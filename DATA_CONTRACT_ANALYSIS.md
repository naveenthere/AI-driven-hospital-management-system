# Hospital Management System - Data Contract Analysis

## ✅ CONFIRMATION: UI & DOM STRUCTURE FROZEN

**The current HTML structure, CSS styling, DOM elements, and all JavaScript render functions are FROZEN and will NOT be modified.**

---

## 📋 MODULES PRESENT IN THE FILE

The application contains **8 main modules**:

1. **Dashboard** - Overview with real-time stats and charts
2. **Patient Flow Management** - Patient admission, transfer, discharge tracking
3. **Staff & Resources** - Staff allocation, equipment monitoring, bed status
4. **Transactions & Payroll** - Financial transactions and employee payroll
5. **Predictions** - ML-based admission predictions and anomaly detection
6. **Blood & Organs Inventory** - Blood stock and organ availability management
7. **Medical Records** - Patient medical records database
8. **Certificates** - Employee certificates and credentials management

---

## 🗂️ HARDCODED DATASETS

### 1. **users** (Lines 66-74)
User authentication credentials and access control.

```javascript
{
  'CEO001': { password: 'ceo@123', role: 'CEO', name: 'Dr. Sarah Johnson', access: [...] },
  'CFO001': { password: 'cfo@123', role: 'CFO', name: 'Michael Chen', access: [...] },
  'CNO001': { password: 'cno@123', role: 'CNO', name: 'Emily Davis', access: [...] },
  'CMO001': { password: 'cmo@123', role: 'CMO', name: 'Dr. Robert Williams', access: [...] },
  'CCO001': { password: 'cco@123', role: 'CCO', name: 'Jennifer Martinez', access: [...] },
  'MRM001': { password: 'mrm@123', role: 'MRM', name: 'David Thompson', access: [...] },
  'HR001': { password: 'hr@123', role: 'HR', name: 'Human Resources Manager', access: [...] }
}
```

**Data Contract:**
```typescript
{
  [userId: string]: {
    password: string;
    role: string;
    name: string;
    access: string[]; // Array of page IDs: 'dashboard', 'patients', 'staff', etc.
  }
}
```

---

### 2. **samplePatients** (Lines 77-83)
Patient admission and flow tracking data.

```javascript
[
  {
    id: 'ADM001',
    opd: 'OPD1001',
    name: 'John Smith',
    aadhar: '1234-5678-9012',
    bloodGroup: 'O+',
    caretaker: 'Mary Smith',
    phone: '555-0101',
    status: 'admitted',
    admittedDate: '2024-01-15',
    transferredDate: null,
    dischargedDate: null,
    department: 'Cardiology',
    doctor: 'Dr. Amanda Foster',
    nurse: 'Nurse Sarah Wilson'
  },
  // ... more patients
]
```

**Data Contract:**
```typescript
{
  id: string;              // Admission ID (e.g., 'ADM001')
  opd: string;             // OPD ID (e.g., 'OPD1001')
  name: string;            // Patient full name
  aadhar: string;          // Aadhar number (format: 'XXXX-XXXX-XXXX')
  bloodGroup: string;      // Blood group (e.g., 'O+', 'A-', 'B+', 'AB-')
  caretaker: string;       // Caretaker/Guardian name
  phone: string;           // Contact phone number
  status: string;          // 'admitted' | 'discharged' | 'transferred' | 'critical'
  admittedDate: string;    // ISO date string (YYYY-MM-DD)
  transferredDate: string | null;  // ISO date string or null
  dischargedDate: string | null;   // ISO date string or null
  department: string;      // Department name
  doctor: string;          // Assigned doctor name
  nurse: string;           // Assigned nurse name
}
```

---

### 3. **sampleStaff** (Lines 85-91)
Staff allocation and attendance data.

```javascript
[
  {
    id: 'STF001',
    name: 'Dr. Amanda Foster',
    department: 'Cardiology',
    shift: 'Day',
    status: 'Present'
  },
  // ... more staff
]
```

**Data Contract:**
```typescript
{
  id: string;          // Staff ID (e.g., 'STF001')
  name: string;        // Full name with title
  department: string;  // Department name
  shift: string;       // 'Day' | 'Night'
  status: string;      // 'Present' | 'Leave'
}
```

---

### 4. **sampleEquipment** (Lines 93-99)
Medical equipment tracking data.

```javascript
[
  {
    id: 'EQ001',
    name: 'MRI Scanner',
    status: 'In Use',
    department: 'Radiology',
    lastService: '2024-01-01'
  },
  // ... more equipment
]
```

