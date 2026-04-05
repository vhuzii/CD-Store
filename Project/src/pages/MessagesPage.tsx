import { useState, useEffect, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { useSearchParams, Link } from "react-router-dom";
import { Send, Disc3 } from "lucide-react";
import { motion } from "framer-motion";

const MessagesPage = () => {
  const { currentUser, messages, users, cds, sendMessage } = useAppStore();
  const [searchParams] = useSearchParams();
  const [selectedUserId, setSelectedUserId] = useState(searchParams.get("to") || "");
  const [text, setText] = useState("");
  const cdRefId = searchParams.get("cd") || undefined;

  useEffect(() => {
    const to = searchParams.get("to");
    if (to) setSelectedUserId(to);
  }, [searchParams]);

  const conversations = useMemo(() => {
    if (!currentUser) return [];
    const userIds = new Set<string>();
    messages.forEach(m => {
      if (m.fromUserId === currentUser.id) userIds.add(m.toUserId);
      if (m.toUserId === currentUser.id) userIds.add(m.fromUserId);
    });
    if (selectedUserId) userIds.add(selectedUserId);
    return Array.from(userIds).map(id => users.find(u => u.id === id)).filter(Boolean);
  }, [currentUser, messages, users, selectedUserId]);

  const currentMessages = useMemo(() => {
    if (!currentUser || !selectedUserId) return [];
    return messages.filter(
      m => (m.fromUserId === currentUser.id && m.toUserId === selectedUserId) ||
           (m.fromUserId === selectedUserId && m.toUserId === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [currentUser, selectedUserId, messages]);

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Увійдіть, щоб переглянути повідомлення</p>
          <Link to="/auth" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Увійти</Link>
        </div>
      </div>
    );
  }

  const selectedUser = users.find(u => u.id === selectedUserId);
  const refCD = cdRefId ? cds.find(c => c.id === cdRefId) : null;

  const handleSend = () => {
    if (!text.trim() || !selectedUserId) return;
    sendMessage(selectedUserId, text.trim(), cdRefId);
    setText("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Повідомлення</h1>

      <div className="flex gap-4 h-[60vh] bg-card border border-border rounded-2xl overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 sm:w-64 border-r border-border overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground">Немає розмов</p>
          ) : (
            conversations.map(user => user && (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`w-full text-left px-4 py-3 border-b border-border transition-colors ${
                  selectedUserId === user.id ? 'bg-secondary' : 'hover:bg-secondary/50'
                }`}
              >
                <span className="text-sm font-medium text-foreground">{user.name}</span>
              </button>
            ))
          )}
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="px-4 py-3 border-b border-border">
                <span className="font-medium text-foreground">{selectedUser.name}</span>
              </div>

              {refCD && (
                <div className="px-4 py-2 bg-secondary/50 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
                  <Disc3 className="h-3.5 w-3.5 text-primary" />
                  Щодо: <span className="text-foreground font-medium">{refCD.title}</span> — {refCD.artist}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentMessages.map(msg => {
                  const isMe = msg.fromUserId === currentUser.id;
                  const msgCD = msg.cdRefId ? cds.find(c => c.id === msg.cdRefId) : null;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                        isMe ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-secondary text-secondary-foreground rounded-bl-md'
                      }`}>
                        {msgCD && (
                          <div className="text-xs opacity-75 mb-1 flex items-center gap-1">
                            <Disc3 className="h-3 w-3" /> {msgCD.title}
                          </div>
                        )}
                        {msg.text}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-border flex gap-2">
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Написати повідомлення..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Оберіть розмову
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
