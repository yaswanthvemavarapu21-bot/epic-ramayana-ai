import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Moon, Sun, Type, Volume2, VolumeX, Info, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const SettingsScreen = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [textSize, setTextSize] = useState(1);
  const [sound, setSound] = useState(true);
  const textSizes = ["Small", "Medium", "Large"];

  const handleSignOut = async () => {
    await signOut();
    toast({ title: "Signed out", description: "You have been signed out." });
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background px-6 pb-24 pt-14">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/home")}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Settings
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-3"
      >
        {/* Dark Mode */}
        <div className="flex items-center justify-between rounded-xl glass-card p-4">
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon className="h-5 w-5 text-primary" />
            ) : (
              <Sun className="h-5 w-5 text-primary" />
            )}
            <span className="text-sm font-medium text-foreground">
              Dark Mode
            </span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              darkMode ? "bg-primary" : "bg-muted"
            }`}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-primary-foreground shadow transition-transform ${
                darkMode ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Text Size */}
        <div className="rounded-xl glass-card p-4">
          <div className="mb-3 flex items-center gap-3">
            <Type className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Text Size
            </span>
          </div>
          <div className="flex gap-2">
            {textSizes.map((size, i) => (
              <button
                key={size}
                onClick={() => setTextSize(i)}
                className={`flex-1 rounded-lg py-2 text-xs font-medium transition-colors ${
                  textSize === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div className="flex items-center justify-between rounded-xl glass-card p-4">
          <div className="flex items-center gap-3">
            {sound ? (
              <Volume2 className="h-5 w-5 text-primary" />
            ) : (
              <VolumeX className="h-5 w-5 text-primary" />
            )}
            <span className="text-sm font-medium text-foreground">Sound</span>
          </div>
          <button
            onClick={() => setSound(!sound)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              sound ? "bg-primary" : "bg-muted"
            }`}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-primary-foreground shadow transition-transform ${
                sound ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Account */}
        {user ? (
          <>
            <div className="flex items-center gap-3 rounded-xl glass-card p-4">
              <User className="h-5 w-5 text-primary" />
              <div>
                <span className="text-sm font-medium text-foreground">
                  {user.email}
                </span>
                <p className="text-xs text-muted-foreground">Signed in</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl glass-card glass-card-hover p-4 text-left"
            >
              <LogOut className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium text-destructive">Sign Out</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="flex w-full items-center gap-3 rounded-xl glass-card glass-card-hover p-4 text-left"
          >
            <LogIn className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Sign In</span>
          </button>
        )}

        {/* About */}
        <button
          onClick={() => navigate("/about")}
          className="flex w-full items-center gap-3 rounded-xl glass-card glass-card-hover p-4 text-left"
        >
          <Info className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-foreground">About</span>
        </button>
      </motion.div>
    </div>
  );
};

export default SettingsScreen;
