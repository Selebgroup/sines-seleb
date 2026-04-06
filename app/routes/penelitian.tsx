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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
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
          <button onClick={() => window.location.reload()} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (riset.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Research Available</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">

      {/* Header */}
      <section className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-emerald-300 rounded-full opacity-15 animate-bounce"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-200 to-emerald-100 bg-clip-text text-transparent">
            Research
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            Explore the cutting-edge research and innovative projects conducted by our team.
          </p>
        </div>
      </section>

      {/* Research Cards */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentRiset.map((item) => (
              <article key={item.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">

                {/* Thumbnail placeholder — data_riset has no image field */}
                <Link to={`/penelitian/${item.id}`}>
                  <div className="h-48 w-full bg-gradient-to-br from-green-800 to-emerald-600 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-300" />
                    <div className="text-center z-10 px-6">
                      <div className="text-5xl mb-3">🔬</div>
                      <p className="text-green-100 text-sm font-medium line-clamp-2 leading-snug">
                        {truncateText(item.judul_riset, 8)}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-sm text-green-600 font-medium mb-2 uppercase tracking-wide">
                    Research Project
                  </div>
                  <Link to={`/penelitian/${item.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-green-600 transition-colors duration-300 cursor-pointer leading-snug">
                      {item.judul_riset}
                    </h3>
                  </Link>
                  <p className="text-base text-gray-600 mb-4 flex-grow leading-relaxed">
                    {truncateText(item.deskripsi_riset, 30)}
                  </p>
                  <Link to={`/penelitian/${item.id}`} className="text-green-600 font-medium hover:text-green-700 text-base self-start">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 mt-8">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, riset.length)} of {riset.length} entries
              </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${page === currentPage ? 'z-10 bg-green-50 border-green-500 text-green-600' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {page}
                      </button>
                    );
                  }
                  return null;
                })}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}