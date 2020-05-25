import { BufferGeometry, PointsMaterial, Points, BufferAttribute } from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.module.js';
import { NoiseField } from 'https://afferore43.github.io/noisefield/noisefield.js';

export class Particles {
  constructor(opt) {
    opt = opt || {};
    this.num = opt.num || 10000;
    this.size = opt.size || 1.7;
    this.boxSize = opt.boxSize || 15;
    this.maxSpeed = 0.02;
    
    this.noise = new NoiseField({minHeight: -0.017, maxHeight: 0.017, noiseScale: 0.08})
  } 
  
  createParticles() {
    this.geo = new BufferGeometry();
    
    this.positionData = new Float32Array(this.num * 3);
    this.colorData = new Float32Array(this.num * 3);
    this.speedData = new Float32Array(this.num * 3);
    this.accData = new Float32Array(this.num * 3);
    
    for(let i = 0; i < this.num * 3; i++) { this.positionData[i] = (Math.random() - 0.5) * this.boxSize; }
    this.geo.setAttribute('position', new BufferAttribute(this.positionData, 3));
    this.geo.setAttribute('color', new BufferAttribute(this.colorData, 3));
  }
  
  getMesh() {
    // tudo change to instanced mesh
    let sA = false;
    if(!this.mesh) {
      if(!this.geo) this.createParticles();
      var mat = new PointsMaterial({ vertexColors: true, size: this.size, sizeAttenuation: sA});
      this.mesh = new Points(this.geo, mat);
    } 
    let rots = 17;
    for(let i = 0; i < rots; i++) {
      var mat = new PointsMaterial({ vertexColors: true, size: this.size, sizeAttenuation: sA });
      var mesh2 = new Points(this.geo, mat);
      mesh2.rotation.z = Math.PI * 2 / rots * i;
      this.mesh.add(mesh2);
      var mesh3 = mesh2.clone();
      mesh3.scale.set(1,-1, 1);
      this.mesh.add(mesh3);
    }
    return this.mesh;
  }
  
  update(delta) {
    for(let i = 0; i < this.num * 3; i += 3) {
      let x = this.positionData[i], y = this.positionData[i + 1], z = this.positionData[i + 2];
      let b = this.boxSize / 2;
      this.positionData[i] += this.speedData[i] * delta * 30;
      this.positionData[i + 1] += this.speedData[i + 1] * delta * 30;
      this.positionData[i + 2] += this.speedData[i + 2] * delta * 30;
      if(Math.abs(x) > b || Math.abs(y) > b || Math.abs(z) > b) {
        for(let j = 0; j < 3; j++) {
          this.positionData[i + j] = (Math.random() - 0.5) * this.boxSize;
          this.colorData[i + j] = 0;
        }
      }
      this.accData[i] = this.noise.getValue(x + 100, y, z);
      this.accData[i + 1] = this.noise.getValue(x, y + 100, z);
      this.accData[i + 2] = this.noise.getValue(x, y, z);
      
      this.speedData[i] += this.accData[i];
      this.speedData[i + 1] += this.accData[i + 1];
      this.speedData[i + 2] += this.accData[i + 2];
      
      let speed = Math.sqrt(Math.pow(this.speedData[i], 2) + Math.pow(this.speedData[i + 1], 2) + Math.pow(this.speedData[i + 2], 2));
      if(speed > this.maxSpeed) {
        this.speedData[i] /= (speed / this.maxSpeed);
        this.speedData[i + 1] /= (speed / this.maxSpeed);
        this.speedData[i + 2] /= (speed / this.maxSpeed);
      }
      let proSpeed = 1 - speed / (this.maxSpeed);
      this.colorData[i] = (this.speedData[i] / this.maxSpeed) * proSpeed;
      this.colorData[i + 1] = (this.speedData[i + 1] / this.maxSpeed) * proSpeed;
      this.colorData[i + 2] = (this.speedData[i + 2] / this.maxSpeed) * proSpeed;
      
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
    this.noise.addNoiseShift(0.3 * delta, 0.1 * delta, 0.5 * delta);
  }
}