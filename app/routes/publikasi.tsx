// import type { Route } from "./+types/publikasi";

// export function meta({}: Route.MetaArgs) {
//   return [
//     { title: "Publications - SELEB" },
//     { name: "description", content: "Publikasi ilmiah dan penelitian Kelompok Riset Sustainable Smart Electronics (SELEB)" },
//   ];
// }

// export default function Publications() {
//   const featuredPublications = [
//     {
//       id: 1,
//       title: "Circular Economy Framework for Sustainable Electronics Manufacturing",
//       authors: "Dr. Andi Teknologi, Dr. Budi Inovasi, Prof. Citra Berkelanjutan",
//       journal: "Nature Electronics",
//       year: "2024",
//       impact: "Q1 - IF: 33.686",
//       doi: "10.1038/s41928-024-01234-5",
//       abstract: "This paper presents a comprehensive framework for implementing circular economy principles in electronics manufacturing, focusing on material recovery and waste reduction strategies.",
//       category: "Journal Article",
//       citations: 45,
//       image: "📄"
//     },
//     {
//       id: 2,
//       title: "AI-Driven Optimization of Green Electronics Design",
//       authors: "Dr. Dewi Cerdas, Dr. Eko Ramah, Dr. Fajar Hijau",
//       journal: "IEEE Transactions on Sustainable Computing",
//       year: "2024",
//       impact: "Q1 - IF: 3.345",
//       doi: "10.1109/TSUSC.2024.3456789",
//       abstract: "Novel machine learning approaches for optimizing electronic device design with minimal environmental impact while maintaining performance standards.",
//       category: "Journal Article",
//       citations: 32,
//       image: "🤖"
//     },
//     {
//       id: 3,
//       title: "Biodegradable Battery Technology for IoT Applications",
//       authors: "Dr. Gita Energi, Dr. Hendra Baterai, Dr. Indra Listrik",
//       journal: "Advanced Energy Materials",
//       year: "2023",
//       impact: "Q1 - IF: 29.368",
//       doi: "10.1002/aenm.202301234",
//       abstract: "Development of fully biodegradable batteries using organic materials for sustainable IoT sensor networks with extended operational lifetime.",
//       category: "Journal Article",
//       citations: 78,
//       image: "🔋"
//     }
//   ];

//   const recentPublications = [
//     {
//       id: 4,
//       title: "Smart Waste Management System Using IoT and Machine Learning",
//       authors: "Dr. Joko Pintar, Dr. Kiki Sensor",
//       venue: "International Conference on Sustainable Technology (ICST 2024)",
//       year: "2024",
//       type: "Conference Paper",
//       image: "🗑️"
//     },
//     {
//       id: 5,
//       title: "Energy Harvesting from Environmental Sources for Wearable Electronics",
//       authors: "Dr. Lisa Wearable, Dr. Maya Harvest",
//       venue: "Journal of Cleaner Production",
//       year: "2024",
//       type: "Journal Article",
//       image: "⚡"
//     },
//     {
//       id: 6,
//       title: "Sustainable Materials for Flexible Electronic Devices",
//       authors: "Dr. Nina Fleksibel, Dr. Omar Material",
//       venue: "Materials & Design",
//       year: "2024",
//       type: "Journal Article",
//       image: "📱"
//     },
//     {
//       id: 7,
//       title: "Life Cycle Assessment of Green Computing Infrastructure",
//       authors: "Dr. Pandu Hijau, Dr. Qori Siklus",
//       venue: "Environmental Science & Technology",
//       year: "2023",
//       type: "Journal Article",
//       image: "🌱"
//     },
//     {
//       id: 8,
//       title: "Blockchain-Based Supply Chain for Sustainable Electronics",
//       authors: "Dr. Rini Chain, Dr. Sari Block",
//       venue: "IEEE Access",
//       year: "2023",
//       type: "Journal Article",
//       image: "🔗"
//     }
//   ];

//   const researchMetrics = [
//     { label: "Total Publikasi", value: "150+", icon: "📚" },
//     { label: "Jurnal Q1", value: "45", icon: "🏆" },
//     { label: "H-Index", value: "28", icon: "📊" },
//     { label: "Total Sitasi", value: "2,500+", icon: "📈" }
//   ];

//   const collaborations = [
//     {
//       name: "MIT - Massachusetts Institute of Technology",
//       country: "USA",
//       projects: 3,
//       publications: 8
//     },
//     {
//       name: "TU Delft - Delft University of Technology",
//       country: "Netherlands",
//       projects: 2,
//       publications: 5
//     },
//     {
//       name: "KAIST - Korea Advanced Institute of Science and Technology",
//       country: "South Korea",
//       projects: 4,
//       publications: 12
//     },
//     {
//       name: "ETH Zurich",
//       country: "Switzerland",
//       projects: 1,
//       publications: 3
//     }
//   ];

