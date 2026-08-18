@echo off
chcp 65001 >nul
echo ===================================
echo AI基金经理挑战赛 - 启动脚本
echo ===================================

:: 检查dist目录是否存在
if not exist "dist\index.html" (
    echo [错误] 未找到构建文件，请先运行install.bat
    exit /b 1
)

echo [1/2] 检查端口21818是否被占用...
netstat -an | findstr ":21818" | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo [警告] 端口21818已被占用，尝试停止现有进程...
    call stop.bat
    timeout /t 2 /nobreak >nul
)

echo [2/2] 启动服务器...
start /b node server.js > server.log 2>&1

:: 等待服务器启动
timeout /t 3 /nobreak >nul

:: 检查是否成功启动
netstat -an | findstr ":21818" | findstr "LISTENING" >nul
if errorlevel 1 (
    echo [错误] 服务器启动失败，请检查server.log
    exit /b 1
)

echo.
echo ===================================
echo 服务器启动成功！
echo 访问地址: http://localhost:21818/
echo ===================================
exit /b 0
