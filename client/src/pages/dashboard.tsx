import { Shell } from "@/components/layout/shell";
import { useRecoveryItems } from "@/hooks/use-recovery-items";
import { Link } from "wouter";
import { Server, HardDrive, Cpu, FileCode2, Settings, ArrowRight } from "lucide-react";

const getIconForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'wim': return <HardDrive className="w-6 h-6 text-cyan-400" />;
    case 'winpe': return <Server className="w-6 h-6 text-blue-400" />;
    case 'dll': return <Settings className="w-6 h-6 text-purple-400" />;
    case 'script': return <FileCode2 className="w-6 h-6 text-amber-400" />;
    case 'folder': return <Cpu className="w-6 h-6 text-emerald-400" />;
    default: return <HardDrive className="w-6 h-6 text-gray-400" />;
  }
};

export function Dashboard() {
  const { data: items, isLoading, error } = useRecoveryItems();

  return (
    <Shell>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Server Online
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Available Recovery Media
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Access remote clean recovery files via PXE boot or Clonezilla-live. Select a package below to view connection instructions.
          </p>
        </header>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-card animate-pulse border border-border" />
            ))}
          </div>
        )}

        {error && (
          <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex flex-col items-center justify-center text-center space-y-3">
            <ShieldAlert className="w-12 h-12 text-destructive" />
            <h3 className="text-xl font-bold text-foreground">Failed to load recovery items</h3>
            <p className="text-muted-foreground">The server might be unreachable or restarting.</p>
          </div>
        )}

        {items && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link key={item.id} href={`/item/${item.id}`} className="group block h-full">
                <div className="h-full flex flex-col glass-panel rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
                      {getIconForType(item.type)}
                    </div>
                    <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-white/5 text-muted-foreground border border-white/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                      {item.size}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm flex-1 mb-6 line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-primary transition-colors mt-auto">
                    View Instructions
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
