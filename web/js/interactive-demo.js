/**
 * BI Reports Series - 交互式图表演示
 * Interactive Demo Module
 */

class InteractiveDemo {
    constructor() {
        this.charts = {};
        this.currentDemo = 'sales';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeDemoData();
        // 延迟渲染，确保DOM已准备好
        setTimeout(() => {
            this.renderInitialCharts();
        }, 500);
    }

    setupEventListeners() {
        // 演示导航切换
        document.querySelectorAll('.demo-nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const demoType = e.target.closest('.demo-nav-btn').dataset.demo;
                this.switchDemo(demoType);
            });
        });

        // 主标签页切换监听
        const demoTab = document.getElementById('demo-tab');
        if (demoTab) {
            demoTab.addEventListener('click', () => {
                // 延迟一点时间确保DOM已切换完成
                setTimeout(() => {
                    this.renderInitialCharts();
                }, 200);
            });
        }

        // 各种控件的事件监听
        this.setupChartControls();
    }

    setupChartControls() {
        // 销售数据控件
        const salesYearSelect = document.getElementById('sales-year-select');
        if (salesYearSelect) {
            salesYearSelect.addEventListener('change', (e) => {
                this.updateSalesTrendChart(e.target.value);
            });
        }

        // 产品类别图表切换
        document.querySelectorAll('[data-chart]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const chartType = e.target.dataset.chart;
                this.updateCategoryChart(chartType);
                this.toggleActiveButton(e.target);
            });
        });

        // 地区销售视图切换
        document.querySelectorAll('[data-view]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewType = e.target.dataset.view;
                this.updateRegionChart(viewType);
                this.toggleActiveButton(e.target);
            });
        });

        // 业绩指标切换
        const performanceMetric = document.getElementById('performance-metric');
        if (performanceMetric) {
            performanceMetric.addEventListener('change', (e) => {
                this.updatePerformanceChart(e.target.value);
            });
        }

        // 财务分析控件
        const profitPeriod = document.getElementById('profit-period');
        if (profitPeriod) {
            profitPeriod.addEventListener('change', (e) => {
                this.updateProfitChart(e.target.value);
            });
        }

        const financialCompany = document.getElementById('financial-company');
        if (financialCompany) {
            financialCompany.addEventListener('change', (e) => {
                this.updateFinancialRadarChart(e.target.value);
            });
        }

        // 资产负债结构切换
        document.querySelectorAll('[data-structure]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const structureType = e.target.dataset.structure;
                this.updateStructureChart(structureType);
                this.toggleActiveButton(e.target);
            });
        });

        // 用户分析控件
        const retentionCohort = document.getElementById('retention-cohort');
        if (retentionCohort) {
            retentionCohort.addEventListener('change', (e) => {
                this.updateRetentionChart(e.target.value);
            });
        }

        const activityPeriod = document.getElementById('activity-period');
        if (activityPeriod) {
            activityPeriod.addEventListener('change', (e) => {
                this.updateActivityHeatmap(e.target.value);
            });
        }

        // RFM分析切换
        document.querySelectorAll('[data-rfm]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rfmType = e.target.dataset.rfm;
                this.updateRFMChart(rfmType);
                this.toggleActiveButton(e.target);
            });
        });

        // 市场分析控件
        const marketSegment = document.getElementById('market-segment');
        if (marketSegment) {
            marketSegment.addEventListener('change', (e) => {
                this.updateMarketShareChart(e.target.value);
            });
        }

        const bostonData = document.getElementById('boston-data');
        if (bostonData) {
            bostonData.addEventListener('change', (e) => {
                this.updateBostonMatrixChart(e.target.value);
            });
        }

        // 竞争对手分析切换
        document.querySelectorAll('[data-competitor]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const competitorType = e.target.dataset.competitor;
                this.updateCompetitorChart(competitorType);
                this.toggleActiveButton(e.target);
            });
        });
    }

    switchDemo(demoType) {
        // 更新导航状态
        document.querySelectorAll('.demo-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-demo="${demoType}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // 切换内容区域
        document.querySelectorAll('.demo-section').forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = document.getElementById(`${demoType}-demo`);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        this.currentDemo = demoType;
        
        // 渲染对应的图表
        setTimeout(() => {
            this.renderDemoCharts(demoType);
        }, 100);
    }

    toggleActiveButton(clickedBtn) {
        const parentControls = clickedBtn.parentElement;
        parentControls.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        clickedBtn.classList.add('active');
    }

    initializeDemoData() {
        // 销售数据
        this.salesData = {
            2023: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                sales: [320, 290, 450, 380, 520, 480, 630, 590, 720, 680, 800, 750]
            },
            2024: {
                months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                sales: [380, 420, 520, 480, 680, 750, 820, 780, 950, 900, 1080, 1150]
            }
        };

        this.categoryData = {
            labels: ['电子产品', '服装鞋帽', '家居用品', '食品饮料', '体育用品', '图书文具'],
            values: [35, 25, 20, 12, 5, 3]
        };

        this.regionData = {
            labels: ['华东', '华南', '华北', '华中', '西南', '东北', '西北'],
            values: [28, 22, 18, 15, 10, 4, 3]
        };

        this.performanceData = {
            names: ['张明', '李华', '王芳', '陈强', '刘婷', '赵磊', '孙娜', '周鹏'],
            sales: [1250, 1180, 1050, 980, 920, 850, 780, 720],
            orders: [85, 78, 72, 68, 64, 58, 52, 48],
            customers: [65, 62, 58, 54, 51, 47, 43, 39]
        };

        // 财务数据
        this.financialData = {
            quarterly: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                revenue: [2500, 2800, 3200, 3500],
                profit: [380, 420, 480, 525],
                margin: [15.2, 15.0, 15.0, 15.0]
            },
            yearly: {
                labels: ['2021', '2022', '2023', '2024'],
                revenue: [8500, 9200, 10800, 12000],
                profit: [1275, 1472, 1728, 1980],
                margin: [15.0, 16.0, 16.0, 16.5]
            },
            radar: {
                company1: [80, 75, 70, 85, 90],
                company2: [70, 85, 80, 75, 85],
                company3: [90, 70, 85, 80, 75]
            }
        };

        // 用户数据
        this.userData = {
            retention: {
                monthly: [100, 45, 32, 28, 25, 23, 21, 20, 19, 18, 17, 16],
                weekly: [100, 65, 48, 38, 32, 28, 25, 23, 21, 19, 18, 17]
            },
            rfm: {
                recency: [1, 2, 3, 4, 5, 2, 3, 4, 1, 2, 3, 5, 4, 3, 2, 1, 5, 4, 3, 2],
                frequency: [10, 8, 6, 4, 2, 12, 9, 5, 15, 11, 7, 3, 6, 8, 10, 12, 4, 6, 9, 11],
                monetary: [1000, 800, 600, 400, 200, 1200, 900, 500, 1500, 1100, 700, 300, 600, 800, 1000, 1200, 400, 600, 900, 1100]
            }
        };

        // 市场数据
        this.marketData = {
            share: {
                product: ['产品A', '产品B', '产品C', '产品D', '其他'],
                productValues: [35, 28, 20, 12, 5],
                region: ['华东', '华南', '华北', '华中', '其他'],
                regionValues: [30, 25, 20, 15, 10]
            },
            boston: {
                current: [
                    { x: 15, y: 8, r: 20, label: '产品A' },
                    { x: 25, y: 12, r: 15, label: '产品B' },
                    { x: 35, y: 18, r: 25, label: '产品C' },
                    { x: 8, y: 25, r: 10, label: '产品D' }
                ],
                projected: [
                    { x: 18, y: 10, r: 22, label: '产品A' },
                    { x: 28, y: 15, r: 17, label: '产品B' },
                    { x: 32, y: 20, r: 27, label: '产品C' },
                    { x: 12, y: 22, r: 12, label: '产品D' }
                ]
            }
        };
    }

    renderInitialCharts() {
        // 检查是否在交互演示标签页
        const demoContent = document.getElementById('demo-content');
        if (!demoContent || !demoContent.classList.contains('active')) {
            return;
        }

        if (this.currentDemo === 'sales') {
            this.renderSalesCharts();
        }
    }

    renderDemoCharts(demoType) {
        switch (demoType) {
            case 'sales':
                this.renderSalesCharts();
                break;
            case 'financial':
                this.renderFinancialCharts();
                break;
            case 'user':
                this.renderUserCharts();
                break;
            case 'market':
                this.renderMarketCharts();
                break;
        }
    }

    renderSalesCharts() {
        this.renderSalesTrendChart('2024');
        this.renderCategoryChart('pie');
        this.renderRegionChart('bar');
        this.renderPerformanceChart('sales');
    }

    renderSalesTrendChart(year) {
        const ctx = document.getElementById('sales-trend-chart');
        if (!ctx) return;

        // 销毁现有图表
        if (this.charts.salesTrend) {
            this.charts.salesTrend.destroy();
        }

        const data = this.salesData[year];
        
        this.charts.salesTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [{
                    label: `${year}年销售额(万元)`,
                    data: data.sales,
                    borderColor: '#4A90E2',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4A90E2',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#4A90E2',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '万';
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    updateSalesTrendChart(year) {
        this.renderSalesTrendChart(year);
    }

    renderCategoryChart(type) {
        const ctx = document.getElementById('category-chart');
        if (!ctx) return;

        if (this.charts.category) {
            this.charts.category.destroy();
        }

        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

        this.charts.category = new Chart(ctx, {
            type: type,
            data: {
                labels: this.categoryData.labels,
                datasets: [{
                    data: this.categoryData.values,
                    backgroundColor: colors,
                    borderColor: colors.map(color => color),
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                }
            }
        });
    }

    updateCategoryChart(type) {
        this.renderCategoryChart(type);
    }

    renderRegionChart(viewType) {
        const ctx = document.getElementById('region-chart');
        if (!ctx) return;

        if (this.charts.region) {
            this.charts.region.destroy();
        }

        const chartType = 'bar';
        const indexAxis = viewType === 'horizontal' ? 'y' : 'x';

        this.charts.region = new Chart(ctx, {
            type: chartType,
            data: {
                labels: this.regionData.labels,
                datasets: [{
                    label: '销售额占比(%)',
                    data: this.regionData.values,
                    backgroundColor: 'rgba(74, 144, 226, 0.8)',
                    borderColor: '#4A90E2',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: indexAxis,
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: 800
                }
            }
        });
    }

    updateRegionChart(viewType) {
        this.renderRegionChart(viewType);
    }

    renderPerformanceChart(metric) {
        const ctx = document.getElementById('performance-chart');
        if (!ctx) return;

        if (this.charts.performance) {
            this.charts.performance.destroy();
        }

        let data, label;
        switch (metric) {
            case 'sales':
                data = this.performanceData.sales;
                label = '销售额(万元)';
                break;
            case 'orders':
                data = this.performanceData.orders;
                label = '订单数';
                break;
            case 'customers':
                data = this.performanceData.customers;
                label = '客户数';
                break;
        }

        this.charts.performance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.performanceData.names,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: data.map((_, i) => `hsl(${220 + i * 20}, 70%, ${60 + i * 3}%)`),
                    borderColor: data.map((_, i) => `hsl(${220 + i * 20}, 70%, ${50 + i * 3}%)`),
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: 1000,
                    delay: (context) => context.dataIndex * 100
                }
            }
        });
    }

    updatePerformanceChart(metric) {
        this.renderPerformanceChart(metric);
    }

    renderFinancialCharts() {
        this.renderProfitChart('quarterly');
        this.renderFinancialRadarChart('company1');
        this.renderStructureChart('assets');
    }

    renderProfitChart(period) {
        const ctx = document.getElementById('profit-chart');
        if (!ctx) return;

        if (this.charts.profit) {
            this.charts.profit.destroy();
        }

        const data = this.financialData[period];

        this.charts.profit = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: '营收(万元)',
                    data: data.revenue,
                    borderColor: '#4A90E2',
                    backgroundColor: 'rgba(74, 144, 226, 0.1)',
                    yAxisID: 'y'
                }, {
                    label: '利润(万元)',
                    data: data.profit,
                    borderColor: '#50C878',
                    backgroundColor: 'rgba(80, 200, 120, 0.1)',
                    yAxisID: 'y'
                }, {
                    label: '利润率(%)',
                    data: data.margin,
                    borderColor: '#FF6B6B',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    yAxisID: 'y1',
                    type: 'line'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    updateProfitChart(period) {
        this.renderProfitChart(period);
    }

    renderFinancialRadarChart(company) {
        const ctx = document.getElementById('financial-radar-chart');
        if (!ctx) return;

        if (this.charts.financialRadar) {
            this.charts.financialRadar.destroy();
        }

        this.charts.financialRadar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['盈利能力', '运营能力', '成长能力', '偿债能力', '现金能力'],
                datasets: [{
                    label: company === 'company1' ? '公司A' : company === 'company2' ? '公司B' : '公司C',
                    data: this.financialData.radar[company],
                    borderColor: '#4A90E2',
                    backgroundColor: 'rgba(74, 144, 226, 0.2)',
                    borderWidth: 2,
                    pointBackgroundColor: '#4A90E2',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#4A90E2'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    updateFinancialRadarChart(company) {
        this.renderFinancialRadarChart(company);
    }

    renderStructureChart(structureType) {
        const ctx = document.getElementById('structure-chart');
        if (!ctx) return;

        if (this.charts.structure) {
            this.charts.structure.destroy();
        }

        let data, labels;
        if (structureType === 'assets') {
            labels = ['流动资产', '固定资产', '无形资产', '其他资产'];
            data = [45, 35, 15, 5];
        } else {
            labels = ['流动负债', '长期负债', '所有者权益'];
            data = [30, 25, 45];
        }

        this.charts.structure = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
                    borderWidth: 2,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    updateStructureChart(structureType) {
        this.renderStructureChart(structureType);
    }

    renderUserCharts() {
        this.renderRetentionChart('monthly');
        this.renderActivityHeatmap('daily');
        this.renderRFMChart('scatter');
    }

    renderRetentionChart(cohortType) {
        const ctx = document.getElementById('retention-chart');
        if (!ctx) return;

        if (this.charts.retention) {
            this.charts.retention.destroy();
        }

        const data = this.userData.retention[cohortType];
        const labels = cohortType === 'monthly' ? 
            ['第1月', '第2月', '第3月', '第4月', '第5月', '第6月', '第7月', '第8月', '第9月', '第10月', '第11月', '第12月'] :
            ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周', '第9周', '第10周', '第11周', '第12周'];

        this.charts.retention = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '留存率(%)',
                    data: data,
                    borderColor: '#50C878',
                    backgroundColor: 'rgba(80, 200, 120, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '留存率: ' + context.parsed.y + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    updateRetentionChart(cohortType) {
        this.renderRetentionChart(cohortType);
    }

    renderActivityHeatmap(period) {
        const ctx = document.getElementById('activity-heatmap');
        if (!ctx) return;

        if (this.charts.activityHeatmap) {
            this.charts.activityHeatmap.destroy();
        }

        // 简化的热力图数据（使用条形图模拟）
        let labels, data;
        if (period === 'daily') {
            labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            data = [85, 92, 88, 95, 78, 65, 58];
        } else {
            labels = ['0-6时', '6-12时', '12-18时', '18-24时'];
            data = [25, 85, 95, 70];
        }

        this.charts.activityHeatmap = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '活跃度',
                    data: data,
                    backgroundColor: data.map(value => `rgba(74, 144, 226, ${value / 100})`),
                    borderColor: '#4A90E2',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    updateActivityHeatmap(period) {
        this.renderActivityHeatmap(period);
    }

    renderRFMChart(rfmType) {
        const ctx = document.getElementById('rfm-chart');
        if (!ctx) return;

        if (this.charts.rfm) {
            this.charts.rfm.destroy();
        }

        if (rfmType === 'scatter') {
            // RFM散点图
            const scatterData = this.userData.rfm.recency.map((r, i) => ({
                x: this.userData.rfm.frequency[i],
                y: this.userData.rfm.monetary[i],
                r: r * 2 // 点的大小表示最近购买程度
            }));

            this.charts.rfm = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'RFM客户分析',
                        data: scatterData,
                        backgroundColor: 'rgba(74, 144, 226, 0.6)',
                        borderColor: '#4A90E2'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: '购买频次'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: '消费金额'
                            }
                        }
                    }
                }
            });
        } else {
            // 客户分群柱状图
            this.charts.rfm = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['重要价值客户', '重要发展客户', '重要保持客户', '重要挽留客户', '一般客户'],
                    datasets: [{
                        label: '客户数量',
                        data: [15, 25, 20, 18, 22],
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    updateRFMChart(rfmType) {
        this.renderRFMChart(rfmType);
    }

    renderMarketCharts() {
        this.renderMarketShareChart('product');
        this.renderBostonMatrixChart('current');
        this.renderCompetitorChart('market');
    }

    renderMarketShareChart(segment) {
        const ctx = document.getElementById('market-share-chart');
        if (!ctx) return;

        if (this.charts.marketShare) {
            this.charts.marketShare.destroy();
        }

        const data = segment === 'product' ? 
            { labels: this.marketData.share.product, values: this.marketData.share.productValues } :
            { labels: this.marketData.share.region, values: this.marketData.share.regionValues };

        this.charts.marketShare = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    updateMarketShareChart(segment) {
        this.renderMarketShareChart(segment);
    }

    renderBostonMatrixChart(dataType) {
        const ctx = document.getElementById('boston-matrix-chart');
        if (!ctx) return;

        if (this.charts.bostonMatrix) {
            this.charts.bostonMatrix.destroy();
        }

        const data = this.marketData.boston[dataType];

        this.charts.bostonMatrix = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: '产品组合分析',
                    data: data,
                    backgroundColor: 'rgba(74, 144, 226, 0.6)',
                    borderColor: '#4A90E2',
                    pointRadius: function(context) {
                        return context.parsed.r;
                    }
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '市场增长率(%)'
                        },
                        min: 0,
                        max: 40
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: '相对市场份额'
                        },
                        min: 0,
                        max: 30
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const point = context.raw;
                                return `${point.label}: 增长率${point.x}%, 份额${point.y}`;
                            }
                        }
                    }
                }
            }
        });
    }

    updateBostonMatrixChart(dataType) {
        this.renderBostonMatrixChart(dataType);
    }

    renderCompetitorChart(competitorType) {
        const ctx = document.getElementById('competitor-chart');
        if (!ctx) return;

        if (this.charts.competitor) {
            this.charts.competitor.destroy();
        }

        let labels, data, label;
        if (competitorType === 'market') {
            labels = ['我公司', '竞争对手A', '竞争对手B', '竞争对手C', '竞争对手D'];
            data = [25, 22, 18, 15, 20];
            label = '市场份额(%)';
        } else {
            labels = ['我公司', '竞争对手A', '竞争对手B', '竞争对手C', '竞争对手D'];
            data = [1200, 1150, 980, 850, 920];
            label = '营收(万元)';
        }

        this.charts.competitor = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: data.map((_, i) => i === 0 ? '#4A90E2' : `rgba(150, 150, 150, 0.7)`),
                    borderColor: data.map((_, i) => i === 0 ? '#4A90E2' : `rgba(150, 150, 150, 1)`),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    updateCompetitorChart(competitorType) {
        this.renderCompetitorChart(competitorType);
    }
}

// 初始化交互演示
let interactiveDemo;
document.addEventListener('DOMContentLoaded', () => {
    // 确保Chart.js已加载
    if (typeof Chart !== 'undefined') {
        interactiveDemo = new InteractiveDemo();
        console.log('Interactive Demo initialized successfully');
    } else {
        console.error('Chart.js not loaded');
    }
}); 