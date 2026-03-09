import type { Route } from "./+types/penelitian";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Riset } from "../data/data_riset";
import { getAllRiset } from "../data/data_riset";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Research - SELEB" },
    { name: "description", content: "Explore ongoing research projects by the SELEB BRIN research group on Electronic Smart System" },
  ];
}

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

export default function Penelitian() {
  const [riset, setRiset] = useState<Riset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Calculate for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRiset = riset.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(riset.length / itemsPerPage);

  useEffect(() => {
    const fetchRiset = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allRiset = await getAllRiset();
        setRiset(allRiset);
      } catch (err) {
        console.error('Error fetching research data:', err);
        setError('Failed to load research data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRiset();
  }, []);

  const retryLoadData = () => {
    const fetchRiset = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allRiset = await getAllRiset();
        setRiset(allRiset);
      } catch (err) {
        console.error('Error fetching research data:', err);
        setError('Failed to load research data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRiset();
  };

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="text-gray-600 mt-4">Loading research data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">An Error Occurred</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={retryLoadData}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Try Again
            </button>
            <Link to="/penelitian" className="text-green-600 hover:text-green-800 underline">
              Back to Research Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (riset.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Research Available</h1>
          <Link to="/penelitian" className="text-green-600 hover:text-green-800 underline">
            Back to Research Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">

      {/* Header Section */}
      <section className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-emerald-300 rounded-full opacity-15 animate-bounce"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-200 to-emerald-100 bg-clip-text text-transparent">
              Research
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
              Explore the cutting-edge research and innovative projects conducted by our team.
            </p>
            <div className="mt-6 inline-block bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm text-green-200">
              {riset.length} ongoing research project{riset.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Research List Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <p className="text-sm text-gray-400 mb-6 text-center">
            Klik judul penelitian untuk melihat deskripsi lengkap
          </p>

          {/* Accordion List */}
          <div className="space-y-4">
            {currentRiset.map((item, index) => {
              const isOpen = expandedId === item.id;
              const globalIndex = indexOfFirstItem + index + 1;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl shadow-md border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-green-400 shadow-lg'
                      : 'border-gray-100 hover:border-green-200 hover:shadow-lg'
                  }`}
                >
                  {/* Card Header — always visible, clickable */}
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full text-left px-6 py-5 flex items-start gap-4 group"
                  >
                    {/* Number badge */}
                    <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 transition-colors ${
                      isOpen
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-green-600 border border-green-200 group-hover:bg-green-100'
                    }`}>
                      {globalIndex}
                    </span>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
                        isOpen ? 'text-green-700' : 'text-gray-900 group-hover:text-green-700'
                      }`}>
                        {item.judul_riset}
                      </h3>
                      {!isOpen && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                          {truncateText(item.deskripsi_riset, 15)}
                        </p>
                      )}
                    </div>

                    {/* Chevron icon */}
                    <span className={`shrink-0 mt-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      <svg
                        className={`w-5 h-5 ${isOpen ? 'text-green-600' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>

                  {/* Expanded Content */}
                  {isOpen && (
                    <div className="px-6 pb-6 border-t border-green-100">
                      <div className="pt-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                          Description
                        </p>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          {item.deskripsi_riset}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, riset.length)} of {riset.length}
              </div>
              <nav className="inline-flex rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <button
                  onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); setExpandedId(null); }}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 border-r border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => { setCurrentPage(page); setExpandedId(null); }}
                        className={`px-4 py-2 text-sm font-medium border-r border-gray-200 ${
                          page === currentPage
                            ? 'bg-green-600 text-white'
                            : 'text-gray-600 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); setExpandedId(null); }}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </nav>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}