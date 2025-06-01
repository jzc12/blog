
# 自动将 ../../src/articles/ 目录下的 .md 文件 添加内容前缀
# 添加内容
"""

---
title: 示例文章
date: 2025-06-01
updated: 2025-06-03
category: 教程
summary: 文章摘要
---

"""

# title 为文件名去掉后缀 .md
# data 如果有 就更改 updated 为当前时间；如果没有 就添加 data 和 updated
# category 如果没有 就添加 category: 教程
# summary 如果没有 就添加 summary: 文章摘要

import os
import re
import sys
from datetime import datetime

ARTICLES_DIR = "../../src/articles"  # 可根据需要调整路径
FRONT_MATTER_REGEX = re.compile(r'^---\n(.*?)\n---\n?', re.DOTALL)

def get_front_matter(content):
    match = FRONT_MATTER_REGEX.match(content)
    if match:
        return match.group(1), content[match.end():]
    return None, content

def parse_yaml(yaml_text):
    data = {}
    for line in yaml_text.strip().split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            data[key.strip()] = value.strip()
    return data

def dump_yaml(data):
    return '\n'.join(f'{k}: {v}' for k, v in data.items())

def update_file(path, force_category=None, force_summary=None):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    file_name = os.path.basename(path).replace('.md', '')
    front_matter_text, body = get_front_matter(content)

    today = datetime.today().date().isoformat()

    if front_matter_text:
        fm = parse_yaml(front_matter_text)
        changed = False

        if 'title' not in fm:
            fm['title'] = file_name
            changed = True
        if 'date' in fm:
            fm['updated'] = today
            changed = True
        else:
            fm['date'] = today
            fm['updated'] = today
            changed = True

        if force_category:
            fm['category'] = force_category
            changed = True
        elif 'category' not in fm:
            fm['category'] = '教程'
            changed = True

        if force_summary:
            fm['summary'] = force_summary
            changed = True
        elif 'summary' not in fm:
            fm['summary'] = '文章摘要'
            changed = True

        if not changed:
            return False

        new_fm = f"---\n{dump_yaml(fm)}\n---\n"
        new_content = new_fm + body
    else:
        fm = {
            'title': file_name,
            'date': today,
            'updated': today,
            'category': force_category or '教程',
            'summary': force_summary or '文章摘要'
        }
        new_fm = f"---\n{dump_yaml(fm)}\n---\n"
        new_content = new_fm + content

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True

def process_all():
    updated_files = []
    for file in os.listdir(ARTICLES_DIR):
        if file.endswith('.md'):
            path = os.path.join(ARTICLES_DIR, file)
            if update_file(path):
                updated_files.append(file)
    print(f"[✅] 批量处理完成，更新文件：{updated_files}")

def process_single(filename, category, summary):
    path = os.path.join(ARTICLES_DIR, filename)
    if not os.path.exists(path):
        print(f"[❌] 文件不存在: {filename}")
        return
    updated = update_file(path, force_category=category, force_summary=summary)
    if updated:
        print(f"[✅] 已更新: {filename}")
    else:
        print(f"[ℹ️] 无需更新: {filename}")

if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        process_all()
    elif len(args) == 3:
        process_single(args[0], args[1], args[2])
    else:
        print("用法：")
        print("  python process_md.py                  # 批量处理所有 .md 文件")
        print("  python process_md.py 文件名 分类 摘要  # 处理单个文件")
