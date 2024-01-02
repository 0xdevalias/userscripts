// ==UserScript==
// @name          Amazon Prime Gaming Highlighter
// @description   Automatically highlight games on Amazon Prime Gaming based on specific criteria
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/amazon-prime-gaming-highlighter/amazon-prime-gaming-highlighter.user.js
// @namespace     https://www.devalias.net/
// @version       1.0.4
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
    "Aion Classic",
    "Aion",
    "Apex Legends",
    "Asphalt 9: Legends",
    "BTS Island: In the SEOM",
    "Battlefield 2042",
    "Big Farm: Mobile Harvest",
    "Black Desert Mobile",
    "Black Desert Online",
    "Blade & Soul",
    "Blankos Block Party",
    "Bloons TD 6",
    "Brawlers",
    "Brawlhalla",
    "Call of Duty: Mobile",
    "Call of Duty: Warzone and Modern Warfare 2",
    "Candy Crush Saga",
    "Candy Crush Soda Saga",
    "Champions Ascension",
    "Company of Heroes 3",
    "Cyberpunk 2077: Phantom Liberty",
    "DKO: Divine Knockout",
    "Dead Island 2",
    "Dead by Daylight",
    "Destiny 2",
    "Diablo IV",
    "EA SPORTS FC 24",
    "F1 23",
    "FIFA 23",
    "Fall Guys",
    "Fallout 76",
    "Farm Heroes Saga",
    "Genshin Impact",
    "Gods Unchained",
    "Guild Wars 2",
    "Hearthstone",
    "Hi-Fi RUSH",
    "Honkai: Star Rail",
    "Just Dance 2023 Edition",
    "Legends of Runeterra",
    "Lineage II",
    "Lineage II: Aden",
    "Lineage II: Classic",
    "Lords Mobile",
    "Lost Ark",
    "Madden NFL 23",
    "Madden NFL 24",
    "Marvel Contest of Champions",
    "Mojo Melee",
    "Monster Hunter Now",
    "My Pet Hooligan",
    "NFL Rivals",
    "Naraka: Bladepoint",
    "New World",
    "Overwatch 2",
    "PUBG MOBILE",
    "PUBG: BATTLEGROUNDS",
    "Paladins",
    "Partie",
    "Phantasy Star Online 2 New Genesis - Global",
    "PlanetSide 2",
    "Pokémon GO",
    "RAID: Shadow Legends",
    "Realm Royale Reforged",
    "Risk: Global Domination",
    "Roblox",
    "Rogue Company",
    "SMITE",
    "Shadow Fight 3",
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

  const sectionsWithTitleInHeading = [
    "offer-section-WEB_GAMES",
  ];

  const sectionsToIgnore = [
    "offer-section-WEB_GAMES",
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

    // This extra background class seems to conflict/override the colour we set above.. so we remove it
    const cardDetails = element.querySelector('.item-card-details');
    if (cardDetails && cardDetails.classList.contains('tw-c-background-free-game')) {
      cardDetails.classList.remove('tw-c-background-free-game');
    }
  }

  function getCardsInSection(section) {
    const sectionCardsSelector = `div[data-a-target="${section}"] .tw-card`;

    return Array.from(document.querySelectorAll(sectionCardsSelector));
  }

  function getTitleForCard({ card, section }) {
    if (sectionsWithTitleInHeading.includes(section)) {
      return card.querySelector(".item-card-details .item-card-details__body .item-card-details__body__primary > [title]")?.title;
    } else {
      return card.querySelector(".item-card-details .item-card-details__body p > a[aria-label]")?.ariaLabel;
    }
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
        const title = getTitleForCard({ card, section });

        if (title) {
          if (gamesToHighlight.includes(title)) {
            styleAsHighlighted(card);

            DEBUG &&
              console.log(
                `[APGH] Highlighting section=${section} title=${title}`
              );
          } else if (gamesToIgnore.includes(title) || sectionsToIgnore.includes(section)) {
            styleAsIgnored(card);

            DEBUG &&
              console.log(`[APGH] Ignoring section=${section} title=${title}`);
          } else {
            DEBUG &&
              console.log(`[APGH] Unhandled section=${section} title=${title}`);
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
