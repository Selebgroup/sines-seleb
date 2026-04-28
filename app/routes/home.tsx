import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router";
import crypto from "node:crypto";
import type { Berita } from "../data/data_berita";
import { getAllBerita } from "../data/data_berita";
import { getAllFacultyMembers } from "../data/facultyData";
import { getAllRiset } from "../data/data_riset";
// GA4 Data API will be enabled later via server-side fetch

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SINES - Sustainable Intelligent Electronics Systems" },
    { name: "description", content: "Kelompok Riset Sistem Elektronika Cerdas Berkelanjutan - Mengembangkan teknologi elektronika yang inovatif dan berkelanjutan" },
  ];
}
export async function loader() {
  const propertyId = process.env.GA_PROPERTY_ID;
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKeyEnv = process.env.GA_PRIVATE_KEY;
  const privateKey = privateKeyEnv ? privateKeyEnv.replace(/\\n/g, "\n") : undefined;
  if (!propertyId || !clientEmail || !privateKey) {
    return { totalSessions: null as number | null, topCountries: [] as { country: string; code: string; count: number }[] };
  }

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })).toString("base64url");
  const claim = Buffer.from(JSON.stringify({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  })).toString("base64url");
  const signingInput = `${header}.${claim}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signingInput);
  const signature = signer.sign(privateKey).toString("base64url");
  const assertion = `${signingInput}.${signature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!tokenRes.ok) {
    return { totalSessions: null as number | null, topCountries: [] as { country: string; code: string; count: number }[] };
  }
  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token as string | undefined;
  if (!accessToken) {
    return { totalSessions: null as number | null, topCountries: [] as { country: string; code: string; count: number }[] };
  }

  const reportRes = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "country" }, { name: "countryIsoCode" }],
      metrics: [{ name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10,
    }),
  });

  let totalSessions = 0;
  let topCountries: { country: string; code: string; count: number }[] = [];

  if (reportRes.ok) {
    const report = await reportRes.json();
    const rows = report.rows ?? [];
    const cleaned = rows
      .map((row: any): { country: string; code: string; count: number } => ({
        country: row.dimensionValues?.[0]?.value ?? "",
        code: row.dimensionValues?.[1]?.value ?? "",
        count: Number(row.metricValues?.[0]?.value ?? "0"),
      }))
      .filter((r: { country: string; code: string; count: number }) => r.country && r.country.toLowerCase() !== "(not set)" && r.country.toLowerCase() !== "not set" && r.count > 0);
    for (const r of cleaned) {
      totalSessions += r.count;
      topCountries.push({ country: r.country, code: r.code, count: r.count });
    }
  }

  // Do not use realtime fallback; only show 30-day aggregated data

  return { totalSessions, topCountries };
}
// ini command
export default function Home() {
  const analytics = useLoaderData<typeof loader>();
  const [news, setNews] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeResearcherCount, setActiveResearcherCount] = useState<string | null>(null);
  const [researchProjectCount, setResearchProjectCount] = useState<string | null>(null);
  const [newsCount, setNewsCount] = useState<string | null>(null);
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  const [errorCounts, setErrorCounts] = useState<string | null>(null);

  const formatCount = (count: number | null): string => {
    if (count === null) return '...';
    if (count <= 50) return count.toString();
    if (count > 50 && count <= 100) return '50+';
    return '100+';
  };

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoadingCounts(true);
      setErrorCounts(null);
      try {
        const [faculty, riset, berita] = await Promise.all([
          getAllFacultyMembers(),
          getAllRiset(),
          getAllBerita(),
        ]);
        setActiveResearcherCount(formatCount(faculty.length));
        setResearchProjectCount(formatCount(riset.length));
        setNewsCount(formatCount(berita.length));
      } catch (error) {
        console.error("Failed to fetch counts:", error);
        setErrorCounts("Gagal memuat data");
        setActiveResearcherCount("...");
        setResearchProjectCount("...");
        setNewsCount("...");
      } finally {
        setIsLoadingCounts(false);
      }
    };
    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const allNews = await getAllBerita();
        // Sort by date in descending order and take the latest 3
        const latestNews = allNews
          .sort((a, b) => new Date(b.tanggal_berita).getTime() - new Date(a.tanggal_berita).getTime())
          .slice(0, 3);
        setNews(latestNews);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Video background — taruh file di /public/hero-video.mp4
  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background — full screen including behind navbar */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content — padded top so text sits below navbar */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            Sustainable Intelligent Electronics Systems
          </h1>
          <div className="inline-block bg-green-500 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-full mb-6 sm:mb-8 shadow-lg mx-2">
            <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-white italic tracking-wide leading-tight">
              "SINES – Innovation in Intelligent Electronics, Sustainability in Action."
            </span>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed opacity-90 px-2">
            The SINES Research Group develops innovative, smart, sustainable, and
            environmentally friendly electronic technologies for a better future.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
            <Link to={`/penelitian`}><button className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto max-w-xs sm:max-w-none">
              Explore Research
            </button></Link>
            <Link to={`/kontak`}><button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 w-full sm:w-auto max-w-xs sm:max-w-none">
              Contact Us
            </button></Link>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-8 sm:mt-12 md:mt-16">
            <div className="animate-bounce">
              <div className="w-4 h-6 sm:w-5 sm:h-8 md:w-6 md:h-10 border-2 border-white rounded-full flex justify-center">
                <div className="w-0.5 h-2 sm:w-0.5 sm:h-2.5 md:w-1 md:h-3 bg-white rounded-full mt-1 sm:mt-1.5 md:mt-2"></div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About SINES
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4">
              <span className="font-bold text-green-500">SINES</span> focuses on developing intelligent,
              energy-efficient, and sustainable electronic systems that address real-world environmental and
              technological challenges. The group integrates multidisciplinary expertise in electronics,
              materials science, artificial intelligence, and green technology to design the next generation
              of smart, sustainable solutions for a better planet.
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our work connects innovation with the
              <span className="font-bold text-green-500"> Sustainable Development Goals (SDGs) </span>
              to create intelligent electronic systems that minimize ecological impact and promote long-term
              sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-4">💡 Vision</h3>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-8 leading-relaxed text-justify">
                To become a leading center of excellence in sustainable and intelligent electronics,
                driving innovation that harmonizes technology and environmental stewardship for a smarter,
                greener world.
              </p>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-4">🎯 Mission</h3>
              <ol className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed list-decimal pl-5 text-justify">
                <li>Conduct high-impact research in intelligent and sustainable electronic systems.</li>
                <li>Develop eco-efficient devices and circuits through innovative design and materials.</li>
                <li>Foster collaboration between academia, industry, and government for sustainable technology solutions.</li>
                <li>Empower young researchers to contribute to a greener electronics future.</li>
              </ol>
            </div>
            
            <div className="bg-green-50 p-6 sm:p-8 rounded-2xl order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                    {isLoadingCounts ? '...' : errorCounts ? 'Error' : activeResearcherCount}
                  </div>
                  <div className="text-sm sm:text-base text-gray-700">Active Researcher</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                    {isLoadingCounts ? '...' : errorCounts ? 'Error' : researchProjectCount}
                  </div>
                  <div className="text-sm sm:text-base text-gray-700">Research Project</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                    {isLoadingCounts ? '...' : errorCounts ? 'Error' : newsCount}
                  </div>
                  <div className="text-sm sm:text-base text-gray-700">News</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Research Areas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our research focus covers various fields of electronic technology 
              that are sustainable and innovative.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">🔋</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                Eco-Devices
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Green Paltform Development; Performance Optimization; Design & Fabrication.
              </p>
              <br />
              <p className="text-sm sm:text-base text-gray-600 text-justify">
                Developing environmentally friendly electronic devices with a focus on energy efficiency
                and sustainable materials. Research includes optimizing the performance of green devices
                and fabrication techniques that reduce environmental impact.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">🤖</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                Electronic Circuits
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                System Design; Control; Signals & Transmission.
              </p>
              <br />
              {/* <br /> */}
              <p className="text-sm sm:text-base text-gray-600 text-justify">
                Designing and developing complex electronic systems with a focus on automatic control
                and efficient signal transmission. Research encompasses analog and digital circuit design
                for various industrial applications.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">🌱</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                Digitalization
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Programming & Visualization; Internet of Things; Artificial Intelligence.
              </p>
              <br />
              {/* <br /> */}
              <p className="text-sm sm:text-base text-gray-600 text-justify">
                Integrating modern digital technologies such as IoT and AI to create smart solutions.
                Research includes algorithm development, data visualization, and connected systems to
                improve operational efficiency.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl">📡</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                Smart-EcoTronics
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Dynamics; Smart & Multi-Functions; Eco-Friendly; Real-Time Control.
              </p>
              <br />
              <p className="text-sm sm:text-base text-gray-600 text-justify">
                Developing smart multifunctional electronic systems with real-time control and environmental
                friendliness. Research focuses on system dynamics, smart function integration, and sustainable
                technologies for future applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-12">
            Recent News
          </h2>
          {isLoading ? (
            <div className="text-center text-gray-600 text-lg">Memuat berita terbaru...</div>
          ) : news.length === 0 ? (
            <div className="text-center text-gray-600 text-lg">Tidak ada berita terbaru yang tersedia.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {news.map((article) => (
                <article key={article.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="h-40 sm:h-48 w-full overflow-hidden">
                    <Link to={`/halaman_berita/detail_berita/${article.id}`}>
                      <img
                        src={article.foto_berita}
                        alt={article.judul_berita}
                        className="w-full h-full object-cover hover:opacity-75 transition-opacity duration-300"
                      />
                    </Link>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="text-xs sm:text-sm text-green-600 font-medium mb-2">
                      {new Date(article.tanggal_berita).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <Link to={`/halaman_berita/detail_berita/${article.id}`}>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 hover:text-green-600 transition-colors duration-300 cursor-pointer">
                        {truncateText(article.judul_berita, 10)}
                      </h3>
                    </Link>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                      {truncateText(article.isi_berita, 20)}
                    </p>
                    <Link to={`/halaman_berita/detail_berita/${article.id}`} className="text-green-600 font-medium hover:text-green-700 text-sm sm:text-base">
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Visitors</h3>
            <div className="space-y-3">
              {(analytics?.topCountries ?? []).slice(0, 10).map((c) => (
                <div key={c.country} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                      srcSet={`https://flagcdn.com/w80/${c.code.toLowerCase()}.png 2x`}
                      width="30"
                      height="20"
                      alt={`Flag of ${c.country}`}
                      className="rounded-sm shadow-sm object-cover border border-gray-200"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <span className="text-black">{c.country}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{c.count}</span>
                </div>
              ))}
              {(analytics?.topCountries ?? []).length === 0 && (
                <div className="text-gray-500">Data belum tersedia</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};