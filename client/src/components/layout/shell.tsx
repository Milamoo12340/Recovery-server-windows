import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Terminal, HardDrive, MessageSquare, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: HardDrive },
    { href: "/chat", label: "Recovery Assistant", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 flex flex-col border-r border-border bg-card/30 backdrop-blur-xl relative z-10 transition-all duration-300">
        <div className="p-4 md:p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <h1 className="hidden md:block font-display font-bold text-lg leading-tight">
            Clonezilla<br/><span className="text-primary">Recovery</span>
          </h1>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className="block">
                <div
                  className={`
                    group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"}
                  `}
                >
                  <item.icon className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="hidden md:block font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center md:justify-start">
            <Terminal className="w-4 h-4" />
            <span className="hidden md:inline">v2025.05.12-plucky</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col relative z-0">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-primary/5 blur-[100px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