**Data Contract:**
```typescript
{
  id: string;          // Equipment ID (e.g., 'EQ001')
  name: string;        // Equipment name
  status: string;      // 'In Use' | 'Under Repair' | 'To Purchase'
  department: string;  // Department name
  lastService: string; // ISO date string or 'N/A'
}
```

---

### 5. **sampleTransactions** (Lines 101-107)
Financial transaction records.

```javascript
[
  {
    id: 'TXN001',
    date: '2024-01-15',
    type: 'Equipment',
    description: 'MRI Maintenance',
    amount: -15000
  },
  // ... more transactions
]
```

**Data Contract:**
```typescript
{
  id: string;          // Transaction ID (e.g., 'TXN001')
  date: string;        // ISO date string (YYYY-MM-DD)
  type: string;        // 'Equipment' | 'Medicine' | 'Revenue' | 'Payroll' | 'Other'
  description: string; // Transaction description
  amount: number;      // Positive for revenue, negative for expenses
}
```

---

### 6. **samplePayroll** (Lines 109-135)
Employee payroll data organized by category.

```javascript
{
  doctors: [
    {
      id: 'PAY001',
      employeeId: 'STF001',
      name: 'Dr. Amanda Foster',
      role: 'Cardiologist',
      baseSalary: 15000,
      bonus: 2000,
      deductions: 1500,
      netSalary: 15500
    },
    // ... more doctors
  ],
  nurses: [ /* ... */ ],
  management: [ /* ... */ ],
  technicians: [ /* ... */ ],
  others: [ /* ... */ ]
}
```

**Data Contract:**
```typescript
{
  doctors: PayrollEntry[];
  nurses: PayrollEntry[];
  management: PayrollEntry[];
  technicians: PayrollEntry[];
  others: PayrollEntry[];
}

interface PayrollEntry {
  id: string;          // Payroll ID (e.g., 'PAY001')
  employeeId: string;  // Employee/Staff ID
  name: string;        // Full name
  role: string;        // Job title/position
  baseSalary: number;  // Base salary amount
  bonus: number;       // Bonus amount
  deductions: number;  // Deductions amount
  netSalary: number;   // Calculated: baseSalary + bonus - deductions
}
```

---

### 7. **sampleBloodStock** (Lines 137-146)
Blood inventory data.

```javascript
[
  {
    type: 'A+',
    units: 45,
    donors: 12
  },
  // ... all blood types
]
```

**Data Contract:**
```typescript
{
  type: string;   // Blood type: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  units: number;  // Number of units available
  donors: number; // Number of registered donors
}
```

---

### 8. **sampleOrgans** (Lines 148-154)
Organ availability and waitlist data.

```javascript
[
  {
    type: 'Kidney',
    available: 8,
    waitlist: 45
  },
  // ... more organs
]
```

**Data Contract:**
```typescript
{
  type: string;      // Organ type: 'Kidney' | 'Liver' | 'Heart' | 'Lungs' | 'Cornea'
  available: number; // Number of organs available
  waitlist: number;  // Number of patients on waitlist
}
```

---

### 9. **sampleCertificates** (Lines 156-160)
Employee certificate and credential tracking.

```javascript
[
  {
    id: 'CERT001',
    employeeId: 'STF001',
    name: 'Dr. Amanda Foster',
    certificate: 'Board Certified Cardiologist',
    issueDate: '2020-06-15',
    expiryDate: '2025-06-15',
    status: 'Valid'
  },
  // ... more certificates
]
```

**Data Contract:**
```typescript
{
  id: string;          // Certificate ID (e.g., 'CERT001')
  employeeId: string;  // Employee/Staff ID
  name: string;        // Employee full name
  certificate: string; // Certificate/credential name
  issueDate: string;   // ISO date string (YYYY-MM-DD)
  expiryDate: string;  // ISO date string (YYYY-MM-DD)
  status: string;      // 'Valid' | 'Expiring Soon' | 'Expired'
}
```

---

### 10. **sampleRecords** (Lines 162-166)
Medical records database.

```javascript
[
  {
    id: 'REC001',
    patientId: 'ADM001',
    name: 'John Smith',
    diagnosis: 'Hypertension',
    treatment: 'Medication',
    doctor: 'Dr. Amanda Foster',
    lastVisit: '2024-01-15'
  },
  // ... more records
]
```

**Data Contract:**
```typescript
{
  id: string;         // Record ID (e.g., 'REC001')
  patientId: string;  // Patient admission ID
  name: string;       // Patient full name
  diagnosis: string;  // Medical diagnosis
  treatment: string;  // Treatment plan
  doctor: string;     // Attending doctor name
  lastVisit: string;  // ISO date string (YYYY-MM-DD)
}
```

