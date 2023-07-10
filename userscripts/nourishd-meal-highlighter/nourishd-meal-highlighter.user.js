// ==UserScript==
// @name          Nourishd Meal Highlighter
// @description   Highlights and ignores meals on Nourishd based on specific criteria
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/nourishd-meal-highlighter/nourishd-meal-highlighter.user.js
// @namespace     https://www.devalias.net/
// @version       0.1.2
// @match         https://nourishd.com.au/account
// @grant         none
// ==/UserScript==

// List all meal names: $$('div[x-show="currentTab === \'my-meals\'"] > div > div:has(> a > div.meal-slider-image) h4').map(element => element.innerText)

// TODO: Add a console.log of all meals in the unknown state so we can more easily update this script with them
//   eg.
//     $$('div[x-show="currentTab === \'my-meals\'"] > div > div:has(> a > div.meal-slider-image) h4')
//       .map(element => element.innerText)
//       .filter(mealName => !mealsToHighlight.includes(mealName) && !mealsToIgnore.includes(mealName))

// TODO: Can we add a 'sometimes' / 'maybe' state so we have: yes, maybe, no, unknown?

// TODO: Can we also apply our highlighting choices to the 'Meal Preferences' tab?

// TODO: Can we make this use what we've selected in the 'Meal Preferences' tab to configure the mealsToHighlight / mealsToIgnore rather than the hardoded arrays?

