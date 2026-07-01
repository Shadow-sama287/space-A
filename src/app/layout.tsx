import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DSA SPACED REPETITION | ANKI FOR DSA",
  description: "Solve problems, rate your recall using SM-2 algorithm, and build your DSA streak.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
