/**
 * AI基金经理挑战赛 - 生产环境服务器
 * 端口：21818（符合参赛规则）
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = 21818;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// API端点 - 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 所有路由指向index.html（支持前端路由）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI基金经理挑战赛服务器运行在端口 ${PORT}`);
  console.log(`📊 访问地址: http://localhost:${PORT}/`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
