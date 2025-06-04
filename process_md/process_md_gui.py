import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import os
import subprocess
import sys
from md_processor import update_file, check_file_status

class MarkdownProcessorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Markdown 文章管理工具")
        self.root.geometry("1000x700")
        self.root.minsize(800, 600)

        self.folder_path = tk.StringVar()
        self.file_statuses = []
        self.current_file = None

        self.set_theme()

        self.main_frame = ttk.Frame(root, padding=10)
        self.main_frame.pack(fill="both", expand=True)

        self.create_widgets()

    def set_theme(self):
        style = ttk.Style()
        style.theme_use('clam')

        style.configure('.', background="#fafafa", font=('Segoe UI', 10))
        style.configure('Card.TLabelframe', background="#ffffff", borderwidth=1, relief="solid")
        style.configure('Card.TLabelframe.Label', background="#ffffff", font=('Segoe UI', 10, 'bold'))
        style.configure('TButton', padding=6, relief="flat", background="#f0f5f9")
        style.map('TButton', background=[('active', "#5bbff0")])
        style.configure('Treeview', font=('Segoe UI', 10), rowheight=28, background="#ffffff", fieldbackground="#ffffff")
        style.configure('Treeview.Heading', font=('Segoe UI', 10, 'bold'), background="#f5f5f5")

    def create_widgets(self):
        left_panel = ttk.Frame(self.main_frame)
        left_panel.pack(side="left", fill="y", padx=(0, 10), expand=False)

        folder_frame = ttk.LabelFrame(left_panel, text="文件夹选择", style='Card.TLabelframe')
        folder_frame.pack(fill="x", pady=(0, 10))

        self.folder_entry = ttk.Entry(folder_frame, textvariable=self.folder_path, state="readonly")
        self.folder_entry.pack(side="left", fill="x", expand=True, padx=5, pady=8)

        browse_button = ttk.Button(folder_frame, text="浏览", command=self.browse_folder)
        browse_button.pack(side="right", padx=5, pady=5)

        button_frame = ttk.Frame(left_panel)
        button_frame.pack(fill="x", pady=(0, 10))

        ttk.Button(button_frame, text="刷新列表", command=self.scan_files).pack(fill="x", expand=True, padx=2, pady=2)
        ttk.Button(button_frame, text="处理所有", command=self.process_all_files).pack(fill="x", expand=True, padx=2, pady=2)
        ttk.Button(button_frame, text="推送 Git", command=self.run_git_push).pack(fill="x", expand=True, padx=2, pady=2)

        list_frame = ttk.LabelFrame(left_panel, text="文件列表", style='Card.TLabelframe')
        list_frame.pack(fill="both", expand=True)

        self.file_list = tk.Listbox(list_frame, font=('Segoe UI', 10), selectmode="single", bg="#ffffff", bd=0, highlightthickness=0)
        self.file_list.pack(fill="both", expand=True, padx=5, pady=5)
        self.file_list.bind('<<ListboxSelect>>', self.on_file_select)

        right_panel = ttk.Frame(self.main_frame)
        right_panel.pack(side="right", fill="both", expand=True)

        status_frame = ttk.LabelFrame(right_panel, text="文件状态", style='Card.TLabelframe')
        status_frame.pack(fill="x", pady=(0, 10))

        self.tree = ttk.Treeview(status_frame, columns=("属性", "状态", "值"), show="headings", height=6)
        for col, width in zip(("属性", "状态", "值"), (120, 100, 300)):
            self.tree.heading(col, text=col)
            self.tree.column(col, width=width, anchor="w")
        self.tree.pack(fill="x", padx=5, pady=5)

        edit_frame = ttk.LabelFrame(right_panel, text="编辑元数据", style='Card.TLabelframe')
        edit_frame.pack(fill="both", expand=True)

        for i in range(4):
            edit_frame.rowconfigure(i, weight=1)
        edit_frame.columnconfigure(1, weight=2)

        ttk.Label(edit_frame, text="日期:").grid(row=0, column=0, padx=5, pady=5, sticky="e")
        self.date_entry = ttk.Entry(edit_frame)
        self.date_entry.grid(row=0, column=1, padx=5, pady=5, sticky="we")

        ttk.Label(edit_frame, text="更新日期:").grid(row=1, column=0, padx=5, pady=5, sticky="e")
        self.updated_entry = ttk.Entry(edit_frame)
        self.updated_entry.grid(row=1, column=1, padx=5, pady=5, sticky="we")

        ttk.Label(edit_frame, text="分类:").grid(row=2, column=0, padx=5, pady=5, sticky="e")
        self.category_entry = ttk.Entry(edit_frame)
        self.category_entry.grid(row=2, column=1, padx=5, pady=5, sticky="we")

        ttk.Label(edit_frame, text="摘要:").grid(row=3, column=0, padx=5, pady=5, sticky="ne")
        self.summary_text = tk.Text(edit_frame, height=5, wrap="word", font=('Segoe UI', 10), bg="#ffffff", bd=1, relief="solid")
        self.summary_text.grid(row=3, column=1, padx=5, pady=5, sticky="we")

        ttk.Button(edit_frame, text="保存更改", command=self.save_changes).grid(row=4, column=1, padx=5, pady=10, sticky="e")

        terminal_frame = ttk.LabelFrame(right_panel, text="终端输出", style='Card.TLabelframe')
        terminal_frame.pack(fill="x", pady=(0, 8))

        self.terminal_output = tk.Text(terminal_frame, height=6, wrap="word", font=('Consolas', 10), bg="#111111", fg="#00ff00")
        self.terminal_output.pack(fill="both", padx=5, pady=5)

        self.status_var = tk.StringVar(value="就绪")
        ttk.Label(right_panel, textvariable=self.status_var, anchor="w", relief="sunken").pack(fill="x", pady=(4, 0))

    def browse_folder(self):
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.folder_path.set(folder_selected)
            self.scan_files()

    def scan_files(self):
        self.file_list.delete(0, tk.END)
        self.tree.delete(*self.tree.get_children())
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
            self.file_list.insert(tk.END, md_file)

        self.status_var.set(f"找到 {len(md_files)} 个 Markdown 文件")

    def on_file_select(self, event):
        if not self.file_list.curselection():
            return

        selected_index = self.file_list.curselection()[0]
        selected_file = self.file_list.get(selected_index)
        folder = self.folder_path.get()
        file_path = os.path.join(folder, selected_file)

        self.current_file = file_path
        fm_data = check_file_status(file_path)

        self.tree.delete(*self.tree.get_children())
        self.tree.insert("", "end", values=("日期", "✅" if fm_data['date'] else "❌", fm_data['date']))
        self.tree.insert("", "end", values=("更新日期", "✅" if fm_data['updated'] else "❌", fm_data['updated']))
        self.tree.insert("", "end", values=("分类", "✅" if fm_data['category'] else "❌", fm_data['category']))
        self.tree.insert("", "end", values=("摘要", "✅" if fm_data['summary'] else "❌", fm_data['summary']))

        self.date_entry.delete(0, tk.END)
        self.date_entry.insert(0, fm_data['date'])

        self.updated_entry.delete(0, tk.END)
        self.updated_entry.insert(0, fm_data['updated'])

        self.category_entry.delete(0, tk.END)
        self.category_entry.insert(0, fm_data['category'])

        self.summary_text.delete("1.0", tk.END)
        self.summary_text.insert("1.0", fm_data['summary'])

    def clear_edit_fields(self):
        self.date_entry.delete(0, tk.END)
        self.updated_entry.delete(0, tk.END)
        self.category_entry.delete(0, tk.END)
        self.summary_text.delete("1.0", tk.END)

    def save_changes(self):
        if not self.current_file:
            messagebox.showwarning("警告", "没有选择文件！")
            return

        success = update_file(
            self.current_file,
            changed_date=self.date_entry.get(),
            changed_updated=self.updated_entry.get(),
            changed_category=self.category_entry.get(),
            changed_summary=self.summary_text.get("1.0", tk.END).strip()
        )

        if success:
            messagebox.showinfo("成功", "文件已更新！")
            self.on_file_select(None)
            self.status_var.set(f"文件 {os.path.basename(self.current_file)} 已更新")
        else:
            messagebox.showerror("错误", "更新文件时出错！")

    def process_all_files(self):
        folder = self.folder_path.get()
        if not folder or not os.path.isdir(folder):
            messagebox.showwarning("警告", "请选择一个有效的文件夹！")
            return

        md_files = [f for f in os.listdir(folder) if f.endswith('.md')]
        if not md_files:
            messagebox.showinfo("信息", "所选文件夹中没有 Markdown 文件。")
            return

        updated_count = 0
        for md_file in md_files:
            file_path = os.path.join(folder, md_file)
            if update_file(file_path):
                updated_count += 1

        self.scan_files()
        messagebox.showinfo("处理完成", f"已处理 {len(md_files)} 个文件，其中 {updated_count} 个文件被更新。")
        self.status_var.set(f"处理完成: {updated_count}/{len(md_files)} 文件已更新")

    def run_git_push(self):
        folder = self.folder_path.get()
        if not folder or not os.path.isdir(folder):
            messagebox.showwarning("警告", "请选择一个有效的文件夹！")
            return

        # Get the directory of the current script and then go up two levels to reach the workspace root
        script_dir = os.path.dirname(os.path.abspath(__file__))
        workspace_root = os.path.abspath(os.path.join(script_dir, "..", ".."))

        script_path = os.path.join(workspace_root, "gitpush.sh")
        if not os.path.exists(script_path):
            messagebox.showerror("错误", f"未找到 gitpush.sh 脚本: {script_path}")
            return

        self.terminal_output.delete("1.0", tk.END)
        self.terminal_output.insert(tk.END, f"$ bash {script_path}\n\n")

        try:
            env = os.environ.copy()
            env['LANG'] = 'C.UTF-8' # Or 'en_US.UTF-8'
            env['LC_ALL'] = 'C.UTF-8' # Also set LC_ALL for consistent locale

            result = subprocess.run(["bash", script_path], cwd=workspace_root, capture_output=True, text=False, env=env, timeout=30)
            output = result.stdout.decode('utf-8', errors='replace').strip()
            error = result.stderr.decode('utf-8', errors='replace').strip()
            if output:
                self.terminal_output.insert(tk.END, output + "\n")
            if error:
                self.terminal_output.insert(tk.END, "\n[错误信息]:\n" + error)
            if result.returncode == 0:
                self.status_var.set("Git 推送成功")
            else:
                self.status_var.set(f"Git 推送失败，返回码：{result.returncode}")
        except Exception as e:
            self.terminal_output.insert(tk.END, f"\n[异常] {str(e)}\n")
            self.status_var.set("Git 推送异常")

if __name__ == '__main__':
    root = tk.Tk()
    app = MarkdownProcessorApp(root)
    root.mainloop()
