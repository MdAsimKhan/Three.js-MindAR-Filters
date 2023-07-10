// Set up Three.js scene
const THREE = window.MINDAR.FACE.THREE;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load("./static/Cuckoo.mp3", function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.1);
  sound.play();
});

// user video preview
const video = document.createElement("video");
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
  video.play();
});

video.style.position = "absolute";
video.style.width = "100%";
video.style.height = "100%";
video.style.objectFit = "cover";
video.style.transform = "scaleX(-1)";
renderer.domElement.style.position = "absolute";

document.body.appendChild(video);
document.body.appendChild(renderer.domElement);

// sun image
const sun = document.createElement("img");
sun.src = "./static/sun.png";
sun.style.width = "190px";
sun.style.height = "180px";
sun.style.position = "absolute";
sun.style.top = 26;
sun.style.right = 26;
document.body.appendChild(sun);

// trees
const trees = document.createElement("img");
trees.src = "./static/trees.png";
trees.style.width = "270px";
trees.style.height = "400px";
trees.style.position = "absolute";
trees.style.bottom = -11;
trees.style.left = -2;
document.body.appendChild(trees);

// fruits
const fruits = document.createElement("img");
fruits.src = "./static/fruits.png";
fruits.style.width = "600px";
fruits.style.height = "500px";
fruits.style.position = "absolute";
fruits.style.bottom = -135;
fruits.style.right = 5;
document.body.appendChild(fruits);

// Define raindrop variables
const numRaindrops = 100;
const raindropGeometry = new THREE.BufferGeometry();
// Load the texture image
const raindropTexture = new THREE.TextureLoader().load("./static/mango.png");

// Define raindrop material
const raindropMaterial = new THREE.PointsMaterial({
  size: 5,
  map: raindropTexture, // Set the raindrop texture
  transparent: true, // Enable transparency for the raindrop material
  blending: THREE.AdditiveBlending, // Set the blending mode to additive for a more realistic rain effect
});

// Create raindrop positions array
const raindropPositions = new Float32Array(numRaindrops * 3); // Three values (x, y, z) for each raindrop

// Set random raindrop positions
for (let i = 0; i < numRaindrops; i++) {
  const index = i * 3;
  raindropPositions[index] = Math.random() * 200 - 100; // x
  raindropPositions[index + 1] = Math.random() * 200 - 100; // y
  raindropPositions[index + 2] = Math.random() * 200 - 100; // z
}

// Set raindrop positions attribute in geometry
raindropGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(raindropPositions, 3)
);

// Create raindrop system
const raindropSystem = new THREE.Points(raindropGeometry, raindropMaterial);
scene.add(raindropSystem);

// Animate the raindrops
function animate() {
  requestAnimationFrame(animate);

  // Update raindrop positions
  const positions = raindropGeometry.attributes.position.array;
  for (let i = 0; i < numRaindrops; i++) {
    const index = i * 3;
    positions[index + 1] -= 0.5; // Adjust the raindrop speed
    if (positions[index + 1] < -100) {
      // positions[index + 1] = 200; // Reset raindrop position when it reaches the bottom
      positions[index + 1] = Math.random() * 200 - 100; // Reset y position to the top
      positions[index] = Math.random() * 200 - 100; // Randomize x position
      positions[index + 2] = Math.random() * 200 - 100; // Randomize z position
    }
  }
  raindropGeometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}
animate();
