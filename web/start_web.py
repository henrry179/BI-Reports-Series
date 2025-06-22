#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BI Reports Series - Web服务器启动脚本
快速启动本地HTTP服务器来访问Web展示平台
"""

import os
import sys
import webbrowser
import http.server
import socketserver
from pathlib import Path

def main():
    # 检查是否在项目根目录
    if not Path('web').exists():
        print("❌ 错误: 请在项目根目录运行此脚本")
        print("   当前目录应包含 'web' 文件夹")
        sys.exit(1)
    
    # 检查图片索引是否存在
    index_file = Path('web/data/image_index.json')
    if not index_file.exists():
        print("📊 生成图片索引...")
        import subprocess
        try:
            subprocess.run([sys.executable, 'web/generate_image_index.py'], check=True)
            print("✅ 图片索引生成完成")
        except subprocess.CalledProcessError:
            print("❌ 图片索引生成失败，请手动运行: python web/generate_image_index.py")
            sys.exit(1)
    
    # 设置服务器参数
    PORT = 8000
    HANDLER = http.server.SimpleHTTPRequestHandler
    
    print(f"""
🌐 BI Reports Series Web展示平台
══════════════════════════════════

🚀 启动本地服务器...
📍 端口: {PORT}
📁 目录: {os.getcwd()}

""")
    
    try:
        with socketserver.TCPServer(("", PORT), HANDLER) as httpd:
            web_url = f"http://localhost:{PORT}/web/"
            
            print(f"✅ 服务器已启动!")
            print(f"🔗 访问地址: {web_url}")
            print(f"📊 图表数量: 499张")
            print(f"📁 项目案例: 18个")
            print()
            print("💡 使用提示:")
            print("   - 🔍 使用搜索框快速查找图表")
            print("   - 📋 切换不同视图模式浏览")
            print("   - 🖼️  点击图表查看高清预览")
            print("   - 📱 支持手机和平板访问")
            print()
            print("⚠️  按 Ctrl+C 停止服务器")
            print("═" * 50)
            
            # 自动打开浏览器
            try:
                webbrowser.open(web_url)
                print(f"🌐 正在打开浏览器: {web_url}")
            except:
                print(f"🌐 请手动在浏览器中访问: {web_url}")
            
            print()
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 服务器已停止，感谢使用!")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ 端口 {PORT} 已被占用")
            print(f"💡 请尝试访问: http://localhost:{PORT}/web/")
            print(f"   或者等待几秒后重试")
        else:
            print(f"❌ 启动服务器失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 