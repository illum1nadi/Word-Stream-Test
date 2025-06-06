'use client';

import React, { useEffect, useState, useRef } from 'react';
import '../globals.css';

interface StreamingTableProps {
  fullTableData: {
    headers: string[];
    rows: string[][];
  };
}

export default function StreamingTable({ fullTableData }: StreamingTableProps) {
  const { headers, rows } = fullTableData;

  // Flatten all cells into a buffer list
  const flattenedCells = [headers, ...rows].flat();
  const [visibleCellCount, setVisibleCellCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visibleCellCount >= flattenedCells.length) return;

    timerRef.current = setTimeout(() => {
      setVisibleCellCount((prev) => prev + 1);
    }, 30); // same 30ms delay per element as used for characters

    return () => clearTimeout(timerRef.current!);
  }, [visibleCellCount, flattenedCells.length]);

  const getCellIndex = (rowIndex: number, colIndex: number) =>
    rowIndex * headers.length + colIndex;

  return (
    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {headers.map((header, colIdx) => {
              const index = getCellIndex(0, colIdx);
              return (
                <th
                  key={colIdx}
                  className={index < visibleCellCount ? 'fade-in-letter' : ''}
                  style={{
                    animationDelay: `${index * 0.03}s`,
                    textAlign: 'left',
                    padding: '8px',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  {index < visibleCellCount ? header : ''}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => {
                const index = getCellIndex(rIdx + 1, cIdx); // +1 for header row
                return (
                  <td
                    key={cIdx}
                    className={index < visibleCellCount ? 'fade-in-letter' : ''}
                    style={{
                      animationDelay: `${index * 0.03}s`,
                      padding: '8px',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    {index < visibleCellCount ? cell : ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
