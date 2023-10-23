// changeVideoPlaybackSpeed.js
// https://github.com/0xdevalias/userscripts/tree/main/devtools-snippets
// Changes the video playback speed of all video tags identified

// Create a toast notification
function showToast(message) {
  console.log("[changeVideoPlaybackSpeed]", message);

  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.custom-toast');
  existingToasts.forEach(toast => {
    toast.remove();
  });

  const toast = document.createElement("div");
  toast.className = 'custom-toast';
  toast.style.position = "fixed";
  toast.style.top = "50%";
  toast.style.left = "50%";
  toast.style.transform = "translate(-50%, -50%)";
  toast.style.padding = "10px";
  toast.style.background = "#333";
  toast.style.color = "#fff";
  toast.style.opacity = 0;
  toast.style.transition = "opacity 0.5s";
  toast.innerText = message;

  document.body.appendChild(toast);

  // Fade in
  setTimeout(() => {
    toast.style.opacity = 1;
  }, 50);

  // Fade out and remove
  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 2000);
}

// Get all video elements
const videos = Array.from(document.querySelectorAll("video"));

// Check if any video tags are found
if (videos.length === 0) {
  showToast("No video tags found.");
} else {
  // Ask for initial speed
  const initialSpeed = parseFloat(prompt("Initial Playback Speed:", "1"));
  
  if (!isNaN(initialSpeed) && initialSpeed >= 0.25) {
    // Set initial speed for all videos
    videos.forEach(video => {
      video.playbackRate = initialSpeed;
    });
    showToast(`Playback speed set to ${initialSpeed}x`);
  } else {
    // Set default speed for all videos
    videos.forEach(video => {
      video.playbackRate = 1;
    });
    showToast("Invalid speed entered. Using default (1x).");
  }
  
  // Listen for keypresses to adjust speed
  document.addEventListener("keydown", (e) => {
    if (e.key === ">" || e.key === "<" || (e.shiftKey && e.code === 'Space')) {
      e.preventDefault();
      e.stopPropagation();
  
      videos.forEach(video => {
        let newSpeed;
        
        if (e.key === ">") {
          newSpeed = Math.min(video.playbackRate + 0.25, 10); // Max speed of 10
        } else if (e.key === "<") {
          newSpeed = Math.max(video.playbackRate - 0.25, 0.25); // Min speed of 0.25
        } else if (e.shiftKey && e.code === 'Space') {
          newSpeed = 1; // Reset to default speed
        }
        
        video.playbackRate = newSpeed;
        showToast(`Playback speed set to ${newSpeed}x`);
      });
    }
  });
}
