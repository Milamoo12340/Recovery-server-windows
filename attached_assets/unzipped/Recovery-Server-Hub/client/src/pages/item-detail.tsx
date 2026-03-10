import { useParams, Link } from "wouter";
import { Shell } from "@/components/layout/shell";
import { useRecoveryItem } from "@/hooks/use-recovery-items";
import { CodeBlock } from "@/components/ui/code-block";
import { ArrowLeft, HardDrive, Terminal, ShieldAlert } from "lucide-react";

export function ItemDetail() {
  const { id } = useParams();
  const { data: item, isLoading, error } = useRecoveryItem(id ? parseInt(id) : 0);

  if (isLoading) {
    return (
      <Shell>
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
          <div className="w-24 h-6 bg-card rounded-md" />
          <div className="h-32 bg-card rounded-2xl" />
          <div className="h-64 bg-card rounded-2xl" />
        </div>
      </Shell>
    );
  }

  if (error || !item) {
    return (
      <Shell>
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-destructive/10 border border-destructive/20 text-center">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Item Not Found</h2>
          <p className="text-muted-foreground mb-6">The recovery media you requested is unavailable or has been removed.</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-4xl mx-auto pb-16">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> 
          Back to Dashboard
        </Link>

        <div className="glass-panel rounded-3xl p-8 md:p-10 mb-8 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center shrink-0">
              <HardDrive className="w-8 h-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-display font-bold text-white">{item.name}</h1>
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-muted-foreground">
                  {item.type.toUpperCase()}
                </span>
              </div>
              <p className="text-muted-foreground text-lg">{item.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
            <div>
              <span className="block text-xs text-muted-foreground mb-1">Size</span>
              <span className="font-mono text-white">{item.size}</span>
            </div>
            <div className="col-span-3">
              <span className="block text-xs text-muted-foreground mb-1">Server Path</span>
              <span className="font-mono text-white truncate block" title={item.path}>{item.path}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-display font-semibold mb-4 flex items-center gap-2">
              <Terminal className="w-6 h-6 text-primary" />
              Connection Instructions
            </h2>
            <div className="prose prose-invert prose-p:text-muted-foreground prose-headings:text-white max-w-none">
              <div className="glass-panel rounded-2xl p-6 md:p-8">
                {/* Parse basic markdown/newlines from the instructions field */}
                {item.instructions.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('```')) {
                    const lines = paragraph.split('\n');
                    const lang = lines[0].replace('```', '');
                    const code = lines.slice(1, -1).join('\n');
                    return <CodeBlock key={idx} code={code} language={lang || 'bash'} />;
                  }
                  return <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>;
                })}

                {/* Always provide a generic connection command block if instructions don't include code blocks */}
                {!item.instructions.includes('```') && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-white mb-2 uppercase tracking-wider">Clonezilla Pre-boot Shell Command</h4>
                    <CodeBlock 
                      code={`# Mount the remote repository containing this media
sudo mount -t cifs //server_ip${item.path.split('/').slice(0, -1).join('/')} /home/partimag -o user=guest,ro

# Verify the file is accessible
ls -l /home/partimag/${item.path.split('/').pop()}`} 
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
