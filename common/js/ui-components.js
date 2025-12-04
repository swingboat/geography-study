/**
 * 地理教学动画 - UI组件工具库
 * 提供可复用的UI组件创建和管理功能
 */

const GeoUIComponents = {
    /**
     * 创建返回主页按钮
     * @param {string} homeUrl - 主页URL路径
     * @returns {HTMLElement}
     */
    createHomeButton(homeUrl = '../../index.html') {
        const btn = document.createElement('a');
        btn.href = homeUrl;
        btn.className = 'home-btn';
        btn.title = '返回主页';
        btn.innerHTML = '🏠';
        return btn;
    },

    /**
     * 创建帮助按钮
     * @param {Function} onClick - 点击回调函数
     * @returns {HTMLElement}
     */
    createHelpButton(onClick) {
        const btn = document.createElement('button');
        btn.className = 'help-btn';
        btn.title = '查看详细说明';
        btn.innerHTML = '?';
        btn.onclick = onClick;
        return btn;
    },

    /**
     * 创建信息面板
     * @param {Object} config - 配置对象
     * @param {string} config.id - 面板ID
     * @param {string} config.title - 标题
     * @param {string} config.position - 位置 ('top-left', 'top-right', 'bottom-left', 'bottom-right')
     * @param {Array} config.items - 信息项数组
     * @returns {HTMLElement}
     */
    createInfoPanel(config) {
        const panel = document.createElement('div');
        panel.id = config.id || 'info-panel';
        panel.className = 'info-panel';
        
        // 设置位置
        const positions = {
            'top-left': { top: '65px', left: '10px' },
            'top-right': { top: '65px', right: '10px' },
            'bottom-left': { bottom: '70px', left: '10px' },
            'bottom-right': { bottom: '70px', right: '10px' }
        };
        
        const pos = positions[config.position] || positions['top-left'];
        Object.assign(panel.style, pos);
        
        // 添加标题
        if (config.title) {
            const title = document.createElement('h4');
            title.textContent = config.title;
            panel.appendChild(title);
        }
        
        // 添加内容容器
        const content = document.createElement('div');
        content.id = `${panel.id}-content`;
        panel.appendChild(content);
        
        return panel;
    },

    /**
     * 创建图例面板
     * @param {Array} legends - 图例数组，每项包含 {color, label}
     * @returns {HTMLElement}
     */
    createLegendPanel(legends) {
        const panel = document.createElement('div');
        panel.className = 'legend-panel';
        
        const title = document.createElement('h4');
        title.textContent = '📍 图例';
        panel.appendChild(title);
        
        legends.forEach(legend => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            
            const colorBox = document.createElement('div');
            colorBox.className = 'legend-color';
            colorBox.style.background = legend.color;
            
            const label = document.createElement('span');
            label.textContent = legend.label;
            
            item.appendChild(colorBox);
            item.appendChild(label);
            panel.appendChild(item);
        });
        
        return panel;
    },

    /**
     * 创建控制面板
     * @param {Object} config - 配置对象
     * @param {string} config.title - 标题
     * @param {Array} config.sliders - 滑动条配置数组
     * @param {Array} config.buttons - 按钮配置数组
     * @returns {HTMLElement}
     */
    createControlPanel(config) {
        const panel = document.createElement('div');
        panel.className = 'control-panel';
        
        const title = document.createElement('h4');
        title.textContent = config.title || '▶ 控制';
        panel.appendChild(title);
        
        // 添加滑动条
        if (config.sliders) {
            config.sliders.forEach(slider => {
                const row = document.createElement('div');
                row.className = 'slider-row';
                
                const label = document.createElement('label');
                label.textContent = slider.label;
                
                const input = document.createElement('input');
                input.type = 'range';
                input.id = slider.id;
                input.min = slider.min || 0;
                input.max = slider.max || 100;
                input.value = slider.value || 0;
                if (slider.onChange) {
                    input.addEventListener('input', slider.onChange);
                }
                
                row.appendChild(label);
                row.appendChild(input);
                panel.appendChild(row);
            });
        }
        
        // 添加按钮组
        if (config.buttons) {
            const btnGroup = document.createElement('div');
            btnGroup.className = 'btn-group';
            
            config.buttons.forEach(btnConfig => {
                const btn = document.createElement('button');
                btn.id = btnConfig.id;
                btn.textContent = btnConfig.label;
                if (btnConfig.active) {
                    btn.classList.add('active');
                }
                if (btnConfig.onClick) {
                    btn.addEventListener('click', btnConfig.onClick);
                }
                btnGroup.appendChild(btn);
            });
            
            panel.appendChild(btnGroup);
        }
        
        return panel;
    },

    /**
     * 创建底部按钮栏
     * @param {Array} buttons - 按钮配置数组
     * @returns {HTMLElement}
     */
    createBottomButtonBar(buttons) {
        const bar = document.createElement('div');
        bar.className = 'bottom-btn-bar';
        
        buttons.forEach(btnConfig => {
            const btn = document.createElement('button');
            btn.className = btnConfig.className || '';
            btn.dataset.value = btnConfig.value || '';
            btn.textContent = btnConfig.label;
            if (btnConfig.active) {
                btn.classList.add('active');
            }
            if (btnConfig.onClick) {
                btn.addEventListener('click', function() {
                    // 移除其他按钮的active状态
                    bar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    btnConfig.onClick.call(this);
                });
            }
            bar.appendChild(btn);
        });
        
        return bar;
    },

    /**
     * 创建工具提示
     * @returns {HTMLElement}
     */
    createTooltip() {
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.className = 'tooltip';
        return tooltip;
    },

    /**
     * 显示工具提示
     * @param {string} text - 提示文本
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     */
    showTooltip(text, x, y) {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.textContent = text;
            tooltip.style.left = x + 'px';
            tooltip.style.top = y + 'px';
            tooltip.classList.add('visible');
        }
    },

    /**
     * 隐藏工具提示
     */
    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    },

    /**
     * 更新速度按钮状态
     * @param {HTMLElement} activeBtn - 激活的按钮
     */
    updateSpeedButtons(activeBtn) {
        const parent = activeBtn.parentElement;
        parent.querySelectorAll('button').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    },

    /**
     * 移动端检测与跳转
     * @param {string} mobileUrl - 移动端页面URL
     */
    checkMobileDevice(mobileUrl = 'mobile.html') {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                       (window.innerWidth <= 768 && 'ontouchstart' in window);
        
        if (isMobile) {
            window.location.replace(mobileUrl);
        }
    }
};

// 导出到全局
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoUIComponents;
}
