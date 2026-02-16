#!/usr/bin/env python3
import re
import sys

def fix_modal_accessibility(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    original = content
    
    # Pattern to match <Modal tags that don't already have accessibilityViewIsModal
    # We need to find Modal tags and check if they have the prop
    lines = content.split('\n')
    new_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if this line starts a Modal component
        if '<Modal' in line and 'accessibilityViewIsModal' not in line:
            # Check if accessibilityViewIsModal appears in the next few lines
            has_prop = False
            for j in range(i, min(i + 15, len(lines))):
                if 'accessibilityViewIsModal' in lines[j]:
                    has_prop = True
                    break
                if '>' in lines[j] and '</' not in lines[j]:  # Closing of opening tag
                    break
            
            if not has_prop:
                # Add the prop after <Modal
                indent = len(line) - len(line.lstrip())
                new_lines.append(line)
                new_lines.append(' ' * (indent + 2) + 'accessibilityViewIsModal')
                i += 1
                continue
        
        new_lines.append(line)
        i += 1
    
    content = '\n'.join(new_lines)
    
    if content != original:
        with open(filename, 'w') as f:
            f.write(content)
        return True
    return False

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: fix-modals.py <file>')
        sys.exit(1)
    
    filename = sys.argv[1]
    if fix_modal_accessibility(filename):
        print(f'Fixed {filename}')
    else:
        print(f'No changes needed for {filename}')
