## Packages
framer-motion | Smooth layout animations and page transitions
react-markdown | For rendering AI chat responses with formatting
remark-gfm | GitHub flavored markdown for tables/code blocks in chat

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
  mono: ["var(--font-mono)"],
}

Tailwind Config - add colors:
colors: {
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  card: "hsl(var(--card))",
  "card-foreground": "hsl(var(--card-foreground))",
  border: "hsl(var(--border))",
  primary: "hsl(var(--primary))",
  "primary-foreground": "hsl(var(--primary-foreground))",
  muted: "hsl(var(--muted))",
  "muted-foreground": "hsl(var(--muted-foreground))",
  accent: "hsl(var(--accent))",
  "accent-foreground": "hsl(var(--accent-foreground))",
}

Chat SSE expects JSON format like: data: {"content": "hello"} \n\n data: {"done": true}
