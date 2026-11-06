import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

function SolutionRenderer({ solution }) {
  const highlightedSolution = solution.replace(
    /^(?:\*\*)?(Final Answer|Answer)(?:\*\*)?:\s*(.*)$/gim,
    (_, label, answer) => `### ${label}\n\n${answer}`,
  );

  return (
    <div className="solution-content">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {highlightedSolution}
      </ReactMarkdown>
    </div>
  );
}

export default SolutionRenderer;