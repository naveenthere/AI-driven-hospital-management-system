"""
Script to apply patients API integration changes to main.js
This script makes all 6 required changes automatically
"""

import re

# Read the file
with open('frontend/static/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

print("Starting frontend integration...")

# Change 1: Replace samplePatients declaration
print("1. Replacing samplePatients declaration...")
old_patients = r"const samplePatients = \[[\s\S]*?\];"
new_patients = "// Patients data - loaded from API\n    let patientsData = [];"
content = re.sub(old_patients, new_patients, content, count=1)

# Change 2: Add loadPatientsData function after showToast
print("2. Adding loadPatientsData() API function...")
showtoast_end = content.find("    function showToast(message, type = 'success') {")
if showtoast_end != -1:
    # Find the end of showToast function
    brace_count = 0
    i = showtoast_end
    while i < len(content):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                # Found the end of showToast
                insert_pos = i + 1
                # Skip to next line
                while insert_pos < len(content) and content[insert_pos] in ['\n', '\r', ' ']:
                    insert_pos += 1
                
                api_function = """

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
    }
"""
                content = content[:insert_pos] + api_function + content[insert_pos:]
                break
        i += 1

# Change 3: Make renderPatients async and add loadPatientsData call
print("3. Making renderPatients() async...")
content = re.sub(
    r'function renderPatients\(container\) \{',
    'async function renderPatients(container) {\n      await loadPatientsData(); // Load fresh data from API\n      ',
    content
)

# Change 4: Replace all samplePatients references
print("4. Replacing all samplePatients references...")
content = content.replace('samplePatients.filter', 'patientsData.filter')
content = content.replace('samplePatients.map', 'patientsData.map')
content = content.replace('samplePatients.length', 'patientsData.length')
content = content.replace('samplePatients.find', 'patientsData.find')
content = content.replace('samplePatients.unshift', 'patientsData.unshift')
content = content.replace('${samplePatients', '${patientsData')

# Change 5: Update add patient form handler
print("5. Updating add patient form handler...")
old_form_handler = r"document\.getElementById\('add-patient-form'\)\?\.addEventListener\('submit', \(e\) => \{[\s\S]*?samplePatients\.unshift\(newPatient\);[\s\S]*?renderPatients\(container\);[\s\S]*?\}\);"

new_form_handler = """document.getElementById('add-patient-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newPatient = {
          id: generateId('ADM'),
          opd: generateId('OPD'),
          name: formData.get('name'),
          aadhar: formData.get('aadhar'),
          bloodGroup: formData.get('bloodGroup'),
          caretaker: formData.get('caretaker'),
          phone: formData.get('phone'),
          department: formData.get('department'),
          doctor: formData.get('doctor'),
          nurse: formData.get('nurse'),
          status: 'admitted',
          admittedDate: new Date().toISOString().split('T')[0],
          transferredDate: null,
          dischargedDate: null
        };
        
        try {
          const response = await fetch('/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPatient)
          });
          
          const data = await response.json();
          
          if (data.success) {
            document.getElementById('add-patient-modal').classList.add('hidden');
            showToast('Patient added successfully!');
            await renderPatients(container);
          } else {
            showToast(data.message || 'Failed to add patient', 'error');
          }
        } catch (error) {
          console.error('Add patient error:', error);
          showToast('Unable to connect to server', 'error');
        }
      });"""

content = re.sub(old_form_handler, new_form_handler, content, flags=re.DOTALL)

# Change 6: Add date update handlers (after patient search functionality)
print("6. Adding date update handlers...")
# Find the patient search section and add handlers after it
search_section = content.find("// Patient search functionality")
if search_section != -1:
    # Find the end of the search event listener
    end_pos = content.find("});", search_section)
    if end_pos != -1:
        end_pos += 3  # Move past the });
        
        date_handlers = """

      // Patient date update handlers
      document.querySelectorAll('.patient-date-input').forEach(input => {
        input.addEventListener('change', async (e) => {
          const patientId = e.target.dataset.patientId;
          const dateType = e.target.dataset.dateType;
          const newDate = e.target.value;
          
          try {
            const response = await fetch(`/api/patients/${patientId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ [`${dateType}Date`]: newDate || null })
            });
            
            const data = await response.json();
            
            if (data.success) {
              showToast('Patient updated successfully!');
              await loadPatientsData();
            } else {
              showToast(data.message || 'Failed to update patient', 'error');
            }
          } catch (error) {
            console.error('Update patient error:', error);
            showToast('Unable to connect to server', 'error');
          }
        });
      });
"""
        content = content[:end_pos] + date_handlers + content[end_pos:]

# Write the modified content
with open('frontend/static/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ All changes applied successfully!")
print("\nChanges made:")
print("  1. ✅ Replaced samplePatients with patientsData")
print("  2. ✅ Added loadPatientsData() API function")
print("  3. ✅ Made renderPatients() async")
print("  4. ✅ Replaced all samplePatients references")
print("  5. ✅ Updated add patient form handler")
print("  6. ✅ Added date update handlers")
