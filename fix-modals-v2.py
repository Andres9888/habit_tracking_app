#!/usr/bin/env python3
import re
import sys

def fix_modal_accessibility(filename):
    with open(filename, 'r') as f:
        lines = f.readlines()
    
    new_lines = []
    i = 0
    modified = False
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this line contains <Modal or <RNModal opening tag
        if re.search(r'<(RN)?Modal[\s>]', line):
            # Check if accessibilityViewIsModal already exists nearby
            has_prop = False
            for j in range(i, min(i + 15, len(lines))):
                if 'accessibilityViewIsModal' in lines[j]:
                    has_prop = True
                    break
                # Stop if we hit the closing >
                if lines[j].strip() == '>' or lines[j].strip().startswith('>'):
                    break
            
            if not has_prop:
                # Add the prop on the next line after <Modal
                new_lines.append(line)
                indent = len(line) - len(line.lstrip())
                # Check if there are already props on the next line to match indentation
                if i + 1 < len(lines) and lines[i + 1].strip() and not lines[i + 1].strip().startswith('>'):
                    next_indent = len(lines[i + 1]) - len(lines[i + 1].lstrip())
                    new_lines.append(' ' * next_indent + 'accessibilityViewIsModal\n')
                else:
                    new_lines.append(' ' * (indent + 2) + 'accessibilityViewIsModal\n')
                modified = True
                i += 1
                continue
        
        new_lines.append(line)
        i += 1
    
    if modified:
        with open(filename, 'w') as f:
            f.writelines(new_lines)
        return True
    return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: fix-modals-v2.py <file>')
        sys.exit(1)
    
    filename = sys.argv[1]
    if fix_modal_accessibility(filename):
        print(f'Fixed {filename}')
    else:
        print(f'No changes needed for {filename}')
