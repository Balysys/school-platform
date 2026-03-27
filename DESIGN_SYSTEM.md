# 🎨 Design System - School Platform v2.0

## 📐 Palette de Couleurs

### Dégradés Principaux
```
Bleu → Indigo (Primaire)
███████████████████ #1e40af → #4338ca
Utilisé dans: Login, Headers, Accents

Gradient de fond (Login):
█████████████████████████
from-blue-600 via-blue-500 to-indigo-600
```

### Couleurs par État
| État | Couleur | Code | Utilisation |
|------|---------|------|-------------|
| ✅ Succès | Vert | `#22c55e` | Toast, Badges, Validations |
| ⚠️ Avertissement | Jaune | `#eab308` | Informations, Status |
| ❌ Erreur | Rouge | `#ef4444` | Erreurs, Suppressions |
| ℹ️ Info | Bleu | `#3b82f6` | Notifications, Helpers |
| 🔄 En cours | Gris | `#6b7280` | Loading, Désactivé |

### Teintes de Textes
```
Titres:      Noir pur #1f2937 (font-bold)
Contenu:     Gris foncé #374151 (font-normal)
Secondaire:  Gris moyen #6b7280 (text-sm)
Subtle:      Gris clair #d1d5db (text-xs)
```

---

## ✨ Éléments Visuels

### 1️⃣ Page Login

#### Layout
```
┌─────────────────────────────────┐
│   Gradient Background (full)    │ ← Dégradé bleu → indigo
│   ┌───────────────────────────┐ │
│   │  Card Blanche             │ │
│   ├───────────────────────────┤ │
│   │ 🏫 Plateforme Scolaire    │ │ ← Header Gradient
│   │ Gestion établissement     │ │
│   ├───────────────────────────┤ │
│   │ Backend Status Indicator  │ │ ← Vert/Rouge/Jaune
│   │                           │ │
│   │ Email Input               │ │
│   │ Password Input            │ │
│   │ [Connexion] Button        │ │
│   │                           │ │
│   │ Test Accounts (clickable) │ │
│   │ [Admin] [Prof] [Parent]   │ │
│   └───────────────────────────┘ │
└─────────────────────────────────┘
```

#### Styles
- **Card**: `rounded-2xl shadow-2xl overflow-hidden`
- **Header**: Gradient `from-blue-600 to-indigo-600`
- **Inputs**: Bordered, focused blue, placeholder gris
- **Boutons**: 
  - Primaire: Bleu gradient + hover plus foncé
  - Comptes test: Gris clair + hover adapté
- **Status**: Icône animée (spin) si en chargement

### 2️⃣ Dashboards

#### Header Principal
```
┌──────────────────────────────────────────┐
│ 👤 Dashboard Admin         [Déconnexion] │ ← Shadow + Border
└──────────────────────────────────────────┘
```
- Background blanc avec ombre subtile
- Icône + Titre grands et lisibles
- Bouton déconnexion rouge avec hover

#### Tabs de Navigation
```
┌─────────────────────────────────────────────────┐
│ 👥 Users │ 👨‍🎓 Élèves │ 📚 Classes │ 📖 Matières │ ...
│          │            │           │            │
└─────────────────────────────────────────────────┘
     ↑ Active = Blue border + Blue background
     Inactive = Gray hover effect
```

#### Sections de Contenu
```
┌──────────────────────────┐
│ Section Title            │
├──────────────────────────┤
│ + Create Button          │ ← Vert clair
│                          │
│ [Search...] [Filter...]  │ ← Gris
│                          │
│ Table with Data          │ ← Alternating rows
│ Hover = Light background │
│                          │
│ [Edit] [Delete] [View]   │ ← Actions
└──────────────────────────┘
```

### 3️⃣ Composants Réutilisables

#### Buttons
```
Primary (Bleu):
   ┌──────────────────┐
   │ [  Enregistrer  ] │ ← bg-blue-600, hover:bg-blue-700
   └──────────────────┘

Secondary (Gris):
   ┌──────────────────┐
   │ [   Annuler    ] │ ← bg-gray-200, hover:bg-gray-300
   └──────────────────┘

Danger (Rouge):
   ┌──────────────────┐
   │ [   Supprimer  ] │ ← bg-red-600, hover:bg-red-700
   └──────────────────┘

Loading:
   ┌──────────────────┐
   │ [  ⟳ Envoi...   ] │ ← Spinner animation
   └──────────────────┘
```

