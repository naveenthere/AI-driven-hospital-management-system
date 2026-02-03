// ============ CONFIGURATION ============
const defaultConfig = {
  hospital_name: "MedCare General Hospital",
  hospital_mantra: "Compassionate Care, Advanced Medicine, Healthier Lives",
  primary_color: "#0f172a",
  secondary_color: "#1e3a5f",
  accent_color: "#3b82f6",
  text_color: "#ffffff",
  surface_color: "#1e293b"
};

let config = { ...defaultConfig };
let currentUser = null;
let currentPage = 'login';
let allData = [];
let userTasks = [];

// Load tasks from API
async function loadTasks() {
  try {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    if (data.success) {
      userTasks = data.tasks;
      updateTaskBadge();
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

// Call on load
document.addEventListener('DOMContentLoaded', loadTasks);



// ============ USER CREDENTIALS ============
const users = {
  'CEO001': { password: 'ceo@123', role: 'CEO', name: 'Dr. Sarah Johnson', access: ['dashboard', 'patients', 'staff', 'transactions', 'predictions', 'inventory', 'records'] },
  'CFO001': { password: 'cfo@123', role: 'CFO', name: 'Michael Chen', access: ['transactions'] },
  'CNO001': { password: 'cno@123', role: 'CNO', name: 'Emily Davis', access: ['patients', 'staff', 'records'] },
  'CMO001': { password: 'cmo@123', role: 'CMO', name: 'Dr. Robert Williams', access: ['dashboard', 'patients', 'staff', 'inventory', 'records'] },
  'MRM001': { password: 'mrm@123', role: 'MRM', name: 'David Thompson', access: ['records'] },
  'HR001': { password: 'hr@123', role: 'HR', name: 'Human Resources Manager', access: ['staff', 'dashboard'] }
};

// ============ SAMPLE DATA ============
// Patients data - loaded from API
let patientsData = [];

// Staff data - loaded from API
let staffData = [];

// Equipment data - loaded from API
let equipmentData = [];

const sampleTransactions = [
  { id: 'TXN001', date: '2024-01-15', type: 'Equipment', description: 'MRI Maintenance', amount: -15000 },
  { id: 'TXN002', date: '2024-01-15', type: 'Medicine', description: 'Monthly Medicine Stock', amount: -45000 },
  { id: 'TXN003', date: '2024-01-14', type: 'Revenue', description: 'Patient Services', amount: 125000 },
  { id: 'TXN004', date: '2024-01-14', type: 'Payroll', description: 'Staff Salaries', amount: -280000 },
  { id: 'TXN005', date: '2024-01-13', type: 'Revenue', description: 'Lab Services', amount: 35000 }
];

const samplePayroll = {
  doctors: [
    { id: 'PAY001', employeeId: 'STF001', name: 'Dr. Amanda Foster', role: 'Cardiologist', baseSalary: 15000, bonus: 2000, deductions: 1500, netSalary: 15500 },
    { id: 'PAY002', employeeId: 'STF003', name: 'Dr. Lisa Park', role: 'Neurologist', baseSalary: 14000, bonus: 1500, deductions: 1200, netSalary: 14300 },
    { id: 'PAY003', employeeId: 'STF009', name: 'Dr. Rachel Green', role: 'Pediatrician', baseSalary: 13500, bonus: 1800, deductions: 1100, netSalary: 14200 }
  ],
  nurses: [
    { id: 'PAY004', employeeId: 'STF002', name: 'Nurse James Wilson', role: 'ICU Nurse', baseSalary: 5000, bonus: 500, deductions: 400, netSalary: 5100 },
    { id: 'PAY005', employeeId: 'STF006', name: 'Nurse Sarah Wilson', role: 'Staff Nurse', baseSalary: 4800, bonus: 450, deductions: 380, netSalary: 4870 },
    { id: 'PAY006', employeeId: 'STF007', name: 'Nurse Emily Davis', role: 'Senior Nurse', baseSalary: 5200, bonus: 600, deductions: 420, netSalary: 5380 }
  ],
  management: [
    { id: 'PAY007', employeeId: 'CEO001', name: 'Dr. Sarah Johnson', role: 'CEO', baseSalary: 25000, bonus: 5000, deductions: 2500, netSalary: 27500 },
    { id: 'PAY008', employeeId: 'CFO001', name: 'Michael Chen', role: 'CFO', baseSalary: 20000, bonus: 4000, deductions: 2000, netSalary: 22000 },
    { id: 'PAY009', employeeId: 'HR001', name: 'Human Resources Manager', role: 'HR Manager', baseSalary: 12000, bonus: 1500, deductions: 1000, netSalary: 12500 }
  ],
  technicians: [
    { id: 'PAY010', employeeId: 'STF004', name: 'Tech Mike Brown', role: 'Radiology Tech', baseSalary: 4500, bonus: 300, deductions: 350, netSalary: 4450 },
    { id: 'PAY011', employeeId: 'STF005', name: 'Tech Anna Lee', role: 'Lab Technician', baseSalary: 4200, bonus: 250, deductions: 320, netSalary: 4130 },
    { id: 'PAY012', employeeId: 'STF008', name: 'Tech David Kim', role: 'X-Ray Technician', baseSalary: 4600, bonus: 350, deductions: 360, netSalary: 4590 }
  ],
  others: [
    { id: 'PAY013', employeeId: 'STF010', name: 'John Martinez', role: 'Security Guard', baseSalary: 3500, bonus: 200, deductions: 280, netSalary: 3420 },
    { id: 'PAY014', employeeId: 'STF011', name: 'Maria Santos', role: 'Janitor', baseSalary: 3200, bonus: 150, deductions: 250, netSalary: 3100 },
    { id: 'PAY015', employeeId: 'STF012', name: 'Robert Taylor', role: 'Receptionist', baseSalary: 3800, bonus: 250, deductions: 300, netSalary: 3750 }
  ]
};

const sampleBloodStock = [
  { type: 'A+', units: 45, donors: 12 },
  { type: 'A-', units: 18, donors: 5 },
  { type: 'B+', units: 32, donors: 8 },
  { type: 'B-', units: 12, donors: 3 },
  { type: 'AB+', units: 28, donors: 7 },
  { type: 'AB-', units: 8, donors: 2 },
  { type: 'O+', units: 55, donors: 15 },
  { type: 'O-', units: 22, donors: 6 }
];

const sampleOrgans = [
  { type: 'Kidney', available: 8, waitlist: 45 },
  { type: 'Liver', available: 3, waitlist: 28 },
  { type: 'Heart', available: 2, waitlist: 15 },
  { type: 'Lungs', available: 4, waitlist: 22 },
  { type: 'Cornea', available: 35, waitlist: 12 }
];



const sampleRecords = [
  { id: 'REC001', patientId: 'ADM001', name: 'John Smith', diagnosis: 'Hypertension', treatment: 'Medication', doctor: 'Dr. Amanda Foster', lastVisit: '2024-01-15' },
  { id: 'REC002', patientId: 'ADM002', name: 'Alice Brown', diagnosis: 'Migraine', treatment: 'Therapy', doctor: 'Dr. Lisa Park', lastVisit: '2024-01-14' },
  { id: 'REC003', patientId: 'ADM004', name: 'Eva Garcia', diagnosis: 'Flu', treatment: 'Rest & Medication', doctor: 'Dr. Rachel Green', lastVisit: '2024-01-15' }
];

// ============ UTILITY FUNCTIONS ============
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function generateId(prefix) {
  return prefix + Date.now().toString(36).toUpperCase();
}

function hasAccess(page) {
  if (!currentUser) return false;
  return currentUser.access.includes(page);
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'} text-white`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ============ API FUNCTIONS ============
async function loadPatientsData() {
  console.log('[loadPatientsData] Starting...');
  try {
    const response = await fetch('/api/patients');
    console.log('[loadPatientsData] Response received:', response.status);
    const data = await response.json();
    console.log('[loadPatientsData] Data parsed:', data);
    if (data.success) {
      patientsData = data.patients;
      console.log('[loadPatientsData] Loaded', patientsData.length, 'patients');
      console.log('[loadPatientsData] First patient:', patientsData[0]);
    } else {
      console.error('Failed to load patients:', data.message);
    }
  } catch (error) {
    console.error('Failed to load patients:', error);
    showToast('Unable to load patients data', 'error');
  }
}

// Load staff data from API
async function loadStaffData() {
  try {
    const response = await fetch('/api/staff');
    const data = await response.json();
    if (data.success) {
      staffData = data.staff;
    } else {
      console.error('Failed to load staff:', data.message);
    }
  } catch (error) {
    console.error('Failed to load staff:', error);
    showToast('Unable to load staff data', 'error');
  }
}

// Load staff summary from API
async function loadStaffSummary() {
  try {
    const response = await fetch('/api/staff/summary');
    const data = await response.json();
    return data.success ? data.summary : null;
  } catch (error) {
    console.error('Failed to load staff summary:', error);
    return null;
  }
}

// Load bed status from API
async function loadBedStatus() {
  try {
    const response = await fetch('/api/resources/beds');
    const data = await response.json();
    return data.success ? data.beds : [];
  } catch (error) {
    console.error('Failed to load bed status:', error);
    return [];
  }
}

// Load equipment data from API
async function loadEquipmentData() {
  try {
    const response = await fetch('/api/resources/equipment');
    const data = await response.json();
    if (data.success) {
      equipmentData = data.equipment;
    } else {
      console.error('Failed to load equipment:', data.message);
    }
  } catch (error) {
    console.error('Failed to load equipment:', error);
    showToast('Unable to load equipment data', 'error');
  }
}

// Update equipment status
async function updateEquipmentStatus(id, status) {
  try {
    const response = await fetch(`/api/resources/equipment/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (data.success) {
      showToast('Equipment status updated');
      return true;
    } else {
      showToast(data.message || 'Failed to update equipment', 'error');
      return false;
    }
  } catch (error) {
    console.error('Update equipment error:', error);
    showToast('Unable to connect to server', 'error');
    return false;
  }
}


// Update staff status
async function updateStaffStatus(id, status) {
  try {
    const response = await fetch(`/api/staff/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (data.success) {
      showToast('Staff status updated');
      return true;
    } else {
      showToast(data.message || 'Failed to update staff status', 'error');
      return false;
    }
  } catch (error) {
    console.error('Update staff error:', error);
    showToast('Unable to connect to server', 'error');
    return false;
  }
}

// ============ FINANCE API FUNCTIONS ============
// Load finance summary
async function loadFinanceSummary() {
  try {
    const response = await fetch('/api/finance/summary');
    const data = await response.json();
    if (data.success) {
      return data;
    }
    return null;
  } catch (error) {
    console.error('Load finance summary error:', error);
    return null;
  }
}

// Load transactions
async function loadTransactions(limit = 20) {
  try {
    const response = await fetch(`/api/finance/transactions?limit=${limit}`);
    const data = await response.json();
    if (data.success) {
      return data.transactions;
    }
    return [];
  } catch (error) {
    console.error('Load transactions error:', error);
    return [];
  }
}

// Load payroll data
async function loadPayroll(month, year) {
  try {
    const response = await fetch(`/api/finance/payroll?month=${month}&year=${year}`);
    const data = await response.json();
    if (data.success) {
      return data.payroll;
    }
    return { doctors: [], nurses: [], management: [], technicians: [], others: [] };
  } catch (error) {
    console.error('Load payroll error:', error);
    return { doctors: [], nurses: [], management: [], technicians: [], others: [] };
  }
}

// Load blood stock
async function loadBloodStock() {
  try {
    const response = await fetch('/api/inventory/blood');
    const data = await response.json();
    return data.success ? data.blood_stock : [];
  } catch (error) {
    console.error('Load blood stock error:', error);
    return [];
  }
}

// Load organ stock
async function loadOrganStock() {
  try {
    const response = await fetch('/api/inventory/organs');
    const data = await response.json();
    return data.success ? data.organ_stock : [];
  } catch (error) {
    console.error('Load organ stock error:', error);
    return [];
  }
}

// Load donors
async function loadDonors() {
  try {
    const response = await fetch('/api/inventory/donors');
    const data = await response.json();
    return data.success ? data.donors : [];
  } catch (error) {
    console.error('Load donors error:', error);
    return [];
  }
}

// Load medical records
async function loadMedicalRecords() {
  try {
    const response = await fetch('/api/records');
    const data = await response.json();
    return data.success ? data.records : [];
  } catch (error) {
    console.error('Load medical records error:', error);
    return [];
  }
}

// Load dashboard metrics
async function loadDashboardMetrics() {
  try {
    const response = await fetch('/api/dashboard/metrics');
    const data = await response.json();
    return data.success ? data.metrics : null;
  } catch (error) {
    console.error('Load dashboard metrics error:', error);
    return null;
  }
}


// ============ RENDER FUNCTIONS ============
function render() {
  const app = document.getElementById('app');
  if (!currentUser) {
    app.innerHTML = renderLoginPage();
    attachLoginEvents();
  } else {
    app.innerHTML = renderMainLayout();
    attachMainEvents();
    renderCurrentPage();
  }
}

function renderLoginPage() {
  return `
        <div class="h-full gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
          <div class="absolute inset-0 opacity-20">
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)"/>
            </svg>
          </div>
          
          <div class="absolute top-10 left-10 flex items-center space-x-4 animate-fade-in">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
              </svg>
            </div>
            <div>
              <h1 id="hospital-title" class="playfair text-3xl font-bold text-white">${config.hospital_name}</h1>
              <p id="hospital-mantra" class="text-blue-300 text-sm">${config.hospital_mantra}</p>
            </div>
          </div>

          <div class="glass rounded-2xl p-8 w-full max-w-md z-10 card-hover">
            <div id="login-form">
              <h2 class="text-2xl font-semibold text-center mb-6">Welcome Back</h2>
              <p class="text-gray-400 text-center mb-8">Sign in to access the Hospital Management System</p>
              
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-300 mb-2">Select Role</label>
                <select id="role-select" class="w-full px-4 py-3 rounded-lg input-field">
                  <option value="">-- Select Your Role --</option>
                  <option value="CEO001">CEO - Chief Executive Officer</option>
                  <option value="CFO001">CFO - Chief Financial Officer</option>
                  <option value="CNO001">CNO - Chief Nursing Officer</option>
                  <option value="CMO001">CMO - Chief Medical Officer</option>
                  <option value="MRM001">MRM - Medical Record Manager</option>
                  <option value="HR001">HR - Human Resources Manager</option>
                </select>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                <input type="text" id="user-id" class="w-full px-4 py-3 rounded-lg input-field" placeholder="Enter User ID" readonly>
              </div>

              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input type="password" id="password" class="w-full px-4 py-3 rounded-lg input-field" placeholder="Enter Password">
              </div>

              <button id="login-btn" class="w-full py-3 btn-primary rounded-lg font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30">
                Sign In
              </button>

              <button id="forgot-pwd-btn" class="w-full mt-4 py-2 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                Forgot Password / Reset Password
              </button>
            </div>

            <div id="reset-form" class="hidden">
              <h2 class="text-2xl font-semibold text-center mb-6">Reset Password</h2>
              <p class="text-gray-400 text-center mb-8">Enter your User ID to reset password</p>
              
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                <input type="text" id="reset-user-id" class="w-full px-4 py-3 rounded-lg input-field" placeholder="Enter User ID">
              </div>

              <div class="bg-slate-800 rounded-lg p-4 mb-6">
                <p class="text-sm text-gray-400">For demo purposes, passwords are:</p>
                <p class="text-sm text-blue-400 mt-2">Format: [role]@123 (e.g., ceo@123)</p>
              </div>

              <button id="back-to-login-btn" class="w-full py-3 border border-blue-500 text-blue-400 rounded-lg font-semibold hover:bg-blue-500/10 transition-all">
                Back to Login
              </button>
            </div>
          </div>

          <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
            <p class="text-gray-500 text-sm">   2024 ${config.hospital_name}. All rights reserved.</p>
          </div>
        </div>
      `;
}

function renderMainLayout() {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', page: 'dashboard' },
    { id: 'patients', icon: '🏥', label: 'Patient Flow', page: 'patients' },
    { id: 'staff', icon: '👥', label: 'Staff & Resources', page: 'staff' },
    { id: 'transactions', icon: '💰', label: 'Transactions', page: 'transactions' },
    { id: 'predictions', icon: '📈', label: 'Predictions', page: 'predictions' },
    { id: 'inventory', icon: '🩸', label: 'Blood & Organs', page: 'inventory' },
    { id: 'records', icon: '📋', label: 'Medical Records', page: 'records' }
  ];

  return `
        <div class="h-full flex">
          <!-- Sidebar -->
          <div class="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
            <div class="p-4 border-b border-slate-700">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                  </svg>
                </div>
                <div>
                  <h1 class="font-semibold text-white text-sm">${config.hospital_name}</h1>
                  <p class="text-xs text-gray-400">Management System</p>
                </div>
              </div>
            </div>

            <nav class="flex-1 p-4 overflow-y-auto">
              ${menuItems.map(item => `
                <button class="sidebar-item w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 text-left ${currentPage === item.page ? 'active' : ''} ${hasAccess(item.page) ? '' : 'opacity-40 cursor-not-allowed'}" 
                  data-page="${item.page}" ${hasAccess(item.page) ? '' : 'disabled'}>
                  <span class="text-xl">${item.icon}</span>
                  <span class="text-sm font-medium ${hasAccess(item.page) ? 'text-gray-200' : 'text-gray-500'}">${item.label}</span>
                  ${!hasAccess(item.page) ? '<span class="ml-auto text-xs text-red-400">🔒</span>' : ''}
                </button>
              `).join('')}
            </nav>

            <div class="p-4 border-t border-slate-700">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                  ${currentUser.name.charAt(0)}
                </div>
                <div>
                  <p class="text-sm font-medium text-white">${currentUser.name}</p>
                  <p class="text-xs text-gray-400">${currentUser.role}</p>
                </div>
              </div>
              <button id="logout-btn" class="w-full py-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                <span>    </span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <!-- Main Content -->
          <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 id="page-title" class="text-xl font-semibold text-white">Dashboard</h2>
                <p class="text-sm text-gray-400">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="relative">
                  <input type="text" id="global-search" placeholder="Search..." class="pl-10 pr-4 py-2 rounded-lg input-field w-64">
                  <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <button id="task-manager-btn" class="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors relative">
                  <span class="text-xl">📝</span>
                  <span id="task-count-badge" class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-xs flex items-center justify-center">${userTasks.length}</span>
                </button>
              </div>
            </header>

            <main id="main-content" class="flex-1 overflow-y-auto p-6 bg-slate-900">
              <!-- Content will be rendered here -->
            </main>
          </div>
        </div>
      `;
}

async function renderCurrentPage() {
  const content = document.getElementById('main-content');
  const title = document.getElementById('page-title');

  const pageTitles = {
    dashboard: 'Dashboard Overview',
    patients: 'Patient Flow Management',
    staff: 'Staff Allocation & Resources',
    transactions: 'Transaction & Payroll Management',
    predictions: 'Admission Prediction & Anomaly Detection',
    inventory: 'Organ & Blood Stock Management',
    records: 'Medical Records'
  };

  title.textContent = pageTitles[currentPage] || 'Dashboard';

  // Check permissions using the robust hasAccess function (matches sidebar logic)
  if (!hasAccess(currentPage)) {
    content.innerHTML = `
          <div class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="text-6xl mb-4">🔒</div>
              <h3 class="text-2xl font-semibold text-white mb-2">Access Denied</h3>
              <p class="text-gray-400">You don't have permission to view this page.</p>
              <p class="text-gray-500 text-sm mt-2">Contact your administrator for access.</p>
            </div>
          </div>
        `;
    return;
  }

  switch (currentPage) {
    case 'dashboard': await renderDashboard(content); break;
    case 'patients': await renderPatients(content); break;
    case 'staff': await renderStaff(content); break;
    case 'transactions': renderTransactions(content); break;
    case 'predictions': renderPredictions(content); break;
    case 'inventory': renderInventory(content); break;
    case 'records': renderRecords(content); break;
    default: await renderDashboard(content);
  }
}

async function renderDashboard(container) {
  console.log('[renderDashboard] Starting... patientsData length:', patientsData.length);
  // Load necessary data
  await loadPatientsData();
  console.log('[renderDashboard] After loadPatientsData, length:', patientsData.length);
  await loadStaffData();
  const bedStatus = await loadBedStatus();

  // Calculate metrics from real data
  const totalBeds = bedStatus.reduce((sum, b) => sum + Number(b.total_beds), 0) || 200;
  const occupiedBeds = bedStatus.reduce((sum, b) => sum + Number(b.occupied_beds), 0) || 156;
  const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) : 0;

  // Use sample data for financial metrics (can be replaced with API later)
  const totalRevenue = sampleTransactions.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0);
  const totalExpenses = Math.abs(sampleTransactions.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0));
  const profit = totalRevenue - totalExpenses;

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const criticalPatients = patientsData.filter(p => p.status === 'critical').length;

  // Use real ICU occupancy if available, else use defaults
  const icuData = bedStatus.find(b => b.ward_type === 'ICU');
  const icuOccupancy = icuData ? icuData.occupied_beds : 18;
  const icuTotal = icuData ? icuData.total_beds : 20;

  const emergencyWaiting = 7; // TODO: Connect to real API
  const surgeriesScheduled = 5; // TODO: Connect to real API
  const lowStockBlood = sampleBloodStock.filter(b => b.units < 25).length;

  // Count today's admissions
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAdmissions = patientsData.filter(p => p.admittedDate === todayStr).length;

  container.innerHTML = `
        <!-- Real-time Status Bar -->
        <div class="glass rounded-xl p-4 mb-6 flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="flex items-center space-x-2">
              <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span class="text-gray-400 text-sm">System Online</span>
            </div>
            <div class="text-gray-400 text-sm">🕐 ${currentTime}</div>
            <div class="text-gray-400 text-sm">📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="text-red-400 text-sm font-medium">🚨 ${criticalPatients} Critical Patients</div>
            <div class="text-yellow-400 text-sm font-medium">⚠️ ${lowStockBlood} Blood Low Stock</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <!-- Stat Cards -->
          <div class="glass rounded-xl p-6 card-hover">
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">🛏️</span>
              <span class="text-green-400 text-sm font-medium">+5.2%</span>
            </div>
            <h3 class="text-gray-400 text-sm">Bed Occupancy</h3>
            <p class="text-2xl font-bold text-white">${occupancyRate}%</p>
            <p class="text-xs text-gray-500 mt-1">${occupiedBeds}/${totalBeds} beds occupied</p>
          </div>

          <div class="glass rounded-xl p-6 card-hover">
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">👥</span>
              <span class="text-blue-400 text-sm font-medium">Today</span>
            </div>
            <h3 class="text-gray-400 text-sm">Patient Admissions</h3>
            <p class="text-2xl font-bold text-white">${todayAdmissions}</p>
            <p class="text-xs text-gray-500 mt-1">${patientsData.filter(p => p.status === 'critical').length} critical, ${patientsData.filter(p => p.status === 'admitted').length} stable</p>
            <p class="text-xs text-gray-500 mt-1">3 critical, 2 stable</p>
          </div>

          <div class="glass rounded-xl p-6 card-hover">
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">👨‍⚕️</span>
              <span class="text-purple-400 text-sm font-medium">Active</span>
            </div>
            <h3 class="text-gray-400 text-sm">Staff on Duty</h3>
            <p class="text-2xl font-bold text-white">${staffData.filter(s => s.status === 'Present').length}</p>
            <p class="text-xs text-gray-500 mt-1">Ratio: 1:4 (Staff:Patient)</p>
          </div>

          <div class="glass rounded-xl p-6 card-hover">
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">💰</span>
              <span class="${profit >= 0 ? 'text-green-400' : 'text-red-400'} text-sm font-medium">${profit >= 0 ? '+' : ''}</span>
            </div>
            <h3 class="text-gray-400 text-sm">Daily P&L</h3>
            <p class="text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}">${formatCurrency(profit)}</p>
            <p class="text-xs text-gray-500 mt-1">Revenue: ${formatCurrency(totalRevenue)}</p>
          </div>
        </div>

        <!-- Additional Real-time Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div class="glass rounded-xl p-6 card-hover">
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">🚑</span>
              <span class="text-red-400 text-sm font-medium pulse-alert">Live</span>
            </div>
            <h3 class="text-gray-400 text-sm">Emergency Waiting</h3>
            <p class="text-2xl font-bold text-white">${emergencyWaiting}</p>
            <p class="text-xs text-gray-500 mt-1">Average wait: 12 mins</p>
          </div>

          <div class="glass rounded-xl p-6 card-hover">
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">  </span>
              <span class="${icuOccupancy >= 18 ? 'text-red-400' : 'text-green-400'} text-sm font-medium">${Math.round((icuOccupancy / icuTotal) * 100)}%</span>
            </div>
            <h3 class="text-gray-400 text-sm">ICU Occupancy</h3>
            <p class="text-2xl font-bold text-white">${icuOccupancy}/${icuTotal}</p>
            <p class="text-xs text-gray-500 mt-1">${icuTotal - icuOccupancy} beds available</p>
          </div>

          <div class="glass rounded-xl p-6 card-hover">
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">⚕️</span>
              <span class="text-blue-400 text-sm font-medium">Today</span>
            </div>
            <h3 class="text-gray-400 text-sm">Surgeries Scheduled</h3>
            <p class="text-2xl font-bold text-white">${surgeriesScheduled}</p>
            <p class="text-xs text-gray-500 mt-1">3 completed, 2 ongoing</p>
          </div>

          <div class="glass rounded-xl p-6 card-hover">
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl">🩸</span>
              <span class="${lowStockBlood > 2 ? 'text-red-400' : 'text-green-400'} text-sm font-medium">${lowStockBlood > 0 ? 'Alert' : 'Good'}</span>
            </div>
            <h3 class="text-gray-400 text-sm">Blood Stock Status</h3>
            <p class="text-2xl font-bold ${lowStockBlood > 2 ? 'text-red-400' : 'text-white'}">${lowStockBlood}</p>
            <p class="text-xs text-gray-500 mt-1">Blood types low on stock</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Patient Flow Chart -->
          <div class="glass rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Patient Flow (Last 7 Days)</h3>
            <div id="patient-flow-chart" class="chart-container"></div>
          </div>

          <!-- Department Heatmap -->
          <div class="glass rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Department Occupancy Heatmap</h3>
            <div id="department-heatmap" class="chart-container"></div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Specialization Chart -->
          <div class="glass rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Visits by Specialization</h3>
            <div id="specialization-chart" class="chart-container"></div>
          </div>

          <!-- Recent Admissions -->
          <div class="glass rounded-xl p-6 lg:col-span-2">
            <h3 class="text-lg font-semibold text-white mb-4">Recent Admissions</h3>
            <div class="table-container">
              <table class="w-full">
                <thead class="sticky top-0 bg-slate-800">
                  <tr class="text-left text-gray-400 text-sm">
                    <th class="pb-3 pr-4">Patient</th>
                    <th class="pb-3 pr-4">Department</th>
                    <th class="pb-3 pr-4">Status</th>
                    <th class="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody id="recent-admissions-tbody">
                  <tr><td colspan="4" class="py-3 text-center text-gray-400">Loading...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

  console.log('[renderDashboard] HTML set, patientsData length:', patientsData.length);
  console.log('[renderDashboard] First 3 patients:', patientsData.slice(0, 3));

  // Render charts
  setTimeout(() => {
    // Patient Flow Chart
    Plotly.newPlot('patient-flow-chart', [{
      x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      y: [45, 52, 38, 61, 48, 35, 42],
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Admissions',
      line: { color: '#3b82f6', width: 3 },
      marker: { size: 8 }
    }, {
      x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      y: [38, 44, 35, 55, 42, 30, 38],
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Discharges',
      line: { color: '#22c55e', width: 3 },
      marker: { size: 8 }
    }], {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#94a3b8' },
      margin: { l: 40, r: 20, t: 20, b: 40 },
      legend: { orientation: 'h', y: -0.2 },
      xaxis: { gridcolor: '#334155' },
      yaxis: { gridcolor: '#334155' }
    }, { responsive: true });

    // Department Heatmap
    Plotly.newPlot('department-heatmap', [{
      z: [[85, 72, 91], [68, 95, 78], [92, 88, 65], [75, 82, 90]],
      x: ['Morning', 'Afternoon', 'Night'],
      y: ['ICU', 'Emergency', 'General', 'Pediatrics'],
      type: 'heatmap',
      colorscale: [[0, '#1e3a5f'], [0.5, '#3b82f6'], [1, '#ef4444']],
      showscale: true
    }], {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#94a3b8' },
      margin: { l: 80, r: 20, t: 20, b: 40 }
    }, { responsive: true });

    // Specialization Chart
    Plotly.newPlot('specialization-chart', [{
      values: [35, 25, 20, 12, 8],
      labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Others'],
      type: 'pie',
      hole: 0.5,
      marker: {
        colors: ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#64748b']
      },
      textinfo: 'label+percent',
      textposition: 'outside'
    }], {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#94a3b8' },
      margin: { l: 20, r: 20, t: 20, b: 20 },
      showlegend: false
    }, { responsive: true });
  }, 100);

  // Populate Recent Admissions table after data is loaded
  setTimeout(async () => {
    const tbody = document.getElementById('recent-admissions-tbody');
    // Force fresh fetch to avoid any state issues
    try {
      const debugRes = await fetch('/api/patients?t=' + Date.now());
      const debugData = await debugRes.json();
      const freshPatients = debugData.patients || [];

      if (tbody && freshPatients.length > 0) {
        tbody.innerHTML = freshPatients.slice(0, 5).map(p => {
          // Debugging logic: Try multiple keys
          const dateVal = p.admittedDate || p.admitted_date || p.date || p.admission_date;
          let dateDisplay = formatDate(dateVal);

          // If still N/A, show the raw value and keys for debugging
          if (dateDisplay === 'N/A') {
            dateDisplay = `<span class="text-xs text-red-500">RAW: ${JSON.stringify(dateVal)} KEYS: ${Object.keys(p).join(',').substring(0, 20)}...</span>`;
          }

          return `
            <tr class="border-t border-slate-700">
              <td class="py-3 pr-4">
                <p class="text-white font-medium">${p.name}</p>
                <p class="text-xs text-gray-400">${p.id}</p>
              </td>
              <td class="py-3 pr-4 text-gray-300">${p.department}</td>
              <td class="py-3 pr-4">
                <span class="${p.status === 'critical' ? 'text-red-400 bg-red-400/10' : p.status === 'discharged' ? 'text-green-400 bg-green-400/10' : p.status === 'transferred' ? 'text-yellow-400 bg-yellow-400/10' : 'text-blue-400 bg-blue-400/10'} px-2 py-1 rounded text-xs font-medium uppercase tracking-wide">${p.status}</span>
              </td>
              <td class="py-3 text-gray-400">${dateDisplay}</td>
            </tr>
          `;
        }).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4">No data found in fresh fetch</td></tr>';
      }
    } catch (e) {
      console.error("Debug fetch failed", e);
      tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">Error: ${e.message}</td></tr>`;
    }
  }, 200);
}

