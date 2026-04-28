import type { Route } from "./+types/data_tim_peneliti";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getFacultyMemberByName, type FacultyMember } from "../data/facultyData";

export function meta({ params }: Route.MetaArgs) {
  const facultyName = decodeURIComponent(params.name || "");
  return [
    { title: `${facultyName} - Researcher Data - SINES BRIN` },
    { name: "description", content: `Profil lengkap ${facultyName} - Tim Peneliti Sistem Elektronika Cerdas Berkelanjutan` },
  ];
}

export default function DataTimPeneliti({ params }: Route.ComponentProps) {
  const facultyName = decodeURIComponent(params.name || "");
  const [faculty, setFaculty] = useState<FacultyMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const facultyData = await getFacultyMemberByName(facultyName);
        setFaculty(facultyData);
      } catch (err) {
        console.error('Error fetching faculty:', err);
        setError('Gagal memuat data peneliti. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };

    if (facultyName) {
      fetchFaculty();
    }
  }, [facultyName]);

  const retryLoadData = () => {
    const fetchFaculty = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const facultyData = await getFacultyMemberByName(facultyName);
        setFaculty(facultyData);
      } catch (err) {
        console.error('Error fetching faculty:', err);
        setError('Gagal memuat data peneliti. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };

    if (facultyName) {
      fetchFaculty();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="text-gray-600 mt-4">Loading Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something Went Wrong</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button 
               onClick={retryLoadData} 
               className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
             >
              Try Again
            </button>
            <Link to="/tim" className="text-green-600 hover:text-green-800 underline">
              Back to Team Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Data Not Found</h1>
          <Link to="/tim" className="text-green-600 hover:text-green-800 underline">
            Back to Team Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-emerald-300 rounded-full opacity-15 animate-bounce"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-4 sm:mb-6">
              <Link 
                to="/tim" 
                className="text-green-200 hover:text-white text-sm underline mb-4 inline-block"
              >
                ← Back to Team Page
              </Link>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-200 to-emerald-100 bg-clip-text text-transparent">
              Team Data - Researcher
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
              Complete profile of the researcher in the Sustainable Intelligent Electronics Systems Research Group
            </p>
          </div>
        </div>
      </section>

      {/* Faculty Detail Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-6 sm:p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Photo and Basic Info */}
                <div className="lg:col-span-1">
                  <div className="text-center">
                    <div className="w-55 h-55 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                      {faculty.image && faculty.image.startsWith('http') ? (
                        <img 
                          src={faculty.image} 
                          alt={faculty.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const nextElement = target.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                      ) : faculty.image && faculty.image.startsWith('/') ? (
                        <img 
                          src={faculty.image} 
                          alt={faculty.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const nextElement = target.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                      ) : (
                        <span className="text-8xl">{faculty.image || '👨‍🔬'}</span>
                      )}
                      <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center" style={{display: 'none'}}>
                        <span className="text-8xl">👨‍🔬</span>
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {faculty.name}
                    </h2>
                    <p className="text-lg text-green-600 font-bold mb-1">
                      {faculty.position}
                    </p>
                  </div>
                </div>

                {/* Right Column - Detailed Information */}
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Specialization</h3>
                      <p className="text-gray-700 leading-relaxed">{faculty.specialization}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
                      <p className="text-gray-700 leading-relaxed">{faculty.education}</p>
                    </div>

                    {faculty.linkPenelitian && (
                       <div>
                         <h3 className="text-lg font-semibold text-gray-900 mb-2">Research Link</h3>
                         <a 
                           href={faculty.linkPenelitian} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-green-600 hover:text-green-800 underline"
                         >
                           {faculty.linkPenelitian}
                         </a>
                       </div>
                     )}

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                      <a 
                        href={`mailto:${faculty.email}`}
                        className="text-green-600 hover:text-green-800 underline"
                      >
                        {faculty.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bibliography Section */}
          {faculty.bibliography && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8 lg:p-12">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Bibliography</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-justify">
                  {faculty.bibliography}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}