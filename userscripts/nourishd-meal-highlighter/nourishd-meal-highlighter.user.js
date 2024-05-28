// ==UserScript==
// @name          Nourishd Meal Highlighter
// @description   Highlights and ignores meals on Nourishd based on specific criteria
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/nourishd-meal-highlighter/nourishd-meal-highlighter.user.js
// @namespace     https://www.devalias.net/
// @version       0.1.7
// @match         https://nourishd.com.au/menu
// @grant         GM_registerMenuCommand
// ==/UserScript==

// TODO: Can we add a 'sometimes' / 'maybe' state so we have: yes, maybe, no, unknown?

// TODO: Can we also apply our highlighting choices to the 'Meal Preferences' tab?

// TODO: Can we make this use what we've selected in the 'Meal Preferences' tab to configure the mealsToHighlight / mealsToIgnore rather than the hardoded arrays?

(function () {
  'use strict';

  const DEBUG = false;

  // ===========================
  // === CONFIGURATION START ===
  // ===========================

  // 'Highlight' Config

  const sidesToHighlight = [
    'Protein Bar - Blueberry',
    'Protein Bar - Choc Sea Salt',
    'Remedy Kombucha - Cherry Plum',
    'Remedy Kombucha - Passionfruit',
    'Remedy Kombucha - Raspberry Lemonade',
    // Maybe's
    'Chocolate Protein Balls',
    'Paleo Fuel Muesli (750g)',
    'Sticky Date Pudding (2 Serves)',
  ];

  const mealsToHighlight = [
    'Beef Bolognese Gnocchi',
    'Beef Cheek Ragu with White Potato Mash',
    'Beef Stroganoff',
    'Butter Chicken with Basmati Rice',
    'Chicken Singapore Noodles',
    'Country Style Crumbed Chicken',
    'Italian Sausage Gnocchi',
    'Korean Sesame Chicken And Broccoli',
    'Kung Pao Chicken',
    'Off The Bone Lamb Shanks',
    'Portuguese Chicken',
    'Primal Pad Thai',
    'Pulled Barbeque Brisket',
    'Pulled Pork with Potato Salad',
    'Pumpkin Lasagna',
    'Satay Chicken And Basmati Rice',
    'Savoury Mince With Baba Ganoush',
    'Slow Cooked Beef Stew',
    'Spaghetti Bolognese',
    'TWØBAYS Brisket and Ale Stew',
    // Maybe's
    'Texas Brisket Chilli',
    'Thai Green Curry',
    'Vegetable Alfredo',
    ...sidesToHighlight,
  ];

  // 'Ignore' Config

  const sidesToIgnore = [
    'Berry Ripe Raw Slice',
    'Bounty Slice',
    'Certified Organic Drip Bag Coffee (10 Pack)',
    'Chia Pudding',
    'Down To Earth - Cold Pressed Juice',
    'Funday Sweets - Fruity Flavoured Gummy Snakes',
    'Funday Sweets - Party Mix',
    'Funday Sweets - Raspberry Flavoured Gummy Frogs',
    'Funday Sweets - Sour Cola Gummy Bottles',
    'Funday Sweets - Sour Peach Hearts',
    'Gevity Rx Sweet Guts™ Salted Caramel Chocolate',
    'In Full Swing - Cold Pressed Juice',
    'Keto Chocolate Slice',
    'Lime And Pistachio Slice',
    'Nourishd House Blend Muesli (750g)',
    'Nourish’d Plant Protein Pancake Mix',
    'Red Rice Porridge',
    'Remedy Sodaly - Lemon Squash',
    'Side Dish - Roasted Broccoli',
    'Side Dish - White Potato Mash',
    'Take a Chill Pill - Cold Pressed Juice',
    'Tessero Rocher Slice',
  ];

  const mealsToIgnore = [
    'All Day Big Breakfast',
    'Bacon And Pumpkin Soup',
    'Bangers and Mash',
    'Beef Cheek Ragu with Cauliflower Mash',
    // "Beef Massaman",
    'Breakky Bowl',
    'Butter Chicken With Cauliflower Rice',
    "Cauliflower 'Mac' and Cheese",
    'Chicken Caesar Salad',
    'Chicken Jalfrezi With Basmati Rice',
    'Chicken Jalfrezi With Cauliflower Rice',
    'Chicken Korma with Basmati Rice',
    'Chicken Korma with Cauliflower Rice',
    'Chicken Masala with Basmati Rice',
    'Chicken Masala with Cauliflower Rice',
    "Chicken, Mushroom and Walnut 'Risotto'",
    'Chickpea Dahl',
    'Chilli Cheese Fries',
    'Chilli Con Carne',
    'Corned Beef with Cauliflower Mash & White Sauce',
    'Cottage Pie',
    'Curried Sausage With White Potato Mash',
    'Curried Sausage With Cauliflower Mash',
    "De-Constructed Shepherd's Pie",
    'Gevity Rx Fried Rice',
    'Greek Briami',
    'Honey Mustard Chicken',
    'Lemon Pepper Chicken',
    'Loaded Sweet Potato',
    'Meatball Marinara',
    'Meatloaf',
    'Minestrone Soup',
    'Moroccan Baked Eggs',
    'Naked Chicken Parmi',
    'Nasi Goreng',
    'Pumpkin Risotto',
    'Satay Pork Meatballs',
    'Vegetarian Singapore Noodles',
    ...sidesToIgnore,
  ];

  // Set to "Regular", "Large", "Extra Large" or falsy value (e.g. '') to not select any portion size by default.
  const defaultPortionSize = 'Extra Large';

  // =========================
  // === CONFIGURATION END ===
  // =========================

  const validPortionSizes = ['Regular', 'Large', 'Extra Large'];

  const mealsContainerSelector = 'main .container > div > div:nth-child(2)';
  const mealsSelector = '.product-card';
  const mealTitleSelector = '.add-to-cart-box a';
  const mealImageSelector =
    '.meal-slider-image > img, .meal-slider-image > video';
  const mealSizeQuantityAddSectionSelector =
    'div:has(div > div > div > select), div:has(div > div > div > input)';

  // Check if defaultPortionSize is set to a valid option
  if (defaultPortionSize && !validPortionSizes.includes(defaultPortionSize)) {
    alert(
      `Error: defaultPortionSize must be one of ${validPortionSizes.join(
        ', ',
      )} or falsy`,
    );
    return;
  }

  // Check if a meal exists in both arrays
  const clashingMeals = mealsToHighlight.filter((meal) =>
    mealsToIgnore.includes(meal),
  );
  if (clashingMeals.length > 0) {
    alert(
      `Error: Meals "${clashingMeals.join(
        ', ',
      )}" are in both mealsToHighlight and mealsToIgnore arrays.`,
    );
  }

  function getMealTitles() {
    return Array.from(
      document.querySelectorAll(
        `${mealsContainerSelector} ${mealsSelector} ${mealTitleSelector}`,
      ),
    ).map((element) => element.innerText.trim());
  }

  GM_registerMenuCommand('[DEBUG] console.log meal titles', () => {
    const mealTitles = getMealTitles();

    console.log(`Meals:\n${mealTitles.join('\n')}`);
  });

  GM_registerMenuCommand('[DEBUG] console.log unknown meals', () => {
    const unknownMeals = getMealTitles().filter(
      (mealName) =>
        !mealsToHighlight.includes(mealName) &&
        !mealsToIgnore.includes(mealName),
    );

    console.log(`Unknown Meals:\n${unknownMeals.join('\n')}`);
  });

  function debugLog(...logContents) {
    if (!DEBUG) return;

    console.log('[NMH]', ...logContents);
  }

  function styleAsHighlighted(element) {
    element.style.backgroundColor = 'green';
    element.style.border = '2px solid green';
  }

  function styleAsIgnored(element) {
    element.style.backgroundColor = 'red';
    element.style.opacity = 0.25;
    element.style.border = '2px solid red';
  }

  function styleAsUnknown(element) {
    element.style.backgroundColor = '#666666';
    element.style.border = '2px solid #666666';
  }

  function setDefaultPortionSize(meal, portionSize) {
    const selectElement = meal.querySelector(
      'select[wire\\:model="selectedVariantId"]',
    );

    if (selectElement && portionSize) {
      const desiredOption = Array.from(selectElement.options).find((option) =>
        option.textContent.includes(portionSize),
      );
      if (desiredOption) {
        selectElement.value = desiredOption.value;

        // To ensure the frontend framework actually notices the change
        selectElement.dispatchEvent(new Event('change'));
      }
    }
  }

  function processMeals({ observedElement: mealsContainer }) {
    if (
      !mealsContainer ||
      getComputedStyle(mealsContainer).display === 'none'
    ) {
      debugLog('processMeals::mealsContainer-notVisible', { mealsContainer });
      return;
    }

    const meals = mealsContainer.querySelectorAll(mealsSelector);

    debugLog('processMeals', meals);

    meals.forEach((meal) => {
      const titleElement = meal.querySelector(mealTitleSelector);
      const title = titleElement?.textContent.trim() ?? '';

      debugLog('processMeals->meals.forEach', title, { titleElement, meal });

      if (title) {
        if (mealsToHighlight.includes(title)) {
          debugLog(
            'processMeals->meals.forEach->mealsToHighlight.includes',
            title,
          );

          styleAsHighlighted(meal);
        } else if (mealsToIgnore.includes(title)) {
          debugLog(
            'processMeals->meals.forEach->mealsToIgnore.includes',
            title,
          );

          styleAsIgnored(meal);
        } else {
          debugLog('processMeals->meals.forEach->unknown', title);

          styleAsUnknown(meal);
        }

        // Removing the excess padding/margin below the meal image
        // meal.classList.remove('pb-10', 'mb-10');
        // meal.classList.add('mb-2');

        // Ensure the meal title contrasts against the background
        titleElement.classList.add('text-white');
        // meal.classList.add("text-white");

        // TODO: Re-add something here to make it reduce the size of the entire box to fit the smaller image?
        // const mealImageElement = meal.querySelector(mealImageSelector);
        // debugLog('mealImageElement', { mealImageElement });
        // if (mealImageElement) {
        //   mealImageElement.classList.remove('w-full', 'h-full');
        //   mealImageElement.classList.add('w-1/2', 'h-1/2', 'mx-auto');
        // }

        // const sizeQuantityAddMealSection = meal.querySelector(mealSizeQuantityAddSectionSelector);
        // debugLog('sizeQuantityAddMealSection', { sizeQuantityAddMealSection });
        // if (sizeQuantityAddMealSection) {
        //   // Ensure there is an even amount of left/right padding around the size/quanity/etc section
        //   sizeQuantityAddMealSection.classList.remove("md:pl-6")
        //   sizeQuantityAddMealSection.classList.add("px-6")
        // }
      }

      // Select our desired portion size in the dropdown
      setDefaultPortionSize(meal, defaultPortionSize);
    });
  }

  // TODO: This seems to work as is now without causing infinite loops.. so we can probably remove the hackier version that is commented out below now?
  const observeTargetElement = (targetSelector, targetMutationHandler) => {
    const attachObserver = (element, handler) => {
      // const observerOptions = { childList: true, subtree: true };
      const observerOptions = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      };

      const observer = new MutationObserver((mutations, observerInstance) => {
        // Temporarily disconnect the observer
        observer.disconnect();

        // Make changes without causing an infinite loop
        handler({
          observedElement: element,
          mutations,
          observer: observerInstance,
        });

        // Reconnect the observer
        observer.observe(element, observerOptions);
      });

      observer.observe(element, observerOptions);

      return observer;
    };

    const initialObserverHandler = ({ observer }) => {
      const targetElement = document.querySelector(targetSelector);

      if (targetElement) {
        debugLog(
          'initialObserverHandler->targetElement->exists',
          targetElement,
        );

        // Disconnect the initial observer
        observer.disconnect();

        // Attach the target observer to re-run our mutation handler on future changes
        const targetObserver = attachObserver(
          targetElement,
          targetMutationHandler,
        );

        // Make sure we run our mutation handler at least once
        targetMutationHandler({
          observedElement: targetElement,
          mutations: [],
          observer: targetObserver,
        });
      }
    };

    const existingTargetElement = document.querySelector(targetSelector);

    if (existingTargetElement) {
      debugLog(
        'observeTargetElement->existingTargetElement->exists',
        existingTargetElement,
      );

      // Attach the target observer to re-run our mutation handler on future changes
      const existingObserver = attachObserver(
        existingTargetElement,
        targetMutationHandler,
      );

      // Make sure we run our mutation handler at least once
      targetMutationHandler({
        observedElement: existingTargetElement,
        mutations: [],
        observer: existingObserver,
      });
    } else {
      // Wait for our desired targetElement to exist
      attachObserver(document.body, initialObserverHandler);
    }
  };

  observeTargetElement(mealsContainerSelector, processMeals);

  //   const mealsContainer = document.querySelector(mealsContainerSelector);

  //   const observerTarget = document.body;
  //   const observerOptions = { attributes: true, childList: true, subtree: true, attributeFilter: ['style', 'class'] };
  //   const observer = new MutationObserver((mutations, observer) => {
  //     const mealsContainer = document.querySelector(mealsContainerSelector);

  //     // Check if the mealsContainer exists and is visible
  //     if (mealsContainer && getComputedStyle(mealsContainer).display !== 'none') {
  //       const hasRelevantMutation = mutations.some(mutation =>
  //         mutation.target === mealsContainer || mealsContainer.contains(mutation.target)
  //       );

  //       // Temporary code for debugLog
  //       const relevantMutations = mutations.filter(mutation =>
  //         mutation.target === mealsContainer || mealsContainer.contains(mutation.target)
  //       );

  //       if (hasRelevantMutation) {
  //           // Temporarily disconnect the observer
  //           observer.disconnect();

  //           debugLog("Relevant mutations occurred:", relevantMutations);

  //           // Make your changes here without causing an infinite loop
  //           processMeals({ observedElement: mealsContainer })

  //           // Reconnect the observer
  //           observer.observe(observerTarget, observerOptions);
  //       }

  //     }
  //   });

  //   // Start observing
  //   observer.observe(observerTarget, observerOptions);

  //   // Run once initially
  //   processMeals({ observedElement: mealsContainer })
})();
