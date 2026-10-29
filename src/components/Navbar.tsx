"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Logo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className ?? ""}`}>
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 via-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
      📸
    </div>
    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-orange-500 to-red-600">
      PHOTO<span className="text-gray-800">GRID</span>
    </span>
  </div>
);

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Galeria" },
    { href: "/upload", label: "Upload" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-4">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                  isActive(item.href)
                    ? "bg-pink-50 text-pink-600 shadow-sm"
                    : "text-gray-600 hover:text-pink-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors"
            >
              Deployed on Vercel
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/upload"
              className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              + Adicionar Foto
            </Link>
            <button
              className="md:hidden p-2 text-gray-600 hover:text-pink-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menu mobile"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base ${
                  isActive(item.href)
                    ? "bg-pink-50 text-pink-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-pink-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/upload"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 mt-4 rounded-lg bg-pink-600 text-white text-base font-medium text-center"
            >
              + Adicionar Foto
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}