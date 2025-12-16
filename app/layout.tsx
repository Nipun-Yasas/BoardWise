import type { Metadata } from "next";
import { Inter, Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./_components/ThemeProvider";

const inter = Inter({
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  weight: ["300", "400", "500", "600"],
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BoardWise - Find Your Dream Boarding Place",
  description:
    "Helping university students find their perfect boarding place near campus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${robotoMono.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
