# AI基金经理挑战赛 - 部署说明

## 项目概述

AI基金经理挑战赛是一款泛财经类互动应用，让用户创建自己的投资基金，选择股票组合，与AI对手进行回测对战，并获得个性化的投资风格诊断。

## 部署方式

### 方式A：自行部署（推荐）

本项目为纯前端应用，可直接部署到任何静态文件服务器。

**部署步骤：**

1. **构建项目**
   ```bash
   npm install
   npm run build
   ```

2. **部署dist目录**
   - 将`dist`目录下的所有文件部署到Web服务器
   - 或使用`server.js`启动Node.js服务器（端口21818）

3. **访问应用**
   - 静态部署：`http://your-domain/AI-FundMaster-Arena/`
   - Node服务器：`http://localhost:21818/`

### 方式B：平台部署（参赛方式）

**文件结构：**
```
service-package.zip
├── install.bat          # 安装脚本（Windows）
├── start.bat            # 启动脚本（必须）
├── stop.bat             # 停止脚本（必须）
├── server.js            # Node.js服务器
├── package.json         # 依赖配置
├── dist/                # 构建输出目录
│   ├── index.html
│   ├── stocks.json
│   └── assets/
└── README.md
```

**部署步骤：**

1. **打包**
   ```bash
   npm install
   npm run build
   zip -r service-package.zip install.bat start.bat stop.bat server.js package.json dist/ README.md
   ```

2. **上传部署包**
   - 登录大赛平台
   - 上传`service-package.zip`
   - 平台将自动执行：stop -> install -> start

3. **验证部署**
   - 访问`http://ip:21818/`
   - 检查健康检查接口：`http://ip:21818/health`

## 技术栈

- **前端**：Vite + TailwindCSS + ECharts
- **后端**：Node.js + Express（生产环境）
- **数据**：静态JSON（模拟5年股票数据）

## 特色功能

1. **智能选股**：支持A股、港股、美股、指数ETF
2. **权重调整**：等权分配或手动调整
3. **回测对战**：与7个AI对手同台竞技
4. **风格诊断**：12种投资人格标签
5. **AI点评**：幽默风趣的投资建议

## 端口配置

- **固定端口**：21818（符合大赛要求）
- **健康检查**：`/health`

## 注意事项

1. 确保Node.js版本 >= 16
2. 端口21818未被占用
3. 构建前确保所有依赖已安装
