import type { Route } from "./+types/berita";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Berita } from "../data/data_berita";
import { getAllBerita } from "../data/data_berita";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "All News - SELEB" },
    { name: "description", content: "View all latest news from the SELEB BRIN research group on Electronic Smart System" },
  ];
}

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

export default function News() {
  const [news, setNews] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Calculate for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(news.length / itemsPerPage);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allNews = await getAllBerita();
        // Sort by date in descending order (terbaru ke terlama)
        const sortedNews = allNews.sort((a, b) => new Date(b.tanggal_berita).getTime() - new Date(a.tanggal_berita).getTime());
        setNews(sortedNews);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const retryLoadData = () => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allNews = await getAllBerita();
        const sortedNews = allNews.sort((a, b) => new Date(b.tanggal_berita).getTime() - new Date(a.tanggal_berita).getTime());
        setNews(sortedNews);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="text-gray-600 mt-4">Loading news...</p>
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
            <Link to="/berita" className="text-green-600 hover:text-green-800 underline">
              Back to News Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No News Available</h1>
          <Link to="/berita" className="text-green-600 hover:text-green-800 underline">
            Back to News Page
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
            <div className="inline-block mb-4 sm:mb-6"></div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-200 to-emerald-100 bg-clip-text text-transparent">
              All News
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
              View all recent news from the Sustainable Intelligent Electronics Systems Research Group
            </p>
          </div>
        </div>
      </section>

      {/* News List Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentNews.map((article) => (
              <article key={article.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                <div className="h-56 w-full overflow-hidden">
                  <Link to={`/halaman_berita/detail_berita/${article.id}`}>
                    <img
                      src={article.foto_berita}
                      alt={article.judul_berita}
                      className="w-full h-full object-cover hover:opacity-75 transition-opacity duration-300"
                    />
                  </Link>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-base text-green-600 font-medium mb-2">
                    {new Date(article.tanggal_berita).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="text-sm text-blue-600 font-medium mb-2">
                    {article.reporter || 'Admin'}
                  </div>
                  <Link to={`/halaman_berita/detail_berita/${article.id}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-green-600 transition-colors duration-300 cursor-pointer">
                      {article.judul_berita}
                    </h3>
                  </Link>
                  <p className="text-base text-gray-600 mb-4 flex-grow">
                    {truncateText(article.isi_berita, 35)}
                  </p>
                  <Link to={`/halaman_berita/detail_berita/${article.id}`} className="text-green-600 font-medium hover:text-green-700 text-base self-start">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 mt-8">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {
                  Math.min(currentPage * itemsPerPage, news.length)
                } of {news.length} entries
              </div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Previous</span>
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
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}