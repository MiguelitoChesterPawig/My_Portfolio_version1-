import type { Metadata, Viewport } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
// Flaticon UIcons (free with credit, see the footer): brand logos + regular rounded icons
import "@flaticon/flaticon-uicons/css/brands/all.css";
import "@flaticon/flaticon-uicons/css/regular/rounded.css";
import "./globals.css";
import "./splash.css";
import { profile } from "@/content/profile";
import { Splash } from "@/components/Splash";

// Browser-tab title: short and formal (your name is what recruiters search for).
const SITE_TITLE = profile.name; // "Miguelito Chester Pawig"

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: profile.tagline,
  applicationName: SITE_TITLE,
  openGraph: {
    title: `${SITE_TITLE} — ${profile.title}`,
    description: profile.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050c08",
};

// Runs before the page shows, so the saved theme loads without a flash
const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans">
        <Splash />
        {children}
      </body>
    </html>
  );
}
