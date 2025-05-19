"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading
  const router = useRouter();

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed left-0 h-full bg-dark text-white transition-all duration-300 ${
          isOpen ? "w-64" : "w-0"
        }`}
        style={{
          overflow: isOpen ? "visible" : "hidden",
          zIndex: 1000,
        }}
      >
        {/* Sidebar content */}
        <div
          className={`relative h-full flex flex-col items-center p-4 ${
            isOpen ? "visible" : "hidden"
          }`}
        >
          <div className="mt-4">
            <Link href="/overview">
              <div
                onClick={closeSidebar}
                className="text-primary hover:primary cursor-pointer"
              >
                Overview
              </div>
            </Link>
          </div>

          <div className="mt-4">
            <Link href="/insights">
              <div
                onClick={closeSidebar}
                className="text-primary hover:primary cursor-pointer"
              >
                Insights
              </div>
            </Link>
          </div>
          <div className="mt-4">
            <Link href="/visitors">
              <div
                onClick={closeSidebar}
                className="text-primary hover:primary cursor-pointer"
              >
                Visitors
              </div>
            </Link>
          </div>
          <div className="mt-4">
            <Link href="/contributions">
              <div
                onClick={closeSidebar}
                className="text-primary hover:primary cursor-pointer"
              >
                Contributions
              </div>
            </Link>
          </div>
          <div className="mt-4">
            <Link href="/comments">
              <div
                onClick={closeSidebar}
                className="text-primary hover:primary cursor-pointer"
              >
                Comments
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 p-4 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Button container for layout */}
        <div
          className={`fixed transition-all duration-300 ${
            isOpen ? "left-64" : "left-4"
          } z-100`}
        >
          <button
            className="bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>
        {/* Add padding to main content to account for fixed button */}
        <div className="pt-12">{/* Your main content goes here */}</div>
      </div>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-1050">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      )}
    </div>
  );
};

export default SideNav;
