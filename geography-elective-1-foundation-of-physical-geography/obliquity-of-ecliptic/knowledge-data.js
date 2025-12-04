/**
 * 黄赤交角与回归线 - 知识点数据配置
 */

const obliquityKnowledgeData = {
    title: '📚 黄赤交角与回归线 - 完整知识说明',
    cards: [
        {
            icon: '🌍',
            title: '什么是黄赤交角？',
            content: [
                '<strong>定义：</strong>黄赤交角是地球赤道面与黄道面（地球公转轨道面）之间的夹角，也等于地轴与黄道面法线的夹角。',
                '<strong>数值：</strong>约为23°26′（约23.5°），不是固定不变的，在22.1°到24.5°之间缓慢变化，周期约4.1万年。',
                '<strong>意义：</strong>黄赤交角的存在是地球上产生四季变化的根本原因！'
            ]
        },
        {
            icon: '🔄',
            title: '地球的自转',
            content: [
                '<strong>方向：</strong>自西向东（从北极上空俯视为逆时针）',
                '<strong>周期：</strong>约23小时56分04秒（一个恒星日）',
                '<strong>意义：</strong>产生昼夜交替现象，决定了地方时和时区。'
            ]
        },
        {
            icon: '💫',
            title: '地球的公转',
            content: [
                '<strong>方向：</strong>自西向东（从北极上空俯视为逆时针），与自转方向相同',
                '<strong>周期：</strong>约365.25天（一个回归年）',
                '<strong>特点：</strong>地轴始终指向北极星方向，与黄道面保持66.5°夹角。'
            ]
        },
        {
            icon: '☀️',
            title: '太阳直射点的移动规律',
            content: [
                '<strong>春分（3月21日左右）：</strong>太阳直射赤道，全球昼夜等长。',
                '<strong>夏至（6月22日左右）：</strong>太阳直射北回归线，北半球白昼最长。',
                '<strong>秋分（9月23日左右）：</strong>太阳直射赤道，全球昼夜等长。',
                '<strong>冬至（12月22日左右）：</strong>太阳直射南回归线，北半球白昼最短。'
            ]
        },
        {
            icon: '📏',
            title: '回归线的由来',
            content: [
                '<strong>北回归线：</strong>位于北纬23.5°，是太阳直射点能到达的最北位置。',
                '<strong>南回归线：</strong>位于南纬23.5°，是太阳直射点能到达的最南位置。',
                '<strong>数学关系：</strong>回归线的纬度 = 黄赤交角的度数！',
                '<strong>名称由来：</strong>"回归"指太阳直射点到达该纬度后就会"返回"，不再继续向极地移动。'
            ]
        },
        {
            icon: '🌐',
            title: '五带的划分',
            content: [
                '<strong>热带：</strong>南北回归线之间（23.5°N ~ 23.5°S），有太阳直射现象。',
                '<strong>北温带：</strong>北回归线到北极圈之间（23.5°N ~ 66.5°N）。',
                '<strong>南温带：</strong>南回归线到南极圈之间（23.5°S ~ 66.5°S）。',
                '<strong>北寒带：</strong>北极圈以北（66.5°N ~ 90°N），有极昼极夜现象。',
                '<strong>南寒带：</strong>南极圈以南（66.5°S ~ 90°S），有极昼极夜现象。'
            ]
        },
        {
            icon: '🇨🇳',
            title: '中国的位置',
            content: [
                '<strong>纬度范围：</strong>约北纬4°～53°，大部分位于北温带。',
                '<strong>北回归线穿过：</strong>云南、广西、广东、台湾四省区。',
                '<strong>夏至日特点：</strong>北回归线以北地区白昼最长，是全年白天最长的一天。',
                '<strong>冬至日特点：</strong>北回归线以北地区白昼最短，是全年白天最短的一天。'
            ]
        },
        {
            icon: '💡',
            title: '记忆要点',
            highlight: true,
            content: [
                '黄赤交角 = 回归线纬度 ≈ 23.5°',
                '极圈纬度 = 90° - 黄赤交角 ≈ 66.5°',
                '地球自转、公转方向相同：自西向东',
                '地轴始终指向北极星方向，与黄道面成66.5°角',
                '春分秋分：全球昼夜等长；夏至冬至：昼夜差异最大'
            ]
        }
    ]
};

// 季节数据配置
const seasonsData = {
    spring: { angle: 0, name: '春分', subsolar: '赤道 (0°)', date: '3月21日左右' },
    summer: { angle: 90, name: '夏至', subsolar: '北回归线 (北纬23.5°)', date: '6月22日左右' },
    autumn: { angle: 180, name: '秋分', subsolar: '赤道 (0°)', date: '9月23日左右' },
    winter: { angle: 270, name: '冬至', subsolar: '南回归线 (南纬23.5°)', date: '12月22日左右' }
};

// 图例数据配置
const legendsData = [
    { color: '#66bb6a', label: '赤道 (0°)' },
    { color: '#ff7043', label: '北回归线 (23.5°N)' },
    { color: '#4fc3f7', label: '南回归线 (23.5°S)' },
    { color: '#ff4444', label: '中国位置' },
    { color: '#ffcc66', label: '黄道面' },
    { color: '#66ccaa', label: '赤道面' }
];
