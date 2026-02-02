"""
Complete the remaining patients API integration changes
"""

# Read the file
with open('frontend/static/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

print("Completing remaining patients API integration changes...")

# Change 3: Make renderPatients async and add loadPatientsData call
print("3. Making renderPatients() async...")
import re

# Find the renderPatients function
pattern = r'function renderPatients\(container\) \{'
if re.search(pattern, content):
    content = re.sub(
        pattern,
        'async function renderPatients(container) {\n      await loadPatientsData(); // Load fresh data from API\n      ',
        content,
        count=1
    )
    print("   ✅ Made renderPatients() async")
else:
    print("   ⚠️  renderPatients function not found or already async")

# Change 4: Replace samplePatients references with patientsData
print("4. Replacing samplePatients references...")
count_before = content.count('samplePatients')
content = re.sub(r'\bsamplePatients\.filter', 'patientsData.filter', content)
content = re.sub(r'\bsamplePatients\.map', 'patientsData.map', content)
content = re.sub(r'\bsamplePatients\.length', 'patientsData.length', content)
content = re.sub(r'\bsamplePatients\.find', 'patientsData.find', content)
content = re.sub(r'\bsamplePatients\.unshift', 'patientsData.unshift', content)
content = re.sub(r'\$\{samplePatients', '${patientsData', content)
count_after = content.count('samplePatients')
print(f"   ✅ Replaced {count_before - count_after} occurrences")

# Write back
with open('frontend/static/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Completed remaining changes!")
print(f"\nVerification:")
print(f"   samplePatients count: {content.count('samplePatients')}")
print(f"   patientsData count: {content.count('patientsData')}")
print(f"   async function renderPatients: {'YES' if 'async function renderPatients' in content else 'NO'}")
