# Database Schema Documentation

## ✅ Schema Design Principles

**CRITICAL**: All column names **EXACTLY match** the JavaScript object keys used in the frontend.

- **Frontend uses camelCase** → Database uses **camelCase**
- **No snake_case conversions** (e.g., NOT `blood_group`, but `bloodGroup`)
- **Field names are identical** to what JavaScript expects

---

## 📊 Table Overview

| # | Table Name | Purpose | JS Data Source |
|---|------------|---------|----------------|
| 1 | `users` | Authentication & access control | `users` object |
| 2 | `patients` | Patient admission tracking | `samplePatients` array |
| 3 | `staff` | Staff management | `sampleStaff` array |
| 4 | `attendance` | Staff attendance (future) | N/A (new table) |
| 5 | `equipment` | Equipment tracking | `sampleEquipment` array |
| 6 | `transactions` | Financial transactions | `sampleTransactions` array |
| 7 | `payroll` | Employee payroll | `samplePayroll` object |
| 8 | `blood_stock` | Blood inventory | `sampleBloodStock` array |
| 9 | `organ_inventory` | Organ availability | `sampleOrgans` array |
| 10 | `certificates` | Employee credentials | `sampleCertificates` array |
| 11 | `medical_records` | Patient medical records | `sampleRecords` array |
| 12 | `tasks` | User task management | `userTasks` array |

---

## 🔗 Table Relationships

### Entity Relationship Diagram

```
users (userId)
  ↓ 1:N
tasks (userId) ← FK

staff (id)
  ↓ 1:N
  ├── payroll (employeeId) ← FK
  ├── certificates (employeeId) ← FK
  └── attendance (staffId) ← FK

patients (id)
  ↓ 1:N
medical_records (patientId) ← FK

[Independent Tables]
- equipment
- transactions
- blood_stock
- organ_inventory
```

---

## 📋 Detailed Table Specifications

### 1. **users** Table
**Purpose**: User authentication and role-based access control

**JS Mapping**: `users[userId]`

| Column | Type | JS Key | Description |
|--------|------|--------|-------------|
| `userId` | VARCHAR(20) PK | `userId` (key) | User ID (e.g., 'CEO001') |
| `password` | VARCHAR(255) | `password` | Plain text password (demo only) |
| `role` | VARCHAR(50) | `role` | User role (CEO, CFO, etc.) |
| `name` | VARCHAR(100) | `name` | Full name |
| `access` | JSON | `access` | Array of accessible pages |

**Relationships**:
- → `tasks.userId` (1:N)

---

### 2. **patients** Table
**Purpose**: Patient admission and flow tracking

**JS Mapping**: `samplePatients[]`

| Column | Type | JS Key | Description |
|--------|------|--------|-------------|
| `id` | VARCHAR(20) PK | `id` | Admission ID (e.g., 'ADM001') |
| `opd` | VARCHAR(20) UNIQUE | `opd` | OPD ID (e.g., 'OPD1001') |
| `name` | VARCHAR(100) | `name` | Patient full name |
| `aadhar` | VARCHAR(20) | `aadhar` | Aadhar number |
| `bloodGroup` | VARCHAR(5) | `bloodGroup` | Blood type (e.g., 'O+') |
| `caretaker` | VARCHAR(100) | `caretaker` | Guardian name |
| `phone` | VARCHAR(20) | `phone` | Contact number |
| `status` | ENUM | `status` | admitted/discharged/transferred/critical |
| `admittedDate` | DATE | `admittedDate` | Admission date |
| `transferredDate` | DATE NULL | `transferredDate` | Transfer date (nullable) |
| `dischargedDate` | DATE NULL | `dischargedDate` | Discharge date (nullable) |
| `department` | VARCHAR(100) | `department` | Department name |
| `doctor` | VARCHAR(100) | `doctor` | Assigned doctor |
| `nurse` | VARCHAR(100) | `nurse` | Assigned nurse |

**Relationships**:
- → `medical_records.patientId` (1:N)

---

### 3. **staff** Table
**Purpose**: Staff allocation and management

**JS Mapping**: `sampleStaff[]`

| Column | Type | JS Key | Description |
|--------|------|--------|-------------|
| `id` | VARCHAR(20) PK | `id` | Staff ID (e.g., 'STF001') |
| `name` | VARCHAR(100) | `name` | Full name with title |
| `department` | VARCHAR(100) | `department` | Department name |
| `shift` | ENUM | `shift` | Day/Night |
| `status` | ENUM | `status` | Present/Leave/Absent |

