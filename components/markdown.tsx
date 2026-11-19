import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { withBasePath } from "@/lib/site";

function allowUrl(url: string): string {
  if (
    url.startsWith("/") ||
    url.startsWith("#") ||
    url.startsWith("tel:") ||
    url.startsWith("mailto:") ||
    url.startsWith("https://") ||
    url.startsWith("http://")
  ) {
    return url;
  }
  return "";
}

const components: Components = {
  p: ({ children }) => <p className="mb-4 text-base leading-7 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc space-y-2 pl-5 text-base leading-7 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal space-y-3 pl-5 text-base leading-7 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="pl-1 marker:text-primary">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  h3: ({ children }) => <h3 className="mt-6 mb-2 font-serif text-xl">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="mb-4 border-l-2 border-primary/40 pl-4 text-muted-foreground">{children}</blockquote>
  ),
  a: ({ href, children }) => {
    const external = Boolean(href?.startsWith("http"));
    return (
      <a
        href={href ? withBasePath(href) : href}
        className="font-medium text-primary underline decoration-primary/30 underline-offset-4"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
};

export function Markdown({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={allowUrl} components={components}>
      {markdown}
    </ReactMarkdown>
  );
}
