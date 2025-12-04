# 地理教学动画 - UI组件库使用指南

## 组件库概览

本项目提供了一套统一的UI组件库和Three.js场景组件库，用于保持所有教学动画的一致风格。

### 文件结构

```
common/
├── styles/
│   └── ui-components.css      # 通用UI样式
└── js/
    ├── ui-components.js       # UI组件工具
    ├── knowledge-modal.js     # 知识点弹窗组件
    └── scene-components.js    # Three.js场景组件 ⭐新增
```

## 快速开始

### 1. 引入样式和脚本

在HTML文件的`<head>`中引入样式：

```html
<link rel="stylesheet" href="../../common/styles/ui-components.css">
```

在`<body>`底部引入脚本：

```html
<!-- Three.js库 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- 组件库 -->
<script src="../../common/js/ui-components.js"></script>
<script src="../../common/js/knowledge-modal.js"></script>
<script src="../../common/js/scene-components.js"></script>
```

### 2. 基础HTML结构

```html
<div class="container">
    <header>
        <h1>🌍 页面标题</h1>
    </header>
    <div class="main-content">
        <div id="canvas-container">
            <canvas id="three-canvas"></canvas>
            <!-- UI组件将通过JavaScript添加到这里 -->
        </div>
    </div>
</div>
```

## 组件使用示例

### 创建返回主页按钮

```javascript
const homeBtn = GeoUIComponents.createHomeButton('../../index.html');
document.body.appendChild(homeBtn);
```

### 创建帮助按钮

```javascript
const helpBtn = GeoUIComponents.createHelpButton(() => {
    GeoKnowledgeModal.show();
});
document.body.appendChild(helpBtn);
```

### 创建信息面板

```javascript
const infoPanel = GeoUIComponents.createInfoPanel({
    id: 'info-panel',
    title: '当前信息',
    position: 'top-left'
});
document.getElementById('canvas-container').appendChild(infoPanel);

// 更新面板内容
const content = document.getElementById('info-panel-content');
content.innerHTML = `
    <div>时间：<span id="current-time">12:00</span></div>
    <div>位置：<span id="current-pos">赤道</span></div>
`;
```

### 创建图例面板

```javascript
const legends = [
    { color: '#66bb6a', label: '赤道 (0°)' },
    { color: '#ff7043', label: '北回归线 (23.5°N)' },
    { color: '#4fc3f7', label: '南回归线 (23.5°S)' }
];

const legendPanel = GeoUIComponents.createLegendPanel(legends);
document.getElementById('canvas-container').appendChild(legendPanel);
```

### 创建控制面板

```javascript
const controlPanel = GeoUIComponents.createControlPanel({
    title: '▶ 动画控制',
    sliders: [
        {
            id: 'orbit-slider',
            label: '公转',
            min: 0,
            max: 360,
            value: 0,
            onChange: (e) => updateOrbitPosition(parseFloat(e.target.value))
        }
    ],
    buttons: [
        { id: 'pause-btn', label: '暂停', onClick: togglePause },
        { id: 'slow-btn', label: '慢', onClick: () => setSpeed(0.3) },
        { id: 'normal-btn', label: '正常', active: true, onClick: () => setSpeed(1) },
        { id: 'fast-btn', label: '快', onClick: () => setSpeed(3) }
    ]
});
document.getElementById('canvas-container').appendChild(controlPanel);
```

### 创建底部按钮栏

```javascript
const buttons = [
    { label: '🌸 春分', value: 'spring', active: true, onClick: selectSeason },
    { label: '☀️ 夏至', value: 'summer', onClick: selectSeason },
    { label: '🍂 秋分', value: 'autumn', onClick: selectSeason },
    { label: '❄️ 冬至', value: 'winter', onClick: selectSeason }
];

const bottomBar = GeoUIComponents.createBottomButtonBar(buttons);
document.getElementById('canvas-container').appendChild(bottomBar);

function selectSeason() {
    const season = this.dataset.value;
    // 处理季节切换逻辑
}
```

### 创建知识点弹窗

```javascript
const knowledgeCards = [
    {
        icon: '🌍',
        title: '什么是黄赤交角？',
        content: [
            '<strong>定义：</strong>黄赤交角是地球赤道面与黄道面之间的夹角。',
            '<strong>数值：</strong>约为23°26′（约23.5°）。'
        ]
    },
    {
        icon: '🔄',
        title: '地球的自转',
        content: '<strong>方向：</strong>自西向东（从北极上空俯视为逆时针）'
    },
    {
        icon: '💡',
        title: '记忆要点',
        highlight: true,
        content: [
            '黄赤交角 = 回归线纬度 ≈ 23.5°',
            '极圈纬度 = 90° - 黄赤交角 ≈ 66.5°'
        ]
    }
];

const modal = GeoKnowledgeModal.createModal({
    title: '📚 黄赤交角 - 完整知识说明',
    cards: knowledgeCards
});
document.body.appendChild(modal);
```

### 移动端检测