// Helper function to render patient table rows
function renderPatientTable(patients) {
  const tableBody = document.getElementById('patient-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = patients.map((p, index) => `
    <tr class="border-b border-slate-700 hover:bg-slate-800/50 transition-colors" 
        data-patient-name="${p.name.toLowerCase()}" 
        data-patient-id="${p.id}" 
        data-aadhar="${p.aadhar}">
      <td class="py-3 pr-4 text-gray-400">${index + 1}</td>
      <td class="py-3 pr-4 text-blue-400 font-medium">${p.id}</td>
      <td class="py-3 pr-4 text-purple-400">${p.opd}</td>
      <td class="py-3 pr-4 text-white font-medium">${p.name}</td>
      <td class="py-3 pr-4 text-gray-300">${p.aadhar}</td>
      <td class="py-3 pr-4">
        <span class="px-3 py-1 rounded-full text-sm font-medium" style="background: ${p.bloodGroup.includes('+') ? '#22c55e20' : '#ef444420'}; color: ${p.bloodGroup.includes('+') ? '#22c55e' : '#ef4444'}">${p.bloodGroup}</span>
      </td>
      <td class="py-3 pr-4 text-gray-300">${p.department}</td>
      <td class="py-3 pr-4 text-blue-300">${p.doctor}</td>
      <td class="py-3 pr-4 text-purple-300">${p.nurse}</td>
      <td class="py-3 pr-4 text-gray-300">${formatDate(p.admittedDate)}</td>
      <td class="py-3 pr-4">
        <input type="date" value="${p.transferredDate || ''}" 
          class="px-2 py-1 rounded bg-slate-700 text-yellow-400 text-sm border border-slate-600 patient-date-input" 
          data-patient-id="${p.id}" data-date-type="transferred"
          placeholder="Set date">
      </td>
      <td class="py-3">
        <input type="date" value="${p.dischargedDate || ''}" 
          class="px-2 py-1 rounded bg-slate-700 text-green-400 text-sm border border-slate-600 patient-date-input" 
          data-patient-id="${p.id}" data-date-type="discharged"
          placeholder="Set date">
      </td>
    </tr>
  `).join('');
}

async function renderPatients(container) {


  await loadPatientsData(); // Load fresh data from API

  container.innerHTML = `
        <div class="glass rounded-xl p-6 mb-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-white">Patient Flow Management</h3>
            <div class="flex items-center space-x-4">
              <input type="date" id="patient-date-filter" class="px-4 py-2 rounded-lg input-field">
              <input type="text" id="patient-search" placeholder="Search patients..." class="px-4 py-2 rounded-lg input-field w-64">
              <button id="add-patient-btn" class="px-4 py-2 btn-primary rounded-lg font-medium flex items-center space-x-2">
                <span>➕</span>
                <span>Add Patient</span>
              </button>
            </div>
          </div>

          <div class="table-container">
            <table class="w-full">
              <thead class="sticky top-0 bg-slate-800">
                <tr class="text-left text-gray-400 text-sm border-b border-slate-700">
                  <th class="pb-3 pr-4">#</th>
                  <th class="pb-3 pr-4">Admission ID</th>
                  <th class="pb-3 pr-4">OPD ID</th>
                  <th class="pb-3 pr-4">Patient Name</th>
                  <th class="pb-3 pr-4">Aadhar Number</th>
                  <th class="pb-3 pr-4">Blood Group</th>
                  <th class="pb-3 pr-4">Department</th>
                  <th class="pb-3 pr-4">Doctor</th>
                  <th class="pb-3 pr-4">Nurse</th>
                  <th class="pb-3 pr-4">Status</th>
                  <th class="pb-3 pr-4">Admitted Date</th>
                  <th class="pb-3 pr-4">Transferred Date</th>
                  <th class="pb-3">Discharged Date</th>
                </tr>
              </thead>
              <tbody id="patient-table-body">
                ${patientsData.map((p, i) => `
                  <tr class="border-t border-slate-700 hover:bg-slate-800/50 transition-colors" data-patient-id="${p.id}" data-patient-name="${p.name.toLowerCase()}" data-aadhar="${p.aadhar}">
                    <td class="py-3 pr-4 text-gray-400">${i + 1}</td>
                    <td class="py-3 pr-4 text-blue-400 font-mono">${p.id}</td>
                    <td class="py-3 pr-4 text-gray-300 font-mono">${p.opd}</td>
                    <td class="py-3 pr-4 text-white font-medium">${p.name}</td>
                    <td class="py-3 pr-4 text-gray-300 font-mono">${p.aadhar}</td>
                    <td class="py-3 pr-4">
                      <span class="px-3 py-1 rounded-full text-sm font-medium" style="background: ${p.bloodGroup.includes('+') ? '#22c55e20' : '#ef444420'}; color: ${p.bloodGroup.includes('+') ? '#22c55e' : '#ef4444'}">${p.bloodGroup}</span>
                    </td>
                    <td class="py-3 pr-4 text-gray-300">${p.department}</td>
                    <td class="py-3 pr-4 text-blue-300">${p.doctor}</td>
                    <td class="py-3 pr-4 text-purple-300">${p.nurse}</td>
                    <td class="py-3 pr-4">
                      <select class="patient-status-select px-3 py-1 rounded-lg bg-slate-700 text-sm border-none ${p.status === 'critical' ? 'text-red-400' : p.status === 'discharged' ? 'text-green-400' : p.status === 'transferred' ? 'text-yellow-400' : 'text-blue-400'}" data-patient-id="${p.id}">
                        <option value="admitted" ${p.status === 'admitted' ? 'selected' : ''} class="text-blue-400">Admitted</option>
                        <option value="critical" ${p.status === 'critical' ? 'selected' : ''} class="text-red-400">Critical</option>
                        <option value="transferred" ${p.status === 'transferred' ? 'selected' : ''} class="text-yellow-400">Transferred</option>
                        <option value="discharged" ${p.status === 'discharged' ? 'selected' : ''} class="text-green-400">Discharged</option>
                      </select>
                    </td>
                    <td class="py-3 pr-4 text-gray-300">${formatDate(p.admittedDate)}</td>
                    <td class="py-3 pr-4">
                      <input type="date" value="${p.transferredDate || ''}" 
                        class="px-2 py-1 rounded bg-slate-700 text-yellow-400 text-sm border border-slate-600 patient-date-input" 
                        data-patient-id="${p.id}" data-date-type="transferred"
                        placeholder="Set date">
                    </td>
                    <td class="py-3">
                      <input type="date" value="${p.dischargedDate || ''}" 
                        class="px-2 py-1 rounded bg-slate-700 text-green-400 text-sm border border-slate-600 patient-date-input" 
                        data-patient-id="${p.id}" data-date-type="discharged"
                        placeholder="Set date">
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Add Patient Modal -->
        <div id="add-patient-modal" class="fixed inset-0 modal-overlay z-50 flex items-center justify-center hidden">
          <div class="glass rounded-xl p-6 w-full max-w-lg mx-4">
            <h3 class="text-xl font-semibold text-white mb-6">Add New Patient</h3>
            <form id="add-patient-form" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Patient Name</label>
                  <input type="text" name="name" class="w-full px-4 py-2 rounded-lg input-field" required>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Aadhar Number</label>
                  <input type="text" name="aadhar" placeholder="XXXX-XXXX-XXXX" class="w-full px-4 py-2 rounded-lg input-field" required>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Blood Group</label>
                  <select name="bloodGroup" class="w-full px-4 py-2 rounded-lg input-field" required>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Department</label>
                  <select name="department" class="w-full px-4 py-2 rounded-lg input-field" required>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="ICU">ICU</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Caretaker Name</label>
                  <input type="text" name="caretaker" class="w-full px-4 py-2 rounded-lg input-field" required>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Phone Number</label>
                  <input type="tel" name="phone" class="w-full px-4 py-2 rounded-lg input-field" required>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm text-gray-400 mb-2">Status</label>
                    <select name="status" class="w-full px-4 py-2 rounded-lg input-field">
                        <option value="admitted">Admitted</option>
                        <option value="critical">Critical</option>
                        <option value="transferred">Transferred</option>
                        <option value="discharged">Discharged</option>
                    </select>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Assigned Doctor</label>
                  <input type="text" name="doctor" placeholder="Dr. Name" class="w-full px-4 py-2 rounded-lg input-field" required>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Assigned Nurse</label>
                  <input type="text" name="nurse" placeholder="Nurse Name" class="w-full px-4 py-2 rounded-lg input-field" required>
                </div>
              </div>
              <div class="flex justify-end space-x-4 mt-6">
                <button type="button" id="cancel-add-patient" class="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors">Cancel</button>
                <button type="submit" class="px-4 py-2 btn-primary rounded-lg font-medium">Add Patient</button>
              </div>
            </form>
          </div>
        </div>
      `;

  // Add patient modal events
  document.getElementById('add-patient-btn')?.addEventListener('click', () => {
    document.getElementById('add-patient-modal').classList.remove('hidden');
  });

  document.getElementById('cancel-add-patient')?.addEventListener('click', () => {
    document.getElementById('add-patient-modal').classList.add('hidden');
  });

  document.getElementById('add-patient-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPatient = {
      id: generateId('ADM'),
      opd: generateId('OPD'),
      name: formData.get('name'),
      aadhar: formData.get('aadhar') || generateId('AADH'),
      bloodGroup: formData.get('bloodGroup'),
      caretaker: formData.get('caretaker'),
      phone: formData.get('phone'),
      department: formData.get('department'),
      doctor: formData.get('doctor'),
      nurse: formData.get('nurse'),
      doctor: formData.get('doctor'),
      nurse: formData.get('nurse'),
      status: formData.get('status') || 'admitted',
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
        e.target.reset(); // Clear form
      } else {
        showToast(data.message || 'Failed to add patient', 'error');
      }
    } catch (error) {
      console.error('Add patient error:', error);
      showToast('Unable to connect to server', 'error');
    }
  });

  // Patient search functionality
  document.getElementById('patient-search')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll('#patient-table-body tr');

    rows.forEach(row => {
      const patientName = row.getAttribute('data-patient-name') || '';
      const patientId = row.getAttribute('data-patient-id') || '';
      const aadhar = row.getAttribute('data-aadhar') || '';

      const matches = patientName.includes(searchTerm) ||
        patientId.toLowerCase().includes(searchTerm) ||
        aadhar.includes(searchTerm);

      row.style.display = matches ? '' : 'none';
    });
  });

  // Date filter functionality (frontend filtering)
  const dateFilterInput = document.getElementById('patient-date-filter');
  if (dateFilterInput) {
    dateFilterInput.addEventListener('change', (e) => {
      const selectedDate = e.target.value;
      const tableBody = document.getElementById('patient-table-body');

      if (selectedDate) {
        // Filter patients by selected date
        const filteredPatients = patientsData.filter(p => p.admittedDate === selectedDate);

        if (filteredPatients.length === 0) {
          // Show "no patients" message
          tableBody.innerHTML = `
            <tr>
              <td colspan="13" class="text-center py-8 text-gray-400">
                <div class="flex flex-col items-center space-y-2">
                  <span class="text-2xl">📅</span>
                  <span>No admissions on ${selectedDate}</span>
                </div>
              </td>
            </tr>
          `;
        } else {
          // Render filtered patients
          renderPatientTable(filteredPatients);
        }
      } else {
        // Show all patients when date is cleared
        renderPatientTable(patientsData);
      }
    });
  }

  // Patient date update functionality
  document.querySelectorAll('.patient-date-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const patientId = e.target.dataset.patientId;
      const dateType = e.target.dataset.dateType;
      const newDate = e.target.value;

      const patient = patientsData.find(p => p.id === patientId);
      if (patient) {
        if (dateType === 'transferred') {
          patient.transferredDate = newDate || null;
          patient.status = newDate ? 'transferred' : patient.status;
          showToast(`Transfer date ${newDate ? 'updated' : 'cleared'} for ${patient.name}`);
        } else if (dateType === 'discharged') {
          patient.dischargedDate = newDate || null;
          patient.status = newDate ? 'discharged' : patient.status;
          showToast(`Discharge date ${newDate ? 'updated' : 'cleared'} for ${patient.name}`);
        }
      }
    });
  });

  // Patient status change functionality (NEW)
  document.querySelectorAll('.patient-status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const patientId = e.target.dataset.patientId;
      const newStatus = e.target.value;
      const oldStatus = patientsData.find(p => p.id === patientId)?.status;

      // Update styling immediately
      e.target.className = `patient-status-select px-3 py-1 rounded-lg bg-slate-700 text-sm border-none ${newStatus === 'critical' ? 'text-red-400' : newStatus === 'discharged' ? 'text-green-400' : newStatus === 'transferred' ? 'text-yellow-400' : 'text-blue-400'}`;

      try {
        const response = await fetch(`/api/patients/${patientId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: newStatus
          })
        });

        const data = await response.json();

        if (data.success) {
          showToast(`Status updated to ${newStatus}`);
          // Update local data
          const patient = patientsData.find(p => p.id === patientId);
          if (patient) {
            patient.status = newStatus;
          }
        } else {
          showToast(data.message || 'Failed to update status', 'error');
          // Revert styling
          e.target.value = oldStatus;
          e.target.className = `patient-status-select px-3 py-1 rounded-lg bg-slate-700 text-sm border-none ${oldStatus === 'critical' ? 'text-red-400' : oldStatus === 'discharged' ? 'text-green-400' : oldStatus === 'transferred' ? 'text-yellow-400' : 'text-blue-400'}`;
        }
      } catch (error) {
        console.error('Update status error:', error);
        showToast('Unable to connect to server', 'error');
        // Revert styling
        e.target.value = oldStatus;
        e.target.className = `patient-status-select px-3 py-1 rounded-lg bg-slate-700 text-sm border-none ${oldStatus === 'critical' ? 'text-red-400' : oldStatus === 'discharged' ? 'text-green-400' : oldStatus === 'transferred' ? 'text-yellow-400' : 'text-blue-400'}`;
      }
    });
  });
}

async function renderStaff(container) {

  // Load all data from APIs
  await loadStaffData();
  await loadEquipmentData();
  const staffSummary = await loadStaffSummary();
  const bedStatus = await loadBedStatus();

  // Calculate bed percentages
  const bedData = {};
  bedStatus.forEach(bed => {
    const percentage = bed.total_beds > 0 ? (bed.occupied_beds / bed.total_beds * 100).toFixed(1) : 0;
    bedData[bed.ward_type] = {
      occupied: bed.occupied_beds,
      total: bed.total_beds,
      percentage: percentage
    };
  });

  container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">Bed Status</h3>
              <span class="text-2xl">🛏️</span>
            </div>
            <div class="space-y-3">
              ${bedStatus.map(bed => {
    const percentage = bed.total_beds > 0 ? (bed.occupied_beds / bed.total_beds * 100) : 0;
    const colorClass = percentage > 85 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : percentage > 50 ? 'bg-blue-500' : 'bg-green-500';
    return `
                  <div class="flex justify-between items-center">
                    <span class="text-gray-400">${bed.ward_type}</span>
                    <span class="text-white font-medium">${bed.occupied_beds}/${bed.total_beds}</span>
                  </div>
                  <div class="w-full bg-slate-700 rounded-full h-2">
                    <div class="${colorClass} h-2 rounded-full" style="width: ${percentage}%"></div>
                  </div>
                `;
  }).join('')}
            </div>
          </div>

          <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">Staff on Duty</h3>
              <span class="text-2xl">👨‍⚕️</span>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-400">Doctors</span>
                <span class="text-white font-medium">${staffSummary ? staffSummary.doctors : 0}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-400">Nurses</span>
                <span class="text-white font-medium">${staffSummary ? staffSummary.nurses : 0}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-400">Technicians</span>
                <span class="text-white font-medium">${staffSummary ? staffSummary.technicians : 0}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-400">Support Staff</span>
                <span class="text-white font-medium">${staffSummary ? staffSummary.support : 0}</span>
              </div>
            </div>
          </div>

          <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">Equipment Status</h3>
              <span class="text-2xl">🔧</span>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-green-400">✓ In Use</span>
                <span class="text-white font-medium">${equipmentData.filter(e => e.status === 'In Use').length}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-yellow-400">⚠ Under Repair</span>
                <span class="text-white font-medium">${equipmentData.filter(e => e.status === 'Under Repair').length}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-red-400">🛒 To Purchase</span>
                <span class="text-white font-medium">${equipmentData.filter(e => e.status === 'To Purchase').length}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Staff Table -->
          <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">Staff Allocation</h3>
              <button id="add-staff-btn" class="px-3 py-1 btn-primary rounded-lg text-sm">+ Hire Staff</button>
            </div>
            <div class="table-container">
              <table class="w-full">
                <thead class="sticky top-0 bg-slate-800">
                  <tr class="text-left text-gray-400 text-sm">
                    <th class="pb-3 pr-4">ID</th>
                    <th class="pb-3 pr-4">Name</th>
                    <th class="pb-3 pr-4">Department</th>
                    <th class="pb-3 pr-4">Shift</th>
                    <th class="pb-3 pr-4">Status</th>
                    <th class="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffData.map(s => `
                    <tr class="border-t border-slate-700">
                      <td class="py-3 pr-4 text-blue-400 font-mono">${s.id}</td>
                      <td class="py-3 pr-4 text-white">${s.name}</td>
                      <td class="py-3 pr-4 text-gray-300">${s.department}</td>
                      <td class="py-3 pr-4 text-gray-300">${s.shift}</td>
                      </td>
                      <td class="py-3 pr-4">
                        <select class="staff-status-select px-3 py-1 rounded-lg bg-slate-700 text-sm border-none ${s.status === 'Present' ? 'text-green-400' : 'text-yellow-400'}" data-id="${s.id}">
                          <option value="Present" ${s.status === 'Present' ? 'selected' : ''} class="text-green-400">Present</option>
                          <option value="Leave" ${s.status === 'Leave' ? 'selected' : ''} class="text-yellow-400">Leave</option>
                        </select>
                      </td>
                      <td class="py-3">
                        <button class="delete-staff-btn text-red-400 hover:text-red-300 transition-colors" data-id="${s.id}" title="Delete Staff">🗑️</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Equipment Table -->
          <div class="glass rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">Equipment Monitoring</h3>
            <div class="table-container">
              <table class="w-full">
                <thead class="sticky top-0 bg-slate-800">
                  <tr class="text-left text-gray-400 text-sm">
                    <th class="pb-3 pr-4">Equipment</th>
                    <th class="pb-3 pr-4">Department</th>
                    <th class="pb-3 pr-4">Status</th>
                    <th class="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${equipmentData.map(e => `
                    <tr class="border-t border-slate-700">
                      <td class="py-3 pr-4 text-white">${e.name}</td>
                      <td class="py-3 pr-4 text-gray-300">${e.department}</td>
                      <td class="py-3 pr-4">
                        <select class="equipment-status-select px-3 py-1 rounded-lg bg-slate-700 text-sm border-none" data-id="${e.id}">
                          <option value="In Use" ${e.status === 'In Use' ? 'selected' : ''}>In Use</option>
                          <option value="Under Repair" ${e.status === 'Under Repair' ? 'selected' : ''}>Under Repair</option>
                          <option value="To Purchase" ${e.status === 'To Purchase' ? 'selected' : ''}>To Purchase</option>
                        </select>
                      </td>
                      <td class="py-3">
                        <button class="p-2 hover:bg-slate-700 rounded-lg transition-colors">✏️</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>

        <!-- Add Staff Modal -->
        <div id="add-staff-modal" class="fixed inset-0 z-50 hidden">
           <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
           <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
             <div class="glass rounded-xl p-6 border border-slate-700 shadow-xl">
               <h3 class="text-xl font-bold text-white mb-4">Hire New Staff</h3>
               <form id="add-staff-form" class="space-y-4">
                 <input type="text" id="staff-name" placeholder="Full Name" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                 <select id="staff-dept" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                   <option value="">Select Department</option>
                   <option value="Cardiology">Cardiology</option>
                   <option value="Neurology">Neurology</option>
                   <option value="Surgery">Surgery</option>
                   <option value="Pediatrics">Pediatrics</option>
                   <option value="General">General</option>
                 </select>
                 <select id="staff-role" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                   <option value="Doctor">Doctor</option>
                   <option value="Nurse">Nurse</option>
                   <option value="Technician">Technician</option>
                   <option value="Support">Support</option>
                 </select>
                 <select id="staff-shift" class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                   <option value="Day">Day Shift</option>
                   <option value="Night">Night Shift</option>
                 </select>
                 <div class="flex justify-end space-x-3 mt-6">
                   <button type="button" id="cancel-staff-btn" class="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                   <button type="submit" class="px-4 py-2 btn-primary rounded-lg text-white font-medium">Hire</button>
                 </div>
               </form>
             </div>
           </div>
        </div>
      `;

  // Add Staff Modal Logic
  document.getElementById('add-staff-btn')?.addEventListener('click', () => {
    document.getElementById('add-staff-modal').classList.remove('hidden');
  });
  document.getElementById('cancel-staff-btn')?.addEventListener('click', () => {
    document.getElementById('add-staff-modal').classList.add('hidden');
  });
  document.getElementById('add-staff-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('staff-name').value,
      department: document.getElementById('staff-dept').value,
      role: document.getElementById('staff-role').value,
      shift: document.getElementById('staff-shift').value
    };
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        showToast('Staff hired successfully');
        document.getElementById('add-staff-modal').classList.add('hidden');
        renderStaff(container);
      } else {
        showToast('Failed to hire staff', 'error');
      }
    } catch (err) { console.error(err); }
  });

  // Delete Staff Logic
  document.querySelectorAll('.delete-staff-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      if (!confirm('Are you sure you want to terminate this employee?')) return;
      const id = e.target.closest('button').dataset.id;
      try {
        const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
        if (res.ok) {
          showToast('Staff terminated');
          renderStaff(container);
        }
      } catch (err) { console.error(err); }
    });
  });

  // Add staff status change handler
  document.querySelectorAll('.staff-status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const staffId = e.target.dataset.id;
      const newStatus = e.target.value;
      const oldStatus = staffData.find(s => s.id === staffId)?.status;

      // Update styling immediately
      e.target.className = `staff-status-select px-3 py-1 rounded-lg bg-slate-700 text-sm border-none ${newStatus === 'Present' ? 'text-green-400' : 'text-yellow-400'}`;

      // Update via API
      const success = await updateStaffStatus(staffId, newStatus);

      if (success) {
        // Update local data
        const staff = staffData.find(s => s.id === staffId);
        if (staff) {
          staff.status = newStatus;
        }
        // Re-render to update counts "Staff on Duty"
        await renderStaff(container);
      } else {
        // Revert dropdown and styling on failure
        e.target.value = oldStatus;
        e.target.className = `staff-status-select px-3 py-1 rounded-lg bg-slate-700 text-sm border-none ${oldStatus === 'Present' ? 'text-green-400' : 'text-yellow-400'}`;
      }
    });
  });

  // Add equipment status change handler
  document.querySelectorAll('.equipment-status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const equipmentId = e.target.dataset.id;
      const newStatus = e.target.value;
      const oldStatus = equipmentData.find(eq => eq.id === equipmentId)?.status;

      // Update via API
      const success = await updateEquipmentStatus(equipmentId, newStatus);

      if (success) {
        // Update local data
        const equipment = equipmentData.find(eq => eq.id === equipmentId);
        if (equipment) {
          equipment.status = newStatus;
        }
        // Re-render to update counts
        await renderStaff(container);
      } else {
        // Revert dropdown on failure
        e.target.value = oldStatus;
      }
    });
  });
}

async function renderTransactions(container) {
  // Show loading state
  container.innerHTML = `
    <div class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading financial data...</p>
      </div>
    </div>
  `;

  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Load data from APIs
  const [summary, transactions, payroll] = await Promise.all([
    loadFinanceSummary(),
    loadTransactions(20),
    loadPayroll(currentMonth, currentYear)
  ]);

  // Use API data or fallback to defaults
  const totalRevenue = summary ? summary.total_revenue : 0;
  const totalExpenses = summary ? summary.total_expenses : 0;
  const netProfit = summary ? summary.net_profit : 0;

  container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="glass rounded-xl p-6">
            <h3 class="text-gray-400 text-sm mb-2">Total Revenue</h3>
            <p class="text-2xl font-bold text-green-400">${formatCurrency(totalRevenue)}</p>
          </div>
          <div class="glass rounded-xl p-6">
            <h3 class="text-gray-400 text-sm mb-2">Total Expenses</h3>
            <p class="text-2xl font-bold text-red-400">${formatCurrency(totalExpenses)}</p>
          </div>
          <div class="glass rounded-xl p-6">
            <h3 class="text-gray-400 text-sm mb-2">Net Profit/Loss</h3>
            <p class="text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}">${formatCurrency(netProfit)}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Transactions -->
          <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">Recent Transactions</h3>
              <button id="add-transaction-btn" class="px-4 py-2 btn-primary rounded-lg text-sm font-medium">+ Add Transaction</button>
            </div>
            <div class="table-container">
              <table class="w-full">
                <thead class="sticky top-0 bg-slate-800">
                  <tr class="text-left text-gray-400 text-sm">
                    <th class="pb-3 pr-4">Date</th>
                    <th class="pb-3 pr-4">Type</th>
                    <th class="pb-3 pr-4">Description</th>
                    <th class="pb-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${transactions.map(t => `
                    <tr class="border-t border-slate-700">
                      <td class="py-3 pr-4 text-gray-300">${formatDate(t.date)}</td>
                      <td class="py-3 pr-4">
                        <span class="px-3 py-1 rounded-full text-xs ${t.type === 'Revenue' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">${t.type}</span>
                      </td>
                      <td class="py-3 pr-4 text-white">${t.description}</td>
                      <td class="py-3 font-medium ${parseFloat(t.amount) >= 0 ? 'text-green-400' : 'text-red-400'}">${formatCurrency(Math.abs(parseFloat(t.amount)))}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payroll -->
          <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">Payroll Management</h3>
              <button id="process-payroll-btn" class="px-4 py-2 btn-primary rounded-lg text-sm font-medium">Process Payroll</button>
            </div>
            
            <!-- Doctors -->
            <div class="mb-6">
              <h4 class="text-md font-semibold text-blue-400 mb-3 flex items-center space-x-2">
                <span>👨‍⚕️</span>
                <span>Doctors</span>
              </h4>
              <div class="table-container">
                <table class="w-full">
                  <thead class="sticky top-0 bg-slate-800">
                    <tr class="text-left text-gray-400 text-sm">
                      <th class="pb-3 pr-4">Employee</th>
                      <th class="pb-3 pr-4">Specialty</th>
                      <th class="pb-3 pr-4">Base Salary</th>
                      <th class="pb-3 pr-4">Bonus</th>
                      <th class="pb-3 pr-4">Deductions</th>
                      <th class="pb-3">Net Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${payroll.doctors.map(p => `
                      <tr class="border-t border-slate-700">
                        <td class="py-3 pr-4 text-white">${p.employee_name}</td>
                        <td class="py-3 pr-4 text-gray-300">${p.role}</td>
                        <td class="py-3 pr-4 text-gray-300">${formatCurrency(parseFloat(p.base_salary))}</td>
                        <td class="py-3 pr-4 text-green-400">+${formatCurrency(parseFloat(p.bonus))}</td>
                        <td class="py-3 pr-4 text-red-400">-${formatCurrency(parseFloat(p.deductions))}</td>
                        <td class="py-3 text-blue-400 font-medium">${formatCurrency(parseFloat(p.net_salary))}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Nurses -->
            <div class="mb-6">
              <h4 class="text-md font-semibold text-purple-400 mb-3 flex items-center space-x-2">
                <span>👩‍⚕️</span>
                <span>Nurses</span>
              </h4>
              <div class="table-container">
                <table class="w-full">
                  <thead class="sticky top-0 bg-slate-800">
                    <tr class="text-left text-gray-400 text-sm">
                      <th class="pb-3 pr-4">Employee</th>
                      <th class="pb-3 pr-4">Position</th>
                      <th class="pb-3 pr-4">Base Salary</th>
                      <th class="pb-3 pr-4">Bonus</th>
                      <th class="pb-3 pr-4">Deductions</th>
                      <th class="pb-3">Net Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${payroll.nurses.map(p => `
                      <tr class="border-t border-slate-700">
                        <td class="py-3 pr-4 text-white">${p.employee_name}</td>
                        <td class="py-3 pr-4 text-gray-300">${p.role}</td>
                        <td class="py-3 pr-4 text-gray-300">${formatCurrency(parseFloat(p.base_salary))}</td>
                        <td class="py-3 pr-4 text-green-400">+${formatCurrency(parseFloat(p.bonus))}</td>
                        <td class="py-3 pr-4 text-red-400">-${formatCurrency(parseFloat(p.deductions))}</td>
                        <td class="py-3 text-blue-400 font-medium">${formatCurrency(parseFloat(p.net_salary))}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Management Staff -->
            <div class="mb-6">
              <h4 class="text-md font-semibold text-yellow-400 mb-3 flex items-center space-x-2">
                <span>💼</span>
                <span>Management Staff</span>
              </h4>
              <div class="table-container">
                <table class="w-full">
                  <thead class="sticky top-0 bg-slate-800">
                    <tr class="text-left text-gray-400 text-sm">
                      <th class="pb-3 pr-4">Employee</th>
                      <th class="pb-3 pr-4">Position</th>
                      <th class="pb-3 pr-4">Base Salary</th>
                      <th class="pb-3 pr-4">Bonus</th>
                      <th class="pb-3 pr-4">Deductions</th>
                      <th class="pb-3">Net Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${payroll.management.map(p => `
                      <tr class="border-t border-slate-700">
                        <td class="py-3 pr-4 text-white">${p.employee_name}</td>
                        <td class="py-3 pr-4 text-gray-300">${p.role}</td>
                        <td class="py-3 pr-4 text-gray-300">${formatCurrency(parseFloat(p.base_salary))}</td>
                        <td class="py-3 pr-4 text-green-400">+${formatCurrency(parseFloat(p.bonus))}</td>
                        <td class="py-3 pr-4 text-red-400">-${formatCurrency(parseFloat(p.deductions))}</td>
                        <td class="py-3 text-blue-400 font-medium">${formatCurrency(parseFloat(p.net_salary))}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Lab Technicians -->
            <div>
              <h4 class="text-md font-semibold text-green-400 mb-3 flex items-center space-x-2">
                <span>🔬</span>
                <span>Lab Technicians</span>
              </h4>
              <div class="table-container">
                <table class="w-full">
                  <thead class="sticky top-0 bg-slate-800">
                    <tr class="text-left text-gray-400 text-sm">
                      <th class="pb-3 pr-4">Employee</th>
                      <th class="pb-3 pr-4">Specialty</th>
                      <th class="pb-3 pr-4">Base Salary</th>
                      <th class="pb-3 pr-4">Bonus</th>
                      <th class="pb-3 pr-4">Deductions</th>
                      <th class="pb-3">Net Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${samplePayroll.technicians.map(p => `
                      <tr class="border-t border-slate-700">
                        <td class="py-3 pr-4">
                          <input type="text" value="${p.name}" 
                            class="bg-slate-700 text-white px-2 py-1 rounded text-sm w-full border border-slate-600 payroll-input" 
                            data-id="${p.id}" data-field="name" data-category="technicians">
                        </td>
                        <td class="py-3 pr-4">
                          <input type="text" value="${p.role}" 
                            class="bg-slate-700 text-gray-300 px-2 py-1 rounded text-sm w-full border border-slate-600 payroll-input" 
                            data-id="${p.id}" data-field="role" data-category="technicians">
                        </td>
                        <td class="py-3 pr-4">
                          <input type="number" value="${p.baseSalary}" 
                            class="bg-slate-700 text-gray-300 px-2 py-1 rounded text-sm w-24 border border-slate-600 payroll-input" 
                            data-id="${p.id}" data-field="baseSalary" data-category="technicians">
                        </td>
                        <td class="py-3 pr-4">
                          <input type="number" value="${p.bonus}" 
                            class="bg-slate-700 text-green-400 px-2 py-1 rounded text-sm w-20 border border-slate-600 payroll-input" 
                            data-id="${p.id}" data-field="bonus" data-category="technicians">
                        </td>
                        <td class="py-3 pr-4">
                          <input type="number" value="${p.deductions}" 
                            class="bg-slate-700 text-red-400 px-2 py-1 rounded text-sm w-20 border border-slate-600 payroll-input" 
                            data-id="${p.id}" data-field="deductions" data-category="technicians">
                        </td>
                        <td class="py-3 text-blue-400 font-medium">${formatCurrency(p.netSalary)}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              <button class="mt-2 px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30 transition-colors add-payroll-btn" data-category="technicians">+ Add Technician</button>
            </div>

            <!-- Others -->
            <div class="mt-6">
              <h4 class="text-md font-semibold text-gray-400 mb-3 flex items-center space-x-2">
                <span>👷</span>
                <span>Others</span>
              </h4>
              <div class="table-container">
                <table class="w-full">
                  <thead class="sticky top-0 bg-slate-800">
                    <tr class="text-left text-gray-400 text-sm">
                      <th class="pb-3 pr-4">Employee</th>
                      <th class="pb-3 pr-4">Position</th>
                      <th class="pb-3 pr-4">Base Salary</th>
                      <th class="pb-3 pr-4">Bonus</th>
                      <th class="pb-3 pr-4">Deductions</th>
                      <th class="pb-3 pr-4">Net Salary</th>
                      <th class="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody id="others-payroll-tbody">
                    ${samplePayroll.others.map(p => `
                      <tr class="border-t border-slate-700" data-id="${p.id}">
                        <td class="py-3 pr-4">
                          <input type="text" value="${p.name}" 
                            class="bg-slate-700 text-white px-2 py-1 rounded text-sm w-full border border-slate-600 payroll-input" 
                            data-id="${p.id}" data-field="name" data-category="others">
                        </td>
                        <td class="py-3 pr-4">
                          <input type="text" value="${p.role}" 
                            class="bg-slate-700 text-gray-300 px-2 py-1 rounded text-sm w-full border border-slate-600 payroll-input" 
                            data-id="${p.id}" data-field="role" data-category="others">
                        </td>
                        <td class="py-3 pr-4">
                          <input type="number" value="${p.baseSalary}" 
                            class="bg-slate-700 text-gray-300 px-2 py-1 rounded text-sm w-24 border border-slate-600 payroll-input" 
                            data-id="${p.id}" data-field="baseSalary" data-category="others">
                        </td>
                        <td class="py-3 pr-4">
                          <input type="number" value="${p.bonus}" 
                            class="bg-slate-700 text-green-400 px-2 py-1 rounded text-sm w-20 border border-slate-600 payroll-input" 
                            data-id="${p.id}" data-field="bonus" data-category="others">
                        </td>
                        <td class="py-3 pr-4">
                          <input type="number" value="${p.deductions}" 
                            class="bg-slate-700 text-red-400 px-2 py-1 rounded text-sm w-20 border border-slate-600 payroll-input" 
                            data-id="${p.id}" data-field="deductions" data-category="others">
                        </td>
                        <td class="py-3 pr-4 text-blue-400 font-medium net-salary">${formatCurrency(p.netSalary)}</td>
                        <td class="py-3">
                          <button class="p-2 hover:bg-red-500/20 rounded text-red-400 transition-colors delete-payroll-btn" data-id="${p.id}" data-category="others" title="Delete">🗑️</button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
              <button class="mt-2 px-3 py-1 bg-gray-500/20 text-gray-400 rounded text-sm hover:bg-gray-500/30 transition-colors add-payroll-btn" data-category="others">+ Add Other Staff</button>
            </div>
          </div>
        </div>

        <!-- Transaction Modal -->
        <div id="transaction-modal" class="fixed inset-0 modal-overlay z-50 flex items-center justify-center hidden">
          <div class="glass rounded-xl p-6 w-full max-w-md mx-4">
            <h3 class="text-xl font-semibold text-white mb-6">Add Transaction</h3>
            <form id="transaction-form" class="space-y-4">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Type</label>
                <select name="type" class="w-full px-4 py-2 rounded-lg input-field" required>
                  <option value="Revenue">Revenue</option>
                  <option value="Equipment">Equipment Expense</option>
                  <option value="Medicine">Medicine Expense</option>
                  <option value="Other">Other Expense</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Description</label>
                <input type="text" name="description" class="w-full px-4 py-2 rounded-lg input-field" required>
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Amount ($)</label>
                <input type="number" name="amount" class="w-full px-4 py-2 rounded-lg input-field" required>
              </div>
              <div class="flex justify-end space-x-4 mt-6">
                <button type="button" id="cancel-transaction" class="px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-slate-700">Cancel</button>
                <button type="submit" class="px-4 py-2 btn-primary rounded-lg font-medium">Add</button>
              </div>
            </form>
          </div>
        </div>
      `;

  document.getElementById('add-transaction-btn')?.addEventListener('click', () => {
    document.getElementById('transaction-modal').classList.remove('hidden');
  });

  document.getElementById('cancel-transaction')?.addEventListener('click', () => {
    document.getElementById('transaction-modal').classList.add('hidden');
  });

  document.getElementById('transaction-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const type = formData.get('type');
    const amount = formData.get('amount');

    // Prepare transaction data
    const transactionData = {
      transaction_type: type === 'Revenue' ? 'Revenue' : 'Expense',
      category: type,
      description: formData.get('description'),
      amount: parseFloat(amount)
    };

    // Disable button to prevent double submit
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Adding...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/finance/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      });

      const result = await response.json();

      if (result.success) {
        document.getElementById('transaction-modal').classList.add('hidden');
        e.target.reset();
        showToast('Transaction added successfully!');
        // Reload transactions and summary to update UI
        renderTransactions(container);
      } else {
        showToast(result.error || 'Failed to add transaction', 'error');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      showToast('Error connecting to server', 'error');
    } finally {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });

  document.getElementById('process-payroll-btn')?.addEventListener('click', async (e) => {
    if (!confirm('Are you sure you want to process payroll for the current month? This will create a transaction and mark records as processed.')) {
      return;
    }

    const btn = e.target;
    const originalText = btn.innerText;
    btn.innerText = 'Processing...';
    btn.disabled = true;

    try {
      // Get current period
      const now = new Date();
      const response = await fetch('/api/finance/process-payroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          month: now.getMonth() + 1,
          year: now.getFullYear()
        })
      });

      const result = await response.json();

      if (result.success) {
        showToast(result.message || 'Payroll processed successfully!');
        // Reload summary to reflect expenses
        loadFinanceSummary().then(summary => {
          if (summary) {
            // Update summary cards if they exist
            // Or just reload the whole view
            renderTransactions(container);
          }
        });
      } else {
        showToast(result.error || 'Failed to process payroll', 'error');
      }
    } catch (error) {
      console.error('Error processing payroll:', error);
      showToast('Error connecting to server', 'error');
    } finally {
      btn.innerText = originalText;
      btn.disabled = false;
    }
  });

  // Payroll input change handlers
  document.querySelectorAll('.payroll-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = e.target.dataset.id;
      const field = e.target.dataset.field;
      const category = e.target.dataset.category;
      const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;

      const employee = samplePayroll[category].find(emp => emp.id === id);
      if (employee) {
        employee[field] = value;

        // Recalculate net salary
        if (['baseSalary', 'bonus', 'deductions'].includes(field)) {
          const netSalary = employee.baseSalary + employee.bonus - employee.deductions;
          employee.netSalary = netSalary;

          // Update the net salary display in the row
          const row = e.target.closest('tr');
          const netSalaryCell = row?.querySelector('.net-salary');
          if (netSalaryCell) {
            netSalaryCell.textContent = formatCurrency(netSalary);
          }
        }

        showToast(`Updated ${field} for ${employee.name}`);
      }
    });
  });

  // Add new payroll entry
  document.querySelectorAll('.add-payroll-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.target.dataset.category;
      const newId = generateId('PAY');
      const newEmployee = {
        id: newId,
        employeeId: generateId('STF'),
        name: 'New Employee',
        role: 'Position',
        baseSalary: 3000,
        bonus: 0,
        deductions: 0,
        netSalary: 3000
      };

      samplePayroll[category].push(newEmployee);
      showToast(`New ${category} employee added`);
      renderTransactions(container);
    });
  });

  // Delete payroll entry
  document.querySelectorAll('.delete-payroll-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const category = e.target.dataset.category;

      const index = samplePayroll[category].findIndex(emp => emp.id === id);
      if (index !== -1) {
        const employee = samplePayroll[category][index];
        samplePayroll[category].splice(index, 1);
        showToast(`Deleted ${employee.name} from payroll`);
        renderTransactions(container);
      }
    });
  });
}

