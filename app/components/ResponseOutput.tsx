'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface ResponseOutputProps {
  responseText: string;
}

// Memoized single letter with fade-in animation
const FadeInLetter = memo(({ char, index }: { char: string; index: number }) => (
  <span
    className="fade-in-letter"
    style={{ animationDelay: `${index * 0.03}s`, whiteSpace: 'pre' }}
  >
    {char === ' ' ? '\u00A0' : char}
  </span>
));

export default function ResponseOutput({ responseText }: ResponseOutputProps) {
  const [letters, setLetters] = useState<string[]>([]);
  const prevTextRef = useRef('');

  useEffect(() => {
    // Append only new letters if text is an extension
    if (responseText.startsWith(prevTextRef.current)) {
      const newLetters = responseText.slice(prevTextRef.current.length).split('');
      if (newLetters.length > 0) {
        setLetters((prev) => [...prev, ...newLetters]);
      }
    } else {
      // Reset if text changed drastically
      setLetters(responseText.split(''));
    }
    prevTextRef.current = responseText;
  }, [responseText]);

  return (
    <Box sx={{ mt: 3, px: 2, py: 1, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: '#fafbfc' }}>
        <Typography
          component="p"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            fontSize: '1rem',
            maxWidth: '100%',
          }}
        >
          {letters.map((char, i) => (
            <FadeInLetter key={i} char={char} index={i} />
          ))}
        </Typography>
      </Paper>
    </Box>
  );
}