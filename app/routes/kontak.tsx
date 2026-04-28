import type { Route } from "./+types/kontak";
import { useEffect, useRef } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact - SINES" },
    { name: "description", content: "Hubungi SELEB Research Group - Sustainable Intelligent Electronic Systems" },
  ];
}

export default function Contact() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const lat = -6.881914;
  const lon = 107.611177;
  useEffect(() => {
    let instance: any;
    const init = async () => {
      const L = await import("leaflet");
      if (!mapRef.current) return;
      instance = L.map(mapRef.current, { zoomControl: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(instance);
      instance.setView([lat, lon], 10);
      setTimeout(() => {
        instance.once("moveend", () => {
          const icon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            shadowSize: [41, 41],
          });
          L.marker([lat, lon], { icon }).addTo(instance);
        });
        instance.flyTo([lat, lon], 18, { duration: 2 });
      }, 500);
    };
    init();
    return () => {
      if (instance) instance.remove();
    };
  }, []);
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-800 text-white py-16 sm:py-20 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-40 h-40 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-emerald-300/30 rounded-full blur-2xl animate-bounce"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-400/20 rounded-full blur-xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Contact Us
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-300 to-emerald-300 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-lg sm:text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              We&apos;re here to help you with information about SELEB and 
              Sustainable Intelligent Electronic Systems. Don&apos;t hesitate to contact us.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-40 h-40 bg-green-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-emerald-200/40 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-200/20 rounded-full blur-xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-white/50">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                Send a Message
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                Please fill out the form below to send us a message. 
                We will respond within 1x24 hours.
              </p>

              <form className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm sm:text-base"
                      placeholder="Masukkan nama depan"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm sm:text-base"
                      placeholder="Masukkan nama belakang"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm sm:text-base"
                    placeholder="nama@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm sm:text-base"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Question Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm sm:text-base"
                  >
                    <option value="">Select a category</option>
                    <option value="research">Research & Collaboration</option>
                    <option value="publication">Publications & Papers</option>
                    <option value="partnership">Industry Partnerships</option>
                    <option value="academic">Academic Programs</option>
                    <option value="facilities">Laboratory Facilities</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-sm sm:text-base"
                    placeholder="Subject of your message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-vertical text-sm sm:text-base"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    required
                    className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="privacy" className="ml-3 text-xs sm:text-sm text-gray-600">
                    I agree to the <a href="#" className="text-emerald-600 hover:text-emerald-800">privacy policy</a> and 
                    give permission to process my personal data. *
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Contact Information
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto"></div>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Office Address */}
                <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-xl sm:text-2xl">🏢</span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Office Address</h3>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        SELEB Research Group<br />
                        KST Samaun Samadikun<br />
                        Jl. Sangkuriang, Dago<br />
                        Kecamatan Coblong, Kota Bandung 40135<br />
                        Jawa Barat, Indonesia
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
                    <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-lg sm:text-xl">📧</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Email</h3>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                      <strong>Research & Collaboration Email:</strong>
                      <br />
                      <a href="mailto:atha001@brin.go.id" className="text-emerald-500 hover:text-emerald-800">atha001@brin.go.id</a>
                    </p>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg sm:text-xl">🕒</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Office Hours</h3>
                  </div>
                  <div className="space-y-2 text-gray-600 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span>Monday - Thursday</span>
                      <span>07:30 - 16:00 WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Friday</span>
                      <span>07:30 - 16:30 WIB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday - Sunday</span>
                      <span className="text-red-500">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Research Focus */}
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg sm:text-xl">🔬</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Research Focus</h3>
                  </div>
                  <div className="space-y-2 text-gray-600 text-sm sm:text-base">
                    <p>• Research Focus Name</p>
                    <p>• Research Focus Name</p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
                  <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-lg sm:text-xl">🌐</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Social Media</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-4">
                    <a href="#" className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-blue-100 text-xs sm:text-sm">
                      <span>📘</span>
                      <span>Facebook</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-blue-400 hover:text-blue-600 transition-colors bg-blue-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-blue-100 text-xs sm:text-sm">
                      <span>🐦</span>
                      <span>Twitter</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-pink-600 hover:text-pink-800 transition-colors bg-pink-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-pink-100 text-xs sm:text-sm">
                      <span>📷</span>
                      <span>Instagram</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors bg-red-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg hover:bg-red-100 text-xs sm:text-sm">
                      <span>📺</span>
                      <span>YouTube</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-emerald-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-200/30 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Location
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg text-gray-600">
              Find the location of SELEB Research Group at KST Samaun Samadikun (Cisitu, Bandung)
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
            <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-emerald-100 to-green-50">
              <div ref={mapRef} className="w-full h-full min-h-[320px] sm:min-h-[380px]" />
            </div>
            <div className="p-5 sm:p-6 text-center">
              <p className="text-gray-700 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                SELEB Research Group<br />
                KST Samaun Samadikun
                Jl. Sangkuriang, Dago
                Kecamatan Coblong, Kota Bandung 40135
                Jawa Barat, Indonesia
              </p>
              <div className="flex justify-center">
                <a
                  href="https://www.openstreetmap.org/?mlat=-6.881914&mlon=107.611177#map=18/-6.881914/107.611177"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-md text-xs sm:text-sm text-center"
                >
                  Open Map
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-emerald-50 to-green-50 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-green-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-green-500 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg text-gray-600">
              Find answers to common questions about SELEB Research Group
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 text-emerald-600 font-bold text-sm sm:text-base">Q</span>
                What is SELEB Research Group?
              </h3>
              <p className="text-gray-600 leading-relaxed pl-9 sm:pl-11 text-sm sm:text-base">
                SELEB (Sustainable Intelligent Electronic Systems) is a research group that
                focuses on developing intelligent and sustainable electronic systems in the
                field of computer and electronics technology.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 text-emerald-600 font-bold text-sm sm:text-base">Q</span>
                How can I join the research group?
              </h3>
              <p className="text-gray-600 leading-relaxed pl-9 sm:pl-11 text-sm sm:text-base">
                Students can join the research group through our internship program, final year projects,
                or as researcher assistants. Please contact us via email or visit our lab for more
                information.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 text-emerald-600 font-bold text-sm sm:text-base">Q</span>
                What are the research areas available?
              </h3>
              <p className="text-gray-600 leading-relaxed pl-9 sm:pl-11 text-sm sm:text-base">
                We focus on IoT, AI/Machine Learning, embedded systems, green technology, smart systems,
                and software development for sustainable applications.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 text-emerald-600 font-bold text-sm sm:text-base">Q</span>
                Is there an industry collaboration program?
              </h3>
              <p className="text-gray-600 leading-relaxed pl-9 sm:pl-11 text-sm sm:text-base">
                Yes, we are open to industry collaborations in the form of joint research,
                technology consulting, and the development of sustainable innovative products.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 text-emerald-600 font-bold text-sm sm:text-base">Q</span>
                How can I get the latest updates?
              </h3>
              <p className="text-gray-600 leading-relaxed pl-9 sm:pl-11 text-sm sm:text-base">
                Follow our social media channels, visit our website regularly, or subscribe to our newsletter
                to stay updated on the latest research and activities of SELEB Research Group.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
