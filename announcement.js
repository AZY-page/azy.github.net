// 公告模块 - 定义公告内容和显示逻辑

// 公告数据
const announcements = [
  {
    id: 1,
    title: '油猴插件更新通知',
    content: '油猴插件版已更新，更加方便，<a href="https://file.zhangyichi.dev/uploads/69284615a01d2_1764247061.7z" class="download-link inline-flex items-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-all hover:shadow-md">【点击下载】<i class="fa fa-download ml-2"></i></a>',
    date: new Date().toLocaleDateString('zh-CN'),
    isImportant: true
  }
];

// 公告管理器类
class AnnouncementManager {
  constructor() {
    this.announcements = announcements;
    this.modalId = 'announcement-modal';
    this.modal = null;
    this.viewAnnouncementsButton = null;
    this.badgeElement = null;
  }

  // 获取所有公告
  getAllAnnouncements() {
    return this.announcements;
  }

  // 获取最新的公告
  getLatestAnnouncement() {
    if (this.announcements.length > 0) {
      return this.announcements[0];
    }
    return null;
  }

  // 添加新公告
  addAnnouncement(title, content, isImportant = false) {
    const newAnnouncement = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleDateString('zh-CN'),
      isImportant
    };
    this.announcements.unshift(newAnnouncement);
    
    // 有新公告时，显示角标提示
    this.showBadge();
    
