'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResponseOutputProps {
  responseText: string;
}

export default function ResponseOutput({ responseText }: ResponseOutputProps) {
  return (
    <div
      style={{
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        minHeight: 100,
        fontSize: 16,
        lineHeight: 1.6,
        transition: 'opacity 0.3s ease',
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {responseText}
      </ReactMarkdown>
    </div>
  );
}
