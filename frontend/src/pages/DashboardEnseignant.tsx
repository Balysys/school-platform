import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { showToast, DashboardLayout, Card, Section, Form, Input, Select, Button, Table } from "../components";

interface Note {
  id: string;
  valeur: number;
  eleve: { id: string; nom: string; prenom: string; classeId: string; classe?: { nom: string } };
  matiere: { id: string; nom: string };
  periode: { id: string; libelle: string };
  enseignant: { id: string; nom: string };
  matiereId: string;
  periodeId: string;
}

interface Classe {
  id: string;
  nom: string;
}

interface Matiere {
  id: string;
  nom: string;
}

interface Periode {
  id: string;
  libelle: string;
}

export default function DashboardEnseignant() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [periodes, setPeriodes] = useState<Periode[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  
  const [filters, setFilters] = useState({
    classe: "",
    matiere: "",
    periode: "",
  });
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [notesRes, classesRes, matieresRes, periodesRes] = await Promise.all([
        api.get("/notes"),
        api.get("/classes"),
        api.get("/matieres"),
        api.get("/periodes"),
      ]);
      setNotes(notesRes.data);
      setClasses(classesRes.data);
      setMatieres(matieresRes.data);
      setPeriodes(periodesRes.data);
    } catch {
      showToast("error", "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    let filtered = notes;
    if (filters.classe) {
      filtered = filtered.filter((n) => n.eleve.classeId === filters.classe);
    }
    if (filters.matiere) {
      filtered = filtered.filter((n) => n.matiereId === filters.matiere);
    }
    if (filters.periode) {
      filtered = filtered.filter((n) => n.periodeId === filters.periode);
    }
    setFilteredNotes(filtered);
  }, [notes, filters]);

  const handleUpdateNote = async (noteId: string) => {
    setIsSubmitting(true);
    try {
      const val = parseFloat(newValue);
      if (val < 0 || val > 20) {
        showToast("error", "Note entre 0 et 20");
        return;
      }
      await api.put(`/notes/${noteId}`, { valeur: val });
      const updated = notes.map((n) => (n.id === noteId ? { ...n, valeur: val } : n));
      setNotes(updated);
      setEditingNote(null);
      showToast("success", "Note mise à jour");
    } catch (error: any) {
      showToast("error", error.response?.data?.message || "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm("Confirmer suppression?")) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter((n) => n.id !== noteId));
      showToast("success", "Note supprimée");
    } catch {
      showToast("error", "Erreur suppression");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Espace Enseignant" icon="👨‍🏫">
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl">◐</div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gestion des Notes" icon="👨‍🏫">
      <Section title="Filtres">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Classe"
              value={filters.classe}
              onChange={(e) => setFilters((prev) => ({ ...prev, classe: e.target.value }))}
              options={classes.map((c) => ({ value: c.id, label: c.nom }))}
            />
            <Select
              label="Matière"
              value={filters.matiere}
              onChange={(e) => setFilters((prev) => ({ ...prev, matiere: e.target.value }))}
              options={matieres.map((m) => ({ value: m.id, label: m.nom }))}
            />
            <Select
              label="Période"
              value={filters.periode}
              onChange={(e) => setFilters((prev) => ({ ...prev, periode: e.target.value }))}
              options={periodes.map((p) => ({ value: p.id, label: p.libelle }))}
            />
          </div>
        </Card>
      </Section>

      <Section title={`Liste des Notes (${filteredNotes.length})`}>
        <Card>
          <Table<Note>
            columns={[
              { key: "eleve", label: "Élève", render: (_, row) => `${row.eleve.prenom} ${row.eleve.nom}`, sortable: true },
              { key: "classe", label: "Classe", render: (_, row) => row.eleve.classe?.nom || "-" },
              { key: "matiere", label: "Matière", render: (_, row) => row.matiere.nom },
              { key: "periode", label: "Période", render: (_, row) => row.periode.libelle },
              {
                key: "valeur",
                label: "Note",
                render: (value) => (
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded font-bold">
                    {value}/20
                  </span>
                ),
              },
            ]}
            data={filteredNotes}
            searchable
            searchFields={["eleve"]}
            actions={(row) => (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingNote(row.id);
                    setNewValue(row.valeur.toString());
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ✏️
                </button>
                <button onClick={() => handleDeleteNote(row.id)} disabled={isSubmitting} className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50">
                  🗑️
                </button>
              </div>
            )}
          />
        </Card>
      </Section>

      {editingNote && (
        <Section title="Modifier la Note">
          <Card>
            <Form className="max-w-md">
              <Input
                type="number"
                label="Nouvelle note (0-20)"
                min="0"
                max="20"
                step="0.5"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={() => handleUpdateNote(editingNote)} isLoading={isSubmitting}>
                  Enregistrer
                </Button>
                <Button onClick={() => setEditingNote(null)} variant="secondary" disabled={isSubmitting}>
                  Annuler
                </Button>
              </div>
            </Form>
          </Card>
        </Section>
      )}
    </DashboardLayout>
  );
}
