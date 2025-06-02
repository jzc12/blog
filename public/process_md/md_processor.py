import os
import re
import sys
from datetime import datetime

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

def update_file(path, changed_date=None, changed_updated=None, changed_category=None, changed_summary=None):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    file_name = os.path.basename(path).replace('.md', '')
    front_matter_text, body = get_front_matter(content)

    today = datetime.today().date().isoformat()

    fm = {}
    if front_matter_text:
        fm = parse_yaml(front_matter_text)

    changed = False

    # Handle date
    if changed_date is not None:
        if fm.get('date') != changed_date:
            fm['date'] = changed_date
            changed = True
    elif 'date' not in fm or not fm['date']:
        fm['date'] = today
        changed = True

    # Handle updated date
    if changed_updated is not None:
        if fm.get('updated') != changed_updated:
            fm['updated'] = changed_updated
            changed = True
    elif 'updated' not in fm or not fm['updated']:
        fm['updated'] = today
        changed = True

    # Handle category
    if changed_category is not None:
        if fm.get('category') != changed_category:
            fm['category'] = changed_category
            changed = True
    elif 'category' not in fm or not fm['category']:
        fm['category'] = '教程'
        changed = True

    # Handle summary
    if changed_summary is not None:
        if fm.get('summary') != changed_summary:
            fm['summary'] = changed_summary
            changed = True
    elif 'summary' not in fm or not fm['summary']:
        fm['summary'] = '文章摘要'
        changed = True

    if not changed:
        return False

    changed_fm = f"---\n{dump_yaml(fm)}\n---\n"
    changed_content = changed_fm + body

    with open(path, 'w', encoding='utf-8') as f:
        f.write(changed_content)
    return True

def check_file_status(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    front_matter_text, _ = get_front_matter(content)
    fm_data = {
        'date': '',
        'updated': '',
        'category': '',
        'summary': ''
    }

    if front_matter_text:
        fm = parse_yaml(front_matter_text)
        fm_data['date'] = fm.get('date', '')
        fm_data['updated'] = fm.get('updated', '')
        fm_data['category'] = fm.get('category', '')
        fm_data['summary'] = fm.get('summary', '')
    return fm_data 