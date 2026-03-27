# 👨‍💻 Guide Développeurs - School Platform

## 📁 Structure du Projet

```
school-platform/
├── backend/                # Express API + Prisma
├── frontend/              # React + TypeScript + Tailwind
├── README.md              # Guide principal
├── OPTIMIZATIONS_REPORT.md # Détails améliorations
└── package.json           # Root config
```

---

## 🏗️ Architecture Frontend

### Dossier: `/frontend/src/components/`

Contient **5 composants réutilisables** suivant le pattern **Component Library**:

#### 1. **Toast.tsx** (445 LOC)
Système de notifications global
```typescript
// Utilisation
import { showToast } from "@/components";

showToast("success", "Opération réussie");
showToast("error", "Une erreur est survenue", 5000);
```

**Features**:
- ✅ 4 types: success, error, info, warning
- ✅ Auto-dismiss après 3s (configurable)
- ✅ Animations slide-in
- ✅ Stack automatique (max 5)

#### 2. **Modal.tsx** (70 LOC)
Dialogues & confirmations
```typescript
// Utilisation
<Modal
  isOpen={isOpen}
  title="Confirmation"
  onConfirm={handleDelete}
  onClose={close}
  isDangerous
>
  Êtes-vous sûr?
</Modal>
```

**Features**:
- ✅ Modal générique
- ✅ ConfirmDialog prédéfini
- ✅ Boutons confirm/cancel
- ✅ État dangerous (rouge)

#### 3. **Layout.tsx** (90 LOC)
Layout standardisé
```typescript
// Utilisation
<DashboardLayout title="Admin Panel" icon="⚙️">
  <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
  <Card><Section title="Title">{content}</Section></Card>
</DashboardLayout>
```

**Exports**:
- `DashboardLayout` - Header + Déconnexion
- `Tabs` - Navigation par onglets
- `Card` - Wrapper styling
- `Section` - Titre + contenu

#### 4. **Form.tsx** (115 LOC)
Composants formulaire réactifs
```typescript
// Utilisation
<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
/>

<Select
  label="Rôle"
  options={roles}
  value={role}
  onChange={setRole}
/>

<Button isLoading={loading} variant="primary">
  Envoyer
</Button>
```

**Exports**:
- `Form` - Wrapper form
- `Input` - Text, password, email, number, date
- `Select` - Dropdown avec validation
- `Button` - primary/secondary/danger variants

#### 5. **Table.tsx** (180 LOC)
Table générique avancée
```typescript
// Utilisation
<Table<User>
  columns={[
    { key: "nom", label: "Nom", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Rôle",
      render: (value) => <span className="badge">{value}</span>
    }
  ]}
  data={users}
  searchable
  searchFields={["nom","email"]}
  actions={(row) => (
    <button onClick={() => delete(row.id)}>Supprimer</button>
  )}
/>
```

**Features**:
- ✅ Générique `Table<T>`
- ✅ Recherche multi-champs
- ✅ Tri par colonnes
- ✅ Pagination auto
- ✅ Render personnalisé par colonne
- ✅ Actions row-by-row

---

## 🎨 Pages Principales

### `/pages/Login.tsx`
Points clés:
- ✅ Gradient background
- ✅ Backend connection check
- ✅ Test accounts cliquables (auto-fill)
- ✅ JWT token storage

```typescript
// Login flow
1. Vérifier backend (/health)
2. POST /auth/login
3. Store token dans localStorage
4. Redirect /dashboard
```

### `/pages/DashboardAdmin.tsx`
Points clés:
- ✅ 5 onglets (users, eleves, classes, matieres, periodes)
- ✅ Chaque onglet: form création + table listing
- ✅ FormData centralisée par type
- ✅ Delete confirmation
- ✅ Fetch all data on mount

```typescript
// Pattern pour chaque onglet:
1. Form création avec validation
2. POST /api/{resource}
3. Reset form + Refetch
4. Display toast success/error
```

### `/pages/DashboardEnseignant.tsx`
Points clés:
- ✅ Filtres: Classe + Matière + Période
- ✅ Table notes: 180 records paginés
- ✅ Édition inline avec modal
- ✅ Validation: 0-20
- ✅ Delete avec confirmation

```typescript
// Filtering pattern:
const filtered = notes
  .filter(n => !classe || n.eleve.classeId === classe)
  .filter(n => !matiere || n.matiereId === matiere)
  .filter(n => !periode || n.periodeId === periode)
```

### `/pages/DashboardParent.tsx`
Points clés:
- ✅ Sélection enfant (buttons grid)
- ✅ Moyennes par trimestre
- ✅ Couleurs pédagogiques (4 niveaux)
- ✅ Détail notes searchable

```typescript
// Couleurs notes:
≥16 🟢 Vert   ("Très bien")
≥12 🔵 Bleu   ("Bien")
≥10 🟡 Jaune  ("Acceptable")
<10 🔴 Rouge  ("À reprendre")
```

---

## 🔌 Gestion d'état

### Pattern 1: FormData centralisée (Admin)
```typescript
const [formData, setFormData] = useState({
  user: { nom: "", email: "", role: "ENSEIGNANT" },
  eleve: { nom: "", prenom: "", classeId: "" },
  // ...
});

// Update
setFormData(prev => ({
  ...prev,
  user: { ...prev.user, nom: e.target.value }
}));
```

