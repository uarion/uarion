import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-6 text-3xl font-bold text-white sm:text-4xl">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-10 border-b border-navy-700 pb-2 text-xl font-semibold text-white sm:text-2xl">
      {children}
    </h2>
  ),
  p: ({ children }) => <p className="text-body mb-4 leading-relaxed text-slate-300">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-slate-100">{children}</strong>,
  ul: ({ children }) => (
    <ul className="text-body mb-4 list-disc space-y-2 pl-6 text-slate-300">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="text-body mb-4 list-decimal space-y-2 pl-6 text-slate-300">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  hr: () => <hr className="my-8 border-navy-700" />,
  table: ({ children }) => (
    <div className="mb-6 overflow-x-auto rounded-lg border border-navy-700">
      <table className="w-full min-w-[28rem] text-left text-sm text-slate-300">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-navy-800 text-slate-200">{children}</thead>,
  tbody: ({ children }) => <tbody className="divide-y divide-navy-700">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => <th className="px-4 py-3 font-semibold">{children}</th>,
  td: ({ children }) => <td className="px-4 py-3">{children}</td>,
  a: ({ href, children }) => (
    <a href={href} className="text-accent underline-offset-2 hover:text-accent-hover hover:underline">
      {children}
    </a>
  ),
};

type LegalMarkdownProps = {
  content: string;
};

export default function LegalMarkdown({ content }: LegalMarkdownProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
}
