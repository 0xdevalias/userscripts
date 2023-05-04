// ==UserScript==
// @name          Amazon Prime Gaming Highlighter
// @description   Automatically highlight games on Amazon Prime Gaming based on specific criteria
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/amazon-prime-gaming-highlighter/amazon-prime-gaming-highlighter.user.js
// @namespace     https://www.devalias.net/
// @version       1.0
// @match         https://gaming.amazon.com/home
// @grant         none
// ==/UserScript==

// Amazon Prime Gaming - CSS Selectors / etc: https://gist.github.com/0xdevalias/2d156a148902e31580f247e3d80d38c3

// Original ChatGPT Reference: https://chat.openai.com/c/abe84fdd-752a-4deb-bef3-02bb5b09f84e

(function () {
  "use strict";

  const DEBUG = false;

  const gamesToHighlight = [
    "League of Legends",
    "League of Legends: Wild Rift",
    "RuneScape",
    "World of Warcraft",
  ];

  const gamesToIgnore = [
    "Black Desert Mobile",
    "Black Desert Online",
    "Bloons TD 6",
    "Brawlhalla",
    "BTS Island: In the SEOM",
    "Candy Crush Saga",
    "Candy Crush Soda Saga",
    "Company of Heroes 3",
    "Dead by Daylight",
    "Destiny 2",
    "DKO: Divine Knockout",
    "Farm Heroes Saga",
    "FIFA 23",
    "Genshin Impact",
    "Guild Wars 2",
    "Hearthstone",
    "Just Dance 2023 Edition",
    "Legends of Runeterra",
    "Lords Mobile",
    "Lost Ark",
    "Madden NFL 23",
    "Naraka: Bladepoint",
    "New World",
    "Overwatch 2",
    "Paladins",
    "Partie",
    "Phantasy Star Online 2 New Genesis - Global",
    "PlanetSide 2",
    "PUBG MOBILE",
    "PUBG: BATTLEGROUNDS",
    "Realm Royale Reforged",
    "Rogue Company",
    "SMITE",
    "Teamfight Tactics",
    "The Elder Scrolls Online",
    "Tom Clancy's Rainbow Six Siege",
    "Total War: Warhammer II",
    "Two Point Campus",
    "VALORANT",
    "Warframe",
    "World of Tanks",
    "World of Warships",
    "World of Warships: Legends",
  ];

  const sectionsToMatch = [
    "offer-section-TOP_PICKS",
    "offer-section-EXPIRING",
    "offer-section-FGWP",
    "offer-section-IN_GAME_LOOT",
    "offer-section-FGWP_FULL",
  ];

  function styleAsHighlighted(element) {
    element.style.backgroundColor = "green";
  }

  function styleAsCollected(element) {
    element.style.opacity = 0.5;
  }

  function styleAsIgnored(element) {
    element.style.backgroundColor = "red";
    element.style.opacity = 0.25;
  }

  function getCardsInSection(section) {
    const sectionCardsSelector = `div[data-a-target="${section}"] div.swiper-slide__child, div[data-a-target="${section}"] div.offer-list__content__grid div.tw-block`;

    return Array.from(document.querySelectorAll(sectionCardsSelector));
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
        const title = card.querySelector(".item-card-details__body p")?.title;

        if (title) {
          if (gamesToHighlight.includes(title)) {
            styleAsHighlighted(card);

            DEBUG &&
              console.log(
                `[APGH] Highlighting section=${section} title=${title}`
              );
          } else if (gamesToIgnore.includes(title)) {
            styleAsIgnored(card);

            DEBUG &&
              console.log(`[APGH] Ignoring section=${section} title=${title}`);
          }
        }

        if (isItemCollected(card)) {
          styleAsCollected(card);

          DEBUG &&
            console.log(
              `[APGH] Already collected section=${section} title=${title}`
            );
        }
      });
    });
  }

  const observer = new MutationObserver(highlightGames);
  observer.observe(document.body, { childList: true, subtree: true });

  // Run initial highlighting
  highlightGames();
})();
