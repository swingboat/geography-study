/**
 * 地理教学动画 - Three.js 场景组件库
 * 提供可复用的3D场景元素和工具函数
 */

const GeoSceneComponents = {
    /**
     * 创建基础场景
     * @param {Object} config - 场景配置
     * @returns {Object} 包含 scene, camera, renderer 的对象
     */
    createBasicScene(config = {}) {
        const container = config.container || document.getElementById('canvas-container');
        const canvas = config.canvas || document.getElementById('three-canvas');
        
        // 创建场景
        const scene = new THREE.Scene();
        
        // 创建相机
        const camera = new THREE.PerspectiveCamera(
            config.fov || 45,
            container.clientWidth / container.clientHeight,
            config.near || 0.1,
            config.far || 1000
        );
        
        // 设置相机位置
        const camPos = config.cameraPosition || { x: 0, y: 10, z: 28 };
        const lookAt = config.lookAt || { x: 0, y: -3, z: 0 };
        camera.position.set(camPos.x, camPos.y, camPos.z);
        camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
        
        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // 窗口大小调整
        const onResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', onResize);
        
        return { scene, camera, renderer, onResize };
    },

    /**
     * 创建星空背景
     * @param {THREE.Scene} scene - Three.js场景
     * @param {Object} config - 配置
     */
    createStarfield(scene, config = {}) {
        const starCount = config.count || 2000;
        const minRadius = config.minRadius || 100;
        const maxRadius = config.maxRadius || 200;
        
        const starGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i += 3) {
            const radius = minRadius + Math.random() * (maxRadius - minRadius);
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: config.color || 0xffffff,
            size: config.size || 0.5,
            transparent: true,
            opacity: config.opacity || 0.8
        });

        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
        
        return stars;
    },

    /**
     * 创建太阳
     * @param {THREE.Scene} scene - Three.js场景
     * @param {Object} config - 配置
     */
    createSun(scene, config = {}) {
        const radius = config.radius || 1.5;
        const position = config.position || { x: 0, y: 0, z: 0 };
        
        // 太阳球体
        const sunGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: config.color || 0xffdd00,
            transparent: true,
            opacity: 1
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.set(position.x, position.y, position.z);
        scene.add(sun);

        // 太阳光晕
        if (config.glow !== false) {
            const glowGeometry = new THREE.SphereGeometry(radius * 1.4, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: config.glowColor || 0xffaa00,
                transparent: true,
                opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            sun.add(glow);
        }

        // 太阳点光源
        if (config.light !== false) {
            const sunLight = new THREE.PointLight(
                0xffffff, 
                config.lightIntensity || 1.5, 
                config.lightDistance || 100
            );
            sun.add(sunLight);
        }

        // 添加标签
        if (config.label) {
            const labelPos = sun.position.clone().add(new THREE.Vector3(0, radius + 1, 0));
            this.addTextSprite(scene, config.label, labelPos, config.labelColor || 0xffdd00);
        }

        return sun;
    },

    /**
     * 创建地球（带纹理）
     * @param {THREE.Group} parent - 父对象（通常是 earthGroup）
     * @param {Object} config - 配置
     */
    createEarth(parent, config = {}) {
        const radius = config.radius || 2;
        const obliquity = config.obliquity || 23.5;
        const obliquityRad = obliquity * Math.PI / 180;
        
        const earthGeometry = new THREE.SphereGeometry(radius, 64, 64);
        
        // 使用纹理或纯色
        let earthMaterial;
        if (config.useTexture !== false) {
            const textureLoader = new THREE.TextureLoader();
            const earthTexture = textureLoader.load(
                config.textureUrl || 'https://unpkg.com/three-globe@2.24.10/example/img/earth-blue-marble.jpg',
                () => {
                    if (config.onTextureLoaded) config.onTextureLoaded();
                }
            );
            
            earthMaterial = new THREE.MeshPhongMaterial({
                map: earthTexture,
                bumpScale: config.bumpScale || 0.1,
                specular: new THREE.Color(config.specular || 0x333333),
                shininess: config.shininess || 15
            });
            
            // 可选：加载凹凸贴图和高光贴图
            if (config.bumpMap !== false) {
                textureLoader.load(
                    'https://unpkg.com/three-globe@2.24.10/example/img/earth-topology.png',
                    (bumpTexture) => { earthMaterial.bumpMap = bumpTexture; }
                );
            }
            
            if (config.specularMap !== false) {
                textureLoader.load(
                    'https://unpkg.com/three-globe@2.24.10/example/img/earth-water.png',
                    (specTexture) => { earthMaterial.specularMap = specTexture; }
                );
            }
        } else {
            earthMaterial = new THREE.MeshPhongMaterial({
                color: config.color || 0x2233ff
            });
        }
        
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        earth.rotation.x = obliquityRad;
        earth.renderOrder = 10;
        parent.add(earth);
        
        // 添加大气层
        if (config.atmosphere !== false) {
            this.createAtmosphere(parent, {
                radius: radius,
                obliquity: obliquity,
                ...config.atmosphereConfig
            });
        }
        
        // 添加云层
        if (config.clouds !== false) {
            this.createCloudLayer(parent, earth, {
                radius: radius,
                obliquity: obliquity,
                ...config.cloudsConfig
            });
        }
        
        return earth;
    },

    /**
     * 创建大气层
     * @param {THREE.Group} parent - 父对象
     * @param {Object} config - 配置
     */
    createAtmosphere(parent, config = {}) {
        const radius = config.radius || 2;
        const obliquityRad = (config.obliquity || 23.5) * Math.PI / 180;
        
        // 内层大气
        const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.06, 64, 64);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: config.color || 0x4da6ff,
            transparent: true,
            opacity: config.opacity || 0.12,
            side: THREE.BackSide,
            depthWrite: false
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        atmosphere.rotation.x = obliquityRad;
        atmosphere.renderOrder = 8;
        parent.add(atmosphere);
        
        // 外层大气光晕
        const outerGeometry = new THREE.SphereGeometry(radius * 1.125, 64, 64);
        const outerMaterial = new THREE.MeshBasicMaterial({
            color: config.outerColor || 0x87ceeb,
            transparent: true,
            opacity: config.outerOpacity || 0.06,
            side: THREE.BackSide,
            depthWrite: false
        });
        const outerAtmosphere = new THREE.Mesh(outerGeometry, outerMaterial);
        outerAtmosphere.rotation.x = obliquityRad;
        outerAtmosphere.renderOrder = 7;
        parent.add(outerAtmosphere);
        
        return { atmosphere, outerAtmosphere };
    },

    /**
     * 创建云层
     * @param {THREE.Group} parent - 父对象
     * @param {THREE.Mesh} earth - 地球对象
     * @param {Object} config - 配置
     */
    createCloudLayer(parent, earth, config = {}) {
        const radius = config.radius || 2;
        const obliquityRad = (config.obliquity || 23.5) * Math.PI / 180;
        
        const textureLoader = new THREE.TextureLoader();
        const cloudTexture = textureLoader.load(
            config.textureUrl || 'https://unpkg.com/three-globe@2.24.10/example/img/earth-clouds.png'
        );
        
        const cloudGeometry = new THREE.SphereGeometry(radius * 1.025, 64, 64);
        const cloudMaterial = new THREE.MeshPhongMaterial({
            map: cloudTexture,
            transparent: true,
            opacity: config.opacity || 0.35,
            depthWrite: false
        });
        
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        clouds.rotation.x = obliquityRad;
        clouds.renderOrder = 11;
        
        // 保存到 earth 的 userData 以便后续访问
        earth.userData.clouds = clouds;
        parent.add(clouds);
        
        return clouds;
    },

    /**
     * 创建地轴
     * @param {THREE.Mesh} earth - 地球对象
     * @param {Object} config - 配置
     */
    createEarthAxis(earth, config = {}) {
        const axisLength = config.length || 5;
        const axisRadius = config.radius || 0.03;
        
        // 地轴主体
        const axisGeometry = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength * 2, 8);
        const axisMaterial = new THREE.MeshBasicMaterial({
            color: config.color || 0xffffff,
            transparent: true,
            opacity: config.opacity || 0.9
        });
        const axis = new THREE.Mesh(axisGeometry, axisMaterial);
        earth.add(axis);

        // 北极点标记
        const northArrowGeometry = new THREE.ConeGeometry(0.15, 0.4, 8);
        const northArrowMaterial = new THREE.MeshBasicMaterial({ 
            color: config.northColor || 0x00ff88 
        });
        const northArrow = new THREE.Mesh(northArrowGeometry, northArrowMaterial);
        northArrow.position.set(0, axisLength + 0.2, 0);
        earth.add(northArrow);

        // 南极点标记
        const southGeometry = new THREE.SphereGeometry(0.12, 16, 16);
        const southMaterial = new THREE.MeshBasicMaterial({ 
            color: config.southColor || 0x00ff88 
        });
        const southPole = new THREE.Mesh(southGeometry, southMaterial);
        southPole.position.set(0, -axisLength, 0);
        earth.add(southPole);
        
        return { axis, northArrow, southPole };
    },

    /**
     * 创建纬线
     * @param {THREE.Mesh} earth - 地球对象
     * @param {number} latitude - 纬度（度数）
     * @param {Object} config - 配置
     */
    createLatitudeLine(earth, latitude, config = {}) {
        const earthRadius = config.earthRadius || 2;
        const lineRadius = config.lineRadius || 2.03;
        const latRad = latitude * Math.PI / 180;
        const radius = lineRadius * Math.cos(latRad);
        const y = lineRadius * Math.sin(latRad);
        const segments = config.segments || 64;

        const points = [];
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                radius * Math.cos(theta),
                y,
                radius * Math.sin(theta)
            ));
        }

        const curve = new THREE.CatmullRomCurve3(points, true);
        const tubeRadius = config.thickness || 0.02;
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, tubeRadius, 8, true);
        const tubeMaterial = new THREE.MeshBasicMaterial({
            color: config.color || 0x66bb6a,
            transparent: true,
            opacity: config.opacity || 0.85
        });
        
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        earth.add(tube);
        
        // 添加标签
        if (config.label) {
            const labelPos = new THREE.Vector3(0, y, radius + 0.5);
            const sprite = this.createTextSprite(config.label, config.labelColor || config.color);
            sprite.position.copy(labelPos);
            earth.add(sprite);
        }
        
        return tube;
    },

    /**
     * 创建公转轨道
     * @param {THREE.Scene} scene - Three.js场景
     * @param {Object} config - 配置
     */
    createOrbit(scene, config = {}) {
        const orbitRadius = config.radius || 15;
        const segments = config.segments || 128;
        const points = [];

        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            points.push(new THREE.Vector3(
                orbitRadius * Math.cos(theta),
                0,
                orbitRadius * Math.sin(theta)
            ));
        }

        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const orbitMaterial = new THREE.LineDashedMaterial({
            color: config.color || 0x666666,
            dashSize: config.dashSize || 0.5,
            gapSize: config.gapSize || 0.3
        });
        
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        orbitLine.computeLineDistances();
        scene.add(orbitLine);
        
        return orbitLine;
    },

    /**
     * 创建平面（如黄道面、赤道面）
     * @param {THREE.Scene|THREE.Group} parent - 父对象
     * @param {Object} config - 配置
     */
    createPlane(parent, config = {}) {
        const innerRadius = config.innerRadius || 3.5;
        const outerRadius = config.outerRadius || 17;
        const segments = config.segments || 64;
        
        // 主平面
        const planeGeometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: config.color || 0xffcc66,
            transparent: true,
            opacity: config.opacity || 0.15,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        
        // 应用旋转
        if (config.rotation) {
            plane.rotation.x = config.rotation.x || 0;
            plane.rotation.y = config.rotation.y || 0;
            plane.rotation.z = config.rotation.z || 0;
        }
        
        plane.renderOrder = config.renderOrder || -1;
        parent.add(plane);
        
        // 边缘高亮
        if (config.edge !== false) {
            const edgeGeometry = new THREE.RingGeometry(
                outerRadius - 0.2, 
                outerRadius, 
                segments
            );
            const edgeMaterial = new THREE.MeshBasicMaterial({
                color: config.edgeColor || config.color || 0xffdd88,
                transparent: true,
                opacity: config.edgeOpacity || 0.5,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
            
            if (config.rotation) {
                edge.rotation.copy(plane.rotation);
            }
            
            edge.renderOrder = 0;
            parent.add(edge);
            
            return { plane, edge };
        }
        
        return { plane };
    },

    /**
     * 创建北极星
     * @param {THREE.Scene} scene - Three.js场景
     * @param {Object} config - 配置
     */
    createPolarStar(scene, config = {}) {
        const distance = config.distance || 40;
        const obliquityRad = (config.obliquity || 23.5) * Math.PI / 180;
        
        const y = distance * Math.cos(obliquityRad);
        const z = -distance * Math.sin(obliquityRad);

        // 北极星主体
        const starGeometry = new THREE.SphereGeometry(config.radius || 0.8, 16, 16);
        const starMaterial = new THREE.MeshBasicMaterial({ 
            color: config.color || 0xffffcc 
        });
        const polarStar = new THREE.Mesh(starGeometry, starMaterial);
        polarStar.position.set(0, y, z);
        scene.add(polarStar);

        // 发光效果
        const glowColors = config.glowColors || [0xffffcc, 0xffffaa, 0xffff88];
        const glowSizes = config.glowSizes || [1.2, 1.6, 2.0];
        const glowOpacities = config.glowOpacities || [0.4, 0.2, 0.1];
        
        glowColors.forEach((color, i) => {
            const glowGeometry = new THREE.SphereGeometry(glowSizes[i], 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: glowOpacities[i]
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            polarStar.add(glow);
        });

        // 星芒效果
        if (config.spikes !== false) {
            this.createStarSpikes(polarStar, config);
        }

        // 添加标签
        if (config.label) {
            this.addTextSprite(scene, config.label, 
                new THREE.Vector3(2, y + 1, z), 
                config.labelColor || 0xffffcc,
                config.labelScale || 0.7
            );
        }
        
        return polarStar;
    },

    /**
     * 创建星芒效果
     * @param {THREE.Mesh} star - 星星对象
     * @param {Object} config - 配置
     */
    createStarSpikes(star, config = {}) {
        const spikeCount = config.spikeCount || 4;
        const spikeLength = config.spikeLength || 2;
        
        for (let i = 0; i < spikeCount; i++) {
            const angle = (i / spikeCount) * Math.PI;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array([
                -spikeLength * Math.cos(angle), -spikeLength * Math.sin(angle), 0,
                spikeLength * Math.cos(angle), spikeLength * Math.sin(angle), 0
            ]);
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const material = new THREE.LineBasicMaterial({
                color: config.spikeColor || 0xffffcc,
                transparent: true,
                opacity: config.spikeOpacity || 0.5
            });
            
            const spike = new THREE.Line(geometry, material);
            star.add(spike);
        }
    },

    /**
     * 添加文字标签（精灵）
     * @param {THREE.Scene} scene - Three.js场景
     * @param {string} text - 文字内容
     * @param {THREE.Vector3} position - 位置
     * @param {number} color - 颜色
     * @param {number} scale - 缩放
     */
    addTextSprite(scene, text, position, color = 0xffffff, scale = 0.6) {
        const sprite = this.createTextSprite(text, color, scale);
        sprite.position.copy(position);
        scene.add(sprite);
        return sprite;
    },

    /**
     * 创建文字精灵
     * @param {string} text - 文字内容
     * @param {number} color - 颜色
     * @param {number} scale - 缩放
     */
    createTextSprite(text, color = 0xffffff, scale = 0.6) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        context.fillStyle = 'transparent';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.font = 'Bold 28px Microsoft YaHei, Arial';
        context.textAlign = 'center';
        context.fillStyle = '#' + color.toString(16).padStart(6, '0');
        context.fillText(text, canvas.width / 2, canvas.height / 2 + 10);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });

        const sprite = new THREE.Sprite(material);
        sprite.scale.set(4 * scale, 1 * scale, 1);
        return sprite;
    },

    /**
     * 添加环境光
     * @param {THREE.Scene} scene - Three.js场景
     * @param {Object} config - 配置
     */
    addAmbientLight(scene, config = {}) {
        const light = new THREE.AmbientLight(
            config.color || 0x404040, 
            config.intensity || 0.5
        );
        scene.add(light);
        return light;
    },

    /**
     * 创建季节标记
     * @param {THREE.Scene} scene - Three.js场景
     * @param {Object} seasonData - 季节数据数组
     * @param {number} orbitRadius - 轨道半径
     */
    createSeasonMarkers(scene, seasonData, orbitRadius = 15) {
        const markers = [];
        
        seasonData.forEach(season => {
            const theta = season.angle * Math.PI / 180;
            const x = orbitRadius * Math.cos(theta);
            const z = orbitRadius * Math.sin(theta);

            // 位置标记点
            const markerGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const markerMaterial = new THREE.MeshBasicMaterial({ 
                color: season.color 
            });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(x, 0, z);
            scene.add(marker);

            // 标签
            this.addTextSprite(scene, season.label, 
                new THREE.Vector3(x, 1.5, z), 
                season.color
            );
            
            markers.push(marker);
        });
        
        return markers;
    }
};

// 导出到全局
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoSceneComponents;
}