---

### 11. **userTasks** (Line 63)
User task management (initially empty array).

**Data Contract:**
```typescript
{
  description: string; // Task description
  dueDate: string;     // ISO date string (YYYY-MM-DD)
  priority: string;    // 'low' | 'medium' | 'high'
  completed: boolean;  // Task completion status
}
```

---

## 🎨 RENDER FUNCTIONS (DO NOT MODIFY)

All render functions are **FROZEN** and must not be modified:

1. **`render()`** (Lines 195-205) - Main render controller
2. **`renderLoginPage()`** (Lines 207-296) - Login page UI
3. **`renderMainLayout()`** (Lines 298-383) - Main application layout with sidebar
4. **`renderCurrentPage()`** (Lines 385-427) - Page router
5. **`renderDashboard(container)`** (Lines 429-665) - Dashboard module
6. **`renderPatients(container)`** (Lines 667-877) - Patient Flow module
7. **`renderStaff(container)`** (Lines 879-1037) - Staff & Resources module
8. **`renderTransactions(container)`** (Lines 1039-1444) - Transactions & Payroll module
9. **`renderPredictions(container)`** (Lines 1446-1607) - Predictions module
10. **`renderInventory(container)`** (Lines 1609-1727) - Blood & Organs module
11. **`renderRecords(container)`** (Lines 1729-1780) - Medical Records module
12. **`renderCertificates(container)`** (Lines 1782-1851) - Certificates module

---

## 🔧 EVENT HANDLERS (DO NOT MODIFY)

All event handlers are **FROZEN** and must not be modified:

1. **`attachLoginEvents()`** (Lines 1854-1895) - Login page interactions
2. **`attachMainEvents()`** (Lines 1897-1921) - Main navigation and logout
3. **`showTaskManager()`** (Lines 1923-2003) - Task manager modal
4. **`toggleTask(idx)`** (Lines 2005-2008) - Toggle task completion
5. **`deleteTask(idx)`** (Lines 2010-2016) - Delete task
6. **`updateTaskBadge()`** (Lines 2018-2025) - Update task count badge

Additional inline event handlers within render functions (also frozen):
- Patient search and filtering
- Patient date updates (transfer/discharge)
- Equipment status updates
- Transaction modal
- Payroll input changes
- Add/delete payroll entries

---

## 🔒 UTILITY FUNCTIONS (DO NOT MODIFY)

1. **`formatCurrency(amount)`** (Lines 169-171) - Currency formatting
2. **`formatDate(date)`** (Lines 173-175) - Date formatting
3. **`generateId(prefix)`** (Lines 177-179) - ID generation
4. **`hasAccess(page)`** (Lines 181-184) - Access control check
5. **`showToast(message, type)`** (Lines 186-192) - Toast notifications

---

## 📊 GLOBAL STATE VARIABLES

```javascript
let config = { ...defaultConfig };  // Hospital configuration
let currentUser = null;             // Currently logged-in user
let currentPage = 'login';          // Current active page
let allData = [];                   // Data from SDK
let userTasks = [];                 // User's task list
```

---

## 🎯 NEXT STEPS

**For backend integration:**
- Replace hardcoded arrays with API calls
- Maintain exact same data structure (contracts above)
- Ensure API responses match the data contracts
- Do NOT modify any render functions or DOM structure
- Do NOT modify any event handlers
- Only replace data sources (the `sample*` arrays)

**Key Integration Points:**
- Replace `samplePatients` with API call to `/api/patients`
- Replace `sampleStaff` with API call to `/api/staff`
- Replace `sampleEquipment` with API call to `/api/equipment`
- Replace `sampleTransactions` with API call to `/api/transactions`
- Replace `samplePayroll` with API call to `/api/payroll`
- Replace `sampleBloodStock` with API call to `/api/blood-stock`
- Replace `sampleOrgans` with API call to `/api/organs`
- Replace `sampleCertificates` with API call to `/api/certificates`
- Replace `sampleRecords` with API call to `/api/records`
- Replace `users` object with API call to `/api/auth/login`

---

## ✅ SUMMARY

- **8 main modules** identified
- **11 hardcoded datasets** documented with complete data contracts
- **12 render functions** identified (FROZEN - DO NOT MODIFY)
- **6+ event handler functions** identified (FROZEN - DO NOT MODIFY)
- **5 utility functions** identified (FROZEN - DO NOT MODIFY)
- **UI/DOM structure** is FROZEN and will remain untouched
- **Data contracts** are clearly defined for backend integration
