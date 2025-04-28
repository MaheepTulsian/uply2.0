import os

IGNORE_FOLDERS = ['__pycache__', 'node_modules', '.git', 'venv']  # Add more if needed

def print_tree(start_path='.', prefix=''):
    files = os.listdir(start_path)
    files.sort()
    for idx, name in enumerate(files):
        if name in IGNORE_FOLDERS:
            continue
        path = os.path.join(start_path, name)
        connector = '└── ' if idx == len(files) - 1 else '├── '
        print(prefix + connector + name)
        if os.path.isdir(path):
            extension = '    ' if idx == len(files) - 1 else '│   '
            print_tree(path, prefix + extension)

if __name__ == "__main__":
    print_tree(os.getcwd())
