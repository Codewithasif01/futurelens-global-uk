import { Fragment, type ReactNode } from "react";

/** Inline: [text](url), **bold**, *italic*. Everything else is plain text (React escapes it). */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    if (m[1]) {
      const href = /^(https?:\/\/|\/|mailto:)/.test(m[2]) ? m[2] : "#";
      out.push(<a key={k} href={href}>{m[1]}</a>);
    } else if (m[3]) out.push(<strong key={k}>{m[3]}</strong>);
    else if (m[4]) out.push(<em key={k}>{m[4]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Minimal, safe Markdown: paragraphs, ## / ### headings and "- " lists. */
export function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose-article">
      {blocks.map((block, i) => {
        const k = `b${i}`;
        if (block.startsWith("### ")) return <h3 key={k} className="text-xl font-semibold mt-6 mb-2">{inline(block.slice(4), k)}</h3>;
        if (block.startsWith("## ")) return <h2 key={k}>{inline(block.slice(3), k)}</h2>;
        const lines = block.split("\n");
        if (lines.every((l) => /^[-*] /.test(l))) {
          return <ul key={k}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2), `${k}-${j}`)}</li>)}</ul>;
        }
        return (
          <p key={k}>
            {lines.map((l, j) => (
              <Fragment key={j}>{j > 0 && <br />}{inline(l, `${k}-${j}`)}</Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