(function () {
  "use strict";

  const DEBUG = false;

  // ===========================
  // === CONFIGURATION START ===
  // ===========================

  // 'Highlight' Config

  const sidesToHighlight = [
    "Protein Bar - Blueberry",
    "Protein Bar - Choc Sea Salt",
    "Remedy Kombucha - Cherry Plum",
    "Remedy Kombucha - Passionfruit",
    "Remedy Kombucha - Raspberry Lemonade",
    // Maybe's
    "Berry Ripe Raw Slice",
    "Chocolate Protein Balls",
    "Keto Chocolate Slice",
    "Paleo Fuel Muesli (750g)",
    "Sticky Date Pudding (2 Serves)",
    "Tessero Rocher Slice",
  ];

  const mealsToHighlight = [
    "Beef Bolognese Gnocchi",
    "Beef Cheek Ragu with White Potato Mash",
    "Butter Chicken with Basmati Rice",
    "Country Style Crumbed Chicken",
    "Korean Sesame Chicken and Broccoli",
    "Kung Pao Chicken",
    "Portuguese Chicken",
    "Pulled Barbeque Brisket",
    "Singapore Noodles",
    "Slow Cooked Beef Stew",
    "Sweet Potato Spaghetti Bolognese",
    // Maybe's
    "Texas Brisket Chilli",
    "Thai Green Curry",
    "Vegetable Alfredo",
    ...sidesToHighlight
  ];

  // 'Ignore' Config

  const sidesToIgnore = [
    "Side Dish - Roasted Broccoli",
    "Side Dish - White Potato Mash",
    "Certified Organic Drip Bag Coffee (10 pack)",
    "Chia Pudding",
    "Down To Earth - Cold Pressed Juice",
    "In Full Swing - Cold Pressed Juice",
    "Take a Chill Pill - Cold Pressed Juice",
    "Funday Sweets - Fruity Flavoured Gummy Snakes",
    "Funday Sweets - Raspberry Flavoured Gummy Frogs",
    "Gevity Rx Sweet Guts™ Salted Caramel Chocolate",
  ];

  const mealsToIgnore = [
    "Bacon and Pumpkin Soup",
    "Bangers and Mash",
    "Beef Cheek Ragu with Cauliflower Mash",
    "Breakky Bowl",
    "Butter Chicken With Cauliflower Rice",
    "Cauliflower 'Mac' and Cheese",
    "Chicken Caesar Salad",
    "Chickpea Dahl",
    "Chilli Cheese Fries",
    "Curried Sausage with Cauliflower Mash",
    "Curried Sausage with White Potato Mash",
    "Gevity Rx Fried Rice",
    "Honey Mustard Chicken",
    "Loaded Sweet Potato",
    "Meatloaf",
    "Minestrone Soup",
    "Moroccan Baked Eggs",
    "Satay Pork Meatballs",
    ...sidesToIgnore,
  ];

  // Set to "Regular", "Large", "Extra Large" or falsy value (e.g. '') to not select any portion size by default.
  const defaultPortionSize = "Extra Large";

  // =========================
  // === CONFIGURATION END ===
  // =========================

  const validPortionSizes = ["Regular", "Large", "Extra Large"];

  const mealsContainerSelector = 'div[x-show="currentTab === \'my-meals\'"]';
  const mealTitleSelector = 'div > a > h4';
  const mealsSelector = 'div > div:has(> a > div.meal-slider-image)';
  const mealImageSelector = '.meal-slider-image > img, .meal-slider-image > video';
  const mealSizeQuantityAddSectionSelector = 'div:has(div > div > div > select), div:has(div > div > div > input)';

  // Check if defaultPortionSize is set to a valid option
  if (defaultPortionSize && !validPortionSizes.includes(defaultPortionSize)) {
    alert(`Error: defaultPortionSize must be one of ${validPortionSizes.join(", ")} or falsy`);
    return;
  }

  // Check if a meal exists in both arrays
  const clashingMeals = mealsToHighlight.filter(meal => mealsToIgnore.includes(meal));
  if (clashingMeals.length > 0) {
    alert(`Error: Meals "${clashingMeals.join(", ")}" are in both mealsToHighlight and mealsToIgnore arrays.`);
  }

  function debugLog(...logContents) {
    if (!DEBUG) return

    console.log('[NMH]', ...logContents);
  }

  function styleAsHighlighted(element) {
    element.style.backgroundColor = "green";
    element.style.border = "2px solid green";
  }

  function styleAsIgnored(element) {
    element.style.backgroundColor = "red";
    element.style.opacity = 0.25;
    element.style.border = "2px solid red";
  }

  function styleAsUnknown(element) {
    element.style.backgroundColor = "#666666";
    element.style.border = "2px solid #666666";
  }

  function setDefaultPortionSize(meal, portionSize) {
    const selectElement = meal.querySelector('select[name="product_variant"]');
    if (selectElement && portionSize) {
      const desiredOption = Array.from(selectElement.options).find((option) =>
        option.textContent.includes(portionSize)
      );
      if (desiredOption) {
        selectElement.value = desiredOption.value;

        // To ensure the frontend framework actually notices the change
        selectElement.dispatchEvent(new Event('change'));
      }
    }
  }

  function processMeals({ observedElement: mealsContainer }) {
    if (!mealsContainer || getComputedStyle(mealsContainer).display === 'none') {
      debugLog('processMeals::mealsContainer-notVisible', { mealsContainer })
      return
    }

    const meals = mealsContainer.querySelectorAll(mealsSelector);

    debugLog('processMeals', meals)

    meals.forEach((meal) => {
      const titleElement = meal.querySelector(mealTitleSelector);
      const title = titleElement?.textContent.trim() ?? '';

      debugLog('processMeals->meals.forEach', title, { titleElement, meal });

      if (!title) return;

      if (mealsToHighlight.includes(title)) {
        debugLog('processMeals->meals.forEach->mealsToHighlight.includes', title);

        styleAsHighlighted(meal);
      } else if (mealsToIgnore.includes(title)) {
        debugLog('processMeals->meals.forEach->mealsToIgnore.includes', title);

        styleAsIgnored(meal);
      } else {
        debugLog('processMeals->meals.forEach->unknown', title);

        styleAsUnknown(meal);
      }

      // Select our desired portion size in the dropdown
      setDefaultPortionSize(meal, defaultPortionSize);

      // Removing the excess padding/margin below the meal image
      meal.classList.remove('pb-10', 'mb-10');
      meal.classList.add('mb-2');

      // Ensure the meal title contrasts against the background
      titleElement.classList.add("text-white");

      const mealImageElement = meal.querySelector(mealImageSelector);
      debugLog('mealImageElement', { mealImageElement });
      if (mealImageElement) {
        mealImageElement.classList.remove('w-full', 'h-full');
        mealImageElement.classList.add('w-1/2', 'h-1/2', 'mx-auto');
      }

      const sizeQuantityAddMealSection = meal.querySelector(mealSizeQuantityAddSectionSelector);
      debugLog('sizeQuantityAddMealSection', { sizeQuantityAddMealSection });
      if (sizeQuantityAddMealSection) {
        // Ensure there is an even amount of left/right padding around the size/quanity/etc section
        sizeQuantityAddMealSection.classList.remove("md:pl-6")
        sizeQuantityAddMealSection.classList.add("px-6")
      }
    });
  }

  // TODO: This seems to work as is now without causing infinite loops.. so we can probably remove the hackier version that is commented out below now?
  const observeTargetElement = (targetSelector, targetMutationHandler) => {
    const attachObserver = (element, handler) => {
      // const observerOptions = { childList: true, subtree: true };
      const observerOptions = { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] };

      const observer = new MutationObserver((mutations, observerInstance) => {
        // Temporarily disconnect the observer
        observer.disconnect();

        // Make changes without causing an infinite loop
        handler({
          observedElement: element,
          mutations,
          observer: observerInstance
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
        debugLog('initialObserverHandler->targetElement->exists', targetElement)

        // Disconnect the initial observer
        observer.disconnect();

        // Attach the target observer to re-run our mutation handler on future changes
        const targetObserver = attachObserver(targetElement, targetMutationHandler);

        // Make sure we run our mutation handler at least once
        targetMutationHandler({ observedElement: targetElement, mutations: [], observer: targetObserver });
      }
    };

    const existingTargetElement = document.querySelector(targetSelector);

    if (existingTargetElement) {
      debugLog('observeTargetElement->existingTargetElement->exists', existingTargetElement)

      // Attach the target observer to re-run our mutation handler on future changes
      const existingObserver = attachObserver(existingTargetElement, targetMutationHandler);

      // Make sure we run our mutation handler at least once
      targetMutationHandler({ observedElement: existingTargetElement, mutations: [], observer: existingObserver });
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