//   return (
//     <div className="min-h-screen pt-20">
//       {/* Hero Section */}
//       <section className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700 text-white py-12 sm:py-16 md:py-20 relative overflow-hidden">
//         <div className="absolute inset-0 bg-black opacity-20"></div>
//         <div className="absolute top-10 left-10 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-green-400 rounded-full opacity-10 animate-pulse"></div>
//         <div className="absolute bottom-10 right-10 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 bg-emerald-300 rounded-full opacity-15 animate-bounce"></div>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//           <div className="text-center">
//             <div className="inline-block mb-4 sm:mb-6">
//             </div>
//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-200 to-emerald-100 bg-clip-text text-transparent">
//               Scientific Publications
//             </h1>
//             <p className="text-base sm:text-lg md:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
//               Contributions of SELEB to sustainable electronics advancement 
//               through publications in top-tier journals and international conferences
//             </p>
//           </div>
//         </div>
//       </section>


//       {/* Featured Publications */}
//       <section className="py-12 sm:py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8 sm:mb-12">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
//               Featured Publications
//             </h2>
//             <p className="text-base sm:text-lg text-gray-600">
//               Selected publications with high impact in sustainable electronics
//             </p>
//           </div>

//           <div className="space-y-6 sm:space-y-8">
//             {featuredPublications.map((pub) => (
//               <article key={pub.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 hover:shadow-xl transition-shadow">
//                 <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
//                   <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
//                     <span className="text-xl sm:text-2xl">{pub.image}</span>
//                   </div>
                  
//                   <div className="flex-grow text-center sm:text-left">
//                     <div className="flex flex-col sm:flex-row items-center mb-3 space-y-2 sm:space-y-0">
//                       <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium sm:mr-3">
//                         {pub.category}
//                       </span>
//                       <span className="text-sm text-gray-500">{pub.year}</span>
//                       <span className="hidden sm:inline mx-2 text-gray-300">•</span>
//                       <span className="text-sm text-green-600 font-medium">{pub.citations} sitasi</span>
//                     </div>
                    
//                     <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
//                       {pub.title}
//                     </h3>
                    
//                     <p className="text-sm sm:text-base text-gray-700 mb-3">{pub.authors}</p>
                    
//                     <div className="flex flex-col sm:flex-row items-center mb-4 text-sm space-y-2 sm:space-y-0">
//                       <span className="font-medium text-gray-700 sm:mr-2">Jurnal:</span>
//                       <span className="text-green-600 font-medium sm:mr-4">{pub.journal}</span>
//                       <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
//                         {pub.impact}
//                       </span>
//                     </div>
                    
//                     <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
//                       {pub.abstract}
//                     </p>
                    
//                     <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
//                       <button className="text-green-600 font-medium hover:text-green-800 transition-colors text-sm">
//                         DOI: {pub.doi}
//                       </button>
//                       <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors w-full sm:w-auto">
//                         Baca Paper
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Recent Publications */}
//       <section className="py-12 sm:py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8 sm:mb-12">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold  text-white mb-3 sm:mb-4">
//               Recent Publications
//             </h2>
//             <p className="text-base sm:text-lg  text-white">
//               Latest research papers from SELEB's research team
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//             {recentPublications.map((pub) => (
//               <article key={pub.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow">
//                 <div className="flex items-start space-x-3 sm:space-x-4">
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                     <span className="text-lg sm:text-xl">{pub.image}</span>
//                   </div>
                  
//                   <div className="flex-grow">
//                     <div className="flex flex-col sm:flex-row items-start sm:items-center mb-2 space-y-1 sm:space-y-0">
//                       <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium sm:mr-2">
//                         {pub.type}
//                       </span>
//                       <span className="text-sm text-gray-500">{pub.year}</span>
//                     </div>
                    
//                     <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 hover:text-green-600 cursor-pointer leading-tight">
//                       {pub.title}
//                     </h3>
                    
//                     <p className="text-gray-700 text-xs sm:text-sm mb-2">{pub.authors}</p>
//                     <p className="text-green-600 text-xs sm:text-sm font-medium">{pub.venue}</p>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
          
//           <div className="text-center mt-6 sm:mt-8">
//             <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors w-full sm:w-auto">
//               View All Publications
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* International Collaborations */}
//       <section className="py-12 sm:py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-8 sm:mb-12">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
//               International Collaborations
//             </h2>
//             <p className="text-base sm:text-lg text-gray-600">
//               Collaborations with top universities worldwide
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//             {collaborations.map((collab, index) => (
//               <div key={index} className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div>
//                     <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">{collab.name}</h3>
//                     <p className="text-green-600 font-medium text-sm sm:text-base">{collab.country}</p>
//                   </div>
//                   <div className="text-xl sm:text-2xl">🌍</div>
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="text-center">
//                     <div className="text-xl sm:text-2xl font-bold text-green-600">{collab.projects}</div>
//                     <div className="text-xs sm:text-sm text-gray-600">Proyek Aktif</div>
//                   </div>
//                   <div className="text-center">
//                     <div className="text-xl sm:text-2xl font-bold text-green-600">{collab.publications}</div>
//                     <div className="text-xs sm:text-sm text-gray-600">Publikasi Bersama</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }