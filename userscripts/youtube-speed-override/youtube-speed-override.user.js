// ==UserScript==
// @name          YouTube Speed Override
// @description   Override the default youtube controls for > and <
// @author        Glenn 'devalias' Grant (devalias.net)
// @homepageURL   https://github.com/0xdevalias/userscripts
// @supportURL    https://github.com/0xdevalias/userscripts/issues
// @downloadURL   https://github.com/0xdevalias/userscripts/raw/main/userscripts/youtube-speed-override/youtube-speed-override.user.js
// @namespace     https://www.devalias.net/
// @version       1.3.1
// @match         https://www.youtube.com/*
// @grant         none
// ==/UserScript==

// TODO: Explore if we want to use any of the GM_* APIs: https://violentmonkey.github.io/api/gm/

(function () {
  'use strict';

  const DEBUG = false;

  // Get the video element
  const video = document.querySelector(
    '#movie_player > .html5-video-container > video.html5-main-video',
  );

  // Get the settings menu element
  const settingsMenu = document.querySelector(
    '#movie_player > .ytp-settings-menu',
  );

  // const videoTimeDisplayCurrentSelector = '#movie_player .ytp-chrome-bottom .ytp-left-controls .ytp-time-display .ytp-time-current';
  const videoTimeDisplayDurationSelector =
    '#movie_player .ytp-chrome-bottom .ytp-left-controls .ytp-time-display .ytp-time-duration';

  // HACK: Track this internally to prevent weird interactions with the default YouTube handler
  // let videoPlaybackRate = video.playbackRate;

  function showSpeedChangeNotification() {
    const bezelContainer = document.querySelector(
      '#movie_player div:has(> .ytp-bezel-text-wrapper)',
    );

    const bezelText = bezelContainer.querySelector(
      '.ytp-bezel-text-wrapper > .ytp-bezel-text',
    );

    const bezelIconContainer = bezelContainer.querySelector('.ytp-bezel');

    // Show the notification
    bezelContainer.style.display = 'block';
    bezelContainer.classList.remove('ytp-bezel-text-hide');
    bezelText.innerText = `${video.playbackRate}x`;
    bezelIconContainer.ariaLabel = `Speed is ${video.playbackRate}`;

    // Set a timeout to hide the notification after 1 second
    setTimeout(() => {
      bezelContainer.style.display = 'none';
    }, 1000);
  }

  // Update the playback speed in the settings menu to match our custom override
  function updateSettingsMenu() {
    const settingsPanel = settingsMenu.querySelector('.ytp-panel');

    const settingsPanelTitle = settingsPanel.querySelector(
      '.ytp-panel-header > .ytp-panel-title',
    );

    const settingsPanelMenuItems = settingsPanel.querySelectorAll(
      '.ytp-panel-menu > .ytp-menuitem',
    );

    DEBUG &&
      console.log('[updateSettingsMenu]', {
        settingsPanel,
        settingsPanelTitle,
        settingsPanelMenuItems,
      });

    if (settingsPanelTitle === null) {
      for (const menuItem of settingsPanelMenuItems) {
        const label = menuItem.querySelector('.ytp-menuitem-label');
        const content = menuItem.querySelector('.ytp-menuitem-content');

        if (label && label.innerText === 'Playback speed') {
          if (content.innerText !== String(video.playbackRate)) {
            DEBUG &&
              console.log(
                `content was "${content.innerText}", setting to "${video.playbackRate}"`,
              );

            // Update the content with the current playback speed
            content.innerText = video.playbackRate;
            break;
          }
        }
      }
    }
    // // TODO: This currently misrepresents the custom speed, as when the user clicks on the label, it will set it to whatever the internal
    // // YouTube playback API thinks the custom speed should be, not our custom override
    // else if (settingsPanelTitle.innerText === 'Playback speed') {
    //   const customSpeedMenuItem = Array.from(settingsPanelMenuItems).find(
    //     (menuItem) => menuItem.innerText.includes('Custom')
    //   );

    //   const customSpeedMenuItemLabel = customSpeedMenuItem.querySelector(
    //     '.ytp-menuitem-label'
    //   );

    //   const newLabel = `Custom (${video.playbackRate})`;

    //   if (customSpeedMenuItemLabel.innerText !== newLabel) {
    //     DEBUG &&
    //       console.log(
    //         `customSpeedMenuItemLabel was "${customSpeedMenuItemLabel.innerText}", setting to "${newLabel}"`
    //       );

    //     // Update the content with the current playback speed
    //     customSpeedMenuItemLabel.innerText = newLabel;
    //   }
    // }
  }

  // Helper function to format time duration
  function formatDuration(durationInSeconds) {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    let durationString = '';
    if (hours > 0) {
      durationString += `${hours}:`;
    }
    durationString += `${
      hours > 0 && minutes < 10 ? '0' : ''
    }${minutes}:${seconds.toString().padStart(2, '0')}`;

    return durationString;
  }

  //   // Function to update the current time display with the adjusted time
  //   function updateAdjustedCurrentTimeDisplay() {
  //     if (video.playbackRate === 1) return;

  //     const currentTimeSpan = document.querySelector(videoTimeDisplayCurrentSelector);

  //     if (currentTimeSpan) {
  //       const originalCurrentTime = formatDuration(video.currentTime);
  //       const adjustedCurrentTime = formatDuration(video.currentTime / video.playbackRate);
  //       currentTimeSpan.innerText = `${originalCurrentTime} (${adjustedCurrentTime} adjusted)`;
  //     }
  //   }

  // Function to update the time display with the adjusted length
  function updateAdjustedTimeDisplay() {
    if (video.playbackRate === 1) return;

    const durationSpan = document.querySelector(
      videoTimeDisplayDurationSelector,
    );

    if (durationSpan) {
      // const originalCurrentTime = formatDuration(video.currentTime);
      const adjustedCurrentTime = formatDuration(
        video.currentTime / video.playbackRate,
      );

      const originaDuration = formatDuration(video.duration);
      const adjustedDuration = formatDuration(
        video.duration / video.playbackRate,
      );
      durationSpan.innerText = `${originaDuration} (${adjustedCurrentTime} / ${adjustedDuration} adjusted for ${video.playbackRate}x playback rate)`;
    }
  }

  // Override the default controls for > and <
  document.addEventListener(
    'keydown',
    (e) => {
      // TODO: I think this still doesn't properly prevent the default YouTube code from running, so sometimes we increase by more than 0.25
      //   This might be fixed since I added capture: true
      if (e.key === '>') {
        // Don't let the default YouTube handler run
        e.preventDefault();
        e.stopPropagation();

        // Increase the speed by 0.25
        // videoPlaybackRate += 0.25
        // video.playbackRate = videoPlaybackRate;
        video.playbackRate += 0.25;

        showSpeedChangeNotification();
      } else if (e.key === '<') {
        // Don't let the default YouTube handler run
        e.preventDefault();
        e.stopPropagation();

        if (video.playbackRate > 0.25) {
          // Decrease the speed by 0.25
          // videoPlaybackRate -= 0.25
          // video.playbackRate = videoPlaybackRate;
          video.playbackRate -= 0.25;
        }

        // Always show the notification, even when we're at our min value
        showSpeedChangeNotification();
      } else if (e.shiftKey && e.code === 'Space') {
        // Don't let the default YouTube handler run
        // TODO: these don't seem to actually prevent it currently, as we still seem to pause the video..?
        e.preventDefault();
        e.stopPropagation();

        // TODO: not sure if this will work?
        e.stopImmediatePropagation();

        video.playbackRate = 1;

        // Always show the notification, even when we're at our min value
        showSpeedChangeNotification();
      }
    },
    { capture: true },
  );

  video.addEventListener('ratechange', () => {
    // When the video playbackRate changes, update the playback speed in the settings menu to match our custom override
    updateSettingsMenu();

    // When the video playbackRate changes, update the time display
    updateAdjustedTimeDisplay();
  });

  // Add event listener to update the time display adjusted based on playback rate
  // video.addEventListener('timeupdate', updateAdjustedCurrentTimeDisplay);
  video.addEventListener('durationupdate', updateAdjustedTimeDisplay);
  video.addEventListener('timeupdate', updateAdjustedTimeDisplay);

  // When the settings menu changes, update the playback speed in the settings menu to match our custom override
  const settingsMenuObserver = new MutationObserver(updateSettingsMenu);
  settingsMenuObserver.observe(settingsMenu, {
    childList: true,
    subtree: true,
  });
})();