**Relationships**:
- → `payroll.employeeId` (1:N)
- → `certificates.employeeId` (1:N)
- → `attendance.staffId` (1:N)

---

### 4. **attendance** Table
**Purpose**: Staff attendance tracking (future expansion)

**JS Mapping**: N/A (new table)

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT PK AUTO | Auto-increment ID |
| `staffId` | VARCHAR(20) FK | References `staff.id` |
| `date` | DATE | Attendance date |
| `checkIn` | TIME NULL | Check-in time |
| `checkOut` | TIME NULL | Check-out time |
| `status` | ENUM | Present/Leave/Absent/Half Day |

**Relationships**:
- ← `staff.id` (N:1)

---

### 5. **equipment** Table
**Purpose**: Medical equipment tracking

**JS Mapping**: `sampleEquipment[]`

| Column | Type | JS Key | Description |
|--------|------|--------|-------------|
| `id` | VARCHAR(20) PK | `id` | Equipment ID (e.g., 'EQ001') |
| `name` | VARCHAR(100) | `name` | Equipment name |
| `status` | ENUM | `status` | In Use/Under Repair/To Purchase |
| `department` | VARCHAR(100) | `department` | Department name |
| `lastService` | DATE NULL | `lastService` | Last service date |

**Relationships**: None (independent)

---

### 6. **transactions** Table
**Purpose**: Financial transaction records

**JS Mapping**: `sampleTransactions[]`

| Column | Type | JS Key | Description |
|--------|------|--------|-------------|
| `id` | VARCHAR(20) PK | `id` | Transaction ID (e.g., 'TXN001') |
| `date` | DATE | `date` | Transaction date |
| `type` | ENUM | `type` | Equipment/Medicine/Revenue/Payroll/Other |
| `description` | TEXT | `description` | Transaction details |
| `amount` | DECIMAL(12,2) | `amount` | Amount (+revenue, -expense) |

**Relationships**: None (independent)

---

### 7. **payroll** Table
**Purpose**: Employee payroll records

**JS Mapping**: `samplePayroll.{category}[]`

| Column | Type | JS Key | Description |
|--------|------|--------|-------------|
| `id` | VARCHAR(20) PK | `id` | Payroll ID (e.g., 'PAY001') |
| `employeeId` | VARCHAR(20) FK | `employeeId` | References `staff.id` |
| `name` | VARCHAR(100) | `name` | Employee name |
| `role` | VARCHAR(100) | `role` | Job title |
| `category` | ENUM | N/A | doctors/nurses/management/technicians/others |
| `baseSalary` | DECIMAL(10,2) | `baseSalary` | Base salary |
| `bonus` | DECIMAL(10,2) | `bonus` | Bonus amount |
| `deductions` | DECIMAL(10,2) | `deductions` | Deductions |
| `netSalary` | DECIMAL(10,2) GENERATED | `netSalary` | Calculated: base + bonus - deductions |

**Relationships**:
- ← `staff.id` (N:1)

**Note**: Frontend groups payroll by category (doctors, nurses, etc.). Backend stores category as ENUM.

---

### 8. **blood_stock** Table
**Purpose**: Blood inventory management

**JS Mapping**: `sampleBloodStock[]`

| Column | Type | JS Key | Description |
|--------|------|--------|-------------|
| `id` | INT PK AUTO | N/A | Auto-increment ID |
| `type` | ENUM UNIQUE | `type` | A+/A-/B+/B-/AB+/AB-/O+/O- |
| `units` | INT | `units` | Units available |
| `donors` | INT | `donors` | Registered donors |

**Relationships**: None (independent)

---

### 9. **organ_inventory** Table
**Purpose**: Organ availability and waitlist

**JS Mapping**: `sampleOrgans[]`

| Column | Type | JS Key | Description |
|--------|------|--------|-------------|
| `id` | INT PK AUTO | N/A | Auto-increment ID |
| `type` | ENUM UNIQUE | `type` | Kidney/Liver/Heart/Lungs/Cornea |
| `available` | INT | `available` | Organs available |
| `waitlist` | INT | `waitlist` | Patients waiting |

**Relationships**: None (independent)

---

### 10. **certificates** Table
**Purpose**: Employee certificates and credentials

**JS Mapping**: `sampleCertificates[]`

