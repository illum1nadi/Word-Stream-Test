'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Props
interface ResponseOutputProps {
  responseText: string;
}

// Reusable memoized letter component
const FadeInLetter = memo(({ char, index }: { char: string; index: number }) => (
  <span
    className="fade-in-letter"
    style={{ animationDelay: `${index * 0.0005}s`, whiteSpace: 'pre' }}
  >
    {char === ' ' ? '\u00A0' : char}
  </span>
));

// AnimatedText: Wraps each character
const AnimatedText = ({
  children,
  startIndex = 0,
}: {
  children: React.ReactNode;
  startIndex?: number;
}) => {
  if (typeof children !== 'string') return <>{children}</>;
  return (
    <>
      {children.split('').map((char, i) => (
        <FadeInLetter key={startIndex + i} char={char} index={startIndex + i} />
      ))}
    </>
  );
};

// Recursively process AST node
const processMarkdownNode = (
  node: React.ReactNode,
  currentIndex: { value: number }
): React.ReactNode => {
  if (typeof node === 'string') {
    const startIdx = currentIndex.value;
    currentIndex.value += node.length;
    return <AnimatedText startIndex={startIdx}>{node}</AnimatedText>;
  }

  if (
    React.isValidElement(node) &&
    node.props &&
    typeof node.props === 'object' &&
    node.props !== null &&
    'children' in node.props
  ) {
    const children = React.Children.map(node.props.children, (child) =>
      processMarkdownNode(child as React.ReactNode, currentIndex)
    );
    return React.cloneElement(node, { ...(node.props || {}) }, children);
  }

  return node;
};

// Reusable animated wrapper for components
const animatedRenderer = (
  Tag: React.ElementType,
  props: any,
  children: React.ReactNode
) => {
  const currentIndex = { value: 0 };
  const animatedChildren = React.Children.map(children, (child) =>
    processMarkdownNode(child as React.ReactNode, currentIndex)
  );
  return <Tag {...props}>{animatedChildren}</Tag>;
};

// Full Markdown component map with animations and MUI
const markdownComponents = {
  h1: (props: any) => animatedRenderer(Typography, { variant: 'h3', gutterBottom: true, ...props }, props.children),
  h2: (props: any) => animatedRenderer(Typography, { variant: 'h4', gutterBottom: true, ...props }, props.children),
  h3: (props: any) => animatedRenderer(Typography, { variant: 'h5', gutterBottom: true, ...props }, props.children),
  h4: (props: any) => animatedRenderer(Typography, { variant: 'subtitle1', gutterBottom: true, ...props }, props.children),
  h5: (props: any) => animatedRenderer(Typography, { variant: 'subtitle2', gutterBottom: true, ...props }, props.children),
  h6: (props: any) => animatedRenderer(Typography, { variant: 'body1', fontWeight: 700, gutterBottom: true, ...props }, props.children),
  p: (props: any) => animatedRenderer(Typography, { variant: 'body1', paragraph: true, ...props }, props.children),
  strong: (props: any) => animatedRenderer('strong', props, props.children),
  em: (props: any) => animatedRenderer('em', props, props.children),
  ul: (props: any) => <List sx={{ listStyleType: 'disc', pl: 3 }} {...props} />,
  ol: (props: any) => <List sx={{ listStyleType: 'decimal', pl: 3 }} {...props} />,
  li: (props: any) =>
    animatedRenderer(ListItem, { sx: { display: 'list-item', pl: 0 }, ...props }, props.children),
  a: (props: any) => <MuiLink target="_blank" rel="noopener" {...props} />,
  blockquote: (props: any) => (
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
  code: (props: any) => {
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
  table: (props: any) => <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', my: 2 }} {...props} />,
  thead: (props: any) => <Box component="thead" {...props} />,
  tbody: (props: any) => <Box component="tbody" {...props} />,
  tr: (props: any) => <Box component="tr" {...props} />,
  th: (props: any) => (
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
  td: (props: any) => (
    <Box
      component="td"
      sx={{
        border: '1px solid #ccc',
        p: 1,
      }}
      {...props}
    />
  ),
};

// Final output component
export default function ResponseOutput({ responseText }: ResponseOutputProps) {
  const [displayText, setDisplayText] = useState('');
  const prevTextRef = useRef('');

  useEffect(() => {
    if (responseText.startsWith(prevTextRef.current)) {
      const newChars = responseText.slice(prevTextRef.current.length);
      if (newChars.length > 0) setDisplayText(responseText);
    } else {
      setDisplayText(responseText);
    }
    prevTextRef.current = responseText;
  }, [responseText]);

  return (
    <>
      <style jsx>{`
        .fade-in-letter {
          opacity: 0;
          animation: fadeIn 0.3s ease-in-out forwards;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>

      <Box sx={{ mt: 3, px: 2, py: 1, maxWidth: 800, mx: 'auto' }}>
        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#fafbfc' }}>
          <Typography
            component="div"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              fontSize: '1rem',
              maxWidth: '100%',
              '& > *:first-child': { marginTop: 0 },
              '& > *:last-child': { marginBottom: 0 },
            }}
          >
            <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
              {displayText}
            </ReactMarkdown>
          </Typography>
        </Paper>
      </Box>
    </>
  );
}
