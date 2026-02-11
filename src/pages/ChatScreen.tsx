import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Send } from "lucide-react";

const characterNames: Record<string, string> = {
  rama: "Lord Rama",
  hanuman: "Hanuman",
  sita: "Sita Devi",
};

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const initialMessages: Record<string, Message[]> = {
  rama: [
    {
      id: 1,
      text: "Namaste. I am Rama, son of Dasharatha. What wisdom do you seek from the path of dharma?",
      sender: "ai",
    },
  ],
  hanuman: [
    {
      id: 1,
      text: "Jai Shri Ram! I am Hanuman, servant of Lord Rama. How may I serve you with the strength of devotion?",
      sender: "ai",
    },
  ],
  sita: [
    {
      id: 1,
      text: "Namaste. I am Sita, daughter of the Earth. Ask me about strength, patience, or the power of love.",
      sender: "ai",
    },
  ],
};

const ChatScreen = () => {
  const navigate = useNavigate();
  const { character } = useParams<{ character: string }>();
  const charName = characterNames[character || "rama"] || "Character";
  const [messages, setMessages] = useState<Message[]>(
    initialMessages[character || "rama"] || []
  );
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now(),
      text: input.trim(),
      sender: "user",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulated AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        text: "This feature will be powered by AI. Connect a backend to enable real conversations with the legends of Ramayana.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <button
          onClick={() => navigate("/characters")}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-foreground">{charName}</h1>
          <p className="text-xs text-primary/70">Online</p>
        </div>
      </div>

      {/* Messages */}
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
                  : "mr-auto bg-card border border-gold/15 text-foreground rounded-bl-md"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question..."
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={sendMessage}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
