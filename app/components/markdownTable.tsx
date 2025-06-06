'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import StreamingTable from './streamingTable';

// Helper function to detect if text contains a proper markdown table
function hasMarkdownTable(text: string): boolean {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    const currentLine = lines[i].trim();
    const nextLine = lines[i + 1]?.trim();
    
    // Check if current line has | and next line has dashes and |
    if (currentLine.includes('|') && nextLine && /^[\s\-\|:]+$/.test(nextLine)) {
      return true;
    }
  }
  return false;
}

// Helper function to parse markdown table manually
function parseMarkdownTable(markdown: string): { headers: string[], rows: string[][] } | null {
  const lines = markdown.split('\n').map(line => line.trim()).filter(line => line);
  
  for (let i = 0; i < lines.length - 1; i++) {
    const headerLine = lines[i];
    const separatorLine = lines[i + 1];
    
    if (headerLine.includes('|') && /^[\s\-\|:]+$/.test(separatorLine)) {
      // Parse headers
      const headers = headerLine
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '');
      
      // Parse data rows
      const rows: string[][] = [];
      for (let j = i + 2; j < lines.length; j++) {
        const rowLine = lines[j];
        if (!rowLine.includes('|')) break;
        
        const rowCells = rowLine
          .split('|')
          .map(cell => cell.trim())
          .filter(cell => cell !== '');
        
        if (rowCells.length > 0) {
          rows.push(rowCells);
        }
      }
      
      return { headers, rows };
    }
  }
  
  return null;
}

export default function MarkdownWithStreamingTable({ markdown }: { markdown: string }) {
  const tableData = useMemo(() => {
    if (!hasMarkdownTable(markdown)) {
      return null;
    }
    return parseMarkdownTable(markdown);
  }, [markdown]);

  // If we have table data, render the streaming table
  if (tableData) {
    return <StreamingTable fullTableData={tableData} />;
  }

  // Otherwise, render normal ReactMarkdown
  return (
    <ReactMarkdown>
      {markdown}
    </ReactMarkdown>
  );
}