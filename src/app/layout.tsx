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
import { SITE_URL } from "@/lib/site";

// Browser-tab title: short and formal (your name is what recruiters search for).
const SITE_TITLE = profile.name; // "Miguelito Chester Pawig"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: profile.tagline,
  applicationName: SITE_TITLE,
  openGraph: {
    title: `${SITE_TITLE} | ${profile.title}`,
    description: profile.tagline,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_TITLE} | ${profile.title}`,
    description: profile.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#050c08",
};

// Runs before the page shows, so the saved theme loads without a flash
const themeScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

// The intro (Splash) plays once per visit: the first load of a browser tab shows it, later loads
// and reloads in that tab skip it. Runs before the page shows, so a skipped intro never flashes.
const splashScript = `try{if(sessionStorage.getItem("splash-seen"))document.documentElement.dataset.splashSeen="";else sessionStorage.setItem("splash-seen","1")}catch(e){}`;

// Reloading always starts at the top of the page: the browser doesn't restore the old scroll
// position, and a "#section" left in the address (the menu adds one) is dropped so it can't jump there.
// A fresh visit to a link like "/#contact" still goes to that section.
const scrollTopScript = `try{
if("scrollRestoration"in history)history.scrollRestoration="manual";
var n=performance.getEntriesByType("navigation")[0];
if(n&&n.type==="reload"){
if(location.hash)history.replaceState(null,"",location.pathname+location.search);
var top=function(){window.scrollTo({top:0,left:0,behavior:"instant"})};
top();addEventListener("DOMContentLoaded",top);addEventListener("load",top);
}
}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: scrollTopScript }} />
        <script dangerouslySetInnerHTML={{ __html: splashScript }} />
      </head>
      <body className="min-h-screen font-sans">
        <Splash />
        {children}
      </body>
    </html>
  );
}
