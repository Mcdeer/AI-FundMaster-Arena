/**
 * 全局状态管理
 * 避免循环依赖
 */

// ==================== 全局状态 ====================
export const APP_STATE = {
  currentScreen: 'builder',
  fundName: '',
  holdings: [],
  period: '1y',
  backtestResults: null,
  stocksData: null,
  userResult: null,
  investAmount: 100000,
  leverage: 1,
  customMonths: 18,
};

// ==================== Toast提示组件 ====================
let toastTimeout = null;
export function showToast(message, type = 'info') {
  // 移除已有的toast
  const existingToast = document.getElementById('toast-message');
  if (existingToast) {
    existingToast.remove();
  }
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  const toast = document.createElement('div');
  toast.id = 'toast-message';
  const bgColor = type === 'error' ? 'bg-red-500/90' : type === 'success' ? 'bg-green-500/90' : 'bg-neon-blue/90';
  toast.className = `fixed top-4 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in`;
  toast.textContent = message;
  document.body.appendChild(toast);

  toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ==================== 更新开始按钮状态 ====================
export function updateStartButton() {
  const btn = document.getElementById('btn-start');
  if (!btn) return;
  // 从APP_STATE获取持仓，因为getHoldings可能在fund-builder.js中
  const holdings = APP_STATE.holdings || [];
  btn.disabled = holdings.length < 1;
}
