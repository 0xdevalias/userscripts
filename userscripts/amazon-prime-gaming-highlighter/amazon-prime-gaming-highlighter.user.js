// ==UserScript==
// @name          Amazon Prime Gaming Highlighter
// @description   Automatically highlight games on Amazon Prime Gaming based on specific criteria
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/amazon-prime-gaming-highlighter/amazon-prime-gaming-highlighter.user.js
// @namespace     https://www.devalias.net/
// @version       1.0.7
// @match         https://gaming.amazon.com/home
// @grant         GM_openInTab
// ==/UserScript==

// Amazon Prime Gaming - CSS Selectors / etc: https://gist.github.com/0xdevalias/2d156a148902e31580f247e3d80d38c3

// Original ChatGPT Reference: https://chat.openai.com/c/abe84fdd-752a-4deb-bef3-02bb5b09f84e

(function () {
  'use strict';

  const DEBUG = false;

  const gamesToHighlight = [
    'League of Legends',
    'League of Legends: Wild Rift',
    'RuneScape',
    'World of Warcraft',
  ];

  const gamesToIgnore = [
    'Aion Classic',
    'Aion',
    'Apex Legends',
    'Asphalt 9: Legends',
    'BTS Island: In the SEOM',
    'Battlefield 2042',
    'Big Farm: Mobile Harvest',
    'Black Desert Mobile',
    'Black Desert Online',
    'Blade & Soul',
    'Blankos Block Party',
    'Bloons TD 6',
    'Brawlers',
    'Brawlhalla',
    'Call of Duty: Mobile',
    'Call of Duty: Warzone and Modern Warfare 2',
    'Candy Crush Saga',
    'Candy Crush Soda Saga',
    'Champions Ascension',
    'Company of Heroes 3',
    'Cyberpunk 2077: Phantom Liberty',
    'DKO: Divine Knockout',
    'Dead Island 2',
    'Dead by Daylight',
    'Destiny 2',
    'Diablo IV',
    'EA SPORTS FC 24',
    'F1 23',
    'FIFA 23',
    'Fall Guys',
    'Fallout 76',
    'Farm Heroes Saga',
    'Genshin Impact',
    'Gods Unchained',
    'Guild Wars 2',
    'Hearthstone',
    'Hi-Fi RUSH',
    'Honkai: Star Rail',
    'Just Dance 2023 Edition',
    'Legends of Runeterra',
    'Lineage II',
    'Lineage II: Aden',
    'Lineage II: Classic',
    'Lords Mobile',
    'Lost Ark',
    'Madden NFL 23',
    'Madden NFL 24',
    'Marvel Contest of Champions',
    'Mojo Melee',
    'Monster Hunter Now',
    'My Pet Hooligan',
    'NFL Rivals',
    'Naraka: Bladepoint',
    'New World',
    'Overwatch 2',
    'PUBG MOBILE',
    'PUBG: BATTLEGROUNDS',
    'Paladins',
    'Partie',
    'Phantasy Star Online 2 New Genesis - Global',
    'PlanetSide 2',
    'Pokémon GO',
    'RAID: Shadow Legends',
    'Realm Royale Reforged',
    'Risk: Global Domination',
    'Roblox',
    'Rogue Company',
    'SMITE',
    'Shadow Fight 3',
    'Star Trek: Timelines',
    'Teamfight Tactics',
    'The Elder Scrolls Online',
    'Time Princess',
    "Tom Clancy's Rainbow Six Siege",
    'Total War: Warhammer II',
    'Two Point Campus',
    'VALORANT',
    'Warframe',
    'World of Tanks',
    'World of Warships',
    'World of Warships: Legends',
  ];

  const sectionsToMatch = [
    'offer-section-DIGITAL_WEEK_GAMES',
    'offer-section-RECOMMENDED',
    'offer-section-WEB_GAMES',
    'offer-section-TOP_PICKS',
    'offer-section-EXPIRING',
    'offer-section-FGWP',
    'offer-section-IN_GAME_LOOT',
    'offer-section-FGWP_FULL',
  ];

  const sectionsToIgnore = ['offer-section-WEB_GAMES'];

  function styleAsHighlighted(element) {
    element.style.backgroundColor = 'green';
  }

  function styleAsCollected(element) {
    element.style.opacity = 0.5;
  }

  function styleAsIgnored(element) {
    element.style.backgroundColor = 'red';
    element.style.opacity = 0.25;

    // This extra background class seems to conflict/override the colour we set above.. so we remove it
    const cardDetails = element.querySelector('.item-card-details');
    if (
      cardDetails &&
      cardDetails.classList.contains('tw-c-background-free-game')
    ) {
      cardDetails.classList.remove('tw-c-background-free-game');
    }
  }

  function getCardsInSection(section) {
    const sectionCardsSelector = `div[data-a-target="${section}"] .tw-card`;

    return Array.from(document.querySelectorAll(sectionCardsSelector));
  }

  function getBlocksInSection(section) {
    const sectionBlocksSelector = `div[data-a-target="${section}"] .offer-list__content__grid > .tw-block, div[data-a-target="${section}"] .grid-carousel__slide > .tw-block`;

    return Array.from(document.querySelectorAll(sectionBlocksSelector));
  }

  function getTitleForItem(item) {
    return (
      // This gets the game title for in-game content
      item.querySelector(
        '.item-card-details .item-card-details__body a[data-a-target="item-card-detail-footer-secondary-link"]',
      )?.ariaLabel ||
      // These attempt to get the game title for standard cards
      item.querySelector(
        '.item-card-details .item-card-details__body .item-card-details__body__primary h3[title]',
      )?.title ||
      item.querySelector('.tw-block a[data-a-target="learn-more-card"]')
        ?.ariaLabel
    );
  }

  function isItemCollected(item) {
    const collectedSelector =
      '[data-a-target="notification-success"], [data-a-target="ItemCardDetailSuccessStatus"]';

    return item.querySelector(collectedSelector) !== null;
  }

  // Highlight all matching games within specified sections
  function highlightGames() {
    sectionsToMatch.forEach((section) => {
      getCardsInSection(section).forEach((card) => {
        const title = getTitleForItem(card);

        if (title) {
          if (gamesToHighlight.includes(title)) {
            styleAsHighlighted(card);

            DEBUG &&
              console.log(`[APGH::highlightGames] Highlighting`, {
                section,
                title,
              });
          } else if (
            gamesToIgnore.includes(title) ||
            sectionsToIgnore.includes(section)
          ) {
            styleAsIgnored(card);

            DEBUG &&
              console.log(`[APGH::highlightGames] Ignoring`, {
                section,
                title,
              });
          } else {
            DEBUG &&
              console.log(`[APGH::highlightGames] Unhandled`, {
                section,
                title,
              });
          }
        }

        if (isItemCollected(card)) {
          styleAsCollected(card);

          DEBUG &&
            console.log(`[APGH::highlightGames] Already collected`, {
              section,
              title,
            });
        }
      });
    });
  }

  function collectClaimURLs() {
    const uniqueClaimURLs = new Set();

    sectionsToMatch.forEach((section) => {
      if (sectionsToIgnore.includes(section)) {
        DEBUG &&
          console.log(`[APGH::collectClaimURLs] Skipping (ignored section)`, {
            section,
          });
        return;
      }

      getBlocksInSection(section).forEach((sectionBlock) => {
        const title = getTitleForItem(sectionBlock);

        if (isItemCollected(sectionBlock)) {
          DEBUG &&
            console.log(
              `[APGH::collectClaimURLs] Skipping (already collected)`,
              {
                section,
                title,
                sectionBlock,
              },
            );
          return;
        }

        Array.from(
          new Set(
            Array.from(
              sectionBlock.querySelectorAll(
                '[data-a-target="learn-more-card"]',
              ),
            )
              .map((el) => el.href)
              .filter((url) => !url.includes('/web-games/'))
              .map((href) => href.replace('/details', '')),
          ),
        ).forEach((url) => {
          DEBUG &&
            console.log(`[APGH::collectClaimURLs] Found claim URL: ${url}`);

          uniqueClaimURLs.add(url);
        });
      });
    });

    return Array.from(uniqueClaimURLs);
  }

  function copyURLsToClipboard(urls) {
    if (urls.length === 0) {
      alert('No claim URLs found to copy.');
      return;
    }

    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = urls.join('\n');
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);

    alert('URLs copied to clipboard!');
  }

  function openURLs(urls) {
    if (urls.length === 0) {
      alert('No claim URLs found to open.');
      return;
    }

    urls.forEach((url) => GM_openInTab(url, { active: false }));
  }

  function createUtilityButtons() {
    const containerId = 'apgh-utility-buttons-container';

    // Check if the container already exists
    let container = document.getElementById(containerId);
    if (container) {
      return; // Bail early if the container already exists
    }

    // Create the main container
    container = document.createElement('div');
    container.id = containerId;
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'flex-end'; // Align everything to the right
    container.style.backgroundColor = 'transparent';
    container.style.gap = '10px';

    let isExpanded = true; // Start expanded

    // Create a flex container for the toggle button
    const toggleContainer = document.createElement('div');
    toggleContainer.style.display = 'flex';
    toggleContainer.style.justifyContent = 'flex-end'; // Keep the toggle button right-aligned
    toggleContainer.style.width = '100%';

    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '⚙️'; // Toggle button without up/down icons
    toggleButton.style.width = '40px';
    toggleButton.style.height = '40px';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.backgroundColor = '#0073e6';
    toggleButton.style.color = '#fff';
    toggleButton.style.fontSize = '16px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.display = 'flex';
    toggleButton.style.alignItems = 'center';
    toggleButton.style.justifyContent = 'center';
    toggleButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    toggleButton.style.transition = 'background-color 0.3s ease';

    toggleButton.onmouseenter = () =>
      (toggleButton.style.backgroundColor = '#005bb5');
    toggleButton.onmouseleave = () =>
      (toggleButton.style.backgroundColor = '#0073e6');

    toggleButton.onclick = () => {
      isExpanded = !isExpanded;
      updateContainerVisibility();
    };

    // Append the toggle button to its container
    toggleContainer.appendChild(toggleButton);

    const createButton = (text, onClick) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.style.padding = '10px 15px';
      button.style.fontSize = '14px';
      button.style.cursor = 'pointer';
      button.style.border = '1px solid #0073e6';
      button.style.borderRadius = '5px';
      button.style.backgroundColor = '#0073e6';
      button.style.color = '#fff';
      button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
      button.style.transition = 'background-color 0.3s ease';

      button.onmouseenter = () => (button.style.backgroundColor = '#005bb5');
      button.onmouseleave = () => (button.style.backgroundColor = '#0073e6');

      button.onclick = onClick;
      return button;
    };

    const copyButton = createButton('Copy Claim URLs', () => {
      const urls = collectClaimURLs();
      copyURLsToClipboard(urls);
    });

    const openButton = createButton('Open Claim URLs', () => {
      const urls = collectClaimURLs();
      openURLs(urls);
    });

    const updateContainerVisibility = () => {
      if (isExpanded) {
        copyButton.style.display = 'block';
        openButton.style.display = 'block';
      } else {
        copyButton.style.display = 'none';
        openButton.style.display = 'none';
      }
    };

    // Append buttons to the main container
    container.appendChild(copyButton);
    container.appendChild(openButton);

    // Append the toggle container to the main container
    container.appendChild(toggleContainer);

    // Append the main container to the body
    document.body.appendChild(container);

    // Initialize visibility
    updateContainerVisibility();
  }

  const observer = new MutationObserver(highlightGames);
  observer.observe(document.body, { childList: true, subtree: true });

  // Run initial highlighting
  highlightGames();
  createUtilityButtons();
})();
