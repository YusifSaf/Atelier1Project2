import { sharedState } from './sharedState.js';

const faceTrackingSketch = (p) => {
  // Parameters
  let SHOW_VIDEO = true;
  let SHOW_ALL_KEYPOINTS = false;
  let TRACKED_KEYPOINT_INDEX = 1;  // 1 = nose tip
  let CURSOR_SIZE = 20;
  let CURSOR_COLOR = [255, 50, 50];
  let KEYPOINT_SIZE = 3;

  // Variables
  let cam;
  let facemesh;
  let faces = [];
  let cursor;
  let cameraReady = false;

  p.setup = () => {
    let canvas = p.createCanvas(640, 480);
    canvas.parent(document.body);
    canvas.class('p5Canvas');
    
    let constraints = {
      video: {
        facingMode: 'user'
      },
      audio: false
    };
    
    cam = p.createCapture(constraints, videoReady);
    cam.size(640, 480);
    cam.hide();
  };

  function videoReady() {
    cameraReady = true;
    
    let options = {
      maxFaces: 1,
      refineLandmarks: false,
      runtime: 'mediapipe',
      flipHorizontal: false
    };
    
    facemesh = ml5.faceMesh(options, modelReady);
  }

  function modelReady() {
    console.log('FaceMesh model loaded!');
    facemesh.detectStart(cam.elt, gotFaces);
  }

  function gotFaces(results) {
    faces = results;
  }

  p.draw = () => {
    p.background(40);
    
    if (SHOW_VIDEO && cameraReady) {
      p.push();
      p.translate(p.width, 0);
      p.scale(-1, 1);
      p.image(cam, 0, 0, p.width, p.height);
      p.pop();
    }
    
    if (faces.length > 0) {
      drawFaceTracking();
    }
    
    drawUI();
  };

  function drawFaceTracking() {
    let face = faces[0];
    
    if (!face.keypoints || face.keypoints.length === 0) return;
    
    let trackedKeypoint = face.keypoints[TRACKED_KEYPOINT_INDEX];
    if (!trackedKeypoint) return;
    
    cursor = mapKeypointToCanvas(trackedKeypoint);
    
    // Update shared state
    sharedState.facePosition = {
      x: cursor.x,
      y: cursor.y,
      z: cursor.z
    };
    
    // Draw cursor
    p.push();
    p.fill(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2]);
    p.noStroke();
    p.ellipse(cursor.x, cursor.y, CURSOR_SIZE, CURSOR_SIZE);
    
    p.stroke(CURSOR_COLOR[0], CURSOR_COLOR[1], CURSOR_COLOR[2], 150);
    p.strokeWeight(2);
    p.line(cursor.x - 15, cursor.y, cursor.x + 15, cursor.y);
    p.line(cursor.x, cursor.y - 15, cursor.x, cursor.y + 15);
    p.pop();
    
    // Display coordinates
    p.push();
    p.fill(255);
    p.stroke(0);
    p.strokeWeight(3);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(12);
    p.text(`x: ${cursor.x.toFixed(0)}, y: ${cursor.y.toFixed(0)}`,
           cursor.x, cursor.y + CURSOR_SIZE/2 + 10);
    p.pop();
    
    if (SHOW_ALL_KEYPOINTS) {
      p.push();
      p.fill(0, 255, 0, 100);
      p.noStroke();
      for (let kp of face.keypoints) {
        let mapped = mapKeypointToCanvas(kp);
        p.ellipse(mapped.x, mapped.y, KEYPOINT_SIZE, KEYPOINT_SIZE);
      }
      p.pop();
    }
  }

  function mapKeypointToCanvas(keypoint) {
    let x, y, z;
    
    if (keypoint.x <= 1 && keypoint.y <= 1) {
      x = keypoint.x * p.width;
      y = keypoint.y * p.height;
    } else {
      x = p.map(keypoint.x, 0, cam.width, 0, p.width);
      y = p.map(keypoint.y, 0, cam.height, 0, p.height);
    }
    
    x = p.width - x;
    z = keypoint.z || 0;
    
    return { x, y, z };
  }

  function drawUI() {
    p.push();
    p.fill(255);
    p.noStroke();
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    
    if (!cameraReady) {
      p.text('Starting camera...', p.width/2, 20);
    } else if (!facemesh) {
      p.text('Loading FaceMesh model...', p.width/2, 20);
    } else if (faces.length === 0) {
      p.text('Show your face', p.width/2, 20);
    } else {
      p.text('Tracking: Nose', p.width/2, 20);
    }
    
    p.textSize(11);
    p.fill(200);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text('Click to toggle video', p.width/2, p.height - 10);
    p.pop();
  }

  p.mousePressed = () => {
    SHOW_VIDEO = !SHOW_VIDEO;
    return false;
  };

  p.touchStarted = () => {
    SHOW_VIDEO = !SHOW_VIDEO;
    return false;
  };
};

// Create p5 instance
new p5(faceTrackingSketch);