function renderPredictions(container) {
  // Generate future dates
  const today = new Date();
  const futureDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // ML-based prediction algorithm (simulated)
  const basePrediction = 45;
  const futurePredictions = Array.from({ length: 14 }, (_, i) => {
    const dayOfWeek = (today.getDay() + i) % 7;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendBoost = isWeekend ? 1.15 : 1.0;
    const trend = 1 + (i * 0.01); // Slight upward trend
    const randomVariation = 0.9 + Math.random() * 0.2;
    return Math.round(basePrediction * weekendBoost * trend * randomVariation);
  });

  // Detect potential anomalies
  const anomalyThreshold = basePrediction * 1.3;
  const anomalyIndices = futurePredictions.map((v, i) => v > anomalyThreshold ? i : -1).filter(i => i !== -1);

  container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div class="glass rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">📈 Admission Predictions (Next 14 Days)</h3>
            <div id="prediction-chart" class="chart-container"></div>
            <div class="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p class="text-blue-400 font-medium">🔮 ML Model Insights:</p>
              <p class="text-gray-300 text-sm mt-2">Based on historical data analysis using time series forecasting, expect <strong class="text-white">15% higher</strong> admissions on weekends. Peak admission times: 10 AM - 2 PM.</p>
              ${anomalyIndices.length > 0 ? `<p class="text-yellow-400 text-sm mt-2">⚠️ Potential high-volume days detected: ${anomalyIndices.map(i => futureDates[i]).join(', ')}</p>` : ''}
            </div>
          </div>

          <div class="glass rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">⚠️ Anomaly Detection (Future Predictions)</h3>
            <div id="anomaly-chart" class="chart-container"></div>
            <div class="mt-4 space-y-3">
              ${anomalyIndices.length > 0 ? anomalyIndices.map(idx => `
                <div class="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center space-x-3">
                  <span class="text-2xl pulse-alert">⚠️</span>
                  <div>
                    <p class="text-yellow-400 font-medium">Predicted High Volume</p>
                    <p class="text-gray-400 text-sm">${futureDates[idx]}: Expecting ${futurePredictions[idx]} admissions (${Math.round((futurePredictions[idx] / basePrediction - 1) * 100)}% above normal)</p>
                  </div>
                </div>
              `).join('') : '<p class="text-gray-400 text-sm">No anomalies predicted in the next 14 days.</p>'}
              <div class="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center space-x-3">
                <span class="text-2xl">✅</span>
                <div>
                  <p class="text-green-400 font-medium">Model Accuracy</p>
                  <p class="text-gray-400 text-sm">Current model accuracy: 87.5% based on last 30 days of data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="glass rounded-xl p-6">
          <h3 class="text-lg font-semibold text-white mb-4">📊 Historical Analysis & Trends</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="p-4 bg-slate-800 rounded-lg">
              <p class="text-gray-400 text-sm">Average Daily Admissions</p>
              <p class="text-2xl font-bold text-white mt-2">47</p>
              <p class="text-green-400 text-sm mt-1">↑ 8% from last month</p>
            </div>
            <div class="p-4 bg-slate-800 rounded-lg">
              <p class="text-gray-400 text-sm">Peak Admission Day</p>
              <p class="text-2xl font-bold text-white mt-2">Saturday</p>
              <p class="text-blue-400 text-sm mt-1">Avg 58 admissions</p>
            </div>
            <div class="p-4 bg-slate-800 rounded-lg">
              <p class="text-gray-400 text-sm">Predicted Peak Load</p>
              <p class="text-2xl font-bold text-yellow-400 mt-2">${futureDates[futurePredictions.indexOf(Math.max(...futurePredictions))]}</p>
              <p class="text-yellow-400 text-sm mt-1">${Math.max(...futurePredictions)} admissions</p>
            </div>
            <div class="p-4 bg-slate-800 rounded-lg">
              <p class="text-gray-400 text-sm">ML Model Type</p>
              <p class="text-2xl font-bold text-white mt-2">ARIMA</p>
              <p class="text-gray-400 text-sm mt-1">Time Series Forecast</p>
            </div>
          </div>
        </div>
      `;

  setTimeout(() => {
    // Prediction Chart with future dates
    Plotly.newPlot('prediction-chart', [{
      x: futureDates,
      y: futurePredictions,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Predicted Admissions',
      line: { color: '#3b82f6', width: 3 },
      marker: {
        size: 8,
        color: futurePredictions.map(v => v > anomalyThreshold ? '#ef4444' : '#3b82f6')
      }
    }, {
      x: futureDates,
      y: Array(14).fill(basePrediction),
      type: 'scatter',
      mode: 'lines',
      name: 'Historical Average',
      line: { color: '#22c55e', width: 2, dash: 'dash' }
    }], {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#94a3b8' },
      margin: { l: 40, r: 20, t: 20, b: 60 },
      legend: { orientation: 'h', y: -0.3 },
      xaxis: { gridcolor: '#334155', tickangle: -45 },
      yaxis: { gridcolor: '#334155', title: 'Predicted Admissions' }
    }, { responsive: true });

    // Anomaly Chart with confidence intervals
    const confidenceUpper = futurePredictions.map(v => v * 1.1);
    const confidenceLower = futurePredictions.map(v => v * 0.9);

    Plotly.newPlot('anomaly-chart', [{
      x: futureDates,
      y: futurePredictions,
      type: 'scatter',
      mode: 'lines',
      name: 'Prediction',
      line: { color: '#3b82f6', width: 3 }
    }, {
      x: futureDates,
      y: confidenceUpper,
      type: 'scatter',
      mode: 'lines',
      name: 'Upper Bound',
      line: { color: 'rgba(59, 130, 246, 0.3)', width: 0 },
      fill: 'tonexty',
      fillcolor: 'rgba(59, 130, 246, 0.2)'
    }, {
      x: futureDates,
      y: confidenceLower,
      type: 'scatter',
      mode: 'lines',
      name: 'Lower Bound',
      line: { color: 'rgba(59, 130, 246, 0.3)', width: 0 }
    }, {
      x: futureDates,
      y: Array(14).fill(anomalyThreshold),
      type: 'scatter',
      mode: 'lines',
      name: 'Anomaly Threshold',
      line: { color: '#ef4444', width: 2, dash: 'dot' }
    }], {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#94a3b8' },
      margin: { l: 40, r: 20, t: 20, b: 60 },
      xaxis: { gridcolor: '#334155', tickangle: -45 },
      yaxis: { gridcolor: '#334155', title: 'Volume' },
      showlegend: false
    }, { responsive: true });
  }, 100);
}

async function renderInventory(container) {
  // Show loading state
  container.innerHTML = `
    <div class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading inventory data...</p>
      </div>
    </div>
  `;

  const [bloodStock, organStock, donors] = await Promise.all([
    loadBloodStock(),
    loadOrganStock(),
    loadDonors()
  ]);

  // Use API data or fallback
  const displayBlood = bloodStock.length > 0 ? bloodStock : sampleBloodStock;
  const displayOrgans = organStock.length > 0 ? organStock : sampleOrgans;
  // Donors logic: API data or fallbacks
  // If API returns data, use it. If not, and fallback is needed, map samples.
  // Sample data: James Anderson, Maria Garcia, Robert Kim.
  // We'll use API data primarily.
  const displayDonors = donors.length > 0 ? donors : [
    { name: 'James Anderson', blood_group: 'O+', contact: '555-0201', address: '123 Oak Street', last_donation: '2024-01-10', status: 'Eligible', donation_type: 'Blood' },
    { name: 'Maria Garcia', blood_group: 'A-', contact: '555-0202', address: '456 Pine Avenue', last_donation: '2023-12-28', status: 'Waiting', donation_type: 'Blood' },
    { name: 'Robert Kim', blood_group: 'B+', contact: '555-0203', address: '789 Elm Road', last_donation: '2024-01-05', status: 'Eligible', donation_type: 'Blood' }
  ];

  container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <!-- Blood Stock -->
          <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">🩸 Blood Stock Inventory</h3>
              <div>
                <button id="consume-stock-btn" class="mr-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">Capture Usage</button>
                <button id="add-blood-donor-btn" class="px-4 py-2 btn-primary rounded-lg text-sm font-medium">+ Add Donor</button>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              ${displayBlood.map(b => `
                <div class="p-4 bg-slate-800 rounded-lg text-center ${b.units < 25 ? 'border-2 border-red-500 pulse-alert' : ''}">
                  <p class="text-2xl font-bold text-white">${b.type}</p>
                  <p class="text-3xl font-bold ${b.units < 25 ? 'text-red-500' : 'text-green-400'} mt-2">${b.units}</p>
                  <p class="text-gray-400 text-sm">units</p>
                  ${b.units < 25 ? '<p class="text-red-400 text-xs mt-2">⚠️ LOW STOCK</p>' : ''}
                  <p class="text-gray-500 text-xs mt-1">${b.donors} donors</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Organ Stock -->
          <div class="glass rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">   Organ Availability</h3>
              <button id="add-organ-donor-btn" class="px-4 py-2 btn-primary rounded-lg text-sm font-medium">+ Register Donor</button>
            </div>
            <div class="space-y-4">
              ${displayOrgans.map(o => `
                <div class="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div class="flex items-center space-x-4">
                    <span class="text-2xl">${o.type === 'Heart' ? '❤️' : o.type === 'Kidney' ? '🫘' : o.type === 'Liver' ? '🫁' : o.type === 'Lungs' ? '🌬     ' : '👁️'}</span>
                    <div>
                      <p class="text-white font-medium">${o.type}</p>
                      <p class="text-gray-400 text-sm">Waitlist: ${o.waitlist}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-2xl font-bold ${o.available < 5 ? 'text-red-400' : 'text-green-400'}">${o.available}</p>
                    <p class="text-gray-400 text-xs">available</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Donor Management -->
        <div class="glass rounded-xl p-6">
          <h3 class="text-lg font-semibold text-white mb-4">👥 Recent Donors</h3>
          <div class="table-container">
            <table class="w-full">
              <thead class="sticky top-0 bg-slate-800">
                <tr class="text-left text-gray-400 text-sm">
                  <th class="pb-3 pr-4">Name</th>
                  <th class="pb-3 pr-4">Type</th>
                  <th class="pb-3 pr-4">Phone</th>
                  <th class="pb-3 pr-4">Address</th>
                  <th class="pb-3 pr-4">Last Donation</th>
                  <th class="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                ${displayDonors.map(d => `
                  <tr class="border-t border-slate-700 hover:bg-slate-800/50 transition-colors">
                    <td class="py-3 pr-4 text-white">${d.name}</td>
                    <td class="py-3 pr-4 ${d.donation_type === 'Blood' ? 'text-red-400 font-bold' : 'text-blue-400 font-bold'}">
                        ${d.donation_type === 'Blood' ? d.blood_group : d.organ_type}
                    </td>
                    <td class="py-3 pr-4 text-gray-300">${d.contact || 'N/A'}</td>
                    <td class="py-3 pr-4 text-gray-300">${d.address || 'N/A'}</td>
                    <td class="py-3 pr-4 text-gray-300">${d.last_donation || formatDate(new Date())}</td>
                    <td class="py-3"><span class="status-badge ${d.status === 'Eligible' ? 'status-admitted' : d.status === 'Waiting' ? 'status-transferred' : 'status-discharged'}">${d.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Alerts Section -->
        <div class="mt-6 glass rounded-xl p-6 border-2 border-red-500/50">
          <h3 class="text-lg font-semibold text-red-400 mb-4">🚨 Critical Alerts</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${displayBlood.filter(b => b.units < 25).map(b => `
              <div class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-4">
                <span class="text-3xl pulse-alert">🩸</span>
                <div>
                  <p class="text-red-400 font-bold">URGENT: ${b.type} Blood Shortage</p>
                  <p class="text-gray-300 text-sm">Only ${b.units} units remaining - Below critical threshold of 25 units</p>
                </div>
              </div>
            `).join('')}
            ${displayOrgans.filter(o => o.available < 5).map(o => `
              <div class="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center space-x-4">
                <span class="text-3xl">⚠️</span>
                <div>
                  <p class="text-yellow-400 font-bold">${o.type} Supply Low</p>
                  <p class="text-gray-300 text-sm">${o.available} available, ${o.waitlist} on waitlist</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Donation Modal -->
        <div id="donation-modal" class="fixed inset-0 z-50 hidden">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm modal-overlay"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
            <div class="glass rounded-xl p-6 border border-slate-700 shadow-2xl relative">
              <h3 id="donation-modal-title" class="text-xl font-bold text-white mb-4">Add Blood Donor</h3>
              <form id="donation-form" class="space-y-4">
                <input type="hidden" id="donation-type" value="Blood">
                
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Donor Name</label>
                  <input type="text" id="donor-name" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white" placeholder="Enter full name">
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Contact Phone</label>
                  <input type="tel" id="donor-contact" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white" placeholder="555-0000">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Address</label>
                  <input type="text" id="donor-address" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white" placeholder="Enter address">
                </div>

                <div id="blood-group-field">
                  <label class="block text-sm font-medium text-gray-400 mb-1">Blood Group</label>
                  <select id="donor-blood-group" class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div id="organ-type-field" class="hidden">
                   <label class="block text-sm font-medium text-gray-400 mb-1">Organ Type</label>
                   <select id="donor-organ-type" class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                     <option value="Kidney">Kidney</option>
                     <option value="Liver">Liver</option>
                     <option value="Heart">Heart</option>
                     <option value="Lungs">Lungs</option>
                     <option value="Cornea">Cornea</option>
                   </select>
                </div>

                <div id="units-field">
                    <label class="block text-sm font-medium text-gray-400 mb-1">Units (bags)</label>
                    <input type="number" id="donor-units" value="1" min="1" class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                </div>

                <div class="flex space-x-3 mt-6">
                  <button type="button" id="cancel-donation-btn" class="flex-1 py-2 px-4 rounded-lg border border-slate-600 text-gray-300 hover:bg-slate-700 transition-colors">Cancel</button>
                  <button type="submit" class="flex-1 py-2 px-4 rounded-lg btn-primary text-white font-medium hover:shadow-lg transition-all">Submit Record</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>

        <!-- Consume Stock Modal -->
        <div id="consume-stock-modal" class="fixed inset-0 z-50 hidden">
           <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
           <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
             <div class="glass rounded-xl p-6 border-2 border-red-500/30 shadow-xl">
               <h3 class="text-xl font-bold text-white mb-4">Capture Stock Usage</h3>
               <form id="consume-stock-form" class="space-y-4">
                 <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Type</label>
                    <select id="consume-type" class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                      <option value="Blood">Blood</option>
                      <option value="Organ">Organ</option>
                    </select>
                 </div>
                 <div id="consume-blood-type">
                    <label class="block text-sm font-medium text-gray-400 mb-1">Blood Group</label>
                    <select id="consume-specific-blood" class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                      <option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
                    </select>
                 </div>
                 <div id="consume-organ-type" class="hidden">
                    <label class="block text-sm font-medium text-gray-400 mb-1">Organ</label>
                    <select id="consume-specific-organ" class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                      <option value="Kidney">Kidney</option><option value="Liver">Liver</option><option value="Heart">Heart</option><option value="Lungs">Lungs</option><option value="Cornea">Cornea</option>
                    </select>
                 </div>
                 <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                    <input type="number" id="consume-qty" value="1" min="1" class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                 </div>
                 <div class="flex justify-end space-x-3 mt-6">
                   <button type="button" id="cancel-consume-btn" class="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                   <button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Confirm Usage</button>
                 </div>
               </form>
             </div>
           </div>
        </div>
      `;

  // Consume Modal Logic
  const consumeModal = document.getElementById('consume-stock-modal');
  const consumeType = document.getElementById('consume-type');
  const consumeBlood = document.getElementById('consume-blood-type');
  const consumeOrgan = document.getElementById('consume-organ-type');

  document.getElementById('consume-stock-btn')?.addEventListener('click', () => consumeModal.classList.remove('hidden'));
  document.getElementById('cancel-consume-btn')?.addEventListener('click', () => consumeModal.classList.add('hidden'));

  consumeType?.addEventListener('change', (e) => {
    if (e.target.value === 'Blood') {
      consumeBlood.classList.remove('hidden');
      consumeOrgan.classList.add('hidden');
    } else {
      consumeBlood.classList.add('hidden');
      consumeOrgan.classList.remove('hidden');
    }
  });

  document.getElementById('consume-stock-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = consumeType.value;
    const specific = type === 'Blood' ? document.getElementById('consume-specific-blood').value : document.getElementById('consume-specific-organ').value;
    const qty = document.getElementById('consume-qty').value;

    try {
      const res = await fetch('/api/inventory/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, specific_type: specific, quantity: qty })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Stock usage recorded');
        consumeModal.classList.add('hidden');
        renderInventory(container);
      } else {
        showToast(data.message || 'Error consuming stock', 'error');
      }
    } catch (err) { console.error(err); }
  });

  // Attach Event Listeners
  const bloodBtn = document.getElementById('add-blood-donor-btn');
  const organBtn = document.getElementById('add-organ-donor-btn');
  const modal = document.getElementById('donation-modal');
  const modalTitle = document.getElementById('donation-modal-title');
  const cancelBtn = document.getElementById('cancel-donation-btn');
  const form = document.getElementById('donation-form');
  const typeInput = document.getElementById('donation-type');
  const bloodField = document.getElementById('blood-group-field');
  const organField = document.getElementById('organ-type-field');
  const unitsField = document.getElementById('units-field');

  const openModal = (type) => {
    typeInput.value = type;
    modal.classList.remove('hidden');
    if (type === 'Blood') {
      modalTitle.textContent = 'Add Blood Donor';
      bloodField.classList.remove('hidden');
      unitsField.classList.remove('hidden');
      organField.classList.add('hidden');
    } else {
      modalTitle.textContent = 'Register Organ Donor';
      bloodField.classList.add('hidden');
      unitsField.classList.add('hidden');
      organField.classList.remove('hidden');
    }
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    form.reset();
  };

  bloodBtn.addEventListener('click', () => openModal('Blood'));
  organBtn.addEventListener('click', () => openModal('Organ'));
  cancelBtn.addEventListener('click', closeModal);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById('donor-name').value,
      contact: document.getElementById('donor-contact').value,
      address: document.getElementById('donor-address').value,
      donation_type: typeInput.value,
      blood_type: document.getElementById('donor-blood-group').value,
      organ_type: document.getElementById('donor-organ-type').value,
      units: parseInt(document.getElementById('donor-units').value) || 1
    };

    try {
      const response = await fetch('/api/inventory/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.success) {
        showToast('Donation recorded successfully');
        closeModal();
        renderInventory(container); // Refresh data
      } else {
        showToast(result.error || 'Failed to record donation', 'error');
      }
    } catch (error) {
      console.error('Donation error:', error);
      showToast('Error connecting to server', 'error');
    }
  });

}

