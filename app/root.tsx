import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  NavLink,
  Link,
  useLocation,
} from "react-router";
import { useState } from "react";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/logo sines.svg" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  },
];

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg text-gray-900 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-auto sm:h-12 sm:w-auto"
                src="/logo sines.svg"
                alt="SINES-Logo"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 drop-shadow-lg">SINES</h1>
              <p className="text-xs sm:text-sm text-gray-600 drop-shadow-md">Sustainable Intelligent Electronics Systems</p>
              {/* <p className="text-xs sm:text-sm text-gray-600 drop-shadow-md">(English: Sustainable Intelligent Electronics Systems)</p> */}
            </div>
            <div className="block sm:hidden">
              <h1 className="text-lg font-bold text-gray-900 drop-shadow-lg">SINES</h1>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors drop-shadow-md ${
                    isActive
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md"
                  }`
                }
              >
                Home
              </NavLink>
              
              <NavLink
                to="/tentang"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors drop-shadow-md ${
                    isActive
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md"
                  }`
                }
              >
                About
              </NavLink>

              <NavLink
                to="/penelitian"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors drop-shadow-md ${
                    isActive
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md"
                  }`
                }
              >
                Research
              </NavLink>

              <NavLink
                to="/tim"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors drop-shadow-md ${
                    isActive
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md"
                  }`
                }
              >
                Team
              </NavLink>

              <NavLink
                to="/berita"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors drop-shadow-md ${
                    isActive
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md"
                  }`
                }
              >
                News
              </NavLink>

              {/* <NavLink
                to="/publikasi"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors drop-shadow-md ${
                    isActive
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md"
                  }`
                }
              >
                Publication
              </NavLink> */}

              <NavLink
                to="/kontak"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors drop-shadow-md ${
                    isActive
                      ? "bg-white text-gray-900 shadow-md"
                      : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-md"
                  }`
                }
              >
                Contact
              </NavLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-900"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/tentang"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-900"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>

            <NavLink
              to="/penelitian"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-900"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Research
            </NavLink>

            <NavLink
              to="/tim"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-900"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Team
            </NavLink>

            <NavLink
              to="/berita"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-900"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              News
            </NavLink>

            {/* <NavLink
              to="/publikasi"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-900"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Publication
            </NavLink> */}

            <NavLink
              to="/kontak"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? "bg-green-100 text-green-900"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <img
                  className="h-10 w-auto sm:h-12 sm:w-auto"
                  src="/logo sines.svg"
                  alt="SINES-Logo"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">SINES</h3>
                <p className="text-gray-300 text-sm">Sustainable Intelligent Electronics Systems</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              The Sustainable Intelligent Electronics Systems (SINES) Research Group is a research group
              dedicated to developing innovative and environmentally friendly electronics
              technologies for a sustainable future.
            </p>
            
            {/* Address Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-green-400">📍 Address</h4>
              <div className="text-gray-300 space-y-1">
                <p className="font-medium">KST Samaun Samadikun</p>
                <p>Jl. Sangkuriang, Dago</p>
                <p>Kecamatan Coblong, Kota Bandung 40135</p>
                <p>Jawa Barat, Indonesia</p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3 text-green-400">📞 Contact</h4>
              <div className="text-gray-300 space-y-1">
                <p>Email: <a 
                  href="mailto:atha001@brin.go.id"
                  className="text-green-500 hover:text-green-700 underline"
                >
                  atha001@brin.go.id
                </a></p>
              </div>
            </div>
            
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Research</h4>
            <div className="space-y-2">
              <Link to="/penelitian" className="text-gray-300 hover:text-white block">Ongoing Research</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Information</h4>
            <div className="space-y-2">
              {/* <a href="#" className="text-gray-300 hover:text-white block">Publication</a> */}
              <Link to="/berita" className="text-gray-300 hover:text-white block">Research News</Link>
              <Link to="/tim" className="text-gray-300 hover:text-white block">Research Team</Link>
              <Link to="/kontak" className="text-gray-300 hover:text-white block">Contact</Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300 mb-4 md:mb-0">
              © 2025 SINES - Sustainable Intelligent Electronics Systems Research Group
            </p>
            <p className="text-sm text-gray-400">
              Badan Riset dan Inovasi Nasional (BRIN)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    // For admin routes, use minimal layout without navbar and footer
    return (
      <html lang="id">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-SCSGS4K5JF"></script>
          <script
            dangerouslySetInnerHTML={{
              __html:
                "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-SCSGS4K5JF');",
            }}
          />
        </head>
        <body className="min-h-screen bg-gray-50">
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }

  // For regular routes, use full layout with navbar and footer
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SCSGS4K5JF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-SCSGS4K5JF');",
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}