// import React, { useEffect, useState, useRef } from "react";
// import { Box, Paper } from "@mui/material";
// import { motion } from "framer-motion";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// const CopilotResponse = ({ markdown }) => {
//   const [visibleText, setVisibleText] = useState("");
//   const scrollRef = useRef(null);

//   const characters = markdown.split("");

//   useEffect(() => {
//     let i = 0;
//     const interval = setInterval(() => {
//       setVisibleText((prev) => prev + characters[i]);
//       i++;
//       if (i >= characters.length) clearInterval(interval);
//     }, 10);

//     return () => clearInterval(interval);
//   }, [markdown]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [visibleText]);

//   return (
//     <Box
//       sx={{
//         maxWidth: 800,
//         height: "70vh",
//         overflowY: "auto",
//         margin: "auto",
//         p: 2,
//         border: "1px solid #ccc",
//         borderRadius: 2,
//         backgroundColor: "#fefefe",
//       }}
//     >
//       <Paper
//         elevation={3}
//         sx={{
//           p: 4,
//           lineHeight: 1.65,
//           fontSize: "1rem",
//           "& table": {
//             width: "100%",
//             borderCollapse: "collapse",
//             margin: "16px 0",
//           },
//           "& th, & td": {
//             border: "1px solid #ccc",
//             padding: "8px 10px",
//             textAlign: "left",
//           },
//           "& tr:nth-of-type(even)": {
//             backgroundColor: "#f9f9f9",
//           },
//           "& th": {
//             backgroundColor: "#f0f0f0",
//             fontWeight: 700,
//           },
//           "& h1, & h2, & h3, & h4, & h5, & h6": {
//             marginTop: "20px",
//             marginBottom: "10px",
//             fontWeight: 700,
//           },
//           "& p": {
//             margin: "10px 0",
//           },
//           "& ul, & ol": {
//             margin: "10px 0 10px 20px",
//           },
//           "& li": {
//             marginBottom: "4px",
//           },
//           "& blockquote": {
//             fontStyle: "italic",
//             color: "#555",
//             borderLeft: "4px solid #ccc",
//             paddingLeft: "1rem",
//             margin: "12px 0",
//           },
//         }}
//       >
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//           style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
//         >
//           <ReactMarkdown remarkPlugins={[remarkGfm]}>{visibleText}</ReactMarkdown>
//         </motion.div>
//         <div ref={scrollRef} />
//       </Paper>
//     </Box>
//   );
// };

// export default CopilotResponse;

// added some new functionality to the CopilotResponse component

import React, { useEffect, useState, useRef } from "react";
import { Box, Paper } from "@mui/material";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

const CopilotResponse = ({ markdown }) => {
  const [visibleText, setVisibleText] = useState("");
  const scrollRef = useRef(null);
  const characters = (markdown || "").split("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setVisibleText((prev) => prev + characters[i]);
      i++;
      if (i >= characters.length) {
        clearInterval(interval);
      }
    }, 5);

    return () => clearInterval(interval);
  }, [markdown]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleText]);

  return (
    <Box
      sx={{
        maxWidth: 800,
        height: "70vh",
        overflowY: "auto",
        margin: "auto",
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        backgroundColor: "#fefefe",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          lineHeight: 1.65,
          fontSize: "1rem",
          color: "transparent",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundImage: "linear-gradient(to right, #000, #000)",
          animation: "fadeInText 0.4s forwards",
          "@keyframes fadeInText": {
            to: {
              color: "#000",
            },
          },
          "& table": {
            width: "100%",
            borderCollapse: "collapse",
            margin: "16px 0",
          },
          "& th, & td": {
            border: "1px solid #ccc",
            padding: "8px 10px",
            textAlign: "left",
          },
          "& tr:nth-of-type(even)": {
            backgroundColor: "#f9f9f9",
          },
          "& th": {
            backgroundColor: "#f0f0f0",
            fontWeight: 700,
          },
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            marginTop: "20px",
            marginBottom: "10px",
            fontWeight: 700,
          },
          "& p": {
            margin: "10px 0",
          },
          "& ul, & ol": {
            margin: "10px 0 10px 20px",
          },
          "& li": {
            marginBottom: "4px",
          },
          "& blockquote": {
            fontStyle: "italic",
            color: "#555",
            borderLeft: "4px solid #ccc",
            paddingLeft: "1rem",
            margin: "12px 0",
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneLight}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {visibleText}
          </ReactMarkdown>
        </motion.div>
        <div ref={scrollRef} />
      </Paper>
    </Box>
  );
};

export default CopilotResponse;