async function renderDashboard_DISABLED(container) {
  // Fetch metrics from API
  const metrics = await loadDashboardMetrics();

  // Use API data if available, fallback to hardcoded values
  const occupancyRate = metrics?.bed_occupancy?.rate || 78.0;
  const occupiedBeds = metrics?.bed_occupancy?.occupied || 156;
  const totalBeds = metrics?.bed_occupancy?.total || 200;
  const patientAdmissions = metrics?.patient_admissions || 2;
  const staffOnDuty = metrics?.staff_on_duty || 4;
  const profit = metrics?.daily_pl?.profit || -180000;
  const totalRevenue = metrics?.daily_pl?.revenue || 100000;
  const emergencyWaiting = metrics?.emergency_waiting || 7;
  const icuOccupancy = metrics?.icu_occupancy?.occupied || 18;
  const icuTotal = metrics?.icu_occupancy?.total || 20;
  const surgeriesScheduled = metrics?.surgeries_scheduled || 5;
  const lowStockBlood = metrics?.blood_low_stock || 4;
  const criticalPatients = metrics?.critical_patients || 1;

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  container.innerHTML = `
    <!-- Real-time Status Bar -->
    <div class="glass rounded-xl p-4 mb-6 flex items-center justify-between">
      <div class="flex items-center space-x-6">
        <div class="flex items-center space-x-2">
          <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          <span class="text-gray-400 text-sm">System Online</span>
        </div>
        <div class="text-gray-400 text-sm">🕐 ${currentTime}</div>
        <div class="text-gray-400 text-sm">📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-red-400 text-sm font-medium">🚨 ${criticalPatients} Critical Patients</div>
        <div class="text-yellow-400 text-sm font-medium">⚠️ ${lowStockBlood} Blood Low Stock</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Stat Cards -->
      <div class="glass rounded-xl p-6 card-hover">
        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl">🛏️</span>
          <span class="text-green-400 text-sm font-medium">+5.2%</span>
        </div>
        <h3 class="text-gray-400 text-sm">Bed Occupancy</h3>
        <p class="text-2xl font-bold text-white">${occupancyRate}%</p>
        <p class="text-xs text-gray-500 mt-1">${occupiedBeds}/${totalBeds} beds occupied</p>
      </div>

      <div class="glass rounded-xl p-6 card-hover">
        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl">👥</span>
          <span class="text-blue-400 text-sm font-medium">Today</span>
        </div>
        <h3 class="text-gray-400 text-sm">Patient Admissions</h3>
        <p class="text-2xl font-bold text-white">${patientAdmissions}</p>
        <p class="text-xs text-gray-500 mt-1">3 critical, 2 stable</p>
      </div>

      <div class="glass rounded-xl p-6 card-hover">
        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl">👨‍⚕️</span>
          <span class="text-purple-400 text-sm font-medium">Active</span>
        </div>
        <h3 class="text-gray-400 text-sm">Staff on Duty</h3>
        <p class="text-2xl font-bold text-white">${staffOnDuty}</p>
        <p class="text-xs text-gray-500 mt-1">Ratio: 1:4 (Staff:Patient)</p>
      </div>

      <div class="glass rounded-xl p-6 card-hover">
        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl">💰</span>
          <span class="${profit >= 0 ? 'text-green-400' : 'text-red-400'} text-sm font-medium">${profit >= 0 ? '+' : ''}</span>
        </div>
        <h3 class="text-gray-400 text-sm">Daily P&L</h3>
        <p class="text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}">${formatCurrency(profit)}</p>
        <p class="text-xs text-gray-500 mt-1">Revenue: ${formatCurrency(totalRevenue)}</p>
      </div>
    </div>

    <!-- Additional Real-time Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="glass rounded-xl p-6 card-hover">
        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl">🚑</span>
          <span class="text-red-400 text-sm font-medium pulse-alert">Live</span>
        </div>
        <h3 class="text-gray-400 text-sm">Emergency Waiting</h3>
        <p class="text-2xl font-bold text-white">${emergencyWaiting}</p>
        <p class="text-xs text-gray-500 mt-1">Average wait: 12 mins</p>
      </div>

      <div class="glass rounded-xl p-6 card-hover">
        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl">🏥</span>
          <span class="${icuOccupancy >= 18 ? 'text-red-400' : 'text-green-400'} text-sm font-medium">${Math.round((icuOccupancy / icuTotal) * 100)}%</span>
        </div>
        <h3 class="text-gray-400 text-sm">ICU Occupancy</h3>
        <p class="text-2xl font-bold text-white">${icuOccupancy}/${icuTotal}</p>
        <p class="text-xs text-gray-500 mt-1">${icuTotal - icuOccupancy} beds available</p>
      </div>

      <div class="glass rounded-xl p-6 card-hover">
        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl">⚕️</span>
          <span class="text-blue-400 text-sm font-medium">Today</span>
        </div>
        <h3 class="text-gray-400 text-sm">Surgeries Scheduled</h3>
        <p class="text-2xl font-bold text-white">${surgeriesScheduled}</p>
        <p class="text-xs text-gray-500 mt-1">3 completed, 2 ongoing</p>
      </div>

      <div class="glass rounded-xl p-6 card-hover">
        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl">🩸</span>
          <span class="${lowStockBlood > 2 ? 'text-red-400' : 'text-green-400'} text-sm font-medium">${lowStockBlood > 0 ? 'Alert' : 'Good'}</span>
        </div>
        <h3 class="text-gray-400 text-sm">Blood Stock Status</h3>
        <p class="text-2xl font-bold ${lowStockBlood > 2 ? 'text-red-400' : 'text-white'}">${lowStockBlood}</p>
        <p class="text-xs text-gray-500 mt-1">Blood types low on stock</p>
      </div>
    </div>

    <div class="glass rounded-xl p-6 mb-6">
      <h3 class="text-lg font-semibold text-white mb-4">Recent Admissions</h3>
      <div class="table-container">
        <table class="w-full">
          <thead class="sticky top-0 bg-slate-800">
            <tr class="text-left text-gray-400 text-sm">
              <th class="pb-3 pr-4">Patient</th>
              <th class="pb-3 pr-4">Department</th>
              <th class="pb-3 pr-4">Status</th>
              <th class="pb-3">Date</th>
            </tr>
          </thead>
          <tbody id="recent-admissions-body">
            <tr class="border-t border-slate-700">
              <td colspan="4" class="py-3 text-center text-gray-400">Loading...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Load recent admissions
  loadRecentAdmissions();
}

async function loadRecentAdmissions_DISABLED() {
  try {
    const response = await fetch('/api/patients');
    const data = await response.json();
    if (data.success && data.patients) {
      const tbody = document.getElementById('recent-admissions-body');
      if (tbody) {
        tbody.innerHTML = data.patients.slice(0, 5).map(p => `
          <tr class="border-t border-slate-700">
            <td class="py-3 pr-4">
              <p class="text-white font-medium">${p.name}</p>
              <p class="text-xs text-gray-400">${p.id}</p>
            </td>
            <td class="py-3 pr-4 text-gray-300">${p.department || 'N/A'}</td>
            <td class="py-3 pr-4">
              <span class="status-badge status-${p.status}">${p.status}</span>
            </td>
            <td class="py-3 text-gray-400">${formatDate(p.admitted_date)}</td>
          </tr>
        `).join('');
      }
    }
  } catch (error) {
    console.error('Error loading recent admissions:', error);
  }
}


async function renderRecords(container) {
  // Show loading state
  container.innerHTML = `
    <div class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading medical records...</p>
      </div>
    </div>
  `;

  const records = await loadMedicalRecords();
  let displayRecords = records.length > 0 ? records : sampleRecords;
  let filteredRecords = [...displayRecords];
  const isCEO = currentUser.role === 'CEO';

  const renderTable = () => {
    const tbody = document.querySelector('#records-table-body');
    if (!tbody) return;

    tbody.innerHTML = filteredRecords.map(r => `
      <tr class="border-t border-slate-700 hover:bg-slate-800/50 transition-colors" data-record-id="${r.id}">
        <td class="py-3 pr-4 text-blue-400 font-mono">${r.id}</td>
        <td class="py-3 pr-4 text-gray-300 font-mono">${r.patientId}</td>
        <td class="py-3 pr-4 text-white font-medium">${r.name}</td>
        <td class="py-3 pr-4 text-gray-300">${r.diagnosis}</td>
        <td class="py-3 pr-4 text-gray-300">${r.treatment}</td>
        <td class="py-3 pr-4 text-gray-300">${r.doctor}</td>
        <td class="py-3 pr-4 text-gray-300">${formatDate(r.lastVisit)}</td>
        <td class="py-3">
          <button class="view-record-btn p-2 hover:bg-slate-700 rounded-lg transition-colors" title="View Full Record" data-id="${r.id}">👁️</button>
          ${!isCEO ? `<button class="edit-record-btn p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Edit" data-id="${r.id}">✏️</button>` : ''}
          <button class="download-record-btn p-2 hover:bg-slate-700 rounded-lg transition-colors" title="Download" data-id="${r.id}">⬇️</button>
        </td>
      </tr>
    `).join('');
  };

  container.innerHTML = `
        <div class="glass rounded-xl p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-white">📋 Medical Records Database</h3>
            <div class="flex items-center space-x-4">
              <input type="text" id="records-search" placeholder="Search by patient name or ID..." class="px-4 py-2 rounded-lg input-field w-80">
              ${!isCEO ? '<button id="add-record-btn" class="px-4 py-2 btn-primary rounded-lg font-medium">+ Add Record</button>' : ''}
            </div>
          </div>

          <div class="table-container">
            <table class="w-full">
              <thead class="sticky top-0 bg-slate-800">
                <tr class="text-left text-gray-400 text-sm">
                  <th class="pb-3 pr-4">Record ID</th>
                  <th class="pb-3 pr-4">Patient ID</th>
                  <th class="pb-3 pr-4">Patient Name</th>
                  <th class="pb-3 pr-4">Diagnosis</th>
                  <th class="pb-3 pr-4">Treatment</th>
                  <th class="pb-3 pr-4">Attending Doctor</th>
                  <th class="pb-3 pr-4">Last Visit</th>
                  <th class="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody id="records-table-body">
              </tbody>
            </table>
          </div>

          <div class="mt-6 p-4 bg-slate-800 rounded-lg">
            <p class="text-gray-400 text-sm">🔒 <strong class="text-white">Note:</strong> All medical records are encrypted and stored securely. Access is logged for compliance purposes.</p>
          </div>
        </div>

        <!-- Add/Edit Record Modal -->
        <div id="record-modal" class="fixed inset-0 z-50 hidden">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
            <div class="glass rounded-xl p-6 border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 id="record-modal-title" class="text-xl font-bold text-white mb-4">Add Medical Record</h3>
              <form id="record-form" class="space-y-4">
                <input type="hidden" id="record-id">
                <input type="hidden" id="record-mode" value="add">
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Patient ID</label>
                    <input type="text" id="record-patient-id" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white" placeholder="ADM001">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Patient Name</label>
                    <input type="text" id="record-patient-name" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white" placeholder="John Doe">
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Diagnosis</label>
                  <input type="text" id="record-diagnosis" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white" placeholder="Enter diagnosis">
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-1">Treatment</label>
                  <input type="text" id="record-treatment" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white" placeholder="Enter treatment plan">
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Attending Doctor</label>
                    <input type="text" id="record-doctor" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white" placeholder="Dr. Smith">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">Last Visit Date</label>
                    <input type="date" id="record-last-visit" required class="w-full px-4 py-2 rounded-lg input-field bg-slate-800 border-slate-600 text-white">
                  </div>
                </div>

                <div class="flex space-x-3 mt-6">
                  <button type="button" id="cancel-record-btn" class="flex-1 py-2 px-4 rounded-lg border border-slate-600 text-gray-300 hover:bg-slate-700 transition-colors">Cancel</button>
                  <button type="submit" class="flex-1 py-2 px-4 rounded-lg btn-primary text-white font-medium">Save Record</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- View Record Modal -->
        <div id="view-record-modal" class="fixed inset-0 z-50 hidden">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl">
            <div class="glass rounded-xl p-6 border border-slate-700 shadow-2xl">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-white">Medical Record Details</h3>
                <button id="close-view-modal" class="text-gray-400 hover:text-white">✕</button>
              </div>
              <div id="view-record-content" class="space-y-4">
              </div>
            </div>
          </div>
        </div>
      `;

  // Initial render
  renderTable();

  // Search functionality
  const searchInput = document.getElementById('records-search');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filteredRecords = displayRecords.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.patientId.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query)
    );
    renderTable();
  });

  // Add Record button
  // Add Record button
  const modal = document.getElementById('record-modal');
  const form = document.getElementById('record-form');
  const cancelBtn = document.getElementById('cancel-record-btn');

  document.getElementById('add-record-btn')?.addEventListener('click', () => {
    document.getElementById('record-modal-title').textContent = 'Add Medical Record';
    document.getElementById('record-mode').value = 'add';
    form.reset();

    // Enable Patient ID field for adding new records
    document.getElementById('record-patient-id').disabled = false;

    // Auto-generate next Patient ID
    const existingPatientNumbers = displayRecords
      .map(r => {
        const match = r.patientId.match(/^ADM(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter(n => n > 0);

    const nextPatientNumber = existingPatientNumbers.length > 0
      ? Math.max(...existingPatientNumbers) + 1
      : 1;

    const nextPatientId = `ADM${String(nextPatientNumber).padStart(3, '0')}`;
    document.getElementById('record-patient-id').value = nextPatientId;

    document.getElementById('record-last-visit').valueAsDate = new Date();
    modal.classList.remove('hidden');
  });

  cancelBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
    form.reset();
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mode = document.getElementById('record-mode').value;

    // Generate sequential Record ID for new records
    let recordId;
    if (mode === 'add') {
      // Find the highest existing record number
      const existingNumbers = displayRecords
        .map(r => {
          const match = r.id.match(/^REC(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        })
        .filter(n => n > 0);

      const nextNumber = existingNumbers.length > 0
        ? Math.max(...existingNumbers) + 1
        : 1;

      recordId = `REC${String(nextNumber).padStart(3, '0')}`;
    } else {
      recordId = document.getElementById('record-id').value;
    }

    const payload = {
      id: recordId,
      patientId: document.getElementById('record-patient-id').value,
      name: document.getElementById('record-patient-name').value,
      diagnosis: document.getElementById('record-diagnosis').value,
      treatment: document.getElementById('record-treatment').value,
      doctor: document.getElementById('record-doctor').value,
      lastVisit: document.getElementById('record-last-visit').value
    };

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.success) {
        showToast(mode === 'add' ? 'Record added successfully' : 'Record updated successfully');
        modal.classList.add('hidden');
        form.reset();
        renderRecords(container); // Refresh
      } else {
        showToast(result.error || 'Failed to save record', 'error');
      }
    } catch (error) {
      console.error('Save record error:', error);
      showToast('Error connecting to server', 'error');
    }
  });

  // View Record buttons
  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-record-btn')) {
      const recordId = e.target.dataset.id;
      const record = displayRecords.find(r => r.id === recordId);
      if (record) {
        const viewModal = document.getElementById('view-record-modal');
        const content = document.getElementById('view-record-content');
        content.innerHTML = `
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-slate-800 rounded-lg">
              <p class="text-gray-400 text-sm">Record ID</p>
              <p class="text-white font-mono font-bold">${record.id}</p>
            </div>
            <div class="p-4 bg-slate-800 rounded-lg">
              <p class="text-gray-400 text-sm">Patient ID</p>
              <p class="text-white font-mono font-bold">${record.patientId}</p>
            </div>
            <div class="p-4 bg-slate-800 rounded-lg col-span-2">
              <p class="text-gray-400 text-sm">Patient Name</p>
              <p class="text-white font-bold text-lg">${record.name}</p>
            </div>
            <div class="p-4 bg-slate-800 rounded-lg col-span-2">
              <p class="text-gray-400 text-sm">Diagnosis</p>
              <p class="text-white">${record.diagnosis}</p>
            </div>
            <div class="p-4 bg-slate-800 rounded-lg col-span-2">
              <p class="text-gray-400 text-sm">Treatment Plan</p>
              <p class="text-white">${record.treatment}</p>
            </div>
            <div class="p-4 bg-slate-800 rounded-lg">
              <p class="text-gray-400 text-sm">Attending Doctor</p>
              <p class="text-white">${record.doctor}</p>
            </div>
            <div class="p-4 bg-slate-800 rounded-lg">
              <p class="text-gray-400 text-sm">Last Visit</p>
              <p class="text-white">${formatDate(record.lastVisit)}</p>
            </div>
          </div>
        `;
        viewModal.classList.remove('hidden');
      }
    }

    // Edit Record buttons
    if (e.target.classList.contains('edit-record-btn')) {
      const recordId = e.target.dataset.id;
      const record = displayRecords.find(r => r.id === recordId);
      if (record) {
        document.getElementById('record-modal-title').textContent = 'Edit Medical Record';
        document.getElementById('record-mode').value = 'edit';
        document.getElementById('record-id').value = record.id;
        document.getElementById('record-patient-id').value = record.patientId;

        // Disable Patient ID field in edit mode
        document.getElementById('record-patient-id').disabled = true;

        document.getElementById('record-patient-name').value = record.name;
        document.getElementById('record-diagnosis').value = record.diagnosis;
        document.getElementById('record-treatment').value = record.treatment;
        document.getElementById('record-doctor').value = record.doctor;
        document.getElementById('record-last-visit').value = record.lastVisit;
        modal.classList.remove('hidden');
      }
    }

    // Download Record buttons
    if (e.target.classList.contains('download-record-btn')) {
      const recordId = e.target.dataset.id;
      const record = displayRecords.find(r => r.id === recordId);
      if (record) {
        const content = `
MEDICAL RECORD
==============
Record ID: ${record.id}
Patient ID: ${record.patientId}
Patient Name: ${record.name}
Diagnosis: ${record.diagnosis}
Treatment: ${record.treatment}
Attending Doctor: ${record.doctor}
Last Visit: ${formatDate(record.lastVisit)}

Generated: ${new Date().toLocaleString()}
        `;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Medical_Record_${record.id}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Record downloaded successfully');
      }
    }
  });

  // Close view modal
  document.getElementById('close-view-modal').addEventListener('click', () => {
    document.getElementById('view-record-modal').classList.add('hidden');
  });
}



// ============ EVENT HANDLERS ============
function attachLoginEvents() {
  const roleSelect = document.getElementById('role-select');
  const userIdInput = document.getElementById('user-id');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const forgotPwdBtn = document.getElementById('forgot-pwd-btn');
  const backToLoginBtn = document.getElementById('back-to-login-btn');

  roleSelect?.addEventListener('change', (e) => {
    if (userIdInput) userIdInput.value = e.target.value;
  });

  loginBtn?.addEventListener('click', () => {
    const userId = userIdInput?.value;
    const password = passwordInput?.value;

    if (!userId || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const user = users[userId];
    if (user && user.password === password) {
      currentUser = user;
      currentPage = user.access[0];
      showToast(`Welcome, ${user.name}!`);
      render();
    } else {
      showToast('Invalid credentials', 'error');
    }
  });

  forgotPwdBtn?.addEventListener('click', () => {
    document.getElementById('login-form')?.classList.add('hidden');
    document.getElementById('reset-form')?.classList.remove('hidden');
  });

  backToLoginBtn?.addEventListener('click', () => {
    document.getElementById('reset-form')?.classList.add('hidden');
    document.getElementById('login-form')?.classList.remove('hidden');
  });
}

function attachMainEvents() {
  // Sidebar navigation
  document.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = e.currentTarget.dataset.page;
      if (hasAccess(page)) {
        currentPage = page;
        render();
      }
    });
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    currentUser = null;
    currentPage = 'login';
    showToast('Logged out successfully');
    render();
  });

  // Task manager
  document.getElementById('task-manager-btn')?.addEventListener('click', () => {
    showTaskManager();
  });
}

function showTaskManager() {
  const modal = document.createElement('div');
  modal.id = 'task-manager-modal';
  modal.className = 'fixed inset-0 modal-overlay z-50 flex items-center justify-center';
  modal.innerHTML = `
        <div class="glass rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80%] overflow-y-auto">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-white">📝 Task Manager</h3>
            <button id="close-task-modal" class="text-gray-400 hover:text-white">✕</button>
          </div>

          <form id="add-task-form" class="mb-6 p-4 bg-slate-800 rounded-lg">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Task Description</label>
                <input type="text" id="task-description" class="w-full px-4 py-2 rounded-lg input-field" placeholder="Enter task..." required>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Due Date</label>
                  <input type="date" id="task-date" class="w-full px-4 py-2 rounded-lg input-field" required>
                </div>
                <div>
                  <label class="block text-sm text-gray-400 mb-2">Priority</label>
                  <select id="task-priority" class="w-full px-4 py-2 rounded-lg input-field">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <button type="submit" class="w-full py-2 btn-primary rounded-lg font-medium">Add Task</button>
            </div>
          </form>

          <div class="space-y-3">
            <h4 class="text-sm font-semibold text-gray-400 uppercase">Your Tasks</h4>
            <div id="task-list">
              ${userTasks.length === 0 ? '<p class="text-gray-500 text-center py-8">No tasks yet. Add your first task above!</p>' :
      userTasks.map((task, idx) => `
                  <div class="p-4 bg-slate-800 rounded-lg flex items-start justify-between hover:bg-slate-700 transition-colors">
                    <div class="flex items-start space-x-3">
                      <input type="checkbox" class="mt-1 w-5 h-5 rounded" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                      <div>
                        <p class="text-white ${task.completed ? 'line-through text-gray-500' : ''}">${task.description}</p>
                        <div class="flex items-center space-x-3 mt-1">
                          <span class="text-xs text-gray-400">📅 ${formatDate(task.dueDate)}</span>
                          <span class="px-2 py-0.5 rounded text-xs ${task.priority === 'high' ? 'bg-red-500/20 text-red-400' : task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}">${task.priority}</span>
                        </div>
                      </div>
                    </div>
                    <button onclick="deleteTask(${task.id})" class="text-red-400 hover:text-red-300">🗑️</button>
                  </div>
                `).join('')}
            </div>
          </div>
        </div>
      `;
  document.body.appendChild(modal);

  document.getElementById('close-task-modal').addEventListener('click', () => {
    modal.remove();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  document.getElementById('add-task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-date').value;
    const priority = document.getElementById('task-priority').value;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, dueDate, priority })
      });

      const data = await response.json();
      if (data.success) {
        await loadTasks();
        showToast('Task added successfully!');
        modal.remove();
        showTaskManager();
      } else {
        showToast('Failed to add task', 'error');
      }
    } catch (error) {
      console.error('Add task error:', error);
      showToast('Error adding task', 'error');
    }
  });
}

async function toggleTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}/toggle`, { method: 'PUT' });
    if (response.ok) {
      await loadTasks();
      modal = document.getElementById('task-manager-modal');
      if (modal) {
        modal.remove();
        showTaskManager();
      }
    }
  } catch (error) {
    console.error('Toggle task error:', error);
  }
}

