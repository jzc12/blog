import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import os
from md_processor import update_file, check_file_status
from datetime import datetime
import re

class ModernFrame(ttk.Frame):
    """现代风格的Frame"""
    def __init__(self, master=None, **kwargs):
        super().__init__(master, **kwargs)
        self.configure(style='Modern.TFrame')

class ModernButton(ttk.Button):
    """现代风格的Button"""
    def __init__(self, master=None, **kwargs):
        if 'style' not in kwargs:
            kwargs['style'] = 'Modern.TButton'
        super().__init__(master, **kwargs)

class MarkdownProcessorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Markdown 编辑器")
        self.root.geometry("900x600")
        self.root.minsize(900, 600)
        
        # 设置主题色
        self.colors = {
            'bg': '#f8f9fa',
            'sidebar': '#ffffff',
            'primary': '#3b82f6',
            'primary_hover': '#2563eb',
            'secondary': '#64748b',
            'text': '#1e293b',
            'text_secondary': '#64748b',
            'border': '#e2e8f0',
            'success': '#22c55e',
            'error': '#ef4444',
            'card': '#ffffff'
        }

        self.folder_path = tk.StringVar()
        self.file_statuses = []
        self.current_file = None
        self.current_content = {}
        self.has_unsaved_changes = False

        self.setup_styles()
        self.create_gui()

    def setup_styles(self):
        """设置现代风格的主题"""
        style = ttk.Style()
        style.theme_use('clam')

        # 主框架样式
        style.configure('Modern.TFrame',
            background=self.colors['bg']
        )

        # 侧边栏框架样式
        style.configure('Sidebar.TFrame',
            background=self.colors['sidebar']
        )

        # 现代按钮样式
        style.configure('Modern.TButton',
            background=self.colors['primary'],
            foreground='white',
            padding=(15, 8),
            font=('Segoe UI', 9),
            borderwidth=0
        )
        style.map('Modern.TButton',
            background=[('active', self.colors['primary_hover'])],
            foreground=[('active', 'white')]
        )

        # 次要按钮样式
        style.configure('Secondary.TButton',
            background=self.colors['secondary'],
            foreground='white',
            padding=(15, 8),
            font=('Segoe UI', 9),
            borderwidth=0
        )

        # 列表样式
        style.configure('Modern.Treeview',
            background=self.colors['sidebar'],
            fieldbackground=self.colors['sidebar'],
            foreground=self.colors['text'],
            font=('Segoe UI', 9),
            rowheight=35,
            borderwidth=0
        )
        style.configure('Modern.Treeview.Heading',
            background=self.colors['bg'],
            foreground=self.colors['text_secondary'],
            font=('Segoe UI', 9, 'bold'),
            padding=(10, 5),
            borderwidth=0
        )
        style.map('Modern.Treeview',
            background=[('selected', self.colors['primary'])],
            foreground=[('selected', 'white')]
        )

        # 输入框样式
        style.configure('Modern.TEntry',
            background='white',
            foreground=self.colors['text'],
            fieldbackground='white',
            borderwidth=1,
            padding=5
        )

        # 标签样式
        style.configure('Modern.TLabel',
            background=self.colors['bg'],
            foreground=self.colors['text_secondary'],
            font=('Segoe UI', 9)
        )

    def create_gui(self):
        """创建现代风格的GUI"""
        # 主容器
        self.main_container = ModernFrame(self.root)
        self.main_container.pack(fill="both", expand=True)

        # 顶部工具栏
        self.create_toolbar()

        # 主要内容区域
        content = ModernFrame(self.main_container)
        content.pack(fill="both", expand=True, padx=20, pady=(0, 20))
        content.grid_columnconfigure(1, weight=1)
        content.grid_rowconfigure(0, weight=1)

        # 左侧文件列表
        self.create_file_list(content)

        # 右侧编辑区
        self.create_editor(content)

    def create_toolbar(self):
        """创建顶部工具栏"""
        toolbar = ModernFrame(self.main_container)
        toolbar.pack(fill="x", padx=20, pady=20)
        toolbar.grid_columnconfigure(1, weight=1)

        # 文件夹选择区域
        folder_frame = ModernFrame(toolbar)
        folder_frame.grid(row=0, column=0, sticky="w")

        self.folder_entry = ttk.Entry(folder_frame, 
            textvariable=self.folder_path,
            state="readonly",
            width=40,
            style='Modern.TEntry'
        )
        self.folder_entry.pack(side="left", padx=(0, 10))

        ModernButton(folder_frame, text="选择文件夹", command=self.browse_folder).pack(side="left")

        # 右侧按钮
        btn_frame = ModernFrame(toolbar)
        btn_frame.grid(row=0, column=2, sticky="e")

        ModernButton(btn_frame, text="刷新列表", 
            style='Secondary.TButton',
            command=self.scan_files
        ).pack(side="left", padx=5)

        ModernButton(btn_frame, text="处理所有", 
            command=self.process_all_files
        ).pack(side="left")

    def create_file_list(self, parent):
        """创建文件列表区域"""
        list_frame = ModernFrame(parent)
        list_frame.grid(row=0, column=0, sticky="nsew", padx=(0, 20))
        list_frame.grid_rowconfigure(1, weight=1)

        # 标题
        ttk.Label(list_frame, 
            text="文件列表", 
            style='Modern.TLabel',
            font=('Segoe UI', 11, 'bold')
        ).grid(row=0, column=0, sticky="w", pady=(0, 10))

        # 文件列表
        self.file_list = ttk.Treeview(
            list_frame,
            columns=("name",),
            show="tree",
            selectmode="browse",
            style='Modern.Treeview'
        )
        self.file_list.heading("#0", text="")
        self.file_list.column("#0", width=0, stretch=False)
        self.file_list.heading("name", text="文件名")
        self.file_list.column("name", width=250)
        
        self.file_list.grid(row=1, column=0, sticky="nsew")
        self.file_list.bind('<<TreeviewSelect>>', self.on_file_select)

        # 滚动条
        scrollbar = ttk.Scrollbar(list_frame, orient="vertical", command=self.file_list.yview)
        scrollbar.grid(row=1, column=1, sticky="ns")
        self.file_list.configure(yscrollcommand=scrollbar.set)

    def create_editor(self, parent):
        """创建编辑区域"""
        editor_frame = ModernFrame(parent)
        editor_frame.grid(row=0, column=1, sticky="nsew")
        editor_frame.grid_columnconfigure(0, weight=1)
        editor_frame.grid_rowconfigure(1, weight=1)

        # 标题
        ttk.Label(editor_frame, 
            text="文章信息", 
            style='Modern.TLabel',
            font=('Segoe UI', 11, 'bold')
        ).grid(row=0, column=0, sticky="w", pady=(0, 20))

        # 编辑区域
        form_frame = ModernFrame(editor_frame)
        form_frame.grid(row=1, column=0, sticky="nsew")
        form_frame.grid_columnconfigure(1, weight=1)

        # 编辑字段
        fields = [
            ("日期", "date_entry"),
            ("更新日期", "updated_entry"),
            ("分类", "category_entry")
        ]

        for i, (label, field) in enumerate(fields):
            ttk.Label(form_frame, 
                text=label,
                style='Modern.TLabel'
            ).grid(row=i, column=0, sticky="e", padx=(0, 10), pady=8)
            
            entry = ttk.Entry(form_frame, style='Modern.TEntry')
            entry.grid(row=i, column=1, sticky="ew", pady=8)
            setattr(self, field, entry)

        # 摘要
        ttk.Label(form_frame, 
            text="摘要",
            style='Modern.TLabel'
        ).grid(row=3, column=0, sticky="ne", padx=(0, 10), pady=8)

        self.summary_text = tk.Text(
            form_frame,
            height=8,
            wrap="word",
            font=('Segoe UI', 9),
            bg='white',
            relief="solid",
            borderwidth=1
        )
        self.summary_text.grid(row=3, column=1, sticky="nsew", pady=8)

        # 底部按钮
        btn_frame = ModernFrame(form_frame)
        btn_frame.grid(row=4, column=1, sticky="e", pady=(20, 0))

        ModernButton(
            btn_frame,
            text="保存更改",
            command=self.save_changes
        ).pack(side="right")

        # 状态栏
        self.status_var = tk.StringVar(value="就绪")
        status_label = ttk.Label(
            editor_frame,
            textvariable=self.status_var,
            style='Modern.TLabel'
        )
        status_label.grid(row=2, column=0, sticky="w", pady=(20, 0))

        # 绑定修改事件
        for widget in [self.date_entry, self.updated_entry, self.category_entry]:
            widget.bind('<KeyRelease>', self.mark_as_modified)
        self.summary_text.bind('<KeyRelease>', self.mark_as_modified)

    def browse_folder(self):
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.folder_path.set(folder_selected)
            self.scan_files()

    def scan_files(self):
        self.file_list.delete(*self.file_list.get_children())
        self.file_statuses = []
        self.current_file = None
        self.clear_edit_fields()

        folder = self.folder_path.get()
        if not folder or not os.path.isdir(folder):
            messagebox.showwarning("警告", "请选择一个有效的文件夹！")
            return

        md_files = [f for f in os.listdir(folder) if f.endswith('.md')]
        if not md_files:
            messagebox.showinfo("信息", "所选文件夹中没有 Markdown 文件。")
            return

        for md_file in sorted(md_files):
            self.file_list.insert("", "end", values=(md_file,))

        self.status_var.set(f"找到 {len(md_files)} 个 Markdown 文件")

    def on_file_select(self, event):
        # 如果有未保存的更改，先保存当前文件
        if not self.save_current_if_modified():
            # 如果保存失败且用户选择不继续，恢复之前的选择
            if hasattr(self, '_last_selection'):
                self.file_list.selection_remove(*self.file_list.selection())
                self.file_list.selection_add(self._last_selection)
            return

        selection = self.file_list.selection()
        if not selection:
            return

        # 保存当前选择
        self._last_selection = selection[0]

        item = selection[0]
        selected_file = self.file_list.item(item)['values'][0]
        folder = self.folder_path.get()
        file_path = os.path.join(folder, selected_file)

        self.current_file = file_path
        fm_data = check_file_status(file_path)

        # 更新编辑字段
        self.date_entry.delete(0, tk.END)
        self.date_entry.insert(0, fm_data['date'] or datetime.today().strftime('%Y-%m-%d'))

        self.updated_entry.delete(0, tk.END)
        self.updated_entry.insert(0, fm_data['updated'] or datetime.today().strftime('%Y-%m-%d'))

        self.category_entry.delete(0, tk.END)
        self.category_entry.insert(0, fm_data['category'])

        self.summary_text.delete("1.0", tk.END)
        self.summary_text.insert("1.0", fm_data['summary'])

        # 保存当前内容的副本
        self.current_content = self.get_current_content()
        self.has_unsaved_changes = False
        self.status_var.set("就绪")

    def save_changes(self):
        if not self.current_file:
            messagebox.showwarning("警告", "没有选择文件！")
            return

        # 获取并验证日期
        date_str = self.date_entry.get()
        updated_str = self.updated_entry.get()

        if not self.validate_date(date_str) or not self.validate_date(updated_str):
            messagebox.showwarning("格式错误", "请使用正确的日期格式：YYYY-MM-DD")
            return

        try:
            success = update_file(
                self.current_file,
                changed_date=date_str or datetime.today().strftime('%Y-%m-%d'),
                changed_updated=updated_str or datetime.today().strftime('%Y-%m-%d'),
                changed_category=self.category_entry.get(),
                changed_summary=self.summary_text.get("1.0", tk.END).strip()
            )

            if success:
                self.status_var.set(f"文件 {os.path.basename(self.current_file)} 已更新")
                self.has_unsaved_changes = False
                self.current_content = self.get_current_content()
                messagebox.showinfo("成功", "文件已更新！")
            else:
                self.status_var.set("没有需要更新的内容")

        except Exception as e:
            messagebox.showerror("错误", f"更新文件时出错：{str(e)}")
            self.status_var.set("更新失败")

    def process_all_files(self):
        folder = self.folder_path.get()
        if not folder or not os.path.isdir(folder):
            messagebox.showwarning("警告", "请选择一个有效的文件夹！")
            return

        md_files = [f for f in os.listdir(folder) if f.endswith('.md')]
        if not md_files:
            messagebox.showinfo("信息", "所选文件夹中没有 Markdown 文件。")
            return

        try:
            updated_count = 0
            for md_file in md_files:
                file_path = os.path.join(folder, md_file)
                if update_file(file_path):
                    updated_count += 1
                self.status_var.set(f"正在处理: {md_file}")
                self.root.update()

            self.scan_files()
            messagebox.showinfo("处理完成", f"已处理 {len(md_files)} 个文件，其中 {updated_count} 个文件被更新。")
            self.status_var.set(f"处理完成: {updated_count}/{len(md_files)} 文件已更新")

        except Exception as e:
            messagebox.showerror("错误", f"批量处理文件时出错：{str(e)}")
            self.status_var.set("批量处理失败")

    def clear_edit_fields(self):
        for widget in [self.date_entry, self.updated_entry, self.category_entry]:
            widget.delete(0, tk.END)
        self.summary_text.delete("1.0", tk.END)

    def validate_date(self, date_str):
        """验证日期格式是否符合 YYYY-MM-DD"""
        if not date_str:
            return True
        pattern = r'^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$'
        return bool(re.match(pattern, date_str))

    def mark_as_modified(self, event=None):
        """标记当前文件为已修改状态"""
        if self.current_file:
            current_content = self.get_current_content()
            if current_content != self.current_content:
                self.has_unsaved_changes = True
                self.status_var.set("有未保存的更改...")

    def get_current_content(self):
        """获取当前编辑区域的所有内容"""
        return {
            'date': self.date_entry.get(),
            'updated': self.updated_entry.get(),
            'category': self.category_entry.get(),
            'summary': self.summary_text.get("1.0", tk.END).strip()
        }

    def save_current_if_modified(self):
        """如果有未保存的更改，保存当前文件"""
        if self.current_file and self.has_unsaved_changes:
            try:
                current_content = self.get_current_content()
                
                # 验证日期格式
                if not self.validate_date(current_content['date']) or not self.validate_date(current_content['updated']):
                    if messagebox.askyesno("格式错误", "日期格式不正确，是否继续切换文件？\n当前修改将丢失。"):
                        self.has_unsaved_changes = False
                        return True
                    return False

                success = update_file(
                    self.current_file,
                    changed_date=current_content['date'] or datetime.today().strftime('%Y-%m-%d'),
                    changed_updated=current_content['updated'] or datetime.today().strftime('%Y-%m-%d'),
                    changed_category=current_content['category'],
                    changed_summary=current_content['summary']
                )

                if success:
                    self.has_unsaved_changes = False
                    self.status_var.set(f"文件 {os.path.basename(self.current_file)} 已自动保存")
                    return True
                else:
                    return True  # 如果没有实际更改，也允许切换
            except Exception as e:
                if messagebox.askyesno("保存错误", f"保存文件时出错：{str(e)}\n是否继续切换文件？\n当前修改将丢失。"):
                    self.has_unsaved_changes = False
                    return True
                return False
        return True

if __name__ == '__main__':
    root = tk.Tk()
    app = MarkdownProcessorApp(root)
    root.mainloop()
