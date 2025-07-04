import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"], // choose weights you need
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FMD Clinic CRM",
  description: "Demo App for a dental clinic CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={montserrat.variable}
      >
        {children}
      </body>
    </html>
  );
}