| Column | Type | JS Key | Description |
|--------|------|--------|-------------|
| `id` | VARCHAR(20) PK | `id` | Certificate ID (e.g., 'CERT001') |
| `employeeId` | VARCHAR(20) FK | `employeeId` | References `staff.id` |
| `name` | VARCHAR(100) | `name` | Employee name |
| `certificate` | VARCHAR(200) | `certificate` | Certificate name |
| `issueDate` | DATE | `issueDate` | Issue date |
| `expiryDate` | DATE | `expiryDate` | Expiry date |
| `status` | ENUM | `status` | Valid/Expiring Soon/Expired |

**Relationships**:
- ← `staff.id` (N:1)

---

### 11. **medical_records** Table
**Purpose**: Patient medical records

**JS Mapping**: `sampleRecords[]`

| Column | Type | JS Key | Description |
|--------|------|--------|-------------|
| `id` | VARCHAR(20) PK | `id` | Record ID (e.g., 'REC001') |
| `patientId` | VARCHAR(20) FK | `patientId` | References `patients.id` |
| `name` | VARCHAR(100) | `name` | Patient name |
| `diagnosis` | TEXT | `diagnosis` | Medical diagnosis |
| `treatment` | TEXT | `treatment` | Treatment plan |
| `doctor` | VARCHAR(100) | `doctor` | Attending doctor |
| `lastVisit` | DATE | `lastVisit` | Last visit date |

**Relationships**:
- ← `patients.id` (N:1)

---

### 12. **tasks** Table
**Purpose**: User task management

**JS Mapping**: `userTasks[]`

| Column | Type | JS Key | Description |
|--------|------|--------|-------------|
| `id` | INT PK AUTO | N/A | Auto-increment ID |
| `userId` | VARCHAR(20) FK | N/A | References `users.userId` |
| `description` | TEXT | `description` | Task description |
| `dueDate` | DATE | `dueDate` | Due date |
| `priority` | ENUM | `priority` | low/medium/high |
| `completed` | BOOLEAN | `completed` | Completion status |

**Relationships**:
- ← `users.userId` (N:1)

---

## 🔑 Foreign Key Relationships

| Child Table | FK Column | Parent Table | Parent Column | On Delete |
|-------------|-----------|--------------|---------------|-----------|
| `tasks` | `userId` | `users` | `userId` | CASCADE |
| `payroll` | `employeeId` | `staff` | `id` | CASCADE |
| `certificates` | `employeeId` | `staff` | `id` | CASCADE |
| `attendance` | `staffId` | `staff` | `id` | CASCADE |
| `medical_records` | `patientId` | `patients` | `id` | CASCADE |

**CASCADE Behavior**: When a parent record is deleted, all related child records are automatically deleted.

---

## 📝 Important Notes

### 1. **Field Name Matching**
✅ **Correct**: `bloodGroup`, `admittedDate`, `employeeId`  
❌ **Wrong**: `blood_group`, `admitted_date`, `employee_id`

### 2. **JSON Fields**
- `users.access`: Stores array as JSON (e.g., `["dashboard", "patients"]`)
- When querying, use MySQL JSON functions: `JSON_CONTAINS(access, '"patients"')`

### 3. **Generated Columns**
- `payroll.netSalary`: Auto-calculated as `baseSalary + bonus - deductions`
- Cannot be manually inserted/updated

### 4. **ENUM Values**
All ENUM values match **exact** JavaScript strings:
- `status`: `'admitted'`, `'discharged'`, `'transferred'`, `'critical'`
- `shift`: `'Day'`, `'Night'` (capitalized!)
- `type` (blood): `'A+'`, `'O-'`, etc.

### 5. **Date Format**
- Database: `DATE` type (YYYY-MM-DD)
- JavaScript: ISO string (YYYY-MM-DD)
- **Perfect match** - no conversion needed!

---

## 🔄 API Response Format

When building APIs, return data in this exact format:

### Example: GET /api/patients
```json
[
  {
    "id": "ADM001",
    "opd": "OPD1001",
    "name": "John Smith",
    "aadhar": "1234-5678-9012",
    "bloodGroup": "O+",
    "caretaker": "Mary Smith",
    "phone": "555-0101",
    "status": "admitted",
    "admittedDate": "2024-01-15",
    "transferredDate": null,
    "dischargedDate": null,
    "department": "Cardiology",
    "doctor": "Dr. Amanda Foster",
    "nurse": "Nurse Sarah Wilson"
  }
]
```

**CRITICAL**: Column names from database = JSON keys in API response!

---

## ✅ Summary

- **12 tables** created
- **5 foreign key relationships** defined
- **100% field name match** with JavaScript
- **All data contracts** preserved
- **Seed data** included for testing
- **Ready for API integration**
