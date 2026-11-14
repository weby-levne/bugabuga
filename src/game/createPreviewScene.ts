import * as THREE from 'three';

export type GameInput = { throttle:number; brake:number; clutch:number; steer:number; handbrake:boolean };
export type Gear = -1|0|1|2|3|4|5|6;
export type GameState = { speed:number; rpm:number; gear:Gear; fuel:number; engine:boolean; stalled:boolean; distance:number; steering:number };
export interface GameScene { update(dt:number,input:GameInput,state:GameState):void; setCamera(mode:'chase'|'cockpit'|'orbit'):void; setLights(on:boolean):void; setIndicators(mode:'off'|'left'|'right'|'hazard'):void; dispose():void }

export function createPreviewScene(canvas:HTMLCanvasElement):GameScene {
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 const scene=new THREE.Scene(); scene.background=new THREE.Color('#91b6c9'); scene.fog=new THREE.Fog('#91b6c9',55,210);
 const camera=new THREE.PerspectiveCamera(66,1,.1,500); camera.position.set(0,5,10);
 scene.add(new THREE.HemisphereLight('#dceeff','#35432e',2)); const sun=new THREE.DirectionalLight('#fff0d1',2.5); sun.position.set(-12,22,8); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024); scene.add(sun);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshStandardMaterial({color:'#536a4d',roughness:1})); ground.rotation.x=-Math.PI/2; ground.position.y=-.08; ground.receiveShadow=true; scene.add(ground);
 const road=new THREE.Mesh(new THREE.PlaneGeometry(12,500),new THREE.MeshStandardMaterial({color:'#292e34',roughness:.95})); road.rotation.x=-Math.PI/2; road.position.y=0; scene.add(road);
 const addPlane=(x:number,z:number,w:number,h:number,color:string)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color}));m.rotation.x=-Math.PI/2;m.position.set(x,.015,z);scene.add(m);return m};
 for(let z=-245;z<250;z+=9){addPlane(0,z,.14,4.2,'#e6e2cc');addPlane(-5.65,z,.12,3,'#d4d0bb');addPlane(5.65,z,.12,3,'#d4d0bb');}
 // Procedural roadside houses, trees and lamps
 const mats=['#b8a18a','#879e9b','#c1b7a0','#8c9aab'].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.9}));
 for(let i=0;i<58;i++){const z=-230+i*8.1; for(const side of [-1,1]){const x=side*(10+(i%3)*3); if(i%3===0){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16,.22,1.8,7),new THREE.MeshStandardMaterial({color:'#594735'}));trunk.position.set(x,.9,z);trunk.userData.roadside=true;scene.add(trunk);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.35,1),new THREE.MeshStandardMaterial({color:i%2?'#456b48':'#52794e'}));crown.position.set(x,2.45,z);crown.castShadow=true;crown.userData.roadside=true;scene.add(crown);}else{const house=new THREE.Mesh(new THREE.BoxGeometry(4,2.5,4.8),mats[i%4]);house.position.set(x,1.25,z);house.castShadow=true;house.userData.roadside=true;scene.add(house);const roof=new THREE.Mesh(new THREE.ConeGeometry(3.2,1.5,4),new THREE.MeshStandardMaterial({color:'#544b45'}));roof.rotation.y=Math.PI/4;roof.position.set(x,3.2,z);roof.userData.roadside=true;scene.add(roof);}}}
 const car=new THREE.Group(); scene.add(car);
 const bodyMat=new THREE.MeshStandardMaterial({color:'#b9cbd0',metalness:.55,roughness:.28}); const dark=new THREE.MeshStandardMaterial({color:'#172832',metalness:.25,roughness:.2});
 const body=new THREE.Mesh(new THREE.BoxGeometry(1.9,.58,3.9),bodyMat);body.position.y=.78;body.castShadow=true;car.add(body);
 const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.55,.72,1.9),dark);cabin.position.set(0,1.38,-.18);cabin.castShadow=true;car.add(cabin);
 const wheelMat=new THREE.MeshStandardMaterial({color:'#101316',roughness:.85}); const wheels:THREE.Mesh[]=[];
 for(const x of [-.99,.99])for(const z of [-1.22,1.22]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.37,.37,.23,20),wheelMat);w.rotation.z=Math.PI/2;w.position.set(x,.38,z);w.castShadow=true;car.add(w);wheels.push(w);}
 const lampMat=new THREE.MeshStandardMaterial({color:'#fff3c4',emissive:'#000000'});for(const x of [-.62,.62]){const l=new THREE.Mesh(new THREE.BoxGeometry(.35,.16,.05),lampMat);l.position.set(x,.82,-1.98);car.add(l);}
 const indicatorMat=new THREE.MeshStandardMaterial({color:'#ffad38',emissive:'#000000'});for(const x of [-.83,.83])for(const z of [-1.99,1.99]){const ind=new THREE.Mesh(new THREE.BoxGeometry(.16,.12,.06),indicatorMat);ind.position.set(x,.78,z);car.add(ind);}
 const resize=()=>{const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};window.addEventListener('resize',resize);resize();
 let camMode:'chase'|'cockpit'|'orbit'='chase', worldZ=0, yaw=0, carX=0, orbitX=0,orbitY=0;
 let dragging=false,lastX=0,lastY=0,indicatorMode:'off'|'left'|'right'|'hazard'='off',blink=0;
 const down=(e:PointerEvent)=>{if(camMode!=='orbit')return;dragging=true;lastX=e.clientX;lastY=e.clientY}; const move=(e:PointerEvent)=>{if(!dragging)return;orbitX+=(e.clientX-lastX)*.006;orbitY=THREE.MathUtils.clamp(orbitY+(e.clientY-lastY)*.004,-.3,1.1);lastX=e.clientX;lastY=e.clientY};const up=()=>dragging=false;
 canvas.addEventListener('pointerdown',down);window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
 return {update(dt,input,state){worldZ-=state.speed*dt/3.6; blink+=dt;indicatorMat.emissive.set(indicatorMode!=='off'&&Math.floor(blink*2)%2===0?'#ff8a16':'#000000');indicatorMat.emissiveIntensity=indicatorMode!=='off'?1.5:0; yaw=THREE.MathUtils.lerp(yaw,input.steer*(.22+.38*Math.min(Math.abs(state.speed)/45,1)),.12);carX=THREE.MathUtils.clamp(carX+Math.sin(yaw)*Math.abs(state.speed)*dt/3.6*.32,-4.7,4.7);car.rotation.y=yaw;car.position.set(carX,0,2.2); wheels.forEach(w=>{w.rotation.x-=state.speed*dt/3.6*2.5});
 // Move the scenery to simulate an endless road.
 scene.children.forEach(o=>{if(o.userData.roadside){o.position.z+=state.speed*dt/3.6;if(o.position.z>18)o.position.z-=470;}});
 const target=new THREE.Vector3(car.position.x,camMode==='cockpit'?1.45:1.0,car.position.z-.4);
 if(camMode==='cockpit'){camera.position.set(car.position.x,.0+1.52,car.position.z+.15);camera.rotation.set(0,yaw,0);camera.fov=72;}
 else {const radius=camMode==='orbit'?9:9.5;const a=camMode==='orbit'?orbitX:0;const elev=camMode==='orbit'?orbitY:0;const desired=new THREE.Vector3(target.x+Math.sin(a)*radius,2.8+elev*7,target.z+Math.cos(a)*radius);camera.position.lerp(desired,.08);camera.lookAt(target);camera.fov=66;}
 camera.updateProjectionMatrix();renderer.render(scene,camera);
 },setCamera(mode){camMode=mode;},setLights(on){lampMat.emissive.set(on?'#ffe8a0':'#000000');lampMat.emissiveIntensity=on?1.8:0;},setIndicators(mode){indicatorMode=mode;blink=0;},dispose(){window.removeEventListener('resize',resize);canvas.removeEventListener('pointerdown',down);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);renderer.dispose();scene.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>m.dispose());}});}};
}
