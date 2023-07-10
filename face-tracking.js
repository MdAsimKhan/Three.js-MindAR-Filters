const THREE = window.MINDAR.FACE.THREE;

const mindarThree = new window.MINDAR.FACE.MindARThree({
  container: document.getElementById("container"),
});

const { renderer, scene, camera } = mindarThree;
const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);

scene.add(light);

const faceMesh = mindarThree.addFaceMesh();
const texture = new THREE.TextureLoader().load("./static/pngegg.png");

faceMesh.material.map = texture;
faceMesh.material.transparent = true;
faceMesh.material.needsUpdate = true;

scene.add(faceMesh);
//=========================FILTER=========================//

const start = async () => {
  await mindarThree.start();
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
};
start();
