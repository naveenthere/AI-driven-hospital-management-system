"""
Improved script to apply remaining patients API integration changes
"""

import re

# Read the file
with open('frontend/static/main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

content = ''.join(lines)

print("Applying remaining frontend integration changes...")

# Change 1: Add loadPatientsData function after showToast (around line 140)
print("1. Adding loadPatientsData() API function...")
for i, line in enumerate(lines):
    if 'function showToast(message, type' in line:
        # Find the closing brace of showToast
        brace_count = 0
        j = i
        while j < len(lines):
            brace_count += lines[j].count('{') - lines[j].count('}')
            if brace_count == 0 and '}' in lines[j]:
                # Insert after this line
                api_function = [
                    '\n',
                    '// ============ API FUNCTIONS ============\n',
                    'async function loadPatientsData() {\n',
                    '  try {\n',
                    '    const response = await fetch(\'/api/patients\');\n',
                    '    const data = await response.json();\n',
                    '    if (data.success) {\n',
                    '      patientsData = data.patients;\n',
                    '    } else {\n',
                    '      console.error(\'Failed to load patients:\', data.message);\n',
                    '    }\n',
                    '  } catch (error) {\n',
                    '    console.error(\'Failed to load patients:\', error);\n',
                    '    showToast(\'Unable to load patients data\', \'error\');\n',
                    '  }\n',
                    '}\n',
                    '\n'
                ]
                lines = lines[:j+1] + api_function + lines[j+1:]
                break
            j += 1
        break

# Change 2: Make renderPatients async and add loadPatientsData call
print("2. Making renderPatients() async...")
for i, line in enumerate(lines):
    if 'function renderPatients(container)' in line:
        lines[i] = line.replace('function renderPatients(container)', 'async function renderPatients(container)')
        # Add loadPatientsData call after the opening brace
        if '{' in lines[i]:
            lines.insert(i+1, '  await loadPatientsData(); // Load fresh data from API\n')
        break

# Write back
with open('frontend/static/main.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("\n✅ Remaining changes applied successfully!")
print("\nChanges made:")
print("  1. ✅ Added loadPatientsData() API function")
print("  2. ✅ Made renderPatients() async with API call")
