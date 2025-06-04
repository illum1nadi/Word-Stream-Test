import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Word Stream",
  description: "Replicating the Word Stream app using Next.js and react.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
