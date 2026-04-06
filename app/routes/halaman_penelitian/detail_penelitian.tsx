import type { Route } from "./+types/detail_penelitian";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { getRisetById, getAllRiset, type Riset } from "../../data/data_riset";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Research Detail - SINES" },
    { name: "description", content: "Research Detail from SINES" },
  ];
}

export default function DetailPenelitian() {
  const { id } = useParams();
  const [riset, setRiset] = useState<Riset | null>(null);
  const [otherRiset, setOtherRiset] = useState<Riset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRiset = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (id) {
          const data = await getRisetById(Number(id));
          setRiset(data);
        }
      } catch (err) {
        console.error('Error fetching research detail:', err);
        setError('Failed to load research data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRiset();
  }, [id]);

  useEffect(() => {
    const fetchOther = async () => {
      try {
        const all = await getAllRiset();
        const filtered = all.filter(item => item.id !== Number(id));
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setOtherRiset(shuffled.slice(0, 4));
      } catch (err) {
        console.error('Error fetching other research:', err);
      }
    };
    fetchOther();
  }, [id]);

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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/penelitian" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Back to Research
          </Link>
        </div>
      </div>
    );
  }

  if (!riset) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Research Not Found</h1>
          <Link to="/penelitian" className="text-green-600 hover:text-green-800 underline">
            Back to Research Page
          </Link>
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
          <div className="mb-4 sm:mb-6">
            <Link to="/penelitian" className="text-green-200 hover:text-white text-sm underline inline-block">
              ← Back to Research Page
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-200 to-emerald-100 bg-clip-text text-transparent">
            Research Detail
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            View details of the selected research project
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2">
            <article className="bg-gray-50 rounded-xl shadow-lg overflow-hidden p-6 sm:p-8">

              {/* Thumbnail placeholder */}
              <div className="w-full h-56 bg-gradient-to-br from-green-800 to-emerald-600 rounded-lg flex items-center justify-center mb-8 overflow-hidden">
                <div className="text-center px-6">
                  <div className="text-6xl mb-3">🔬</div>
                  <p className="text-green-100 text-sm font-medium">Research Project</p>
                </div>
              </div>

              <div className="text-sm text-green-600 font-medium uppercase tracking-wide mb-3">
                Research Project · SINES
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                {riset.judul_riset}
              </h2>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Description</p>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-justify whitespace-pre-line">
                  {riset.deskripsi_riset}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <Link
                  to="/penelitian"
                  className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors"
                >
                  ← Back to All Research
                </Link>
              </div>
            </article>
          </div>

          {/* Other Research Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Other Research</h3>
              <div className="space-y-4">
                {otherRiset.map((item) => (
                  <Link
                    key={item.id}
                    to={`/penelitian/${item.id}`}
                    className="block group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-green-700 to-emerald-500 flex items-center justify-center shadow-md">
                        <span className="text-2xl">🔬</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300 line-clamp-3 leading-snug">
                          {item.judul_riset}
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