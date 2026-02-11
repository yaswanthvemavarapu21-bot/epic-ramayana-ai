import { useNavigate, useLocation } from "react-router-dom";
import { Home, BookOpen, Settings } from "lucide-react";

const tabs = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/story-mode", icon: BookOpen, label: "Stories" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on splash and chat screens
  if (location.pathname === "/" || location.pathname.startsWith("/chat/")) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map((tab) => {
          const isActive =
            location.pathname === tab.path ||
            (tab.path === "/story-mode" &&
              location.pathname.startsWith("/story"));
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