    return newAnnouncement;
  }

  // 创建公告弹窗
  createModal() {
    // 检查弹窗是否已存在
    if (document.getElementById(this.modalId)) {
      this.modal = document.getElementById(this.modalId);
      return this.modal;
    }

    // 创建弹窗容器
    this.modal = document.createElement('div');
    this.modal.id = this.modalId;
    this.modal.className = 'announcement-modal fixed inset-0 z-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300';
    this.modal.innerHTML = `
      <div class="announcement-modal-overlay absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-300"></div>
      <div class="announcement-modal-content glass-effect rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-auto mx-4 transition-transform duration-300 scale-95">
        <div class="announcement-modal-header flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold flex items-center">
            <i class="fa fa-bullhorn text-primary mr-2"></i>
            系统公告
          </h2>
          <button class="announcement-close-btn p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
            <i class="fa fa-times"></i>
          </button>
        </div>
        <div class="announcement-modal-body p-4">
          <!-- 公告内容将在这里动态添加 -->
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    // 添加关闭事件
    const closeBtn = this.modal.querySelector('.announcement-close-btn');
    const overlay = this.modal.querySelector('.announcement-modal-overlay');
    
    closeBtn.addEventListener('click', () => this.hide());
    overlay.addEventListener('click', () => this.hide());

    // 阻止点击内容区域时关闭弹窗
    const content = this.modal.querySelector('.announcement-modal-content');
    content.addEventListener('click', (e) => e.stopPropagation());

    // 添加ESC键关闭功能
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('pointer-events-none')) {
        this.hide();
      }
    });

    return this.modal;
  }

  // 显示公告弹窗
  show() {
    if (!this.modal) {
      this.createModal();
    }

    // 更新弹窗内容
    this.updateModalContent();

    // 显示弹窗
    setTimeout(() => {
      this.modal.classList.remove('opacity-0', 'pointer-events-none');
      this.modal.querySelector('.announcement-modal-content').classList.remove('scale-95');
      this.modal.querySelector('.announcement-modal-content').classList.add('scale-100');
    }, 10);

    // 记录显示状态
    localStorage.setItem('announcementLastShown', new Date().toDateString());
    
    // 立即隐藏角标，不等待动画
    if (this.badgeElement) {
      this.badgeElement.style.display = 'none';
      this.badgeElement.classList.remove('scale-100', 'announcement-badge');
      this.badgeElement.classList.add('scale-0');
      this.badgeElement.style.animation = 'none';
    }
  }

  // 隐藏公告弹窗
  hide() {
    if (!this.modal) return;

    // 添加退出动画
    this.modal.classList.add('opacity-0');
    const content = this.modal.querySelector('.announcement-modal-content');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
    
    // 延迟移除指针事件，确保动画完成
    setTimeout(() => {
      this.modal.classList.add('pointer-events-none');
    }, 300);
  }

  // 更新弹窗内容
  updateModalContent() {
    const body = this.modal.querySelector('.announcement-modal-body');
    if (!body) return;

    // 清空内容
    body.innerHTML = '';

    // 为每个公告创建DOM元素
    this.announcements.forEach(announcement => {
      const announcementEl = document.createElement('div');
      announcementEl.className = 'announcement mb-4 last:mb-0 animate-fadeIn';
      
      // 根据重要性添加不同的样式类
      if (announcement.isImportant) {
        announcementEl.classList.add('announcement-important');
        // 添加重要公告的脉冲动画
        announcementEl.classList.add('animate-pulse-soft');
      }

      announcementEl.innerHTML = `
        <div class="announcement-header flex flex-wrap justify-between items-center gap-2 mb-3">
          <h3 class="announcement-title font-bold flex items-center">
            ${announcement.isImportant ? '<i class="fa fa-exclamation-circle text-warning mr-2"></i>' : ''}
            ${announcement.title}
          </h3>
          <span class="announcement-date text-sm px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
            ${announcement.date}
          </span>
        </div>
        <div class="announcement-content">
          ${announcement.content}
        </div>
      `;

      body.appendChild(announcementEl);
    });
    
    // 如果没有公告，显示提示信息
    if (this.announcements.length === 0) {
      body.innerHTML = `
        <div class="text-center py-6 text-gray-500 dark:text-gray-400">
          <i class="fa fa-info-circle text-3xl mb-2"></i>
          <p>暂无公告</p>
        </div>
      `;
    }
  }

  // 创建角标提示
  createBadge() {
    if (this.badgeElement) return this.badgeElement;
    
    this.badgeElement = document.createElement('span');
    this.badgeElement.className = 'announcement-badge absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full transform scale-0 transition-transform duration-200';
    this.badgeElement.textContent = '1';
    // 默认隐藏角标，防止初始加载时显示
    this.badgeElement.style.display = 'none';
    
    return this.badgeElement;
  }
  
  // 显示角标提示
  showBadge() {
    if (!this.viewAnnouncementsButton || !this.badgeElement) return;
    
    // 确保角标已添加到按钮中
    if (!this.badgeElement.parentElement) {
      this.viewAnnouncementsButton.appendChild(this.badgeElement);
    }
    
    // 先设置为显示，再添加动画
    this.badgeElement.style.display = 'flex';
    setTimeout(() => {
      this.badgeElement.classList.remove('scale-0');
      this.badgeElement.classList.add('scale-100', 'announcement-badge');
      this.badgeElement.style.animation = 'bounce 1s infinite alternate';
    }, 10);
  }
  
  // 隐藏角标提示
  hideBadge() {
    if (!this.badgeElement) return;
    
    // 立即隐藏，不再依赖动画过渡
    this.badgeElement.style.display = 'none';
    this.badgeElement.classList.remove('scale-100', 'announcement-badge');
    this.badgeElement.classList.add('scale-0');
    this.badgeElement.style.animation = 'none';
  }

  // 创建查看公告按钮
  createViewButton() {
    // 检查按钮是否已存在
    if (this.viewAnnouncementsButton) return this.viewAnnouncementsButton;

    // 查找合适的位置添加按钮（在主题切换按钮旁边）
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return null;

    // 创建查看公告按钮
    this.viewAnnouncementsButton = document.createElement('button');
    this.viewAnnouncementsButton.id = 'view-announcements-btn';
    this.viewAnnouncementsButton.className = 'p-2 rounded-full hover:bg-opacity-10 hover:bg-black dark:hover:bg-white transition-all mx-2 relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50';
    this.viewAnnouncementsButton.innerHTML = '<i class="fa fa-bullhorn text-primary"></i>';
    this.viewAnnouncementsButton.title = '查看公告';

    // 添加角标
    this.createBadge();
    this.viewAnnouncementsButton.appendChild(this.badgeElement);

    // 添加点击事件
    this.viewAnnouncementsButton.addEventListener('click', () => this.show());

    // 插入到主题切换按钮之前
    themeToggle.parentNode.insertBefore(this.viewAnnouncementsButton, themeToggle);

    // 检查是否有未读公告 - 只有今天未查看过时才显示角标
    const lastShown = localStorage.getItem('announcementLastShown');
    const today = new Date().toDateString();
    
    // 默认隐藏角标，只有需要时才显示
    this.badgeElement.style.display = 'none';
    
    if (lastShown !== today) {
      this.showBadge();
    }

    return this.viewAnnouncementsButton;
  }

  // 初始化公告系统
  init() {
    // 添加CSS样式
    this.addStyles();
    
    // 当DOM加载完成后初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initialize();
      });
    } else {
      this.initialize();
    }
  }

  // 实际的初始化逻辑
  initialize() {
    // 创建弹窗
    this.createModal();
    
    // 创建查看按钮
    this.createViewButton();

    // 检查是否需要自动显示公告（例如今天第一次访问）
    const lastShown = localStorage.getItem('announcementLastShown');
    const today = new Date().toDateString();
    
    // 强制隐藏角标，除非确实需要显示
    if (this.badgeElement) {
      this.badgeElement.style.display = 'none';
    }
    
    if (lastShown !== today) {
      // 延迟显示，让页面先加载完成
      setTimeout(() => this.show(), 1000);
    }
  }

  // 添加公告所需的CSS样式
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* 毛玻璃效果增强 */
      .glass-effect {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      }
      
      .dark .glass-effect {
        background: rgba(28, 28, 30, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
      }

      /* 公告样式 */
      .announcement {
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 15px;
        background-color: rgba(248, 249, 250, 0.95);
        border: 1px solid rgba(222, 226, 230, 0.95);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .announcement::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary, #4f46e5), transparent);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
      }
      
      .announcement:hover::before {
        transform: scaleX(1);
      }
      
      .dark .announcement {
        background-color: rgba(52, 53, 54, 0.95);
        border: 1px solid rgba(84, 84, 84, 0.95);
      }
      
      .announcement:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
      }
      
      .announcement-important {
        background-color: rgba(255, 243, 205, 0.95);
        border-color: rgba(255, 234, 167, 0.95);
        border-left: 4px solid #ffc107;
      }
      
      .dark .announcement-important {
        background-color: rgba(82, 70, 24, 0.95);
        border-color: rgba(120, 87, 0, 0.95);
      }
      
      .announcement-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .announcement-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #333;
        line-height: 1.3;
      }
      
      .dark .announcement-title {
        color: #fff;
      }
      
      .announcement-date {
        font-size: 12px;
        color: #6c757d;
        background-color: rgba(0,0,0,0.05);
        padding: 3px 8px;
        border-radius: 100px;
        font-weight: 500;
      }
      
      .dark .announcement-date {
        color: #a0aec0;
        background-color: rgba(255,255,255,0.05);
      }
      
      .announcement-content {
        font-size: 15px;
        line-height: 1.6;
        color: #495057;
      }
      
      .dark .announcement-content {
        color: #e2e8f0;
      }
      
      /* 下载链接样式 */
      .download-link {
        display: inline-flex;
        align-items: center;
        margin-top: 8px;
        padding: 8px 16px;
        background-color: var(--primary, #4f46e5);
        color: white !important;
        text-decoration: none !important;
        border-radius: 100px;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
      }
      
      .download-link:hover {
        background-color: var(--primary-dark, #4338ca);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
      }
      
      .download-link:active {
        transform: translateY(0);
      }
      
      .download-link i {
        margin-left: 6px;
        font-size: 12px;
      }

      /* 弹窗样式 */
      .announcement-modal-overlay {
        cursor: pointer;
        animation: fadeIn 0.3s ease;
      }
      
      .announcement-close-btn i {
        color: #6c757d;
        transition: color 0.2s ease;
      }
      
      .announcement-close-btn:hover i {
        color: #333;
      }
      
      .dark .announcement-close-btn i {
        color: #a0aec0;
      }
      
      .dark .announcement-close-btn:hover i {
        color: #fff;
      }
      
      .announcement-modal-body .announcement:last-child {
        margin-bottom: 0;
      }

      /* 确保弹窗内容在深色模式下显示正常 */
      .dark .announcement-modal-header h2 {
        color: #fff;
      }
      
      /* 角标样式 */
      .announcement-badge {
        animation: bounce 1s infinite alternate;
      }
      
      /* 动画效果 */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes bounce {
        from { transform: translateY(0) scale(1); }
        to { transform: translateY(-3px) scale(1.1); }
      }
      
      @keyframes pulse-soft {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
      }
      
      .animate-pulse-soft {
        animation: pulse-soft 2s infinite;
      }
      
      /* 响应式优化 */
      @media (max-width: 480px) {
        .announcement-modal-content {
          margin: 16px;
          max-height: calc(100vh - 32px);
        }
        
        .announcement-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }
        
        .download-link {
          display: block;
          text-align: center;
          margin-top: 12px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// 创建公告管理器实例
const announcementManager = new AnnouncementManager();

// 导出公告管理器，方便在其他地方使用
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = announcementManager;
} else {
  // 浏览器环境下，将公告管理器挂载到全局对象
  window.announcementManager = announcementManager;
}

// 自动初始化公告系统
announcementManager.init();