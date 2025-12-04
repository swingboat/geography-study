/**
 * 地理教学动画 - 知识点弹窗组件
 * 提供可复用的知识点展示功能
 */

const GeoKnowledgeModal = {
    /**
     * 创建知识点弹窗
     * @param {Object} config - 配置对象
     * @param {string} config.title - 弹窗标题
     * @param {Array} config.cards - 知识卡片数组
     * @returns {HTMLElement}
     */
    createModal(config) {
        const modal = document.createElement('div');
        modal.id = 'knowledge-modal';
        modal.className = 'knowledge-modal';
        
        const content = document.createElement('div');
        content.className = 'knowledge-modal-content';
        
        // 关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => this.hide();
        content.appendChild(closeBtn);
        
        // 标题
        const title = document.createElement('h2');
        title.textContent = config.title || '知识点说明';
        content.appendChild(title);
        
        // 卡片容器
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'knowledge-cards-container';
        
        const cardsGrid = document.createElement('div');
        cardsGrid.id = 'knowledge-carousel';
        cardsGrid.className = 'knowledge-cards-grid';
        
        // 添加卡片
        config.cards.forEach(cardData => {
            const card = this.createCard(cardData);
            cardsGrid.appendChild(card);
        });
        
        cardsContainer.appendChild(cardsGrid);
        content.appendChild(cardsContainer);
        
        // 导航控件
        const nav = this.createCarouselNav(cardsGrid, config.cards.length);
        content.appendChild(nav);
        
        // 滑动提示
        const hint = document.createElement('div');
        hint.className = 'swipe-hint';
        hint.textContent = '← 左右滑动查看更多 →';
        content.appendChild(hint);
        
        modal.appendChild(content);
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hide();
            }
        });
        
        return modal;
    },

    /**
     * 创建知识卡片
     * @param {Object} cardData - 卡片数据
     * @returns {HTMLElement}
     */
    createCard(cardData) {
        const card = document.createElement('div');
        card.className = cardData.highlight ? 'knowledge-item highlight-card' : 'knowledge-item';
        
        // 标题
        const title = document.createElement('h4');
        if (cardData.icon) {
            const icon = document.createElement('span');
            icon.className = 'icon';
            icon.textContent = cardData.icon;
            title.appendChild(icon);
        }
        const titleText = document.createTextNode(cardData.title);
        title.appendChild(titleText);
        card.appendChild(title);
        
        // 内容段落
        if (Array.isArray(cardData.content)) {
            cardData.content.forEach(text => {
                const p = document.createElement('p');
                p.innerHTML = text; // 允许使用<strong>等标签
                card.appendChild(p);
            });
        } else {
            const p = document.createElement('p');
            p.innerHTML = cardData.content;
            card.appendChild(p);
        }
        
        return card;
    },

    /**
     * 创建轮播导航
     * @param {HTMLElement} carousel - 轮播容器
     * @param {number} totalCards - 卡片总数
     * @returns {HTMLElement}
     */
    createCarouselNav(carousel, totalCards) {
        const nav = document.createElement('div');
        nav.className = 'carousel-nav';
        
        // 上一张按钮
        const prevBtn = document.createElement('button');
        prevBtn.className = 'nav-btn';
        prevBtn.id = 'carousel-prev';
        prevBtn.innerHTML = '‹';
        prevBtn.addEventListener('click', () => {
            const cardWidth = carousel.querySelector('.knowledge-item').offsetWidth + 16;
            carousel.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
        nav.appendChild(prevBtn);
        
        // 点指示器
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';
        dotsContainer.id = 'carousel-dots';
        
        for (let i = 0; i < totalCards; i++) {
            const dot = document.createElement('span');
            dot.className = i === 0 ? 'dot active' : 'dot';
            dot.addEventListener('click', () => {
                const cardWidth = carousel.querySelector('.knowledge-item').offsetWidth + 16;
                carousel.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        }
        nav.appendChild(dotsContainer);
        
        // 下一张按钮
        const nextBtn = document.createElement('button');
        nextBtn.className = 'nav-btn';
        nextBtn.id = 'carousel-next';
        nextBtn.innerHTML = '›';
        nextBtn.addEventListener('click', () => {
            const cardWidth = carousel.querySelector('.knowledge-item').offsetWidth + 16;
            carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
        nav.appendChild(nextBtn);
        
        // 监听滚动更新点指示器
        carousel.addEventListener('scroll', () => {
            const cardWidth = carousel.querySelector('.knowledge-item').offsetWidth + 16;
            const activeIndex = Math.round(carousel.scrollLeft / cardWidth);
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === activeIndex);
            });
        });
        
        return nav;
    },

    /**
     * 显示弹窗
     */
    show() {
        const modal = document.getElementById('knowledge-modal');
        if (modal) {
            modal.classList.add('visible');
            // 重置滚动位置
            const carousel = modal.querySelector('.knowledge-cards-grid');
            if (carousel) {
                carousel.scrollLeft = 0;
            }
        }
    },

    /**
     * 隐藏弹窗
     */
    hide() {
        const modal = document.getElementById('knowledge-modal');
        if (modal) {
            modal.classList.remove('visible');
        }
    }
};

// 导出到全局
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoKnowledgeModal;
}
