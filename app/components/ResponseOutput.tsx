import React from 'react';

interface ResponseOutputProps {
  responseText: string;
}

export default function ResponseOutput({ responseText }: ResponseOutputProps) {
  return (
    <pre
      style={{
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        minHeight: 100,
        whiteSpace: 'pre-wrap',
        fontSize: 16,
        transition: 'opacity 0.3s ease',
      }}
    >
      {responseText}
    </pre>
  );
}
