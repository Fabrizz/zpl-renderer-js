import ReactMarkdown from "react-markdown";

type Props = {
  markdown: string;
  className?: string; // e.g., "prose max-w-none"
};

export default function BasicMarkdown({ markdown, className }: Props) {
  return (
    <div className={className}>
      <ReactMarkdown>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}