async function deleteTask(id) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  try {
    const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (response.ok) {
      await loadTasks();
      showToast('Task deleted');
      document.getElementById('task-manager-modal')?.remove();
      showTaskManager();
    }
  } catch (error) {
    console.error('Delete task error:', error);
    showToast('Error deleting task', 'error');
  }
}

function updateTaskBadge() {
  const badge = document.getElementById('task-count-badge');
  if (badge) {
    const pendingTasks = userTasks.filter(t => !t.completed).length;
    badge.textContent = pendingTasks;
    badge.style.display = pendingTasks > 0 ? 'flex' : 'none';
  }
}

// ============ PREDICTIONS MODULE ============
// API Functions for Predictions
async function loadPredictionData() {
  try {
    const response = await fetch('/api/predictions/admissions');
    const data = await response.json();
    return data.success ? data : null;
  } catch (error) {
    console.error('Failed to load predictions:', error);
    return null;
  }
}

async function loadAnomalies() {
  try {
    const response = await fetch('/api/predictions/anomalies');
    const data = await response.json();
    return data.success ? data : null;
  } catch (error) {
    console.error('Failed to load anomalies:', error);
    return null;
  }
}

async function loadInsights() {
  try {
    const response = await fetch('/api/predictions/insights');
    const data = await response.json();
    return data.success ? data : null;
  } catch (error) {
    console.error('Failed to load insights:', error);
    return null;
  }
}

