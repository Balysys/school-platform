import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { showToast, DashboardLayout, Tabs, Card, Section, Form, Input, Select, Button, Table, ConfirmDialog } from "../components";

type TabType = "users" | "eleves" | "classes" | "matieres" | "periodes";

interface User {
  id: string;
  nom: string;
  email: string;
  role: string;
}

interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  classeId: string;
  classe?: { nom: string };
  parentId?: string;
}

interface Classe {
  id: string;
  nom: string;
  niveau: string;
}

interface Matiere {
  id: string;
  nom: string;
  coeff: number;
}

interface Periode {
  id: string;
  libelle: string;
  dateDebut: string;
  dateFin: string;
}

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [periodes, setPeriodes] = useState<Periode[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    user: { nom: "", email: "", mot_de_passe: "", role: "ENSEIGNANT" },
    eleve: { nom: "", prenom: "", classeId: "", parentId: "" },
    classe: { nom: "", niveau: "" },
    matiere: { nom: "", coeff: "1" },
    periode: { libelle: "", dateDebut: "", dateFin: "" },
  });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [usersRes, elevesRes, classesRes, matieresRes, periodesRes] = await Promise.all([
        api.get("/utilisateurs"),
        api.get("/eleves"),
        api.get("/classes"),
        api.get("/matieres"),
        api.get("/periodes"),
      ]);
      setUsers(usersRes.data);
      setEleves(elevesRes.data);
      setClasses(classesRes.data);
      setMatieres(matieresRes.data);
      setPeriodes(periodesRes.data);
    } catch {
      showToast("error", "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreate = async (e: React.FormEvent, type: TabType) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = formData[type];
      let payload: any = { ...data };

      if (type === "matiere") payload = { ...payload, coeff: parseInt(payload.coeff) };
      if (type === "periode") {
        payload = {
          ...payload,
          dateDebut: new Date(payload.dateDebut),
          dateFin: new Date(payload.dateFin),
        };
      }
      if (type === "eleve") payload = { ...payload, dateNaissance: "2010-01-01" };

      const endpoints: Record<TabType, string> = {
        user: "/utilisateurs",
        eleve: "/eleves",
        classe: "/classes",
        matiere: "/matieres",
        periode: "/periodes",
      };

      await api.post(endpoints[type], payload);
      showToast("success", `${type} créé avec succès`);
      
      const resetData: Record<TabType, any> = {
        user: { nom: "", email: "", mot_de_passe: "", role: "ENSEIGNANT" },
        eleve: { nom: "", prenom: "", classeId: "", parentId: "" },
        classe: { nom: "", niveau: "" },
        matiere: { nom: "", coeff: "1" },
        periode: { libelle: "", dateDebut: "", dateFin: "" },
      };

      setFormData((prev) => ({ ...prev, [type]: resetData[type] }));
      fetchAllData();
    } catch (error: any) {
      showToast("error", error.response?.data?.message || "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setIsSubmitting(true);

    try {
      const endpoints: Record<string, string> = {
        user: "/utilisateurs",
        eleve: "/eleves",
        classe: "/classes",
        matiere: "/matieres",
        periode: "/periodes",
      };

      await api.delete(`${endpoints[deleteConfirm.type]}/${deleteConfirm.id}`);
      showToast("success", "Supprimé");
      setDeleteConfirm(null);
      fetchAllData();
    } catch (error: any) {
      showToast("error", error.response?.data?.message || "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Tableau de Bord Admin" icon="⚙️">
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl">◐</div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: "users", label: "Utilisateurs", icon: "👥" },
    { id: "eleves", label: "Élèves", icon: "📚" },
    { id: "classes", label: "Classes", icon: "🏫" },
    { id: "matieres", label: "Matières", icon: "📖" },
    { id: "periodes", label: "Périodes", icon: "📅" },
  ];

  return (
    <DashboardLayout title="Tableau de Bord Admin" icon="⚙️">
      <Tabs tabs={tabs as any} activeTab={activeTab} onChange={(id) => setActiveTab(id as TabType)} />

      {activeTab === "users" && (
        <div className="space-y-6">
          <Section title="Ajouter un Utilisateur">
            <Card>
              <Form onSubmit={(e) => handleCreate(e, "user")} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  placeholder="Dupont"
                  value={formData.user.nom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, user: { ...prev.user, nom: e.target.value } }))}
                  required
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="user@ecole.com"
                  value={formData.user.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, user: { ...prev.user, email: e.target.value } }))}
                  required
                />
                <Input
                  type="password"
                  label="Mot de passe"
                  value={formData.user.mot_de_passe}
                  onChange={(e) => setFormData((prev) => ({ ...prev, user: { ...prev.user, mot_de_passe: e.target.value } }))}
                  required
                />
                <Select
                  label="Rôle"
                  value={formData.user.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, user: { ...prev.user, role: e.target.value } }))}
                  options={[
                    { value: "ADMIN", label: "Admin" },
                    { value: "ENSEIGNANT", label: "Enseignant" },
                    { value: "PARENT", label: "Parent" },
                  ]}
                />
                <Button type="submit" isLoading={isSubmitting} className="md:col-span-2">
                  Ajouter Utilisateur
                </Button>
              </Form>
            </Card>
          </Section>

          <Section title="Liste des Utilisateurs">
            <Card>
              <Table<User>
                columns={[
                  { key: "nom", label: "Nom", sortable: true },
                  { key: "email", label: "Email", sortable: true },
                  {
                    key: "role",
                    label: "Rôle",
                    render: (value) => (
                      <span className={`px-3 py-1 rounded text-xs text-white font-medium ${
                        value === "ADMIN" ? "bg-purple-600" : value === "ENSEIGNANT" ? "bg-blue-600" : "bg-green-600"
                      }`}>
                        {value}
                      </span>
                    ),
                  },
                ]}
                data={users}
                searchable
                searchFields={["nom", "email"]}
                actions={(row) => (
                  <button onClick={() => setDeleteConfirm({ type: "user", id: row.id, name: row.nom })} className="text-red-600 hover:text-red-800 font-medium text-sm">
                    🗑️ Supprimer
                  </button>
                )}
              />
            </Card>
          </Section>
        </div>
      )}

      {activeTab === "eleves" && (
        <div className="space-y-6">
          <Section title="Ajouter un Élève">
            <Card>
              <Form onSubmit={(e) => handleCreate(e, "eleve")} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  placeholder="Martin"
                  value={formData.eleve.nom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, eleve: { ...prev.eleve, nom: e.target.value } }))}
                  required
                />
                <Input
                  label="Prénom"
                  placeholder="Jean"
                  value={formData.eleve.prenom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, eleve: { ...prev.eleve, prenom: e.target.value } }))}
                  required
                />
                <Select
                  label="Classe"
                  value={formData.eleve.classeId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, eleve: { ...prev.eleve, classeId: e.target.value } }))}
                  options={classes.map((c) => ({ value: c.id, label: c.nom }))}
                />
                <Select
                  label="Parent (optionnel)"
                  value={formData.eleve.parentId || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, eleve: { ...prev.eleve, parentId: e.target.value } }))}
                  options={users.filter((u) => u.role === "PARENT").map((u) => ({ value: u.id, label: u.nom }))}
                />
                <Button type="submit" isLoading={isSubmitting} className="md:col-span-2">
                  Ajouter Élève
                </Button>
              </Form>
            </Card>
          </Section>

          <Section title="Liste des Élèves">
            <Card>
              <Table<Eleve>
                columns={[
                  { key: "nom", label: "Nom", sortable: true },
                  { key: "prenom", label: "Prénom", sortable: true },
                  { key: "classe", label: "Classe", render: (_, row) => row.classe?.nom || "-" },
                ]}
                data={eleves}
                searchable
                searchFields={["nom", "prenom"]}
                actions={(row) => (
                  <button onClick={() => setDeleteConfirm({ type: "eleve", id: row.id, name: `${row.prenom} ${row.nom}` })} className="text-red-600 hover:text-red-800 font-medium text-sm">
                    🗑️
                  </button>
                )}
              />
            </Card>
          </Section>
        </div>
      )}

      {activeTab === "classes" && (
        <div className="space-y-6">
          <Section title="Ajouter une Classe">
            <Card>
              <Form onSubmit={(e) => handleCreate(e, "classe")} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  placeholder="6eA"
                  value={formData.classe.nom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, classe: { ...prev.classe, nom: e.target.value } }))}
                  required
                />
                <Input
                  label="Niveau"
                  placeholder="6ème"
                  value={formData.classe.niveau}
                  onChange={(e) => setFormData((prev) => ({ ...prev, classe: { ...prev.classe, niveau: e.target.value } }))}
                  required
                />
                <Button type="submit" isLoading={isSubmitting} className="md:col-span-2">
                  Ajouter Classe
                </Button>
              </Form>
            </Card>
          </Section>

          <Section title="Liste des Classes">
            <Card>
              <Table<Classe>
                columns={[
                  { key: "nom", label: "Nom", sortable: true },
                  { key: "niveau", label: "Niveau", sortable: true },
                ]}
                data={classes}
                searchable
                searchFields={["nom"]}
                actions={(row) => (
                  <button onClick={() => setDeleteConfirm({ type: "classe", id: row.id, name: row.nom })} className="text-red-600 hover:text-red-800 font-medium text-sm">
                    🗑️
                  </button>
                )}
              />
            </Card>
          </Section>
        </div>
      )}

      {activeTab === "matieres" && (
        <div className="space-y-6">
          <Section title="Ajouter une Matière">
            <Card>
              <Form onSubmit={(e) => handleCreate(e, "matiere")} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  placeholder="Mathématiques"
                  value={formData.matiere.nom}
                  onChange={(e) => setFormData((prev) => ({ ...prev, matiere: { ...prev.matiere, nom: e.target.value } }))}
                  required
                />
                <Input
                  type="number"
                  label="Coefficient"
                  placeholder="1"
                  value={formData.matiere.coeff}
                  onChange={(e) => setFormData((prev) => ({ ...prev, matiere: { ...prev.matiere, coeff: e.target.value } }))}
                  required
                />
                <Button type="submit" isLoading={isSubmitting} className="md:col-span-2">
                  Ajouter Matière
                </Button>
              </Form>
            </Card>
          </Section>

          <Section title="Liste des Matières">
            <Card>
              <Table<Matiere>
                columns={[
                  { key: "nom", label: "Nom", sortable: true },
                  { key: "coeff", label: "Coefficient", render: (value) => <span className="font-semibold">{value}</span> },
                ]}
                data={matieres}
                searchable
                searchFields={["nom"]}
                actions={(row) => (
                  <button onClick={() => setDeleteConfirm({ type: "matiere", id: row.id, name: row.nom })} className="text-red-600 hover:text-red-800 font-medium text-sm">
                    🗑️
                  </button>
                )}
              />
            </Card>
          </Section>
        </div>
      )}

      {activeTab === "periodes" && (
        <div className="space-y-6">
          <Section title="Ajouter une Période">
            <Card>
              <Form onSubmit={(e) => handleCreate(e, "periode")} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Libellé"
                  placeholder="Trimestre 1"
                  value={formData.periode.libelle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, periode: { ...prev.periode, libelle: e.target.value } }))}
                  required
                />
                <Input
                  type="date"
                  label="Date de début"
                  value={formData.periode.dateDebut}
                  onChange={(e) => setFormData((prev) => ({ ...prev, periode: { ...prev.periode, dateDebut: e.target.value } }))}
                  required
                />
                <Input
                  type="date"
                  label="Date de fin"
                  value={formData.periode.dateFin}
                  onChange={(e) => setFormData((prev) => ({ ...prev, periode: { ...prev.periode, dateFin: e.target.value } }))}
                  required
                />
                <Button type="submit" isLoading={isSubmitting} className="md:col-span-2">
                  Ajouter Période
                </Button>
              </Form>
            </Card>
          </Section>

          <Section title="Liste des Périodes">
            <Card>
              <Table<Periode>
                columns={[
                  { key: "libelle", label: "Libellé", sortable: true },
                  { key: "dateDebut", label: "Début", render: (value) => new Date(value).toLocaleDateString("fr-FR") },
                  { key: "dateFin", label: "Fin", render: (value) => new Date(value).toLocaleDateString("fr-FR") },
                ]}
                data={periodes}
                searchable
                searchFields={["libelle"]}
                actions={(row) => (
                  <button onClick={() => setDeleteConfirm({ type: "periode", id: row.id, name: row.libelle })} className="text-red-600 hover:text-red-800 font-medium text-sm">
                    🗑️
                  </button>
                )}
              />
            </Card>
          </Section>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer "${deleteConfirm?.name}" ?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={isSubmitting}
      />
    </DashboardLayout>
  );
}
