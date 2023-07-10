const THREE = window.MINDAR.FACE.THREE;
document.addEventListener("DOMContentLoaded", () => {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera();
  camera.position.set(1, 1, 5);

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(500, 500);
  renderer.render(scene, camera);

  const video = document.createElement("video");
  navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
    video.play();
  });

  video.style.position = "absolute";
  video.style.width = renderer.domElement.width;
  video.style.height = renderer.domElement.height;
  renderer.domElement.style.position = "absolute";

  document.body.appendChild(video);
  document.body.appendChild(renderer.domElement);

  // Define raindrop variables
  const numRaindrops = 1000;
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
});
