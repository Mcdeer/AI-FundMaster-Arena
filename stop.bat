@echo off
chcp 65001 >nul
echo ===================================
echo AI基金经理挑战赛 - 停止脚本
echo ===================================

echo [1/2] 查找Node.js进程...
tasklist | findstr "node.exe" | findstr "server.js" >nul
if errorlevel 1 (
    echo [信息] 未找到运行中的服务器进程
    goto :check_port
)

echo [2/2] 停止Node.js进程...
for /f "tokens=2" %%a in ('tasklist ^| findstr "node.exe" ^| findstr "server.js"') do (
    echo 正在停止进程 PID: %%a
    taskkill /PID %%a /F >nul 2>&1
)

:check_port
echo.
echo 检查端口21818...
netstat -an | findstr ":21818" | findstr "LISTENING" >nul
if errorlevel 1 (
    echo [信息] 端口21818已释放
) else (
    echo [警告] 端口21818仍被占用，强制释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":21818" ^| findstr "LISTENING"') do (
        if not "%%a"=="0" (
            taskkill /PID %%a /F >nul 2>&1
        )
    )
)

echo.
echo ===================================
echo 服务器已停止
echo ===================================
exit /b 0