```javascript
// 在页面加载时检测
window.addEventListener('DOMContentLoaded', () => {
    GeoUIComponents.checkMobileDevice('mobile.html');
    // 其他初始化代码...
});
```

## Three.js 场景组件使用

### 创建基础场景

```javascript
const { scene, camera, renderer } = GeoSceneComponents.createBasicScene({
    fov: 45,
    cameraPosition: { x: 0, y: 10, z: 28 },
    lookAt: { x: 0, y: -3, z: 0 }
});
```

### 创建星空背景

```javascript
GeoSceneComponents.createStarfield(scene, {
    count: 2000,
    minRadius: 100,
    maxRadius: 200,
    size: 0.5
});
```

### 创建太阳

```javascript
const sun = GeoSceneComponents.createSun(scene, {
    radius: 1.5,
    position: { x: 0, y: 0, z: 0 },
    glow: true,
    light: true,
    label: '太阳',
    labelColor: 0xffdd00
});
```

### 创建地球

```javascript
// 创建地球组（用于公转）
const earthGroup = new THREE.Group();
scene.add(earthGroup);

// 创建地球
const earth = GeoSceneComponents.createEarth(earthGroup, {
    radius: 2,
    obliquity: 23.5,
    useTexture: true,
    atmosphere: true,
    clouds: true
});
```

### 创建地轴

```javascript
GeoSceneComponents.createEarthAxis(earth, {
    length: 5,
    radius: 0.03,
    northColor: 0x00ff88,
    southColor: 0x00ff88
});
```

### 创建纬线

```javascript
// 赤道
GeoSceneComponents.createLatitudeLine(earth, 0, {
    color: 0x44ff44,
    thickness: 0.02,
    label: '赤道 0°',
    labelColor: 0x44ff44
});

// 北回归线
GeoSceneComponents.createLatitudeLine(earth, 23.5, {
    color: 0xff6633,
    thickness: 0.015,
    label: '北回归线 23.5°N',
    labelColor: 0xff6633
});

// 南回归线
GeoSceneComponents.createLatitudeLine(earth, -23.5, {
    color: 0x33bbff,
    thickness: 0.015,
    label: '南回归线 23.5°S',
    labelColor: 0x33bbff
});
```

### 创建公转轨道

```javascript
const orbitLine = GeoSceneComponents.createOrbit(scene, {
    radius: 15,
    color: 0x666666,
    dashSize: 0.5,
    gapSize: 0.3
});
```

### 创建平面（黄道面/赤道面）

```javascript
// 黄道面（固定在场景中）
const { plane: eclipticPlane } = GeoSceneComponents.createPlane(scene, {
    innerRadius: 3.5,
    outerRadius: 17,
    color: 0xffcc66,
    opacity: 0.15,
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
    edge: true,
    edgeColor: 0xffdd88
});

// 赤道面（跟随地球）
const { plane: equatorialPlane } = GeoSceneComponents.createPlane(earthGroup, {
    innerRadius: 2.5,
    outerRadius: 8,
    color: 0x66ccaa,
    opacity: 0.15,
    rotation: { x: Math.PI / 2, y: 0, z: 0 },
    edge: true,
    edgeColor: 0x88ffcc
});
```

### 创建北极星

```javascript
const polarStar = GeoSceneComponents.createPolarStar(scene, {
    distance: 40,
    obliquity: 23.5,
    radius: 0.8,
    spikes: true,
    label: '⭐ 北极星',
    labelColor: 0xffffcc
});
```

### 创建季节标记

```javascript
const seasonData = [
    { angle: 0, label: '春分', color: 0x66bb6a },
    { angle: 90, label: '夏至', color: 0xff7043 },
    { angle: 180, label: '秋分', color: 0xffb74d },
    { angle: 270, label: '冬至', color: 0x4fc3f7 }
];

GeoSceneComponents.createSeasonMarkers(scene, seasonData, 15);
```

### 添加环境光

```javascript
GeoSceneComponents.addAmbientLight(scene, {
    color: 0x404040,
    intensity: 0.5
});
```

## 完整示例

参考 `obliquity-of-ecliptic/index.html` 查看完整的实现示例。

## 样式定制

### 颜色变量

主要颜色已在组件中定义，如需修改可以在页面级CSS中覆盖：

```css
/* 自定义颜色 */
.legend-panel {
    background: rgba(20, 30, 50, 0.9); /* 自定义背景 */
}
```

### 预定义颜色类

```css
.legend-color.equator { background: #66bb6a; }
.legend-color.tropic-n { background: #ff7043; }
.legend-color.tropic-s { background: #4fc3f7; }
```

## 最佳实践

1. **保持一致性**：所有新页面都应使用这套组件系统
2. **位置规范**：
   - 返回按钮：左上角
   - 帮助按钮：左下角
   - 信息面板：可选左上或右上
   - 图例面板：左下
   - 控制面板：右下
   - 底部按钮栏：底部居中
3. **响应式设计**：组件已包含移动端适配
4. **无障碍访问**：按钮都有合适的title属性

## 技术支持

如有问题或建议，请参考现有实现或联系开发团队。
