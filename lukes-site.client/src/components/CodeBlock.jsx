import React from 'react';

const CodeBlock = ({ language, code }) => {
  // For OCaml, let's use a more structured approach using tokens
  const tokenizeOCaml = (code) => {
    if (language !== 'ocaml' || !code) return <code>{code}</code>;
    
    // OCaml keywords
    const keywords = [
      'let', 'rec', 'match', 'with', 'type', 'module', 'struct', 'sig',
      'end', 'open', 'in', 'of', 'fun', 'function', 'val', 'mutable',
      'and', 'as', 'assert', 'begin', 'class', 'constraint', 'do', 'done',
      'downto', 'else', 'exception', 'external', 'false', 'for', 'if',
      'include', 'inherit', 'initializer', 'lazy', 'method', 'new',
      'object', 'private', 'to', 'true', 'try', 'when', 'while'
    ];

    // Split the code into lines
    return (
      <code>
        {code.split('\n').map((line, lineIndex) => {
          // Check for comments starting with #
          if (line.trim().startsWith('#')) {
            return (
              <React.Fragment key={lineIndex}>
                <span className="comment">{line}</span>
                {lineIndex < code.split('\n').length - 1 && <br />}
              </React.Fragment>
            );
          }
          
          // Within the tokenizeOCaml function, update the inline comment handling:

          // Check for inline comments with (* ... *)
          if (line.includes('(*') && !line.startsWith('(*')) {
            const commentStart = line.indexOf('(*');
            const beforeComment = line.substring(0, commentStart);
            const afterCommentStart = line.substring(commentStart);
            
            // Process the part before the comment with full syntax highlighting
            const beforeParts = [];
            let currentWord = '';
            
            // Process each character in the beforeComment section
            for (let i = 0; i < beforeComment.length; i++) {
              const char = beforeComment[i];
              
              // Handle string literals
              if (char === '"') {
                if (currentWord) {
                  beforeParts.push({ text: currentWord, type: 'text' });
                  currentWord = '';
                }
                
                // Find the end of the string
                const startIndex = i;
                let endIndex = i + 1;
                while (endIndex < beforeComment.length && beforeComment[endIndex] !== '"') {
                  if (beforeComment[endIndex] === '\\' && endIndex + 1 < beforeComment.length) {
                    endIndex += 2; // Skip escaped characters
                  } else {
                    endIndex++;
                  }
                }
                
                if (endIndex < beforeComment.length) {
                  beforeParts.push({ 
                    text: beforeComment.substring(startIndex, endIndex + 1), 
                    type: 'string' 
                  });
                  i = endIndex;
                } else {
                  beforeParts.push({ 
                    text: beforeComment.substring(startIndex), 
                    type: 'string' 
                  });
                  i = beforeComment.length;
                }
                continue;
              }
              
              // Handle separators
              if (/[\s\(\)\[\]\{\}:;,]/.test(char)) {
                if (currentWord) {
                  // Check if the current word is a keyword
                  const type = keywords.includes(currentWord) ? 'keyword' : 
                              currentWord === '->' ? 'arrow' : 'text';
                  beforeParts.push({ text: currentWord, type });
                  currentWord = '';
                }
                
                if (char === '-' && i + 1 < beforeComment.length && beforeComment[i + 1] === '>') {
                  beforeParts.push({ text: '->', type: 'arrow' });
                  i++; // Skip the next character
                } else {
                  beforeParts.push({ text: char, type: 'text' });
                }
              } else {
                currentWord += char;
              }
            }
            
            // Add any remaining word
            if (currentWord) {
              const type = keywords.includes(currentWord) ? 'keyword' : 'text';
              beforeParts.push({ text: currentWord, type });
            }
            
            return (
              <React.Fragment key={lineIndex}>
                {/* Render the part before comment with syntax highlighting */}
                {beforeParts.map((part, partIndex) => {
                  const className = part.type !== 'text' ? part.type : undefined;
                  return <span key={`before-${partIndex}`} className={className}>{part.text}</span>;
                })}
                
                {/* Render the comment part */}
                <span className="comment">{afterCommentStart}</span>
                
                {lineIndex < code.split('\n').length - 1 && <br />}
              </React.Fragment>
            );
          }
          
          // Split the line into parts that can be individually styled
          const parts = [];
          let currentWord = '';
          let inString = false;
          
          // Process each character
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            // Handle # comments (rest of line becomes a comment)
            if (char === '#' && !inString) {
              if (currentWord) {
                parts.push({ text: currentWord, type: 'text' });
                currentWord = '';
              }
              parts.push({ text: line.substring(i), type: 'comment' });
              break;
            }
            
            // Handle string literals
            if (char === '"') {
              if (currentWord) {
                parts.push({ text: currentWord, type: 'text' });
                currentWord = '';
              }
              
              // Find the end of the string
              const startIndex = i;
              let endIndex = i + 1;
              while (endIndex < line.length && line[endIndex] !== '"') {
                if (line[endIndex] === '\\' && endIndex + 1 < line.length) {
                  endIndex += 2; // Skip escaped characters
                } else {
                  endIndex++;
                }
              }
              
              if (endIndex < line.length) {
                parts.push({ 
                  text: line.substring(startIndex, endIndex + 1), 
                  type: 'string' 
                });
                i = endIndex;
              } else {
                parts.push({ 
                  text: line.substring(startIndex), 
                  type: 'string' 
                });
                i = line.length;
              }
              continue;
            }
            
            // Handle separators
            if (/[\s\(\)\[\]\{\}:;,]/.test(char)) {
              if (currentWord) {
                // Check if the current word is a keyword
                const type = keywords.includes(currentWord) ? 'keyword' : 
                             currentWord === '->' ? 'arrow' : 'text';
                parts.push({ text: currentWord, type });
                currentWord = '';
              }
              
              if (char === '-' && i + 1 < line.length && line[i + 1] === '>') {
                parts.push({ text: '->', type: 'arrow' });
                i++; // Skip the next character
              } else {
                parts.push({ text: char, type: 'text' });
              }
            } else {
              currentWord += char;
            }
          }
          
          // Add any remaining word
          if (currentWord) {
            const type = keywords.includes(currentWord) ? 'keyword' : 'text';
            parts.push({ text: currentWord, type });
          }
          
          return (
            <React.Fragment key={lineIndex}>
              {parts.map((part, partIndex) => {
                const className = part.type !== 'text' ? part.type : undefined;
                return <span key={partIndex} className={className}>{part.text}</span>;
              })}
              {lineIndex < code.split('\n').length - 1 && <br />}
            </React.Fragment>
          );
        })}
      </code>
    );
  };
  
  // Simple highlighting for other languages with # comments (Python, Ruby, etc.)
  const tokenizeWithHashComments = (code) => {
    if (!code) return <code>{code}</code>;
    
    return (
      <code>
        {code.split('\n').map((line, lineIndex) => {
          // Check for comments
          const commentIndex = line.indexOf('#');
          if (commentIndex >= 0) {
            // Line has a comment
            const codePart = line.substring(0, commentIndex);
            const commentPart = line.substring(commentIndex);
            
            return (
              <React.Fragment key={lineIndex}>
                {codePart && <span>{codePart}</span>}
                <span className="comment">{commentPart}</span>
                {lineIndex < code.split('\n').length - 1 && <br />}
              </React.Fragment>
            );
          }
          
          // Regular line
          return (
            <React.Fragment key={lineIndex}>
              {line}
              {lineIndex < code.split('\n').length - 1 && <br />}
            </React.Fragment>
          );
        })}
      </code>
    );
  };
  
  return (
    <pre className={`code-block language-${language}`}>
      {language === 'ocaml' 
        ? tokenizeOCaml(code) 
        : ['python', 'ruby', 'bash', 'shell'].includes(language)
          ? tokenizeWithHashComments(code)
          : <code>{code}</code>
      }
    </pre>
  );
};

export default CodeBlock;