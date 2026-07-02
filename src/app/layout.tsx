import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPACE A | DSA Spaced Repetition Engine",
  description: "Solve problems, rate your recall using SM-2 algorithm, and build your DSA streak with Space A.",
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
