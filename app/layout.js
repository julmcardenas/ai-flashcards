import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Typography, Container, Box, Grid } from "@mui/material";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-sans bg-gray-50">
          <header className="bg-transparent shadow-lg">
            <nav className="flex items-center justify-between px-6 py-4">
              <Link href="/" passHref>
                <p className="text-2xl font-bold text-gray-900">AI Flashcards</p>
              </Link>
              <div className="flex items-center space-x-4">
                <SignedOut>
                  <Link href="/login" passHref>
                    <p className="text-gray-900 hover:underline">Login</p>
                  </Link>
                  <Link href="/signup" passHref>
                    <p className="text-gray-900 hover:underline">Sign Up</p>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </nav>
          </header>

          {/* Content */}
          <main className="min-h-screen pt-4">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