#### Inputs
```
┌──────────────────────────────────────┐
│ Label                                │
│ ┌──────────────────────────────────┐ │
│ │ Input value...               [X]  │ │ ← Focus: blue border
│ └──────────────────────────────────┘ │
│ ✓ Optional helper text or error   │ │
└──────────────────────────────────────┘
```

#### Tables
```
┌─ Search: [___________] 🔍
├─────────────────────────────────────┐
│ Column 1 │ Column 2 │ Column 3      │ ← Header: gray bg
├─────────────────────────────────────┤  Sortable (icon shows)
│ Data 1   │ Data 2   │ [Actions]     │
├─────────────────────────────────────┤  Row hover = light bg
│ Data 1   │ Data 2   │ [Actions]     │
└─────────────────────────────────────┘
  ← [< 1 2 3 >] Pagination
```

#### Toasts (Notifications)
```
Success:
┌──────────────────────────────────────┐
│ ✓ Opération réussie !               │ ← green-100 bg, green-700 text
└──────────────────────────────────────┘  Slide in from right, auto-dismiss 3s

Error:
┌──────────────────────────────────────┐
│ ✕ Erreur: email invalide           │ ← red-100 bg, red-700 text
└──────────────────────────────────────┘

Info:
┌──────────────────────────────────────┐
│ ℹ Veuillez vérifier vos données     │ ← blue-100 bg, blue-700 text
└──────────────────────────────────────┘
```

#### Modals
```
┌─────────────────────────────────────────┐
│ Titre                             [×]   │ ← Header avec fermeture
├─────────────────────────────────────────┤
│                                         │
│ Contenu du modal...                     │
│ (Formulaire, message, options)          │
│                                         │
├─────────────────────────────────────────┤
│         [Annuler]  [Confirmer]         │ ← Buttons
└─────────────────────────────────────────┘
  ↑ Overlay semi-transparent (bg-black/50)
```

---

## 🎬 Animations

### 1. Slide In (Droite → Gauche)
```css
@keyframes slideIn {
  from: transform translateX(100%), opacity 0
  to:   transform translateX(0), opacity 1
}
Duration: 0.3s ease-out

Utilisé: Toasts, Modals
```

### 2. Fade In (Invisible → Visible)
```css
@keyframes fadeIn {
  from: opacity 0
  to:   opacity 1
}
Duration: 0.5s ease-out

Utilisé: Page load, Data rendering
```

### 3. Spin (Loader)
```css
@keyframes spin-slow {
  from: rotate(0deg)
  to:   rotate(360deg)
}
Duration: 1s linear infinite

Utilisé: Loading buttons, Status waiting
```

### 4. Transitions
```
Tous les éléments: transition-all 0.3s ease
- Hover colors
- Button states
- Background changes
```

---

## 📐 Typography

### Hiérarchie des Tailles

| Niveau | Taille | Poids | Utilisation |
|--------|--------|-------|-------------|
| H1 | 2xl (24px) | bold | Titre page |
| H2 | xl (20px) | bold | Sous-titre |
| H3 | lg (18px) | semibold | Section title |
| Body | base (16px) | normal | Contenu |
| Small | sm (14px) | normal | Labels, helpers |
| Tiny | xs (12px) | normal | Metadata |

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 
             'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

Anti-aliasing: -webkit-font-smoothing: antialiased
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
```
Mobile:  < 640px   (sm:)
Tablet:  ≥ 640px   (md:)
Desktop: ≥ 1024px  (lg:)
Wide:    ≥ 1280px  (xl:)
```

### Grid Layouts

**Admin Dashboard:**
```
Mobile:  1 column
Tablet:  2 columns
Desktop: 4 columns (max)
```

**Tables:**
```
Mobile:  Overflow horizontally, compact
Tablet:  Full width, normal
Desktop: Scrollable, pagination
```

### Spacing

