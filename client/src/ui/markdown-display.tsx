import { marked } from "marked";
import "./md_style.css"

interface MarkdownDisplayProps {
    content: string;
  }
  
  const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ content }) => {
    return (
      <div className="markdown-content"
        dangerouslySetInnerHTML={{ __html: marked(content) }}
      ></div>
    );
  };
  
  export default MarkdownDisplay;
  