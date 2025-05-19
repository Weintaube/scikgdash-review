"use client";
import React from "react";
import Link from "next/link";
import { Network, Gitlab, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const pageTitles = {
    "/overview": "Overview",
    "/insights": "Insights",
    "/visitors": "Visitors",
    "/contributions": "Contributions",
    "/comments": "Comments",
  };

  const currentPage = pageTitles[pathname] || "";

  return (
    <header className="w-full bg-light py-4 px-8 shadow flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <Network className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">SciKGDash</h1>
          <p className="text-sm text-gray-600">
            Curation Dashboard for the Open Research Knowledge Graph
          </p>
        </div>
      </div>

      <div className="flex-grow text-center">
        {currentPage && (
          <p className="text-lg text-gray-700 font-semibold">{currentPage}</p>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <Link
          href="https://www.orkg.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-semibold"
        >
          Visit ORKG
        </Link>

        <Link
          href="https://gitlab.com/TIBHannover/orkg/scikgdash"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary"
        >
          <Gitlab className="h-6 w-6" />
        </Link>

        <Link href="mailto:info@orkg.org" className="hover:text-primary">
          <Mail className="h-6 w-6" />
        </Link>
      </div>
    </header>
  );
}
