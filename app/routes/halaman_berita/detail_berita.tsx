import type { Route } from "./+types/detail_berita";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { getBeritaById, type Berita, getAllBerita } from "../../data/data_berita";

export function meta({ params }: Route.MetaArgs) {
  const beritaId = params.id;
  return [
    { title: "News Detail - SINES" },
    { name: "description", content: "News Detail from SINES" },
  ];
}

const getYouTubeEmbedUrl = (url: string) => {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([^\s&]+)$/;
  const match = url.match(regExp);
  return match && match[1] ? `https://www.youtube.com/embed/${match[1]}` : null;
};

export default function DetailBerita() {
  const { id } = useParams();
  const [berita, setBerita] = useState<Berita | null>(null);
  const [otherNews, setOtherNews] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (id) {
          const beritaData = await getBeritaById(Number(id));
          setBerita(beritaData);
        }
      } catch (err) {
        console.error('Error fetching news detail:', err);
        setError('Failed to load news. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBerita();
  }, [id]);

  const fetchOtherNews = async () => {
    try {
      const allBerita = await getAllBerita();
      const filteredBerita = allBerita.filter(item => item.id !== Number(id));

      // Shuffle and pick 3 random news
      const shuffled = filteredBerita.sort(() => 0.5 - Math.random());
      setOtherNews(shuffled.slice(0, 3));
    } catch (err) {
      console.error('Error fetching other news:', err);
    }
  };

  useEffect(() => {
    fetchOtherNews();
    const interval = setInterval(fetchOtherNews, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [id]);

  const retryLoadData = () => {
    const fetchBerita = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (id) {
          const beritaData = await getBeritaById(Number(id));
          setBerita(beritaData);
        }
      } catch (err) {
        console.error('Error fetching news detail:', err);
        setError('Failed to load news. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBerita();
    fetchOtherNews();
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button 
               onClick={retryLoadData} 
               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
             >
              Retry
            </button>
            <Link to="/berita" className="text-green-600 hover:text-green-800 underline">
              Back to News Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">News Not Found</h1>
          <Link to="/berita" className="text-green-600 hover:text-green-800 underline">
            Back to News Page
          </Link>
        </div>
      </div>
    );
  }

  const youtubeEmbedUrl = berita.link_yt ? getYouTubeEmbedUrl(berita.link_yt) : null;

  return (
    <div className="min-h-screen pt-20">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-emerald-300 rounded-full opacity-15 animate-bounce"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-4 sm:mb-6">
              <Link 
                to="/berita" 
                className="text-green-200 hover:text-white text-sm underline mb-4 inline-block"
              >
                ← Back to News Page
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-200 to-emerald-100 bg-clip-text text-transparent">
              News Detail
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
              View details of the selected news
            </p>
          </div>
        </div>
      </section>

      {/* News Detail Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="bg-gray-50 rounded-xl shadow-lg overflow-hidden p-6 sm:p-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {berita.judul_berita}
              </h2>
              <p className="text-base text-green-600 font-medium mb-2">
                {new Date(berita.tanggal_berita).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-base text-gray-700 mb-6">
                Reporter/Writer: <span className="text-blue-600">{berita.reporter || "Admin"}</span>
              </p>
              <div className="mb-8 rounded-lg overflow-hidden shadow-md">
                <img 
                  src={berita.foto_berita}
                  alt={berita.judul_berita}
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const nextElement = target.nextElementSibling as HTMLElement;
                    if (nextElement) {
                      nextElement.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-lg" style={{display: 'none'}}>
                  Images not available
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-justify whitespace-pre-line">
                {berita.isi_berita}
              </div>
              {youtubeEmbedUrl && (
                <div className="mt-8 aspect-w-16 aspect-h-9">
                  <iframe
                    width="100%"
                    height="400px"
                    src={youtubeEmbedUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                    className="rounded-lg shadow-md"
                  ></iframe>
                </div>
              )}
            </article>
          </div>

          {/* Other News Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 sticky top-20">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Other News</h3>
              <div className="space-y-6">
                {otherNews.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/halaman_berita/detail_berita/${item.id}`}
                    className="block group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden shadow-md">
                        <img 
                          src={item.foto_berita}
                          alt={item.judul_berita}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const nextElement = target.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
                          No Image
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300 line-clamp-3">
                          {item.judul_berita}
                        </h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}