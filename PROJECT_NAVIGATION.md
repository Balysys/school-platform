# 🗺️ Project Navigation Guide

## 📚 Documentation (Start Here)

| Document | Purpose | Length | Read Time |
|----------|---------|--------|-----------|
| **README.md** | Overview & Quick Start | Long | 5 min |
| **COMPLETION_SUMMARY.md** | What was built | Short | 3 min |
| **OPTIMIZATIONS_REPORT.md** | v2.0 Improvements | Medium | 7 min |
| **DEVELOPERS_GUIDE.md** | How to code here | Very Long | 15 min |
| **DEPLOYMENT_CONFIG.md** | Production setup | Medium | 5 min |

---

## 🏗️ Backend Structure

### Routes (API Endpoints)
```
backend/src/routes/
├── auth.ts          → POST /auth/login, /auth/register
├── utilisateurs.ts  → CRUD /api/utilisateurs (Admin only)
├── eleves.ts        → CRUD /api/eleves (with RBAC)
├── classes.ts       → CRUD /api/classes
├── matieres.ts      → CRUD /api/matieres
├── periodes.ts      → CRUD /api/periodes
└── notes.ts         → CRUD /api/notes + /api/notes/eleve/:id/moyennes

Total Endpoints: 30+
Auth Type: JWT Bearer
```

### Core Files
```
backend/
├── src/app.ts       → Express app setup, middleware, routes
├── src/db.ts        → Prisma client export
├── prisma/
│   ├── schema.prisma → Database models (6 tables)
│   └── seed.ts      → Test data generation (226 records)
└── package.json     → Dependencies & scripts
```

### Key Features
- **Auth**: JWT (7 days) + bcrypt password hashing
- **RBAC**: 3 roles (ADMIN, ENSEIGNANT, PARENT)
- **Database**: SQLite with Prisma ORM
- **Validation**: Grade (0-20), IDs, email format
- **Security**: CORS, Helmet headers, HTTPS ready

---

## 🎨 Frontend Structure

### Components (New - Reusable)
```
frontend/src/components/
├── Toast.tsx        → Global notifications (success/error/info/warning)
│   └─ Usage: showToast("success", "Message")
│   └─ Features: Auto-dismiss, animations, stacking
│
├── Modal.tsx        → Dialog boxes & confirmations
│   ├─ <Modal />     → Generic dialog
│   └─ <ConfirmDialog /> → Pre-built delete confirmation
│   └─ Features: Cancel/Confirm buttons, danger state
│
├── Layout.tsx       → Standardized dashboard layout
│   ├─ <DashboardLayout /> → Header + content wrapper
│   ├─ <Tabs />      → Tab navigation
│   ├─ <Card />      → White box with shadow
│   └─ <Section />   → Title + content container
│
├── Form.tsx         → Form components
│   ├─ <Form />      → Form wrapper
│   ├─ <Input />     → Text, email, number, date, password
│   ├─ <Select />    → Dropdown with options
│   └─ <Button />    → primary/secondary/danger variants
│   └─ Features: Validation, error messages, disabled states
│
├── Table.tsx        → Generic data table
│   └─ <Table<T> />  → TypeScript generic
│   └─ Features: Search, Sort, Pagination, Custom render, Actions
│
└── index.ts         → Barrel export (import from './components')
```

### Pages (Dashboards)
```
frontend/src/pages/
├── Login.tsx
│   ├­─ Auth form
│   ├─ Test accounts (clickable auto-fill)
│   ├─ Backend health check
│   └─ JWT token storage
│
├── DashboardAdmin.tsx
│   ├─ 5 Tabs: Users, Élèves, Classes, Matières, Périodes
│   ├─ Each tab: Create form + List table
│   ├─ Features: Search, Delete confirm, Pagination
│   └─ Permissions: ADMIN only
│
├── DashboardEnseignant.tsx
│   ├─ Filters: Classe + Matière + Période
│   ├─ List 180 grades with pagination
│   ├─ Inline edit modal
│   ├─ Validation (0-20)
│   └─ Delete with confirm
│
└── DashboardParent.tsx
    ├─ Select child (grid buttons)
    ├─ Show averages per trimester
    ├─ Color-coded grades (4 levels)
    ├─ List all grades (searchable)
    └─ Show teacher names
```

### Utils & Config
```
frontend/src/
├── App.jsx          → Router + role-based guards + Toast
├── main.jsx         → React entry point
├── index.css        → Global styles + animations
├── api/
│   └─ axios.ts      → API client + JWT interceptor
├── vite.config.js   → Build config
└── tailwind.config.js → Tailwind setup
```

---

## 🔄 Data Flow

