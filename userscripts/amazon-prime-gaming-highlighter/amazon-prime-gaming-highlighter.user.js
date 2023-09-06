// ==UserScript==
// @name          Amazon Prime Gaming Highlighter
// @description   Automatically highlight games on Amazon Prime Gaming based on specific criteria
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/amazon-prime-gaming-highlighter/amazon-prime-gaming-highlighter.user.js
// @namespace     https://www.devalias.net/
// @version       1.0.1
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
    "Asphalt 9: Legends",
    "Black Desert Mobile",
    "Black Desert Online",
    "Blade & Soul",
    "Blankos Block Party",
    "Bloons TD 6",
    "Brawlhalla",
    "BTS Island: In the SEOM",
    "Call of Duty: Mobile",
    "Candy Crush Saga",
    "Candy Crush Soda Saga",
    "Company of Heroes 3",
    "Dead by Daylight",
    "Dead Island 2",
    "Destiny 2",
    "Diablo IV",
    "DKO: Divine Knockout",
    "Fallout 76",
    "Fall Guys",
    "Farm Heroes Saga",
    "FIFA 23",
    "Genshin Impact",
    "Guild Wars 2",
    "Hearthstone",
    "Hi-Fi RUSH",
    "Honkai: Star Rail",
    "Just Dance 2023 Edition",
    "Legends of Runeterra",
    "Lords Mobile",
    "Lost Ark",
    "Madden NFL 23",
    "Madden NFL 24",
    "Mojo Melee",
    "Naraka: Bladepoint",
    "New World",
    "Overwatch 2",
    "Paladins",
    "Partie",
    "Phantasy Star Online 2 New Genesis - Global",
    "PlanetSide 2",
    "Pokémon GO",
    "PUBG MOBILE",
    "PUBG: BATTLEGROUNDS",
    "Realm Royale Reforged",
    "Risk: Global Domination",
    "Roblox",
    "Rogue Company",
    "Shadow Fight 3",
    "SMITE",
    "Star Trek: Timelines",
    "Teamfight Tactics",
    "The Elder Scrolls Online",
    "Time Princess",
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
    "offer-section-DIGITAL_WEEK_GAMES",
    "offer-section-RECOMMENDED",
    "offer-section-WEB_GAMES",
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
