// require('videojs-seek-buttons/dist/videojs-seek-buttons.css');
const videojs = require('video.js');

const {ipcRenderer, dialog} = window.require('electron');

const options = {
    // controls: true,
    autoplay: true,
    fluid: true,
    playbackRates: [0.5, 1, 1.5, 2],
    plugins: {
    //   seekButtons: {
    //     forward: 10,
    //     back: 10,
    //   },
    },
    children:[
      'bigPlayButton', 'controlBar'
    ],
    controlBar: {
        children: [
            'playToggle',
            'SeekBackwardButton', // Add your custom button here
            'SeekForwardButton',
            'playbackRateMenuButton',
            'volumePanel',
            // 'currentTimeDisplay',
            // 'timeDivider',
            // 'durationDisplay',
            'progressControl',
            'remainingTimeDisplay',
            'fullscreenToggle',
            'pictureInPictureToggle'
        ]
    },
  };

  // Create a custom button class by extending the video.js Button class
var Button = videojs.getComponent('Button');

var SeekBackwardButton = videojs.extend(Button, {
  constructor: function() {
    Button.apply(this, arguments);
    // this.addClass('vjs-play-control');
    this.addClass('vjs-control');
    this.addClass('vjs-button');
    this.addClass('vjs-my-button');
    this.addClass('vjs-forward-button');
    /* initialize your button */
  },

  handleClick: function() {
    /* this will be called when you click the button */
    var player = videojs('my-video');
    player.currentTime(player.currentTime() - 10);
  },
});

// SeekBackwardButton.addClass('')

var SeekForwardButton = videojs.extend(Button, {
  constructor: function() {
    Button.apply(this, arguments);
    this.addClass('vjs-control');
    this.addClass('vjs-button');
    this.addClass('vjs-my-button');
    this.addClass('vjs-backwards-button');
    /* initialize your button */
  },

  handleClick: function() {
    /* this will be called when you click the button */
    var player = videojs('my-video');
    player.currentTime(player.currentTime() + 10);
  },
});

// Register the new component
videojs.registerComponent('SeekBackwardButton', SeekBackwardButton);
videojs.registerComponent('SeekForwardButton', SeekForwardButton);
  
const player = videojs('my-video', options, () => {
  let vjsControlBar = document.querySelector('.vjs-control-bar'); // Use querySelector instead of getElementsByClassName
  vjsControlBar.classList.add('vjs-control-bar-remove-opacity')
});

// player.getChild('controlBar').addChild('SeekBackwardButton', {});
// player.getChild('controlBar').addChild('SeekForwardButton', {});

player.on('fullscreenchange', () => {
    fullscreenChange();
});

const fullscreenChange = ()=>{
    let vjsControlBar = document.querySelector('.vjs-control-bar'); // Use querySelector instead of getElementsByClassName
    if (player.isFullscreen()) {
        // Do something when entering fullscreen mode
        console.log('Entered fullscreen mode');
        vjsControlBar.classList.remove('vjs-control-bar-remove-opacity'); // Remove the class
    } else {
        vjsControlBar.classList.add('vjs-control-bar-remove-opacity'); // Add the class
        // Do something when exiting fullscreen mode
        console.log('Exited fullscreen mode');
    }
}

