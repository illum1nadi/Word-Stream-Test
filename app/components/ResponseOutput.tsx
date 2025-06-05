'use client';

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Paper, Typography, List, ListItem, Link as MuiLink, Divider } from '@mui/material';

interface ResponseOutputProps {
  responseText: string;
}

export default function ResponseOutput({ responseText }: ResponseOutputProps) {
  const [localText, setLocalText] = React.useState(responseText);

  useEffect(() => {
    setLocalText(responseText);
  }, [responseText]);

  useEffect(() => {
    function handleClear() {
      setLocalText('');
    }
    window.addEventListener('clear-response-output', handleClear);
    return () => {
      window.removeEventListener('clear-response-output', handleClear);
    };
  }, []);

  return (
    <Box sx={{ mt: 3, px: 2, py: 1, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#fafbfc' }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ ...props }) => <Typography variant="h4" gutterBottom {...props} />,
            h2: ({ ...props }) => <Typography variant="h5" gutterBottom {...props} />,
            h3: ({ ...props }) => <Typography variant="h6" gutterBottom {...props} />,
            h4: ({ ...props }) => <Typography variant="subtitle1" gutterBottom {...props} />,
            h5: ({ ...props }) => <Typography variant="subtitle2" gutterBottom {...props} />,
            h6: ({ ...props }) => <Typography variant="body1" fontWeight={700} gutterBottom {...props} />,
            p: ({ ...props }) => <Typography variant="body1" paragraph {...props} />,
            ul: ({ ...props }) => <List sx={{ listStyleType: 'disc', pl: 3 }} {...props} />,
            ol: ({ ...props }) => <List sx={{ listStyleType: 'decimal', pl: 3 }} {...props} />,
            li: ({ ...props }) => <ListItem sx={{ display: 'list-item', pl: 0 }} {...props} />,
            a: ({ ...props }) => <MuiLink target="_blank" rel="noopener" {...props} />,
            blockquote: ({ ...props }) => (
              <Typography
                component="blockquote"
                sx={{
                  borderLeft: '4px solid #ccc',
                  pl: 2,
                  color: 'grey.700',
                  fontStyle: 'italic',
                  my: 2,
                }}
                {...props}
              />
            ),
            hr: () => <Divider sx={{ my: 2 }} />,
            code(props) {
              // @ts-ignore
              const isInline = props.inline;
              const { children, ...rest } = props;
              return (
                <Box
                  component="code"
                  sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    px: 0.7,
                    py: 0.3,
                    fontFamily: 'monospace',
                    fontSize: '0.95em',
                    color: '#c7254e',
                    ...(isInline ? { display: 'inline' } : { display: 'block', my: 1, p: 1 }),
                  }}
                  {...rest}
                >
                  {children}
                </Box>
              );
            },
            table: ({ ...props }) => (
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', my: 2 }} {...props} />
            ),
            th: ({ ...props }) => (
              <Box
                component="th"
                sx={{
                  border: '1px solid #ccc',
                  p: 1,
                  backgroundColor: '#f0f0f0',
                  fontWeight: 700,
                }}
                {...props}
              />
            ),
            td: ({ ...props }) => (
              <Box component="td" sx={{ border: '1px solid #ccc', p: 1 }} {...props} />
            ),
            tr: ({ ...props }) => <Box component="tr" {...props} />,
          }}
        >
          {localText}
        </ReactMarkdown>
      </Paper>
    </Box>
  );
}
