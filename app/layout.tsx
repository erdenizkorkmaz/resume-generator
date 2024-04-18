import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.scss";

const open_sans = Open_Sans({subsets: ["latin"], weight: ['400', '500','600', '700']});

export const metadata: Metadata = {
  title: "Erdeniz Korkmaz Resume",
  description: "Erdeniz Korkmaz - Frontend Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={open_sans.className}>{children}</body>
    </html>
  );
}