window.onload = function() {
  const fileSelector = document.getElementById('fileSelector');
    
  fileSelector.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    player.src({ type: file.type, src: fileUrl });
  });
  fullscreenChange();
};

  const fullScreen = () => {
    if(player.isFullscreen()){
        player.exitFullscreen();
    } else {
        player.requestFullscreen();
    }
  }

  const togglePlayPause = () => {
    // console.log(typeof(player))
    if (player.paused()) {
      player.play();
    } else {
      player.pause();
    }
  };

  // Other functions (stopAndRestart, rewind, fastForward, etc.) remain the same
  
  const stopAndRestart = () => {
    player.currentTime(0);
    player.pause();
  };

  const rewind = () => {
    player.currentTime(player.currentTime() - 10);
  };

  const fastForward = () => {
    player.currentTime(player.currentTime() + 10);
  };

  const goToEnd = () => {
    player.currentTime(player.duration());
  };

  const toggleMute = () => {
    if (player.muted()) {
      player.muted(false);
    } else {
      player.muted(true);
    }
  };
  
  const changePlaybackRate = (rate) => {
    player.playbackRate(rate);
  };
  
  // const toggleSubtitles = () => {
  //   const tracks = player.textTracks();
  //   if (tracks && tracks.length > 0) {
  //       const firstTrack = tracks[0];
  //       firstTrack.mode = (firstTrack.mode === 'showing') ? 'hidden' : 'showing';
  //   }
  // };

  const jumpToTime = (time) => {
    player.currentTime(time);
  };

  const getCurrentTime = () => {
    return player.currentTime();
  };
  
  const getDuration = () => {
    return player.duration();
  };

  const isVideoEnded = () => {
    return player.ended();
  };
  
  const toggleLoop = () => {
    player.loop(!player.loop());
    let loopNotificationStatus={true: "is", false: "is not"};
    // ipcRenderer.send('trigger-notification',
    // 'Basic Notification',
    // 'Video Player ' + loopNotificationStatus[player.loop()] + " looping"
    // )
  };
  
  const getSource = () => {
    return player.currentSrc();
  };
  

  ipcRenderer.on('open-video-selector', (event, selectedFilePaths) => {
    if (selectedFilePaths && selectedFilePaths.length > 0) {
      const filePath = selectedFilePaths[0];
  
      // Check if the file path is valid
      if (filePath) {
        // Use Node.js `file://` protocol for local file paths
        const fileUrl = `file://${filePath}`;
        player.src({ type: 'video/mp4', src: fileUrl });
  
        // Optionally, you can also display the selected file path in the UI
        const filePathElement = document.getElementById('selected-file-path');
        filePathElement.textContent = filePath;
      } else {
        console.log('Invalid file path.');
      }
    } else {
      console.log('No file selected or error occurred.');
    }
  });
  
  
  ipcRenderer.on('toggle-play-pause', () => {
    togglePlayPause();
  });
  
  ipcRenderer.on('toggle-full-screen', () => {
    fullScreen();
    // let fullScreenButton = document.getElementById("fullScreenButton");
    // fullScreenButton.click();
  });
  
  ipcRenderer.on('stop-and-restart', () => {
    stopAndRestart();
  });
  
  ipcRenderer.on('rewind', () => {
    rewind();
  });
  
  ipcRenderer.on('fast-forward', () => {
    fastForward();
  });
  
  ipcRenderer.on('go-to-end', () => {
    goToEnd();
  });
  
  ipcRenderer.on('toggle-mute', () => {
    toggleMute();
  });
  
  ipcRenderer.on('change-playback-rate', (event, rate) => {
    changePlaybackRate(rate);
  });
  
  ipcRenderer.on('jump-to-time', (event, time) => {
    jumpToTime(time);
  });
  
  ipcRenderer.on('get-current-time', () => {
    console.log(getCurrentTime());
  });
  
  ipcRenderer.on('get-duration', () => {
    console.log(getDuration());
  });
  
  ipcRenderer.on('is-video-ended', () => {
    console.log(isVideoEnded());
  });
  
  ipcRenderer.on('toggle-loop', () => {
    toggleLoop();
  });
  
  ipcRenderer.on('get-source', () => {
    console.log(getSource());
  });

  ipcRenderer.on('play-command-pressed', () => {
    togglePlayPause();
  })

  ipcRenderer.on('rewind-command-pressed', () => {
    rewind();
  })

  ipcRenderer.on('fastforward-command-pressed', () => {
    fastForward();
  })

  ipcRenderer.on('looping-command-pressed', () => {
    toggleLoop();
  })

  ipcRenderer.on('mute-command-pressed', () => {
    toggleMute();
  })