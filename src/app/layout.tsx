import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "space A",
  description: "Solve problems, rate your recall using SM-2 algorithm, and build your DSA streak with space A.",
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
