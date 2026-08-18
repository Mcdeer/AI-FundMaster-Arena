@echo off
chcp 65001 >nul
echo ===================================
echo AI基金经理挑战赛 - 安装脚本
echo ===================================

:: 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    exit /b 1
)

echo [1/3] 检查Node.js版本...
node --version

echo [2/3] 安装依赖...
call npm install
if errorlevel 1 (
    echo [错误] 依赖安装失败
    exit /b 1
)

echo [3/3] 构建项目...
call npm run build
if errorlevel 1 (
    echo [错误] 项目构建失败
    exit /b 1
)

echo.
echo ===================================
echo 安装完成！
echo ===================================
exit /b 0