### Pattern 2: Filters (Teacher)
```typescript
const [filters, setFilters] = useState({
  classe: "",
  matiere: "",
  periode: "",
});

useEffect(() => {
  let filtered = notes;
  if (filters.classe) filtered = filtered.filter(...);
  setFiltered(filtered);
}, [notes, filters]);
```

### Pattern 3: Selection (Parent)
```typescript
const [selectedEleve, setSelectedEleve] = useState(null);

useEffect(() => {
  if (selectedEleve) {
    fetchEleveData(selectedEleve.id);
  }
}, [selectedEleve]);
```

---

## 🔒 Authentification & RBAC

### JWT Flow:
```typescript
// Login
POST /auth/login
{ email, mot_de_passe }
← { token, utilisateur }

// Storage
localStorage.setItem("token", token);

// Usage
headers: { Authorization: `Bearer ${token}` }

// Axios interceptor (api/axios.ts)
- Auto-add token à toutes requêtes
- Redirect /login si token invalide
```

### RBAC Roles:
```typescript
ADMIN     → Accès complet
ENSEIGNANT → Lecture notes + édition
PARENT    → Lecture propres enfants seulement
```

---

## 📊 API Endpoints

### Auth
```
POST   /api/auth/login
POST   /api/auth/register
```

### CRUD Resources
```
GET    /api/{resource}
GET    /api/{resource}/:id
POST   /api/{resource}
PUT    /api/{resource}/:id
DELETE /api/{resource}/:id
```

### Resources: utilisateurs, eleves, classes, matieres, periodes, notes

### Special Endpoints
```
GET    /api/notes/eleve/:id
GET    /api/notes/eleve/:id/moyennes
GET    /api/health (Backend check)
```

---

## 🧪 Développement Local

### Setup Initial:
```bash
# Root
npm install

# Backend
cd backend
npm install
npm run seed        # Init DB + test data
npm run dev        # Watch mode
npm run build      # Production build

# Frontend (new terminal)
cd frontend
npm install
npm run dev        # Vite dev server
npm run build      # Production build
```

### Ports
```
Backend:  http://localhost:3001
Frontend: http://localhost:5173
```

### Hot Reload:
- Backend: ✅ ts-node watch
- Frontend: ✅ Vite HMR

---

## 🎨 Tailwind CSS Classes

### Couleurs
```typescript
// Primary gradient
bg-gradient-to-r from-blue-600 to-indigo-600

// Status
bg-green-500, bg-red-500, bg-yellow-500, bg-blue-500

// Backgrounds
bg-white, bg-gray-50, bg-gray-100

// Text
text-gray-800, text-gray-600, text-gray-400
```

### Espacements
```typescript
// Standard: 4px, 8px, 16px, 24px
p-2, p-3, p-4, p-6, p-8
m-2, m-4, etc
gap-2, gap-4, gap-6

// Responsive
md: breakpoint tablet (768px)
lg: breakpoint desktop (1024px)
```

### Grille
```typescript
// 1 col mobile → 4 col desktop
grid grid-cols-1 md:grid-cols-4 gap-4
```

---

## 🚀 Production Deployment

### Backend (Node.js)
```bash
# .env
NODE_ENV=production
PORT=3001
DATABASE_URL=file:./prod.db

# Ships: src/ + prisma/ + node_modules/
npm run build
node dist/app.js
```

### Frontend (Static)
```bash
npm run build
# Génère dist/ → servir avec nginx/vercel/cloudflare

# Headers importants
Cache-Control: public, max-age=3600
x-xss-protection: 1; mode=block
```

---

## 📝 Conventions Code

### Naming
```typescript
// Components: PascalCase
DashboardAdmin, UserTable, LoginForm

// Functions: camelCase
handleDeleteUser, fetchAllData, updateNote

// Constants: UPPER_SNAKE_CASE
MAX_PAGE_SIZE, API_BASE_URL

// Files: kebab-case (components), PascalCase (pages)
components/user-table.tsx
pages/DashboardAdmin.tsx
```

### Types
```typescript
// Interfaces dans même file ou types.ts
interface User {
  id: string;
  nom: string;
  email: string;
  role: "ADMIN" | "ENSEIGNANT" | "PARENT";
}
```

### Error Handling
```typescript
try {
  // API call
} catch (error: any) {
  const message = error.response?.data?.message || "Erreur";
  showToast("error", message);
}
```

---

## 🐛 Debugging

### VS Code Setup (✅ recommandé)
```json
{
  "launch": {
    "type": "node",
    "request": "attach",
    "port": 9229
  }
}
```

### Logs
```typescript
// Backend: Console.log avec prefixes
console.log("✅ Success:", msg);
console.error("❌ Error:", err);

// Frontend: Browser DevTools
F12 → Console tab
```

### API Testing
```bash
# Postman / cURL
curl -X GET http://localhost:3001/api/utilisateurs \
  -H "Authorization: Bearer {token}"
```

---

## 📚 Ressources Utiles

- React: https://react.dev
- TypeScript: https://typescriptlang.org
- Tailwind: https://tailwindcss.com/docs
- Prisma: https://prisma.io/docs
- Express: https://expressjs.com/

---

## ✅ Checklist Avant Commit

- [ ] Tests locaux passent (backend + frontend)
- [ ] Pas d'erreurs TypeScript (`npm run tsc`)
- [ ] Pas de console.error non intentionnels
- [ ] Responsive testé sur mobile
- [ ] Pas de dépendances non utilisées
- [ ] Code formaté (prettier - optionnel)

---

**Dernière mise à jour:** 27 Mars 2026
**Maintfinable** Oui ✅