| Élément | Padding | Margin |
|---------|---------|--------|
| Container | p-4 sm:p-6 lg:p-8 | m-0 |
| Card | p-6 | mb-4 |
| Button | px-4 py-2 | - |
| Input | px-3 py-2 | mb-4 |
| Gap (grid) | gap-3 sm:gap-4 lg:gap-6 | - |

---

## 🌙 Mode Sombre (Futur)

Préparation pour dark mode:
- Utilisation de variables CSS Tailwind
- Suffixes `dark:` prêts à être appliqués
- Couleurs neutres adaptées au sombre

Exemple:
```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Content
</div>
```

---

## 🎯 Principes de Design

### 1. Cohérence
✓ Même palette de couleurs partout  
✓ Même système de spacing  
✓ Même typographie  
✓ Même style d'icônes  

### 2. Clarté
✓ Hiérarchie visuelle claire  
✓ États évidents (hover, focus, active)  
✓ Messages d'erreur explicites  
✓ Feedback immédiat  

### 3. Accessibilité
✓ Contraste suffisant (WCAG AA)  
✓ Focus indicators visibles  
✓ Texte alternatif sur icônes  
✓ Taille min 14px pour le texte  

### 4. Performance
✓ Animations fluides (60 FPS)  
✓ Transitions rapides (0.3s max)  
✓ Images optimisées  
✓ CSS minimal (Tailwind)  

### 5. Utilité
✓ Chaque élément a un but  
✓ Pas de bloat visuel  
✓ Actions claires et visibles  
✓ Feedback pour chaque action  

---

## 📊 Avant vs Après

### Login Page
```
AVANT: Formulaire basique, gris neutre
APRÈS: 
✓ Gradient bleu/indigo background
✓ Card blanche avec shadow 2xl
✓ Header gradient bleu
✓ Status indicator (serveur)
✓ Test accounts clickable
✓ Smooth animations
```

### Dashboards
```
AVANT: Tableaux statiques, design basique
APRÈS:
✓ Header moderne avec icônes
✓ Tabs navigation colorées
✓ Cards avec shadow et spacing
✓ Tables avec search/sort/paginate
✓ Modals de confirmation
✓ Toasts notifications
✓ Gradient backgrounds
```

### Composants
```
AVANT: Styles inline répétés
APRÈS:
✓ 5 composants réutilisables
✓ Cohérence garantie
✓ Dark mode prêt
✓ TypeScript typé
✓ Animations fluides
✓ Responsive natif
```

---

## 🚀 Comment Utiliser le Design System

### Appliquer une Couleur
```jsx
// Bleu primaire
className="bg-blue-600 hover:bg-blue-700"

// Succès vert
className="text-green-600 bg-green-50"

// Erreur rouge
className="border border-red-200 text-red-700"
```

### Appliquer Spacing
```jsx
// Padding
className="p-4 sm:p-6 lg:p-8"

// Margins
className="mb-4 mt-2"

// Gap (flex/grid)
className="gap-3 sm:gap-4"
```

### Appliquer Animations
```jsx
// Slide in
className="animate-slide-in"

// Fade in
className="animate-fade-in"

// Spin loader
className="animate-spin"
```

### Appliquer Typographie
```jsx
// Titre
className="text-2xl font-bold"

// Corps
className="text-base font-normal"

// Petite info
className="text-xs text-gray-500"
```

---

## 🔧 Fichiers de Configuration

### `tailwind.config.js`
```javascript
// Déjà configuré
// Content paths définies
// Tema extend empty (utilise Tailwind par défaut)
// Plugins: none (pour plus tard)
```

### `index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Animations personnalisées */
@keyframes slideIn { ... }
@keyframes fadeIn { ... }
@keyframes spin-slow { ... }

/* Utility classes */
.animate-slide-in { ... }
.animate-fade-in { ... }
```

---

## ✅ Checklist Design

- [x] Palette de couleurs définie
- [x] Typographie hiérarchisée
- [x] Spacing système établi
- [x] Animations fluides
- [x] Responsive design
- [x] Composants cohérents
- [x] Accessibility WCAG AA
- [x] Dark mode préparé
- [x] Performance optimisée
- [x] Documentation complète

---

**Status**: ✅ Design System Production Ready  
**Last Updated**: 27 Mars 2026
