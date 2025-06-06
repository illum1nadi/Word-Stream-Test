'use client';

import React, {
  useState,
  useEffect,
  useRef,
  memo,
  ReactNode,
  ReactElement,
} from 'react';
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
import { Components } from 'react-markdown';

interface ResponseOutputProps {
  responseText: string;
}

const FadeInLetter = memo(
  ({ char, index }: { char: string; index: number }) => (
    <span
      className="fade-in-letter"
      style={{ animationDelay: `${index * 0.0005}s`, whiteSpace: 'pre' }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  )
);

const AnimatedText = ({
  children,
  startIndex = 0,
}: {
  children: ReactNode;
  startIndex?: number;
}): ReactElement => {
  if (typeof children !== 'string') return <>{children}</>;
  return (
    <>
      {children.split('').map((char, i) => (
        <FadeInLetter key={startIndex + i} char={char} index={startIndex + i} />
      ))}
    </>
  );
};

const processMarkdownNode = (
  node: ReactNode,
  currentIndex: { value: number }
): ReactNode => {
  if (typeof node === 'string') {
    const startIdx = currentIndex.value;
    currentIndex.value += node.length;
    return <AnimatedText startIndex={startIdx}>{node}</AnimatedText>;
  }

  if (
    React.isValidElement(node) &&
    node.props &&
    typeof node.props === 'object' &&
    'children' in node.props
  ) {
    const children = React.Children.map(
      node.props.children as ReactNode,
      (child: ReactNode) => processMarkdownNode(child, currentIndex)
    );
    return React.cloneElement(node, { ...(node.props || {}) }, children);
  }

  return node;
};

const animatedRenderer = (
  Tag: React.ElementType,
  props: Record<string, unknown>,
  children: ReactNode
): ReactElement => {
  const currentIndex = { value: 0 };
  const animatedChildren = React.Children.map(children, (child) =>
    processMarkdownNode(child, currentIndex)
  );
  return <Tag {...props}>{animatedChildren}</Tag>;
};

const markdownComponents: Components = {
  h1: (props) =>
    animatedRenderer(
      Typography,
      { variant: 'h3', gutterBottom: true, ...props },
      props.children
    ),
  h2: (props) =>
    animatedRenderer(
      Typography,
      { variant: 'h4', gutterBottom: true, ...props },
      props.children
    ),
  h3: (props) =>
    animatedRenderer(
      Typography,
      { variant: 'h5', gutterBottom: true, ...props },
      props.children
    ),
  h4: (props) =>
    animatedRenderer(
      Typography,
      { variant: 'subtitle1', gutterBottom: true, ...props },
      props.children
    ),
  h5: (props) =>
    animatedRenderer(
      Typography,
      { variant: 'subtitle2', gutterBottom: true, ...props },
      props.children
    ),
  h6: (props) =>
    animatedRenderer(
      Typography,
      { variant: 'body1', fontWeight: 700, gutterBottom: true, ...props },
      props.children
    ),
  p: (props) =>
    animatedRenderer(
      Typography,
      { variant: 'body1', paragraph: true, ...props },
      props.children
    ),
  strong: (props) => animatedRenderer('strong', { ...props }, props.children),
  em: (props) => animatedRenderer('em', { ...props }, props.children),
  ul: (props) => <List sx={{ listStyleType: 'disc', pl: 3 }} {...props} />,
  ol: (props) => <List sx={{ listStyleType: 'decimal', pl: 3 }} {...props} />,
  li: (props) =>
    animatedRenderer(
      ListItem,
      { sx: { display: 'list-item', pl: 0 }, ...props },
      props.children
    ),
  a: (props) => <MuiLink target="_blank" rel="noopener" {...props} />,
  blockquote: (props) => (
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
  code: ({
    inline,
    children,
    ...rest
  }: {
    inline?: boolean;
    children?: ReactNode;
  }) => (
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
        ...(inline
          ? { display: 'inline' }
          : { display: 'block', my: 1, p: 1 }),
      }}
      {...rest}
    >
      {children}
    </Box>
  ),
  table: (props) => (
    <Box
      component="table"
      sx={{ width: '100%', borderCollapse: 'collapse', my: 2 }}
      {...props}
    />
  ),
  thead: (props) => <Box component="thead" {...props} />,
  tbody: (props) => <Box component="tbody" {...props} />,
  tr: (props) => <Box component="tr" {...props} />,
  th: (props) => (
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
  td: (props) => (
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

export default function ResponseOutput({
  responseText,
}: ResponseOutputProps): ReactElement {
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

      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: '100%',
          overflowY: 'scroll',
          backgroundColor: '#fafbfc',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          component="div"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            fontSize: '1rem',
            flex: 1,
          }}
        >
          <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
            {responseText}
          </ReactMarkdown>
        </Typography>
      </Paper>
    </>
  );
}
