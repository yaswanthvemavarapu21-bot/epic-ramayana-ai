import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const characterNames: Record<string, string> = {
  rama: "Lord Rama",
  hanuman: "Hanuman",
  sita: "Sita Devi",
};

const characterGreetings: Record<string, string> = {
  rama: "Namaste. I am Rama, son of Dasharatha. What wisdom do you seek from the path of dharma?",
  hanuman: "Jai Shri Ram! I am Hanuman, servant of Lord Rama. How may I serve you with the strength of devotion?",
  sita: "Namaste. I am Sita, daughter of the Earth. Ask me about strength, patience, or the power of love.",
};

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const ChatScreen = () => {
  const navigate = useNavigate();
  const { character } = useParams<{ character: string }>();
  const { user, session } = useAuth();
  const charName = characterNames[character || "rama"] || "Character";
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: characterGreetings[character || "rama"] || "", sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input.trim();
    const userMsg: Message = { id: Date.now(), text: userText, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      };

      // If user is logged in, use their token for chat history saving
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ character: character || "rama", message: userText }),
        }
      );

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed (${resp.status})`);
      }

      // Check if JSON response (authenticated) or SSE stream
      const contentType = resp.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await resp.json();
        setMessages((prev) => [
          ...prev,
          { id: Date.now(), text: data.response, sender: "ai" },
        ]);
      } else {
        // SSE streaming for unauthenticated
        const reader = resp.body!.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";
        let buffer = "";

        const aiMsgId = Date.now() + 1;
        setMessages((prev) => [...prev, { id: aiMsgId, text: "", sender: "ai" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullContent += content;
                const captured = fullContent;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === aiMsgId ? { ...m, text: captured } : m
                  )
                );
              }
            } catch { /* partial */ }
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get response",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: "I'm unable to respond right now. Please try again.", sender: "ai" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/characters")}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-foreground">{charName}</h1>
          <p className="text-xs text-primary/70">
            {user ? "Connected" : "Guest mode"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
        <div className="flex flex-col gap-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "ml-auto bg-primary text-primary-foreground rounded-br-md"
                  : "mr-auto glass-card text-foreground rounded-bl-md"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
          {isLoading && (
            <div className="mr-auto flex items-center gap-2 glass-card rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1 rounded-xl glass-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform active:scale-95 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
