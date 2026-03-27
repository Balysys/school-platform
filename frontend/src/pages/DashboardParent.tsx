import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { showToast, DashboardLayout, Card, Section, Table } from "../components";

interface Eleve {
  id: string;
  nom: string;
  prenom: string;
  classe?: { nom: string };
}

interface Note {
  id: string;
  valeur: number;
  matiere: { nom: string };
  periode: { libelle: string };
  enseignant: { nom: string };
}

interface Moyenne {
  periode: { libelle: string };
  general: number;
}

export default function DashboardParent() {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [moyennes, setMoyennes] = useState<Moyenne[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEleves = async () => {
      try {
        setLoading(true);
        const res = await api.get("/eleves");
        setEleves(res.data);
        if (res.data.length > 0) {
          setSelectedEleve(res.data[0]);
        }
      } catch {
        showToast("error", "Erreur chargement élèves");
      } finally {
        setLoading(false);
      }
    };
    fetchEleves();
  }, []);

  useEffect(() => {
    const fetchEleveData = async () => {
      if (!selectedEleve) return;
      try {
        const [notesRes, moyennesRes] = await Promise.all([
          api.get(`/notes/eleve/${selectedEleve.id}`),
          api.get(`/notes/eleve/${selectedEleve.id}/moyennes`),
        ]);
        setNotes(notesRes.data);
        setMoyennes(moyennesRes.data);
      } catch {
        showToast("error", "Erreur chargement notes");
      }
    };
    fetchEleveData();
  }, [selectedEleve]);

  if (loading) {
    return (
      <DashboardLayout title="Suivi Académique" icon="👨‍👩‍👧">
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl">◐</div>
          <p className="text-gray-600 mt-4">Chargement...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Suivi Académique" icon="👨‍👩‍👧">
      <Section title="Sélectionner un enfant">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {eleves.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedEleve(e)}
              className={`p-4 rounded-lg transition duration-200 ${
                selectedEleve?.id === e.id
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                  : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <h3 className="font-bold text-lg">{e.prenom}</h3>
              <p className="text-sm opacity-80">{e.nom}</p>
              <p className="text-xs opacity-60 mt-1">{e.classe?.nom || "—"}</p>
            </button>
          ))}
        </div>
      </Section>

      {selectedEleve && (
        <>
          <Section title={`Moyennes de ${selectedEleve.prenom} ${selectedEleve.nom}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {moyennes.map((m, idx) => (
                <Card key={idx}>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm font-medium mb-2">{m.periode.libelle}</p>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                      {m.general.toFixed(2)}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">/20</p>
                  </div>
                </Card>
              ))}
            </div>
          </Section>

          <Section title="Détail des Notes">
            <Card>
              <Table<Note>
                columns={[
                  { key: "matiere", label: "Matière", render: (_, row) => row.matiere.nom, sortable: true },
                  { key: "periode", label: "Période", render: (_, row) => row.periode.libelle },
                  {
                    key: "valeur",
                    label: "Note",
                    render: (value) => {
                      const color =
                        value >= 16
                          ? "bg-green-100 text-green-700"
                          : value >= 12
                          ? "bg-blue-100 text-blue-700"
                          : value >= 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700";
                      return (
                        <span className={`inline-block ${color} px-3 py-1 rounded font-bold`}>
                          {value}/20
                        </span>
                      );
                    },
                  },
                  { key: "enseignant", label: "Enseignant", render: (_, row) => row.enseignant.nom },
                ]}
                data={notes}
                searchable
                searchFields={["matiere"]}
                emptyMessage="Aucune note disponible"
              />
            </Card>
          </Section>
        </>
      )}
    </DashboardLayout>
  );
}
