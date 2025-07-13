import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../style/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sophie | AI Assistant by Limits",
  description: "Talk with Sophie – your smart AI support assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/limits.jpg" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
