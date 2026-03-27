import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  title: string;
  icon: string;
  children: ReactNode;
}

export function DashboardLayout({ title, icon, children }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authTokenChanged"));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-xs text-gray-500">Plateforme Scolaire</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-danger text-sm"
          >
            <span>🚪</span>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          <p>© 2026 Plateforme Scolaire • Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}

interface TabsProps {
  tabs: { id: string; label: string; icon: string }[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="card mb-8 overflow-hidden">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${
              activeTab === tab.id
                ? "border-primary-600 text-primary-700 bg-primary-50"
                : "border-transparent text-gray-600 hover:text-primary-600 hover:bg-gray-50"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card p-6 animate-scale-in ${className}`}>
      {children}
    </div>
  );
}

export function Section({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-primary-600 to-primary-400 rounded-full"></div>
        {title}
      </h2>
      {children}
    </div>
  );
}

