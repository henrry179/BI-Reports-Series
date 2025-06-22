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
        
        // 文件夹层级管理
        this.folderHierarchy = {};
        this.expandedFolders = new Set();
        this.currentFolderPath = [];
        this.folderStates = new Map(); // 存储每个文件夹的展开状态
        
        // 搜索增强功能
        this.searchHistory = JSON.parse(localStorage.getItem('bi-search-history') || '[]');
        this.favoriteImages = new Set(JSON.parse(localStorage.getItem('bi-favorites') || '[]'));
        this.recentViewed = JSON.parse(localStorage.getItem('bi-recent-viewed') || '[]');
        
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
            this.buildFolderHierarchy();
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
    
    buildFolderHierarchy() {
        this.folderHierarchy = {};
        
        // 根据图片路径构建文件夹层级结构
        this.imageData.images.forEach(image => {
            const pathParts = image.path.split('/');
            let currentLevel = this.folderHierarchy;
            
            // 构建层级结构，跳过最后一个元素（文件名）
            for (let i = 0; i < pathParts.length - 1; i++) {
                const folderName = pathParts[i];
                if (!currentLevel[folderName]) {
                    currentLevel[folderName] = {
                        name: folderName,
                        cleanName: this.getCleanFolderName(folderName),
                        children: {},
                        images: [],
                        path: pathParts.slice(0, i + 1).join('/'),
                        level: i,
                        isExpanded: false
                    };
                }
                currentLevel[folderName].images.push(image);
                currentLevel = currentLevel[folderName].children;
            }
        });
    }
    
    getCleanFolderName(folderName) {
        // 移除数字前缀并美化文件夹名称
        return folderName.replace(/^\d+-/, '').replace(/[-_]/g, ' ');
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
        
        // 新增特殊筛选器
        this.specialFilter = document.getElementById('special-filter');
        this.specialFilter.addEventListener('change', () => this.filterImages());
        
        this.sortSelect.addEventListener('change', () => this.sortAndRenderImages());
        
        // 搜索建议功能
        this.searchInput.addEventListener('focus', () => this.showSearchSuggestions());
        this.searchInput.addEventListener('blur', () => {
            // 延迟隐藏，让点击事件能正常执行
            setTimeout(() => this.hideSearchSuggestions(), 200);
        });
        
        // 高级搜索按钮
        document.getElementById('advanced-search-btn').addEventListener('click', () => {
            this.toggleAdvancedSearch();
        });
        
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
        // 填充文件夹筛选器 - 按数字序号排序
        const folders = Object.keys(this.imageData.folders).sort((a, b) => {
            // 提取文件夹名开头的数字序号
            const getNumericPrefix = (folderName) => {
                const match = folderName.match(/^(\d+)-/);
                return match ? parseInt(match[1]) : 999; // 没有数字前缀的排在最后
            };
            
            const numA = getNumericPrefix(a);
            const numB = getNumericPrefix(b);
            
            // 如果数字相同，则按原来的字符串排序
            if (numA === numB) {
                return a.localeCompare(b);
            }
            
            return numA - numB;
        });
        
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
        const selectedSpecial = this.specialFilter.value;
        
        // 保存搜索历史
        if (searchTerm && !this.searchHistory.includes(searchTerm)) {
            this.searchHistory.unshift(searchTerm);
            this.searchHistory = this.searchHistory.slice(0, 10); // 只保留最近10条
            localStorage.setItem('bi-search-history', JSON.stringify(this.searchHistory));
        }
        
        let baseImages = this.imageData.images;
        
        // 特殊筛选逻辑
        if (selectedSpecial === 'favorites') {
            baseImages = baseImages.filter(image => this.favoriteImages.has(image.path));
        } else if (selectedSpecial === 'recent') {
            const recentPaths = this.recentViewed.map(item => item.path);
            baseImages = baseImages.filter(image => recentPaths.includes(image.path));
            // 按最近查看顺序排序
            baseImages.sort((a, b) => {
                const aIndex = recentPaths.indexOf(a.path);
                const bIndex = recentPaths.indexOf(b.path);
                return aIndex - bIndex;
            });
        }
        
        this.filteredImages = baseImages.filter(image => {
            const matchesSearch = !searchTerm || 
                image.filename.toLowerCase().includes(searchTerm) ||
                image.clean_folder_name.toLowerCase().includes(searchTerm) ||
                image.category.toLowerCase().includes(searchTerm) ||
                this.getImageTags(image).some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesFolder = !selectedFolder || image.folder === selectedFolder;
            const matchesCategory = !selectedCategory || image.category === selectedCategory;
            
            return matchesSearch && matchesFolder && matchesCategory;
        });
        
        this.sortAndRenderImages();
    }
    
    getImageTags(image) {
        // 根据图片内容自动生成标签
        const tags = [];
        
        // 基于文件名生成标签
        if (image.filename.includes('仪表板') || image.filename.includes('dashboard')) tags.push('仪表板');
        if (image.filename.includes('图表') || image.filename.includes('chart')) tags.push('图表');
        if (image.filename.includes('数据') || image.filename.includes('data')) tags.push('数据');
        if (image.filename.includes('分析') || image.filename.includes('analysis')) tags.push('分析');
        if (image.filename.includes('销售') || image.filename.includes('sales')) tags.push('销售');
        if (image.filename.includes('财务') || image.filename.includes('financial')) tags.push('财务');
        if (image.filename.includes('用户') || image.filename.includes('user')) tags.push('用户');
        if (image.filename.includes('产品') || image.filename.includes('product')) tags.push('产品');
        
        // 基于分类生成标签
        if (image.category === '仪表板') tags.push('dashboard', '看板');
        if (image.category === '分析图表') tags.push('chart', 'visualization');
        if (image.category === '动态演示') tags.push('动态', 'gif', 'demo');
        
        return tags;
    }
    
    showSearchSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        const suggestions = [];
        
        // 搜索历史
        this.searchHistory.forEach(term => {
            suggestions.push({
                type: 'history',
                text: term,
                icon: 'fas fa-history',
                action: () => {
                    this.searchInput.value = term;
                    this.filterImages();
                    this.hideSearchSuggestions();
                }
            });
        });
        
        // 热门标签
        const popularTags = ['仪表板', '数据分析', '销售分析', '财务分析', '用户分析'];
        popularTags.forEach(tag => {
            suggestions.push({
                type: 'tag',
                text: tag,
                icon: 'fas fa-tag',
                action: () => {
                    this.searchInput.value = tag;
                    this.filterImages();
                    this.hideSearchSuggestions();
                }
            });
        });
        
        // 显示建议
        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.map(suggestion => `
                <div class="suggestion-item" onclick="suggestion.action()">
                    <i class="${suggestion.icon}"></i>
                    <span class="suggestion-text">${suggestion.text}</span>
                </div>
            `).join('');
            
            // 添加点击事件
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item, index) => {
                item.addEventListener('click', suggestions[index].action);
            });
            
            suggestionsContainer.classList.add('active');
        }
    }
    
    hideSearchSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        suggestionsContainer.classList.remove('active');
    }
    
    toggleAdvancedSearch() {
        // 简单的高级搜索实现 - 显示搜索提示
        const searchInput = this.searchInput;
        const currentPlaceholder = searchInput.placeholder;
        
        if (currentPlaceholder.includes('高级')) {
            searchInput.placeholder = '搜索项目名称或图表类型...';
        } else {
            searchInput.placeholder = '高级搜索：支持多关键词、标签搜索...';
        }
        
        searchInput.focus();
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
                case 'viewed':
                    // 按查看时间排序（最近查看的在前）
                    const aViewTime = this.recentViewed.find(item => item.path === a.path)?.viewedAt || '';
                    const bViewTime = this.recentViewed.find(item => item.path === b.path)?.viewedAt || '';
                    return bViewTime.localeCompare(aViewTime);
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
                this.renderHierarchicalFolderView();
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
    
    renderHierarchicalFolderView() {
        const container = document.createElement('div');
        container.className = 'gallery-folders-hierarchical';
        
        // 添加面包屑导航
        if (this.currentFolderPath.length > 0) {
            const breadcrumb = this.createBreadcrumb();
            container.appendChild(breadcrumb);
        }
        
        // 渲染当前层级的文件夹和图片
        const currentLevel = this.getCurrentHierarchyLevel();
        this.renderFolderLevel(container, currentLevel, 0);
        
        this.galleryContainer.innerHTML = '';
        this.galleryContainer.appendChild(container);
    }
    
    getCurrentHierarchyLevel() {
        let currentLevel = this.folderHierarchy;
        for (const folderName of this.currentFolderPath) {
            if (currentLevel[folderName] && currentLevel[folderName].children) {
                currentLevel = currentLevel[folderName].children;
            }
        }
        return currentLevel;
    }
    
    createBreadcrumb() {
        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'folder-breadcrumb';
        
        // 根目录链接
        const homeLink = document.createElement('span');
        homeLink.className = 'breadcrumb-item breadcrumb-link';
        homeLink.innerHTML = '<i class="fas fa-home"></i> 首页';
        homeLink.addEventListener('click', () => {
            this.currentFolderPath = [];
            this.renderHierarchicalFolderView();
        });
        breadcrumb.appendChild(homeLink);
        
        // 路径链接
        this.currentFolderPath.forEach((folderName, index) => {
            const separator = document.createElement('span');
            separator.className = 'breadcrumb-separator';
            separator.textContent = '>';
            breadcrumb.appendChild(separator);
            
            const link = document.createElement('span');
            link.className = 'breadcrumb-item breadcrumb-link';
            link.textContent = this.getCleanFolderName(folderName);
            link.addEventListener('click', () => {
                this.currentFolderPath = this.currentFolderPath.slice(0, index + 1);
                this.renderHierarchicalFolderView();
            });
            breadcrumb.appendChild(link);
        });
        
        return breadcrumb;
    }
    
    renderFolderLevel(container, folderLevel, depth) {
        const folderGrid = document.createElement('div');
        folderGrid.className = 'folder-grid';
        
        // 按数字序号排序文件夹
        const sortedFolderNames = Object.keys(folderLevel).sort((a, b) => {
            const getNumericPrefix = (folderName) => {
                const match = folderName.match(/^(\d+)-/);
                return match ? parseInt(match[1]) : 999;
            };
            
            const numA = getNumericPrefix(a);
            const numB = getNumericPrefix(b);
            
            if (numA === numB) {
                return a.localeCompare(b);
            }
            
            return numA - numB;
        });
        
        sortedFolderNames.forEach(folderName => {
            const folderInfo = folderLevel[folderName];
            const folderCard = this.createHierarchicalFolderCard(folderInfo, depth);
            folderGrid.appendChild(folderCard);
        });
        
        container.appendChild(folderGrid);
    }
    
    createHierarchicalFolderCard(folderInfo, depth) {
        const card = document.createElement('div');
        card.className = `folder-card-hierarchical depth-${depth}`;
        
        const hasSubfolders = Object.keys(folderInfo.children).length > 0;
        const previewImages = folderInfo.images.slice(0, 6);
        const totalImages = folderInfo.images.length;
        
        // 计算子文件夹中的图片总数
        const totalImagesInSubfolders = this.countImagesInSubfolders(folderInfo);
        const totalAllImages = totalImages + totalImagesInSubfolders;
        
        card.innerHTML = `
            <div class="folder-header-hierarchical">
                <div class="folder-title-section">
                    <div class="folder-icon-container">
                        <i class="fas fa-folder ${hasSubfolders ? 'has-subfolders' : ''}"></i>
                    </div>
                    <div class="folder-info">
                        <div class="folder-title">${folderInfo.cleanName}</div>
                        <div class="folder-stats">
                            <span class="image-count">${totalAllImages} 张图片</span>
                            ${hasSubfolders ? `<span class="subfolder-count">${Object.keys(folderInfo.children).length} 个子文件夹</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="folder-actions">
                    ${hasSubfolders ? `
                        <button class="btn-expand" onclick="gallery.enterFolder('${folderInfo.name}')">
                            <i class="fas fa-folder-open"></i> 打开
                        </button>
                    ` : ''}
                    ${totalImages > 0 ? `
                        <button class="btn-view-images" onclick="gallery.viewFolderImages('${folderInfo.path}')">
                            <i class="fas fa-images"></i> 查看图片
                        </button>
                    ` : ''}
                </div>
            </div>
            ${previewImages.length > 0 ? `
                <div class="folder-images-preview">
                    ${previewImages.map((image, index) => `
                        <img class="folder-preview-image" 
                             src="../${image.path}" 
                             alt="${image.filename}"
                             onclick="gallery.openModal(gallery.imageData.images.find(img => img.path === '${image.path}'), ${this.imageData.images.indexOf(image)})"
                             onerror="this.style.display='none'" 
                             loading="lazy">
                    `).join('')}
                    ${totalImages > 6 ? `
                        <div class="more-images-indicator">
                            <i class="fas fa-plus"></i>
                            <span>还有 ${totalImages - 6} 张</span>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
        `;
        
        return card;
    }
    
    countImagesInSubfolders(folderInfo) {
        let count = 0;
        Object.values(folderInfo.children).forEach(child => {
            count += child.images.length;
            count += this.countImagesInSubfolders(child);
        });
        return count;
    }
    
    enterFolder(folderName) {
        this.currentFolderPath.push(folderName);
        this.renderHierarchicalFolderView();
    }
    
    viewFolderImages(folderPath) {
        // 筛选显示特定文件夹的图片
        this.filteredImages = this.imageData.images.filter(image => 
            image.path.startsWith(folderPath + '/')
        );
        this.currentView = 'grid';
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('grid-view').classList.add('active');
        this.renderGridView();
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
    
    openModal(image, index) {
        this.currentImageIndex = index;
        this.modalImage.src = `../${image.path}`;
        document.getElementById('modal-title').textContent = image.filename;
        document.getElementById('info-folder').textContent = image.clean_folder_name;
        document.getElementById('info-category').textContent = image.category;
        document.getElementById('info-filename').textContent = image.filename;
        document.getElementById('info-size').textContent = this.formatFileSize(image.size);
        
        // 更新收藏状态
        this.updateFavoriteButton(image.path);
        
        // 添加到最近查看
        this.addToRecentViewed(image);
        
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    updateFavoriteButton(imagePath) {
        const favoriteBtn = document.getElementById('favorite-btn');
        if (favoriteBtn) {
            const isFavorite = this.favoriteImages.has(imagePath);
            favoriteBtn.innerHTML = isFavorite ? 
                '<i class="fas fa-heart"></i> 已收藏' : 
                '<i class="far fa-heart"></i> 收藏';
            favoriteBtn.classList.toggle('favorited', isFavorite);
        }
    }
    
    toggleFavorite() {
        const currentImage = this.filteredImages[this.currentImageIndex];
        if (!currentImage) return;
        
        if (this.favoriteImages.has(currentImage.path)) {
            this.favoriteImages.delete(currentImage.path);
        } else {
            this.favoriteImages.add(currentImage.path);
        }
        
        localStorage.setItem('bi-favorites', JSON.stringify([...this.favoriteImages]));
        this.updateFavoriteButton(currentImage.path);
    }
    
    addToRecentViewed(image) {
        // 移除已存在的相同图片
        this.recentViewed = this.recentViewed.filter(item => item.path !== image.path);
        
        // 添加到开头
        this.recentViewed.unshift({
            path: image.path,
            filename: image.filename,
            folder: image.clean_folder_name,
            viewedAt: new Date().toISOString()
        });
        
        // 只保留最近20个
        this.recentViewed = this.recentViewed.slice(0, 20);
        
        localStorage.setItem('bi-recent-viewed', JSON.stringify(this.recentViewed));
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