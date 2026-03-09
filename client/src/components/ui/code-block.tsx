import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = "bash", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-[#0d1117] my-4 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
        <span className="text-xs text-muted-foreground font-mono">
          {filename || language}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto scrollbar-thin">
        <pre className="text-sm text-gray-300 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
