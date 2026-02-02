"""
Fix the patients module by properly replacing samplePatients with patientsData
"""

# Read the file
with open('frontend/static/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

print("Fixing patients module...")
print(f"Before: samplePatients count = {content.count('samplePatients')}")
print(f"Before: patientsData count = {content.count('patientsData')}")

# Fix the declaration line (remove extra indentation)
content = content.replace('    let patientsData = [];', 'let patientsData = [];')

# Replace ALL occurrences of samplePatients with patientsData
content = content.replace('samplePatients', 'patientsData')

print(f"\nAfter: samplePatients count = {content.count('samplePatients')}")
print(f"After: patientsData count = {content.count('patientsData')}")

# Write back
with open('frontend/static/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Fixed all samplePatients references!")
