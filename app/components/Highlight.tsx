import type { ReactNode } from "react";

export default function Highlight({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const needle = query.trim().toLowerCase();
  if (!needle) return <>{text}</>;

  const haystack = text.toLowerCase();
  const parts: ReactNode[] = [];
  let index = 0;
  let key = 0;

  while (index < text.length) {
    const found = haystack.indexOf(needle, index);
    if (found === -1) {
      parts.push(text.slice(index));
      break;
    }
    if (found > index) parts.push(text.slice(index, found));
    parts.push(
      <mark key={key++} className="bg-neon/25 text-neon">
        {text.slice(found, found + needle.length)}
      </mark>,
    );
    index = found + needle.length;
  }

  return <>{parts}</>;
}