async function loadMetrics() {
  try {
    const response = await fetch('/api/predictions/metrics');
    const data = await response.json();
    return data.success ? data : null;
  } catch (error) {
    console.error('Failed to load metrics:', error);
    return null;
  }
}

// Render Predictions Page
async function renderPredictions(container) {
  // Load data from backend
  const [predictionData, anomalyData, insightsData, metricsData] = await Promise.all([
    loadPredictionData(),
    loadAnomalies(),
    loadInsights(),
    loadMetrics()
  ]);

  if (!predictionData || !metricsData) {
    container.innerHTML = `
      <div class="p-6">
        <div class="glass rounded-xl p-8 text-center">
          <p class="text-red-400 text-lg">Failed to load prediction data</p>
          <p class="text-gray-400 mt-2">Please try again later</p>
        </div>
      </div>
    `;
    return;
  }

  // Extract data from API responses
  const futureDates = predictionData.predictions.map(p => {
    const date = new Date(p.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const futurePredictions = predictionData.predictions.map(p => p.predicted);
  const anomalies = anomalyData?.anomalies || [];
  const insights = insightsData?.insights || [];
  const anomalyThreshold = anomalyData?.threshold || (metricsData.statistics.average_daily_admissions * 1.3);
  const anomalyIndices = anomalies.map(a => {
    const idx = predictionData.predictions.findIndex(p => p.date === a.date);
    return idx;
  }).filter(i => i !== -1);

  // Get peak prediction
  const maxPrediction = Math.max(...futurePredictions);
  const maxPredictionIdx = futurePredictions.indexOf(maxPrediction);
  const peakDate = futureDates[maxPredictionIdx];

  // Get historical peak day name
  const peakDayDate = new Date(metricsData.statistics.peak_admission_day);
  const peakDayName = peakDayDate.toLocaleDateString('en-US', { weekday: 'long' });

  // Calculate trend
  const avgAdmissions = metricsData.statistics.average_daily_admissions;
  const trendPercent = 8; // Could be calculated from historical data

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="glass rounded-xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">📈 Admission Predictions (Next 14 Days)</h3>
        <div id="prediction-chart" class="chart-container"></div>
        <div class="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p class="text-blue-400 font-medium">🔮 ML Model Insights:</p>
          <p class="text-gray-300 text-sm mt-2">${insights.length > 0 ? insights[0].message : 'Based on historical data analysis using time series forecasting, expect <strong class="text-white">15% higher</strong> admissions on weekends. Peak admission times: 10 AM - 2 PM.'}</p>
          ${anomalyIndices.length > 0 ? `<p class="text-yellow-400 text-sm mt-2">⚠️ Potential high-volume days detected: ${anomalyIndices.map(i => futureDates[i]).join(', ')}</p>` : ''}
        </div>
      </div>

      <div class="glass rounded-xl p-6">
        <h3 class="text-lg font-semibold text-white mb-4">⚠️ Anomaly Detection (Future Predictions)</h3>
        <div id="anomaly-chart" class="chart-container"></div>
        <div class="mt-4 space-y-3">
          ${anomalyIndices.length > 0 ? anomalyIndices.map(idx => {
    const anomaly = anomalies.find(a => predictionData.predictions[idx].date === a.date);
    const percentAbove = anomaly ? Math.round(((anomaly.predicted_value / avgAdmissions) - 1) * 100) : 0;
    return `
              <div class="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center space-x-3">
                <span class="text-2xl pulse-alert">⚠️</span>
                <div>
                  <p class="text-yellow-400 font-medium">Predicted High Volume</p>
                  <p class="text-gray-400 text-sm">${futureDates[idx]}: Expecting ${futurePredictions[idx]} admissions (${percentAbove}% above normal)</p>
                </div>
              </div>
            `;
  }).join('') : '<p class="text-gray-400 text-sm">No anomalies predicted in the next 14 days.</p>'}
          <div class="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center space-x-3">
            <span class="text-2xl">✅</span>
            <div>
              <p class="text-green-400 font-medium">Model Accuracy</p>
              <p class="text-gray-400 text-sm">Current model accuracy: ${metricsData.accuracy}% based on last 30 days of data</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="glass rounded-xl p-6">
      <h3 class="text-lg font-semibold text-white mb-4">📊 Historical Analysis & Trends</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="p-4 bg-slate-800 rounded-lg">
          <p class="text-gray-400 text-sm">Average Daily Admissions</p>
          <p class="text-2xl font-bold text-white mt-2">${Math.round(avgAdmissions)}</p>
          <p class="text-green-400 text-sm mt-1">↑ ${trendPercent}% from last month</p>
        </div>
        <div class="p-4 bg-slate-800 rounded-lg">
          <p class="text-gray-400 text-sm">Peak Admission Day</p>
          <p class="text-2xl font-bold text-white mt-2">${peakDayName}</p>
          <p class="text-blue-400 text-sm mt-1">Avg ${metricsData.statistics.peak_admission_value} admissions</p>
        </div>
        <div class="p-4 bg-slate-800 rounded-lg">
          <p class="text-gray-400 text-sm">Predicted Peak Load</p>
          <p class="text-2xl font-bold text-yellow-400 mt-2">${peakDate}</p>
          <p class="text-yellow-400 text-sm mt-1">${maxPrediction} admissions</p>
        </div>
        <div class="p-4 bg-slate-800 rounded-lg">
          <p class="text-gray-400 text-sm">ML Model Type</p>
          <p class="text-2xl font-bold text-white mt-2">${predictionData.model_type.split(' ')[0]}</p>
          <p class="text-gray-400 text-sm mt-1">Time Series Forecast</p>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    // Prediction Chart with future dates
    const predictionMarkerColors = futurePredictions.map(v => v > anomalyThreshold ? '#ef4444' : '#3b82f6');

    Plotly.newPlot('prediction-chart', [{
      x: futureDates,
      y: futurePredictions,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Predicted Admissions',
      line: { color: '#3b82f6', width: 3 },
      marker: {
        size: 8,
        color: predictionMarkerColors
      }
    }, {
      x: futureDates,
      y: Array(14).fill(predictionData.historical_average),
      type: 'scatter',
      mode: 'lines',
      name: 'Historical Average',
      line: { color: '#22c55e', width: 2, dash: 'dash' }
    }], {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#94a3b8' },
      margin: { l: 40, r: 20, t: 20, b: 60 },
      legend: { orientation: 'h', y: -0.3 },
      xaxis: { gridcolor: '#334155', tickangle: -45 },
      yaxis: { gridcolor: '#334155', title: 'Predicted Admissions' }
    }, { responsive: true });

    // Anomaly Chart with confidence intervals
    const confidenceUpper = predictionData.predictions.map(p => p.upper_bound);
    const confidenceLower = predictionData.predictions.map(p => p.lower_bound);

    Plotly.newPlot('anomaly-chart', [{
      x: futureDates,
      y: futurePredictions,
      type: 'scatter',
      mode: 'lines',
      name: 'Prediction',
      line: { color: '#3b82f6', width: 3 }
    }, {
      x: futureDates,
      y: confidenceUpper,
      type: 'scatter',
      mode: 'lines',
      name: 'Upper Bound',
      line: { color: 'rgba(59, 130, 246, 0.3)', width: 0 },
      fill: 'tonexty',
      fillcolor: 'rgba(59, 130, 246, 0.2)'
    }, {
      x: futureDates,
      y: confidenceLower,
      type: 'scatter',
      mode: 'lines',
      name: 'Lower Bound',
      line: { color: 'rgba(59, 130, 246, 0.3)', width: 0 }
    }, {
      x: futureDates,
      y: Array(14).fill(anomalyThreshold),
      type: 'scatter',
      mode: 'lines',
      name: 'Anomaly Threshold',
      line: { color: '#ef4444', width: 2, dash: 'dot' }
    }], {
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      font: { color: '#94a3b8' },
      margin: { l: 40, r: 20, t: 20, b: 60 },
      xaxis: { gridcolor: '#334155', tickangle: -45 },
      yaxis: { gridcolor: '#334155', title: 'Volume' },
      showlegend: false
    }, { responsive: true });
  }, 100);
}

// ============ SDK INITIALIZATION ============
async function initializeApp() {
  // Initialize Element SDK
  if (window.elementSdk) {
    await window.elementSdk.init({
      defaultConfig,
      onConfigChange: async (newConfig) => {
        config = { ...defaultConfig, ...newConfig };
        const hospitalTitle = document.getElementById('hospital-title');
        const hospitalMantra = document.getElementById('hospital-mantra');
        if (hospitalTitle) hospitalTitle.textContent = config.hospital_name;
        if (hospitalMantra) hospitalMantra.textContent = config.hospital_mantra;
      },
      mapToCapabilities: (cfg) => ({
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
      }),
      mapToEditPanelValues: (cfg) => new Map([
        ['hospital_name', cfg.hospital_name || defaultConfig.hospital_name],
        ['hospital_mantra', cfg.hospital_mantra || defaultConfig.hospital_mantra]
      ])
    });
    config = { ...defaultConfig, ...window.elementSdk.config };
  }

  // Initialize Data SDK
  if (window.dataSdk) {
    const dataHandler = {
      onDataChanged(data) {
        allData = data;
      }
    };
    await window.dataSdk.init(dataHandler);
  }

  render();
}

// Start the application
initializeApp();

// ============ RECENT ADMISSIONS ============
async function loadRecentAdmissions() {
  const tbody = document.getElementById('recent-admissions-tbody');
  if (!tbody) {
    console.error('recent-admissions-tbody not found');
    return;
  }

  tbody.innerHTML = '<tr><td colspan="4" class="py-3 text-center text-gray-400">Loading recent data...</td></tr>';

  try {
    // Fresh fetch to ensure data is up-to-date
    console.log('[loadRecentAdmissions] Fetching fresh data...');
    const response = await fetch('/api/patients?t=' + Date.now());
    const data = await response.json();

    if (data.success && data.patients && data.patients.length > 0) {
      console.log('[loadRecentAdmissions] Loaded', data.patients.length, 'patients');

      tbody.innerHTML = data.patients.slice(0, 5).map(p => {
        // Robust Date Handling
        const dateVal = p.admittedDate || p.admitted_date || p.date || p.admission_date;
        let dateDisplay = formatDate(dateVal);

        // Debug fallback
        if (dateDisplay === 'N/A') {
          console.warn('Date N/A for', p.name, 'Val:', dateVal);
          // Force show raw value if N/A
          dateDisplay = `<span class="text-xs text-red-500" title="Raw: ${dateVal}">RAW: ${dateVal}</span>`;
        }

        return `
          <tr class="border-t border-slate-700">
            <td class="py-3 pr-4">
              <p class="text-white font-medium">${p.name}</p>
              <p class="text-xs text-gray-400">${p.id}</p>
            </td>
            <td class="py-3 pr-4 text-gray-300">${p.department || 'General'}</td>
            <td class="py-3 pr-4">
              <span class="${p.status === 'critical' ? 'text-red-400 bg-red-400/10' : p.status === 'discharged' ? 'text-green-400 bg-green-400/10' : p.status === 'transferred' ? 'text-yellow-400 bg-yellow-400/10' : 'text-blue-400 bg-blue-400/10'} px-2 py-1 rounded text-xs font-medium uppercase tracking-wide">${p.status}</span>
            </td>
            <td class="py-3 text-gray-400">${dateDisplay}</td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="4" class="py-3 text-center text-gray-400">No recent admissions found</td></tr>';
    }
  } catch (error) {
    console.error('Error loading recent admissions:', error);
    tbody.innerHTML = `<tr><td colspan="4" class="py-3 text-center text-red-400">Error loading data: ${error.message}</td></tr>`;
  }
}

