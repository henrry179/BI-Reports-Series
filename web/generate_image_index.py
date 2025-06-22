#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BI Reports Series - 图片索引生成器
生成所有可视化图表的索引文件
"""

import os
import json
import re
from pathlib import Path

def clean_folder_name(folder_name):
    """清理文件夹名称，提取关键信息"""
    # 移除"数据可视化报告-"前缀
    if folder_name.startswith('数据可视化报告-'):
        folder_name = folder_name[8:]
    elif folder_name.startswith('数据分析模型和方法合集'):
        return "数据分析模型合集"
    elif folder_name.startswith('数据可视化-'):
        folder_name = folder_name[6:]
    elif folder_name.startswith('数据可视化看板-'):
        folder_name = folder_name[7:]
    
    return folder_name

def categorize_image(file_path, folder_name):
    """根据文件名和路径对图片进行分类"""
    filename = os.path.basename(file_path).lower()
    
    # 判断图片类型
    image_type = "其他"
    if any(word in filename for word in ['仪表板', '看板', 'dashboard']):
        image_type = "仪表板"
    elif any(word in filename for word in ['分析', 'analysis']):
        image_type = "分析图表"
    elif any(word in filename for word in ['模型', 'model']):
        image_type = "分析模型"
    elif any(word in filename for word in ['思路', '框架', '流程']):
        image_type = "分析框架"
    elif any(word in filename for word in ['效果', '展示', '结果']):
        image_type = "效果展示"
    elif filename.endswith('.gif'):
        image_type = "动态演示"
    
    return image_type

def generate_image_index():
    """生成图片索引"""
    base_path = Path('.')
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.webp'}
    
    image_index = {
        "metadata": {
            "total_images": 0,
            "total_folders": 0,
            "generated_at": "2024-12-19",
            "description": "BI Reports Series 可视化图表索引"
        },
        "folders": {},
        "categories": {},
        "images": []
    }
    
    # 扫描所有图片文件
    for root, dirs, files in os.walk(base_path):
        # 跳过web目录和git目录
        if 'web' in root or '.git' in root:
            continue
            
        for file in files:
            if any(file.lower().endswith(ext) for ext in image_extensions):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, base_path)
                
                # 获取文件夹信息
                folder_parts = relative_path.split(os.sep)
                if len(folder_parts) > 1:
                    folder_name = folder_parts[0]
                    clean_name = clean_folder_name(folder_name)
                    
                    # 分类图片
                    image_type = categorize_image(file_path, folder_name)
                    
                    # 构建图片信息
                    image_info = {
                        "path": relative_path.replace(os.sep, '/'),
                        "filename": file,
                        "folder": folder_name,
                        "clean_folder_name": clean_name,
                        "category": image_type,
                        "size": os.path.getsize(file_path) if os.path.exists(file_path) else 0,
                        "extension": os.path.splitext(file)[1].lower()
                    }
                    
                    image_index["images"].append(image_info)
                    
                    # 统计文件夹
                    if folder_name not in image_index["folders"]:
                        image_index["folders"][folder_name] = {
                            "clean_name": clean_name,
                            "count": 0,
                            "categories": {}
                        }
                    
                    image_index["folders"][folder_name]["count"] += 1
                    
                    # 统计类别
                    if image_type not in image_index["folders"][folder_name]["categories"]:
                        image_index["folders"][folder_name]["categories"][image_type] = 0
                    image_index["folders"][folder_name]["categories"][image_type] += 1
                    
                    # 全局类别统计
                    if image_type not in image_index["categories"]:
                        image_index["categories"][image_type] = 0
                    image_index["categories"][image_type] += 1
    
    # 更新元数据
    image_index["metadata"]["total_images"] = len(image_index["images"])
    image_index["metadata"]["total_folders"] = len(image_index["folders"])
    
    return image_index

def main():
    """主函数"""
    print("🔍 扫描项目中的可视化图表...")
    
    # 生成索引
    index_data = generate_image_index()
    
    # 保存到JSON文件
    output_path = Path('web/data/image_index.json')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 图片索引生成完成！")
    print(f"📊 总计发现 {index_data['metadata']['total_images']} 张图片")
    print(f"📁 来自 {index_data['metadata']['total_folders']} 个项目文件夹")
    print(f"💾 索引文件保存至: {output_path}")
    
    # 显示分类统计
    print("\n📈 图片分类统计:")
    for category, count in sorted(index_data['categories'].items(), key=lambda x: x[1], reverse=True):
        print(f"  {category}: {count} 张")
    
    # 显示文件夹统计（前10个）
    print("\n📁 主要项目文件夹:")
    sorted_folders = sorted(index_data['folders'].items(), key=lambda x: x[1]['count'], reverse=True)
    for folder, info in sorted_folders[:10]:
        print(f"  {info['clean_name']}: {info['count']} 张图片")

if __name__ == "__main__":
    main() 