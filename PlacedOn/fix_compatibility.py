import os
import re

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    content = "".join(lines)
    
    # 1. Replace | None -> Optional[...]
    new_content = re.sub(r'([\w\[\], ]+) \| None', r'Optional[\1]', content)
    new_content = re.sub(r'(\w+) \| None', r'Optional[\1]', new_content)
    
    # 2. Replace type1 | type2 -> Union[type1, type2]
    # Simple cases like bool | int
    new_content = re.sub(r'(\w+) \| (\w+)', r'Union[\1, \2]', new_content)

    if new_content == content and "from __future__ import annotations" in content:
        # Check if we need to move the future import to the top
        pass
    else:
        # We changed something or we need the future import
        pass

    # Standardize: Remove all existing __future__ annotations imports and add it back at the TOP
    clean_lines = [line for line in new_content.splitlines() if "from __future__ import annotations" not in line]
    
    # Ensure Optional/Union are imported from typing
    has_optional = "Optional[" in new_content
    has_union = "Union[" in new_content
    
    typing_imports = []
    if has_optional: typing_imports.append("Optional")
    if has_union: typing_imports.append("Union")
    if "Any" in new_content and "Any" not in "".join(clean_lines[:10]): # rough check
         typing_imports.append("Any")
    
    # Remove all "from typing import ..." lines and consolidate
    final_lines = []
    typing_line_index = -1
    for i, line in enumerate(clean_lines):
        if "from typing import" in line:
            # Extract existing imports
            existing = re.findall(r'import ([\w, ]+)', line)
            if existing:
                for item in existing[0].split(','):
                    item = item.strip()
                    if item and item not in typing_imports:
                        typing_imports.append(item)
            if typing_line_index == -1:
                typing_line_index = i
        else:
            final_lines.append(line)
            
    if typing_imports:
        consolidated_typing = f"from typing import {', '.join(sorted(list(set(typing_imports))))}"
        if typing_line_index == -1:
            final_lines.insert(0, consolidated_typing)
        else:
            # Insert at original first typing import position
            # (Note: typing_line_index might be off if we removed lines, but it's a good guess)
            final_lines.insert(0, consolidated_typing)

    # Final result
    res = "from __future__ import annotations\n" + "\n".join(final_lines) + "\n"
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(res)
    return True

def main():
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.py') and file != 'fix_compatibility.py':
                path = os.path.join(root, file)
                try:
                    fix_file(path)
                    print(f"Fixed {path}")
                except Exception as e:
                    print(f"Failed to fix {path}: {e}")

if __name__ == "__main__":
    main()
