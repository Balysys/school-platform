import { useEffect, useState } from "react";
import { api } from "../api/axios";

export default function DashboardParent() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await api.get("/eleves/mes-enfants");
        setChildren(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) return <div className="text-center p-8">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-2xl font-bold">👨‍👩‍👧 Espace Parent</h1>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
          Déconnexion
        </button>
      </header>
      <main className="p-8">
        <h2 className="text-xl mb-4">Mes enfants</h2>
        {children.length === 0 ? (
          <p>Aucun enfant inscrit</p>
        ) : (
          children.map((child: any) => (
            <div key={child.id} className="bg-white p-4 rounded shadow mb-4">
              <h3 className="font-bold">{child.prenom} {child.nom}</h3>
              <p>Classe: {child.classe?.nom}</p>
              <p>Notes: {child.notes?.length || 0} note(s)</p>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
