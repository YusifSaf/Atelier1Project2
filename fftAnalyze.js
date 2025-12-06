// let mic, fft;
//   let fftDetailLevel = 128;
//   let spectrum;
//   let testSong;
//   let threshold = 10;
//   let r = 0;
//   let xOff = 0;
//   let fftColorCoefficent = 1;

//   let nyquist;
//   let freqPerBin;
//   let lowFreq = 80;
//   let highFreq = 7000;
//   let lowBin;
//   let highBin;

//   let fftSize = 1;
//   let fftRangeMin = Infinity;
//   let fftRangeMax = -Infinity;

//  function setup() {
//     createCanvas(windowWidth, windowHeight, WEBGL);
//     angleMode(DEGREES);
//     colorMode(HSB);
//     noStroke();

//     // FFT ANALYZER
//     mic = new p5.AudioIn();
    
//     // Get available audio input devices and let user select
//     selectAudioDevice();
    
//     fft = new p5.FFT(0.8, fftDetailLevel);
//     if (fft) {
//     fft.setInput(testSong);
//     }
//     testSong.play();

//     nyquist = sampleRate() / 2;
//     freqPerBin = nyquist / fftDetailLevel;
//     lowBin = floor(lowFreq / freqPerBin);
//     highBin = ceil(highFreq / freqPerBin);
//   }
  
  

// // Audio Visualizer with FFT Analysis
// // Refactored for Vite.js module-based project using p5 instance mode
import { sharedState } from './sharedState.js';

