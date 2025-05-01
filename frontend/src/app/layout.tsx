import type { Metadata } from "next";
import "./globals.css";
import { PagesProvider } from "@/context/PagesContext";

export const metadata: Metadata = {
  title: "panys profiterols",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PagesProvider>{children}</PagesProvider>
      </body>
    </html>
  );
}
