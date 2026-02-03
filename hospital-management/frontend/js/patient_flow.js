// ============================================
// PATIENTS MODULE API INTEGRATION
// Replace hardcoded samplePatients with API calls
// ============================================

// Step 1: Replace samplePatients declaration (line ~30)
// OLD:
// const samplePatients = [ ... ];

// NEW:
let patientsData = []; // Will be loaded from API


// Step 2: Add API loading function (add after utility functions, before render functions)
async function loadPatientsData() {
    try {
        const response = await fetch('/api/patients');
        const data = await response.json();
        if (data.success) {
            patientsData = data.patients;
        } else {
            console.error('Failed to load patients:', data.message);
            showToast('Failed to load patients', 'error');
        }
    } catch (error) {
        console.error('Failed to load patients:', error);
        showToast('Unable to connect to server', 'error');
    }
}


// Step 3: Update renderPatients function to be async and load data
// Find: function renderPatients(container) {
// Replace with: async function renderPatients(container) {
//   await loadPatientsData(); // Load fresh data from API
//   
//   // Rest of the function stays EXACTLY the same, just replace:
//   // - All instances of `samplePatients` with `patientsData`


// Step 4: Update add patient form handler
// Find the add-patient-form submit handler and replace with:
document.getElementById('add-patient-form')?.addEventListener('submit', async (e) => {
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPatient)
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('add-patient-modal').classList.add('hidden');
            showToast('Patient added successfully!');
            await renderPatients(container); // Reload with fresh data
        } else {
            showToast(data.message || 'Failed to add patient', 'error');
        }
    } catch (error) {
        console.error('Add patient error:', error);
        showToast('Unable to connect to server', 'error');
    }
});


// Step 5: Update patient date change handlers
// Find the patient-date-input change handlers and add API call:
document.querySelectorAll('.patient-date-input').forEach(input => {
    input.addEventListener('change', async (e) => {
        const patientId = e.target.dataset.patientId;
        const dateType = e.target.dataset.dateType;
        const newDate = e.target.value;

        try {
            const response = await fetch(`/api/patients/${patientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    [`${dateType}Date`]: newDate || null
                })
            });

            const data = await response.json();

            if (data.success) {
                showToast('Patient updated successfully!');
                // Optionally reload data
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


// Step 6: Update all references in renderPatients and renderDashboard
// Find and replace (case-sensitive):
// - samplePatients.filter => patientsData.filter
// - samplePatients.map => patientsData.map
// - samplePatients.length => patientsData.length
// - ${samplePatients => ${patientsData
