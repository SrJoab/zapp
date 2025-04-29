import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Assuming globals.css exists or will be created
import { ThemeProvider } from "@/components/theme-provider"; // Assuming theme provider exists
import { Toaster } from "@/components/ui/sonner"; // For notifications

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Omni Platform",
  description: "Automação de marketing e vendas omnichannel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

