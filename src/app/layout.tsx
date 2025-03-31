import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "./resume/component/header";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const date = new Date();

const siteBaseUrl = "https://umangsth.github.io"
const pageDescription = `Resume for Umanga Shrestha, a results-driven Full Stack Developer (~${date.getFullYear()-2022} yrs exp). Proficient in React, Next.js, Node.js, ASP.NET Core, Angular, SQL, Docker & CI/CD.`;
const pageTitle = "Umanga Shrestha | Full Stack Developer Resume";

export const metadata: Metadata = {
  metadataBase: new URL(siteBaseUrl),
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "Umanga Shrestha",
    "Full Stack Developer",
    "Web Developer",
    "Resume",
    "Portfolio",
    "React",
    "Next.js",
    "Node.js",
    "ASP.NET Core",
    "Angular",
    "TypeScript",
    "JavaScript",
    "SQL",
    "MS-SQL",
    "MySQL",
    "PostgreSQL",
    "Docker",
    "Git",
    "CI/CD",
    "RESTful API",
    "Toronto", // Added location from education
    "Canada",
  ],
  authors: [{ name: 'Umanga Shrestha', url: siteBaseUrl }],
  creator: 'Umanga Shrestha',
  openGraph: {
    title: pageTitle, 
    description: pageDescription,
    url: siteBaseUrl, 
    siteName: "Umanga Shrestha | Resume & Portfolio", 
    images: [
      {
        url: "/images/og-image.png", 
        width: 1200, 
        height: 630,
        alt: "Preview image for Umanga Shrestha's Resume", 
      },
    ],
    locale: 'en_CA', 
    type: 'profile', 
  },
  robots: {
    index: true,
    follow: true,
    nocache: true, 
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false, 
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="dark:bg-gray-800 bg-white relative h-screen">
          <Header />
            {children}
        </main>
      </body>
    </html>
  );
}