const fftAnalyze = (p) => {
  // ==============================================
  // VARIABLES
  // ==============================================
  let mic, fft;
  let fftDetailLevel = 128;
  let spectrum;
  let testSong;
  let threshold = 10;
  let r = 0;
  let xOff = 0;
  let fftColorCoefficent = 1;

  let nyquist;
  let freqPerBin;
  let lowFreq = 80;
  let highFreq = 7000;
  let lowBin;
  let highBin;

  let fftSize = 1;
  let fftRangeMin = Infinity;
  let fftRangeMax = -Infinity;


  // ==============================================
  // PRELOAD
  // ==============================================
  p.preload = () => {
    // testSong = p.loadSound('/Blizzard (Hotline Miami 2  Wrong Number OST)   Light Club.mp3');
  };

  // ==============================================
  // SETUP
  // ==============================================
  p.setup = () => {
    p.createCanvas(1, 1, p.WEBGL);
    p.angleMode(p.DEGREES);
    p.colorMode(p.HSB);
    p.noStroke();

    // FFT ANALYZER
    mic = new p5.AudioIn();
    // p.createPhoneCamera("user", false, 'fixed');
    // mic.start();

    // Enable microphone with tap permission
    p.enableMicTap("Press to Enable Mic");
    // p.enableCameraTap("Press to Enable Camera");
    
    // Lock mobile gestures
    p.lockGestures();
    
    // Get available audio input devices and let user select
    // selectAudioDevice();
    
    fft = new p5.FFT(0.8, fftDetailLevel);
    if (fft) {
      fft.setInput(mic);
    }
    // testSong.play();

    nyquist = p.sampleRate() / 2;
    freqPerBin = nyquist / fftDetailLevel;
    lowBin = p.floor(lowFreq / freqPerBin);
    highBin = p.ceil(highFreq / freqPerBin);
  };

  // ==============================================
  // DRAW
  // ==============================================
  p.draw = () => {
    p.background(240, 39, 7);
    p.normalMaterial();

    FFTAnalyze();
    CamAnimation();
  };

  // ==============================================
  // FFT ANALYZE
  // ==============================================
  function FFTAnalyze() {
    spectrum = fft.analyze();
    for (let i = lowBin; i <= highBin; i++) {
        let amp;
        let cubeSize = 25;
        amp = spectrum[i];
        if (amp < threshold) continue;
        cubeSize = p.map(amp, 0, 255, 200, 500);

        fftSize = p.floor(cubeSize - i * 1.5);        
        // to determine min and max fft range of the song
        if (fftSize < fftRangeMin) { fftRangeMin = fftSize; }
        if (fftSize > fftRangeMax) { fftRangeMax = fftSize; }
        
        sharedState.fftData.size = fftSize;
        sharedState.fftData.fftRangeMin = fftRangeMin;
        sharedState.fftData.fftRangeMax = fftRangeMax;

        // console.log(sharedState.fftData.fftRangeMax);
    }

    // for (let i = lowBin; i <= highBin; i++) {
    //   let amp;
    //   let cubeSize = 25;
    //   r += 0.001;
    //   xOff += 0.1;

    //   amp = spectrum[i];

    //   if (amp < threshold) continue;
      
    //   cubeSize = p.map(amp, 0, 255, 200, 500);

    //   p.push();
    //   let x = p.map(i, lowBin, highBin, -1000, 1000);
    //   p.translate(x, 0, 0);
    //   p.rotateX(r + i * 0.5);
      
    //   p.fill(
    //     p.map(amp, 0, 255, 180 * fftColorCoefficent, 300 * fftColorCoefficent),
    //     p.map(p.noise(xOff), 0, 15, 50, 150),
    //     200
    //   );
      
    //   p.box(50, cubeSize - i * 1.5);
    //   p.pop();
    // }
    
    xOff = 0;
  }

  // ==============================================
  // CAMERA ANIMATION
  // ==============================================
  function CamAnimation() {
    // Add your camera animation logic here
    // p.orbitControl();
  }

  // ==============================================
  // MIDI ANALYZE (placeholder)
  // ==============================================
  function MIDIAnalyze() {
    // Add your MIDI analysis logic here
  }

  // ==============================================
  // AUDIO DEVICE SELECTION
  // ==============================================
//   function selectAudioDevice() {
//     navigator.mediaDevices.enumerateDevices()
//       .then(devices => {
//         const audioInputs = devices.filter(device => device.kind === 'audioinput');
        
//         console.log('=== Available audio input devices ===');
//         audioInputs.forEach((device, index) => {
//           console.log(`${index}: ${device.label || 'Unknown device'} (ID: ${device.deviceId})`);
//         });
//         console.log('=====================================');
        
//         // Automatically select a specific device by name
//         const audioInterface = audioInputs.find(device => 
//           device.label.toLowerCase().includes('focusrite') ||
//           device.label.toLowerCase().includes('scarlett') ||
//           device.label.toLowerCase().includes('audio interface') ||
//           device.label.toLowerCase().includes('behringer') ||
//           device.label.toLowerCase().includes('m-audio') ||
//           device.label.toLowerCase().includes('presonus') ||
//           device.label.toLowerCase().includes('your-device-name-here')
//         );
        
//         if (audioInterface) {
//           const deviceIndex = audioInputs.indexOf(audioInterface);
//           console.log(`✓ Using audio interface: ${audioInterface.label} (Index: ${deviceIndex})`);
//           mic.setSource(deviceIndex);
//           mic.start();
//         } else {
//           console.log('⚠ Audio interface not found by name, using default input (index 0)');
//           console.log('To use a different device, either:');
//           console.log('1. Update the search terms in selectAudioDevice()');
//           console.log('2. Or manually set: mic.setSource(INDEX_NUMBER)');
//           mic.start();
//         }
//       })
//       .catch(err => {
//         console.error('Error accessing audio devices:', err);
//         mic.start();
//       });
//   }

  // ==============================================
  // WINDOW RESIZE
  // ==============================================
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  // ==============================================
  // KEY CONTROLS (optional)
  // ==============================================
  p.keyPressed = () => {
    // Toggle play/pause with SPACE
    if (p.key === ' ') {
      if (testSong.isPlaying()) {
        testSong.pause();
      } else {
        testSong.play();
      }
    }
    
    // Adjust threshold with up/down arrows
    if (p.keyCode === p.UP_ARROW) {
      threshold += 5;
      console.log('Threshold:', threshold);
    }
    if (p.keyCode === p.DOWN_ARROW) {
      threshold = p.max(0, threshold - 5);
      console.log('Threshold:', threshold);
    }
  };
};

// Create p5 instance
new p5(fftAnalyze);