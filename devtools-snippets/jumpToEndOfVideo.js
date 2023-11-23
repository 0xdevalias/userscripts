// jumpToEndOfVideo.js
// https://github.com/0xdevalias/userscripts/tree/main/devtools-snippets
// Sets the current time of all video elements to their respective duration (end time)

Array.from($$('video')).forEach(videoElement => {
    videoElement.currentTime = videoElement.duration;
    console.log(videoElement.currentTime);
})
