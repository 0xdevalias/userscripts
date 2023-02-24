// ==UserScript==
// @name         YouTube Speed Override
// @description  Override the default youtube controls for > and <
// @author       Glenn 'devalias' Grant (devalias.net)
// @namespace    https://www.devalias.net/
// @version      1.0
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

// TODO: Explore if we want to use any of the GM_* APIs: https://violentmonkey.github.io/api/gm/

(function() {
    'use strict';

    // Get the video element
    var video = document.getElementsByTagName("video")[0];

    // HACK: Track this internally to prevent weird interactions with the default YouTube handler
    // let videoPlaybackRate = video.playbackRate;

    function showSpeedChangeNotification() {
      // Select the div with the given selector
      const videoSpeedNotificationContainer = document.querySelector('#movie_player > div:nth-child(9)');
      const videoSpeedNotificationText = document.querySelector('#movie_player > div:nth-child(9) > div.ytp-bezel-text-wrapper > div');
      const videoSpeedIconContainer = document.querySelector('#movie_player > div:nth-child(9) > div.ytp-bezel');

      // Show the notification
      videoSpeedNotificationContainer.style.display = "block";
      videoSpeedNotificationText.innerText = `${video.playbackRate}x`;
      videoSpeedIconContainer.ariaLabel = `Speed is ${video.playbackRate}`;

      // Set a timeout to hide the notification after 1 second
      setTimeout(() => {
        videoSpeedNotificationContainer.style.display = "none";
      }, 1000);
    }

    // Override the default controls for > and <
    document.addEventListener("keydown", (e) => {
        // TODO: I think this still doesn't properly prevent the default YouTube code from running, so sometimes we increase by more than 0.25
        //   This might be fixed since I added capture: true
        if (e.key === ">") {
            // Don't let the default YouTube handler run
            e.preventDefault();
            e.stopPropagation();

            // Increase the speed by 0.25
            // videoPlaybackRate += 0.25
            // video.playbackRate = videoPlaybackRate;
            video.playbackRate += 0.25

            showSpeedChangeNotification();
        } else if (e.key === "<") {
            // Don't let the default YouTube handler run
            e.preventDefault();
            e.stopPropagation();

            if (video.playbackRate > 0.25) {
                // Decrease the speed by 0.25
                // videoPlaybackRate -= 0.25
                // video.playbackRate = videoPlaybackRate;
                video.playbackRate -= 0.25
            }

            // Always show the notification, even when we're at our min value
            showSpeedChangeNotification();
        }
    }, { capture: true });
})();
