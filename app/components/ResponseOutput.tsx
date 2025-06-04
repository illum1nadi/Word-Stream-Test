import React from 'react';

interface ResponseOutputProps {
  response: string;
}

export default function ResponseOutput({ response }: ResponseOutputProps) {
  return (
    <pre
      style={{
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        minHeight: 100,
        whiteSpace: 'pre-wrap',
      }}
    >
      {response}
    </pre>
  );
}
