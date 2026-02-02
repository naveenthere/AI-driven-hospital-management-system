"""
Carefully apply patients API integration changes to the restored main.js
This script makes ONLY the necessary changes without corrupting other data
"""

# Read the file
with open('frontend/static/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

print("Applying patients API integration changes...")

# Change 1: Replace samplePatients declaration (ONLY the declaration, not the word everywhere)
print("1. Replacing samplePatients declaration...")
import re

# Find and replace the samplePatients array declaration
pattern = r'const samplePatients = \[\s*\{[^\]]+\}\s*\];'
replacement = '// Patients data - loaded from API\nlet patientsData = [];'

# Check if pattern exists
if re.search(pattern, content, re.DOTALL):
    content = re.sub(pattern, replacement, content, count=1, flags=re.DOTALL)
    print("   ✅ Replaced samplePatients declaration")
else:
    print("   ⚠️  Could not find samplePatients declaration")

# Change 2: Add loadPatientsData function after showToast
print("2. Adding loadPatientsData() API function...")
showtoast_pattern = r'(function showToast\(message, type = \'success\'\) \{[^}]+\})'
api_function = r'''\1

// ============ API FUNCTIONS ============
async function loadPatientsData() {
  try {
    const response = await fetch('/api/patients');
    const data = await response.json();
    if (data.success) {
      patientsData = data.patients;
    } else {
      console.error('Failed to load patients:', data.message);
    }
  } catch (error) {
    console.error('Failed to load patients:', error);
    showToast('Unable to load patients data', 'error');
  }
}'''

content = re.sub(showtoast_pattern, api_function, content, count=1)
print("   ✅ Added loadPatientsData() function")

# Change 3: Make renderPatients async and add loadPatientsData call
print("3. Making renderPatients() async...")
content = re.sub(
    r'function renderPatients\(container\) \{',
    'async function renderPatients(container) {\n  await loadPatientsData(); // Load fresh data from API\n',
    content,
    count=1
)
print("   ✅ Made renderPatients() async")

# Change 4: Replace samplePatients references with patientsData (ONLY in specific contexts)
print("4. Replacing samplePatients references...")
# Replace in filter, map, find, length contexts
content = re.sub(r'\bsamplePatients\.filter', 'patientsData.filter', content)
content = re.sub(r'\bsamplePatients\.map', 'patientsData.map', content)
content = re.sub(r'\bsamplePatients\.length', 'patientsData.length', content)
content = re.sub(r'\bsamplePatients\.find', 'patientsData.find', content)
content = re.sub(r'\bsamplePatients\.unshift', 'patientsData.unshift', content)
content = re.sub(r'\$\{samplePatients', '${patientsData', content)
print("   ✅ Replaced samplePatients references")

# Write back
with open('frontend/static/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ All changes applied successfully!")
print("\nVerifying...")
print(f"   samplePatients count: {content.count('samplePatients')}")
print(f"   patientsData count: {content.count('patientsData')}")
