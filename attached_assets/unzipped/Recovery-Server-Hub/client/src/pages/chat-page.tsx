import { useState, useRef, useEffect } from "react";
import { Shell } from "@/components/layout/shell";
import { useConversations, useCreateConversation, useConversation, useChatStream, useDeleteConversation } from "@/hooks/use-chat";
import { Plus, MessageSquare, Send, User, Bot, Trash2, Loader2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ChatPage() {
  const { data: conversations, isLoading: isConversationsLoading } = useConversations();
  const createConv = useCreateConversation();
  const deleteConv = useDeleteConversation();
  
  const [activeId, setActiveId] = useState<number | null>(null);

  // Set first conversation as active by default
  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeId) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  const handleCreate = async () => {
    const newConv = await createConv.mutateAsync("New Troubleshoot Session");
    setActiveId(newConv.id);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this conversation?")) {
      await deleteConv.mutateAsync(id);
      if (activeId === id) setActiveId(null);
    }
  };

  return (
    <Shell>
      <div className="flex h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] max-w-7xl mx-auto gap-6">
        
        {/* Chat Sidebar */}
        <div className="hidden lg:flex w-72 flex-col glass-panel rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <button
              onClick={handleCreate}
              disabled={createConv.isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors disabled:opacity-50"
            >
              {createConv.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
              New Session
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
            {isConversationsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
              </div>
            ) : conversations?.map(conv => (
              <div
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`
                  group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all
                  ${activeId === conv.id ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/5 hover:text-white"}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate text-sm font-medium">{conv.title}</span>
                </div>
                <button
                  onClick={(e) => handleDelete(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {conversations?.length === 0 && (
              <div className="text-center p-4 text-sm text-muted-foreground">
                No active sessions.
              </div>
            )}
          </div>
        </div>

        {/* Active Chat Area */}
        <div className="flex-1 flex flex-col glass-panel rounded-2xl overflow-hidden relative">
          {activeId ? (
            <ActiveChat conversationId={activeId} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Bot className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">AI Recovery Assistant</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Stuck at a boot menu? BCD errors? Let the assistant guide you to the right recovery file and command sequence.
              </p>
              <button
                onClick={handleCreate}
                disabled={createConv.isPending}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-all shadow-lg glow-cyan"
              >
                Start Troubleshooting
              </button>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

function ActiveChat({ conversationId }: { conversationId: number }) {
  const { data: conversation, isLoading } = useConversation(conversationId);
  const { sendMessage, isStreaming, streamedResponse, error } = useChatStream(conversationId);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, streamedResponse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput("");
  };

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <>
      {/* Header */}
      <div className="p-4 md:px-6 md:py-5 border-b border-border bg-card/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{conversation?.title || "Troubleshoot Session"}</h3>
            <span className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Online
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin">
        {conversation?.messages?.length === 0 && !isStreaming && (
          <div className="text-center mt-10 text-muted-foreground p-6 rounded-xl border border-dashed border-white/10 max-w-lg mx-auto">
            Describe your computer's issue (e.g., "I have a BCD error 0xc00000f" or "My Windows 11 won't boot past the HP logo").
          </div>
        )}
        
        {conversation?.messages?.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 ${
              msg.role === "user" ? "bg-white/10" : "bg-primary/20"
            }`}>
              {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-primary" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === "user" 
                ? "bg-primary text-primary-foreground rounded-tr-sm" 
                : "bg-white/5 border border-white/10 text-foreground rounded-tl-sm prose-invert prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10"
            }`}>
              {msg.role === "user" ? (
                msg.content
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="flex gap-4">
            <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 bg-primary/20">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="max-w-[80%] rounded-2xl p-4 bg-white/5 border border-white/10 text-foreground rounded-tl-sm prose-invert prose-pre:bg-black/50">
              {streamedResponse ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{streamedResponse}</ReactMarkdown>
              ) : (
                <div className="flex gap-1 items-center h-6">
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-destructive p-4 bg-destructive/10 rounded-xl justify-center">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-card/50 border-t border-border">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder="Type your error or question here..."
            className="w-full bg-background border border-white/10 rounded-xl pl-4 pr-14 py-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </>
  );
}
