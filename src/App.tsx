import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "./pages/SplashScreen";
import HomeScreen from "./pages/HomeScreen";
import StoryMode from "./pages/StoryMode";
import StoryDetail from "./pages/StoryDetail";
import Characters from "./pages/Characters";
import ChatScreen from "./pages/ChatScreen";
import LifeLessons from "./pages/LifeLessons";
import JourneyMap from "./pages/JourneyMap";
import SettingsScreen from "./pages/SettingsScreen";
import AboutScreen from "./pages/AboutScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="mx-auto max-w-lg min-h-screen">
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/story-mode" element={<StoryMode />} />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/chat/:character" element={<ChatScreen />} />
            <Route path="/life-lessons" element={<LifeLessons />} />
            <Route path="/journey-map" element={<JourneyMap />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
