import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function DashboardEnseignant() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) return <div className="text-center p-8">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-2xl font-bold">👨‍🏫 Espace Enseignant</h1>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
          Déconnexion
        </button>
      </header>
      <main className="p-8">
        <h2 className="text-xl mb-4">Gestion des notes</h2>
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Élève</th>
                <th className="p-2 text-left">Matière</th>
                <th className="p-2 text-left">Note</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note: any) => (
                <tr key={note.id} className="border-t">
                  <td className="p-2">{note.eleve?.prenom} {note.eleve?.nom}</td>
                  <td className="p-2">{note.matiere?.nom}</td>
                  <td className="p-2 font-bold">{note.valeur}/20</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
