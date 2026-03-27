import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { showToast, Button, Input, Form } from "../components";

const TEST_ACCOUNTS = [
  { email: "admin@ecole.com", password: "admin123", role: "Admin" },
  { email: "prof@ecole.com", password: "prof123", role: "Enseignant" },
  { email: "parent@example.com", password: "parent123", role: "Parent" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"loading" | "connected" | "error">("loading");
  const navigate = useNavigate();

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      setBackendStatus("loading");
      await api.get("/health");
      setBackendStatus("connected");
    } catch {
      setBackendStatus("error");
      showToast("error", "Serveur non connecté", 5000);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (backendStatus === "error") {
      showToast("error", "Serveur non disponible");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, mot_de_passe: password });
      localStorage.setItem("token", res.data.token);
      
      // Dispatch custom event to notify App of token change
      window.dispatchEvent(new Event("authTokenChanged"));
      
      showToast("success", "Connexion réussie");
      
      // Navigate after a brief delay to ensure state is updated
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } catch (err: any) {
      showToast("error", err.response?.data?.message || "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20 animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8 text-center">
            <h1 className="text-5xl font-bold mb-3">🏫</h1>
            <h2 className="text-3xl font-bold">Plateforme Scolaire</h2>
            <p className="text-primary-100 mt-2 text-sm">Gestion complète d'établissement</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Backend Status */}
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border-2 ${
              backendStatus === "connected"
                ? "bg-success-50 border-success-300"
                : backendStatus === "error"
                ? "bg-danger-50 border-danger-300"
                : "bg-warning-50 border-warning-300"
            }`}>
              <span className={`text-2xl flex-shrink-0 ${
                backendStatus === "connected" ? "" : 
                backendStatus === "error" ? "" : "animate-spin"
              }`}>
                {backendStatus === "connected" ? "✅" : 
                 backendStatus === "error" ? "⚠️" : "⏳"}
              </span>
              <div className="flex-1">
                <p className={`font-semibold text-sm ${
                  backendStatus === "connected" ? "text-success-700" :
                  backendStatus === "error" ? "text-danger-700" : "text-warning-700"
                }`}>
                  {backendStatus === "connected" ? "Serveur connecté" :
                   backendStatus === "error" ? "Serveur indisponible" : "Vérification..."}
                </p>
              </div>
              {backendStatus !== "loading" && (
                <button
                  onClick={checkBackendConnection}
                  className="text-xs px-3 py-1 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 font-semibold transition"
                >
                  Tester
                </button>
              )}
            </div>

            {/* Login Form */}
            <Form onSubmit={handleLogin} className="mb-6">
              <Input
                type="email"
                label="Email"
                placeholder="admin@ecole.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full"
                disabled={backendStatus === "error"}
              >
                🔐 Se connecter
              </Button>
            </Form>

            {/* Test Accounts */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span>👥</span>
                Comptes de test :
              </p>
              <div className="space-y-2">
                {TEST_ACCOUNTS.map((account, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                    }}
                    type="button"
                    className="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100 rounded-lg hover:shadow-md transition border border-gray-200 hover:border-primary-300 text-left"
                  >
                    <p className="font-mono text-xs text-primary-600 font-semibold">{account.email}</p>
                    <p className="text-gray-600 text-xs mt-2 flex items-center gap-1">
                      <span>👤</span>
                      {account.role}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white text-sm">
          <p>💡 Cliquez sur un compte de test pour le remplissage automatique</p>
        </div>
      </div>
    </div>
  );
}

