/**
 * BI Reports Series - 可视化图表展示平台
 * JavaScript 主脚本文件
 */

class ImageGallery {
    constructor() {
        this.imageData = null;
        this.filteredImages = [];
        this.currentView = 'grid';
        this.currentImageIndex = 0;
        
        // DOM 元素
        this.galleryContainer = document.getElementById('gallery-container');
        this.searchInput = document.getElementById('search-input');
        this.clearSearchBtn = document.getElementById('clear-search');
        this.folderFilter = document.getElementById('folder-filter');
        this.categoryFilter = document.getElementById('category-filter');
        this.sortSelect = document.getElementById('sort-select');
        this.resultsCount = document.getElementById('results-count');
        this.modal = document.getElementById('image-modal');
        this.modalImage = document.getElementById('modal-image');
        this.backToTopBtn = document.getElementById('back-to-top');
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadImageData();
            this.setupEventListeners();
            this.populateFilters();
            this.updateStats();
            this.renderImages();
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('加载图片数据失败，请刷新页面重试。');
        }
    }
    
    async loadImageData() {
        try {
            const response = await fetch('data/image_index.json');
            if (!response.ok) throw new Error('网络请求失败');
            this.imageData = await response.json();
            this.filteredImages = [...this.imageData.images];
        } catch (error) {
            throw new Error('无法加载图片数据: ' + error.message);
        }
    }
    
    setupEventListeners() {
        // 搜索功能
        this.searchInput.addEventListener('input', this.debounce(() => {
            this.filterImages();
            this.updateClearButton();
        }, 300));
        
        this.clearSearchBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            this.filterImages();
            this.updateClearButton();
        });
        
        // 筛选器
        this.folderFilter.addEventListener('change', () => this.filterImages());
        this.categoryFilter.addEventListener('change', () => this.filterImages());
        this.sortSelect.addEventListener('change', () => this.sortAndRenderImages());
        
        // 视图切换
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.id.replace('-view', '');
                this.renderImages();
            });
        });
        
        // 模态框
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('download-btn').addEventListener('click', () => this.downloadImage());
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());
        
        // 点击模态框背景关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeModal();
                        break;
                    case 'ArrowLeft':
                        this.showPreviousImage();
                        break;
                    case 'ArrowRight':
                        this.showNextImage();
                        break;
                }
            }
        });
        
        // 返回顶部按钮
        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // 滚动事件
        window.addEventListener('scroll', this.throttle(() => {
            this.updateBackToTopButton();
        }, 100));
    }
    
    populateFilters() {
        // 填充文件夹筛选器
        const folders = Object.keys(this.imageData.folders).sort();
        folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder;
            option.textContent = this.imageData.folders[folder].clean_name;
            this.folderFilter.appendChild(option);
        });
        
        // 填充类别筛选器
        const categories = Object.keys(this.imageData.categories).sort();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            this.categoryFilter.appendChild(option);
        });
    }
    
    updateStats() {
        document.getElementById('total-images').textContent = this.imageData.metadata.total_images;
        document.getElementById('total-folders').textContent = this.imageData.metadata.total_folders;
        document.getElementById('total-categories').textContent = Object.keys(this.imageData.categories).length;
        document.getElementById('gif-count').textContent = this.imageData.categories['动态演示'] || 0;
    }
    
    filterImages() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        const selectedFolder = this.folderFilter.value;
        const selectedCategory = this.categoryFilter.value;
        
        this.filteredImages = this.imageData.images.filter(image => {
            const matchesSearch = !searchTerm || 
                image.filename.toLowerCase().includes(searchTerm) ||
                image.clean_folder_name.toLowerCase().includes(searchTerm) ||
                image.category.toLowerCase().includes(searchTerm);
            
            const matchesFolder = !selectedFolder || image.folder === selectedFolder;
            const matchesCategory = !selectedCategory || image.category === selectedCategory;
            
            return matchesSearch && matchesFolder && matchesCategory;
        });
        
        this.sortAndRenderImages();
    }
    
    sortAndRenderImages() {
        const sortBy = this.sortSelect.value;
        
        this.filteredImages.sort((a, b) => {
            switch(sortBy) {
                case 'name':
                    return a.filename.localeCompare(b.filename);
                case 'folder':
                    return a.clean_folder_name.localeCompare(b.clean_folder_name);
                case 'size':
                    return b.size - a.size;
                default:
                    return 0;
            }
        });
        
        this.renderImages();
    }
    
    renderImages() {
        this.updateResultsCount();
        
        if (this.filteredImages.length === 0) {
            this.showEmptyState();
            return;
        }
        
        switch(this.currentView) {
            case 'grid':
                this.renderGridView();
                break;
            case 'list':
                this.renderListView();
                break;
            case 'folder':
                this.renderFolderView();
                break;
        }
    }
    
    renderGridView() {
        const container = document.createElement('div');
        container.className = 'gallery-grid';
        
        this.filteredImages.forEach((image, index) => {
            const card = this.createImageCard(image, index);
            container.appendChild(card);
        });
        
        this.galleryContainer.innerHTML = '';
        this.galleryContainer.appendChild(container);
    }
    
    renderListView() {
        const container = document.createElement('div');
        container.className = 'gallery-list';
        
        this.filteredImages.forEach((image, index) => {
            const item = this.createListItem(image, index);
            container.appendChild(item);
        });
        
        this.galleryContainer.innerHTML = '';
        this.galleryContainer.appendChild(container);
    }
    
    renderFolderView() {
        const container = document.createElement('div');
        container.className = 'gallery-folders';
        
        // 按文件夹分组
        const imagesByFolder = {};
        this.filteredImages.forEach(image => {
            if (!imagesByFolder[image.folder]) {
                imagesByFolder[image.folder] = [];
            }
            imagesByFolder[image.folder].push(image);
        });
        
        Object.keys(imagesByFolder).sort().forEach(folder => {
            const folderCard = this.createFolderCard(folder, imagesByFolder[folder]);
            container.appendChild(folderCard);
        });
        
        this.galleryContainer.innerHTML = '';
        this.galleryContainer.appendChild(container);
    }
    
    createImageCard(image, index) {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.addEventListener('click', () => this.openModal(image, index));
        
        card.innerHTML = `
            <img class="image-preview" src="../${image.path}" alt="${image.filename}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhm"'" loading="lazy">
            <div class="image-meta">
                <div class="image-title">${image.filename}</div>
                <div class="image-details">
                    <span>${image.clean_folder_name}</span>
                    <span class="category-tag">${image.category}</span>
                </div>
            </div>
        `;
        
        return card;
    }
    
    createListItem(image, index) {
        const item = document.createElement('div');
        item.className = 'image-list-item';
        item.addEventListener('click', () => this.openModal(image, index));
        
        item.innerHTML = `
            <img class="list-image" src="../${image.path}" alt="${image.filename}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZiI+PC9yZWN0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjYWFhIj7lm77nlIc8L3RleHQ+PC9zdmc+'" loading="lazy">
            <div class="list-content">
                <div class="list-title">${image.filename}</div>
                <div class="list-meta">${image.clean_folder_name} • ${image.category} • ${this.formatFileSize(image.size)}</div>
            </div>
        `;
        
        return item;
    }
    
    createFolderCard(folderName, images) {
        const card = document.createElement('div');
        card.className = 'folder-card';
        
        const folderInfo = this.imageData.folders[folderName];
        const previewImages = images.slice(0, 6);
        
        card.innerHTML = `
            <div class="folder-header">
                <div class="folder-title">
                    <i class="fas fa-folder"></i>
                    ${folderInfo.clean_name}
                </div>
                <div class="folder-count">${images.length} 张图片</div>
            </div>
            <div class="folder-images">
                ${previewImages.map((image, index) => `
                    <img class="folder-image" src="../${image.path}" alt="${image.filename}" 
                         onclick="gallery.openModal(gallery.filteredImages.find(img => img.path === '${image.path}'), ${this.filteredImages.indexOf(image)})"
                         onerror="this.style.display='none'" loading="lazy">
                `).join('')}
            </div>
        `;
        
        return card;
    }
    
    openModal(image, index) {
        this.currentImageIndex = index;
        this.modalImage.src = `../${image.path}`;
        document.getElementById('modal-title').textContent = image.filename;
        document.getElementById('info-folder').textContent = image.clean_folder_name;
        document.getElementById('info-category').textContent = image.category;
        document.getElementById('info-filename').textContent = image.filename;
        document.getElementById('info-size').textContent = this.formatFileSize(image.size);
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    downloadImage() {
        const currentImage = this.filteredImages[this.currentImageIndex];
        if (!currentImage) return;
        
        const link = document.createElement('a');
        link.href = `../${currentImage.path}`;
        link.download = currentImage.filename;
        link.click();
    }
    
    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            this.modalImage.requestFullscreen();
        }
    }
    
    showPreviousImage() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
            const image = this.filteredImages[this.currentImageIndex];
            this.openModal(image, this.currentImageIndex);
        }
    }
    
    showNextImage() {
        if (this.currentImageIndex < this.filteredImages.length - 1) {
            this.currentImageIndex++;
            const image = this.filteredImages[this.currentImageIndex];
            this.openModal(image, this.currentImageIndex);
        }
    }
    
    updateResultsCount() {
        this.resultsCount.textContent = `显示 ${this.filteredImages.length} 张图表`;
    }
    
    updateClearButton() {
        if (this.searchInput.value.trim()) {
            this.clearSearchBtn.classList.add('visible');
        } else {
            this.clearSearchBtn.classList.remove('visible');
        }
    }
    
    updateBackToTopButton() {
        if (window.pageYOffset > 300) {
            this.backToTopBtn.classList.add('visible');
        } else {
            this.backToTopBtn.classList.remove('visible');
        }
    }
    
    showEmptyState() {
        this.galleryContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-search"></i>
                <p>没有找到匹配的图表</p>
                <small style="color: var(--secondary-color); margin-top: 0.5rem;">
                    尝试调整搜索条件或筛选器
                </small>
            </div>
        `;
    }
    
    showError(message) {
        this.galleryContainer.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle" style="color: var(--danger-color);"></i>
                <p>${message}</p>
            </div>
        `;
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 初始化画廊
let gallery;
document.addEventListener('DOMContentLoaded', () => {
    gallery = new ImageGallery();
});

// 全局函数（用于HTML内联事件）
window.gallery = null;
document.addEventListener('DOMContentLoaded', () => {
    window.gallery = gallery;
    initializeTabs();
});

// 选项卡功能
function initializeTabs() {
    const galleryTab = document.getElementById('gallery-tab');
    const demoTab = document.getElementById('demo-tab');
    const docsTab = document.getElementById('docs-tab');
    const galleryContent = document.getElementById('gallery-content');
    const demoContent = document.getElementById('demo-content');
    const docsContent = document.getElementById('docs-content');

    if (!galleryTab || !demoTab || !docsTab || !galleryContent || !demoContent || !docsContent) {
        console.warn('选项卡元素未找到');
        return;
    }

    // 图表展示选项卡点击事件
    galleryTab.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 切换选项卡状态
        document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
        galleryTab.classList.add('active');
        
        // 切换内容显示
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        galleryContent.classList.add('active');
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 交互演示选项卡点击事件
    demoTab.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 切换选项卡状态
        document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
        demoTab.classList.add('active');
        
        // 切换内容显示
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        demoContent.classList.add('active');
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 项目文档选项卡点击事件
    docsTab.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 切换选项卡状态
        document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
        docsTab.classList.add('active');
        
        // 切换内容显示
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        docsContent.classList.add('active');
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
} 