### Authentication Flow
```
User → Login Page
    ↓
POST /auth/login (email, password)
    ↓
Backend validates + generates JWT
    ↓
Store token in localStorage
    ↓
Decode token → Extract role
    ↓
Route based on role → Dashboard
```

### CRUD Flow (Example: Create Note)
```
User → Teacher Dashboard
    ↓
Fill form + Submit
    ↓
POST /api/notes (with Bearer token)
    ↓
Backend validates + stores in DB
    ↓
showToast("success", "Note créée")
    ↓
Refresh table + Reset form
```

### RBAC Check Flow
```
Frontend:
  - Route guard (role check before render)
Backend:
  - Middleware checks token
  - Extract role from JWT
  - Allow/Deny based on role
```

---

## 🎯 Key Concepts

### Components Library Pattern
```typescript
// Export all at once
import { 
  Toast, Button, Table, Modal, Input, Select 
} from "@/components";

// No more repetitive UI code!
```

### TypeScript Generics
```typescript
// Table can work with any data structure
<Table<User>
  columns={...}
  data={users}
/>

<Table<Note>
  columns={...}
  data={notes}
/>
```

### Form State Pattern
```typescript
const [formData, setFormData] = useState({
  user: { nom: "", email: "", role: "ENSEIGNANT" },
  eleve: { nom: "", prenom: "", classeId: "" },
  // ... other forms
});

// Update nested properties
setFormData(prev => ({
  ...prev,
  user: { ...prev.user, nom: value }
}));
```

### Filter Pattern
```typescript
useEffect(() => {
  let filtered = notes;
  if (filters.classe) filtered = filtered.filter(...);
  if (filters.matiere) filtered = filtered.filter(...);
  setFiltered(filtered);
}, [notes, filters]);
```

---

## 🚀 Common Tasks

### Add New Dashboard Page
```typescript
1. Create frontend/src/pages/NewPage.tsx
2. Import reusable components
3. Add route in App.jsx
4. Test routing

// Template
import { DashboardLayout, Card, Table } from "@/components";

export default function NewPage() {
  return (
    <DashboardLayout title="New Page" icon="📄">
      <Card>...</Card>
    </DashboardLayout>
  );
}
```

### Add New API Endpoint
```typescript
1. Create route in backend/src/routes/newroute.ts
2. Add to app.ts: app.use('/api/new', newRoutes)
3. Implement RBAC if needed
4. Test with curl/Postman

// Template
import { Router } from 'express';
import { authenticate, authorize } from '../middleware';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), (req, res) => {
  // Logic here
});

export default router;
```

### Style Component
```typescript
// Use Tailwind utilities
<div className="p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition">
  {content}
</div>

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {items}
</div>

// Colors
className="bg-blue-600 text-white hover:bg-blue-700"
```

---

## 🧪 Testing Checklist

Before deploying, verify:

- [ ] Backend builds (`npm run build`)
- [ ] Frontend builds (`npm run build`)
- [ ] Database seeds (`npm run seed`)
- [ ] API accessible (`curl localhost:3001/api/health`)
- [ ] Login works (test all 3 roles)
- [ ] Admin CRUD works (create, read, delete)
- [ ] Teacher can edit notes
- [ ] Parent sees only own children
- [ ] Responsive on mobile (320px)
- [ ] No console errors
- [ ] No TypeScript errors

---

## 🔍 Debugging Tips

### Backend Issues
```bash
# Check database
sqlite3 backend/prisma/dev.db "SELECT COUNT(*) FROM User;"

# View logs
npm run dev 2>&1 | grep -i error

# Test endpoint
curl http://localhost:3001/api/health
```

### Frontend Issues
```bash
# Browser DevTools
F12 → Console tab → Check for errors

# Check token
localStorage.getItem("token")

# Check API calls
Network tab → Look for failed requests
```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Port already in use | Process running | Kill or use PORT=3002 |
| CORS error | Frontend URL mismatch | Check CORS_ORIGIN in .env |
| JWT invalid | Token expired | Login again |
| Data not loading | API failing | Check backend logs |

---

## 📈 Next Steps

### To Learn More
1. Read DEVELOPERS_GUIDE.md (detailed examples)
2. Explore components source code
3. Try modifying a dashboard
4. Add a new field to a form

### To Deploy
1. Read DEPLOYMENT_CONFIG.md
2. Set up .env file
3. Use Docker or Heroku
4. Configure database

### To Expand
- Add tests (Jest/Vitest)
- Add E2E tests (Cypress)
- Add charts (Chart.js)
- Add export (PDF/Excel)
- Add notifications (email)

---

## 📞 Quick Links

- **React Docs**: https://react.dev
- **TypeScript**: https://typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Prisma**: https://prisma.io/docs
- **Express**: https://expressjs.com/

---

**Last Updated:** 27 Mars 2026  
**Status:** ✅ Production Ready
