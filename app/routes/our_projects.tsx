export function meta() {
  return [
    { title: "Our Projects - SINES" },
    { name: "description", content: "Research projects developed by the SINES research group" },
  ];
}

const projects = [
  {
    id: 1,
    name: "MMG — Mechanomyography",
    emoji: "💪",
    description:
      "A mechanomyography-based system for detecting and analyzing muscle mechanical vibrations. Used for muscle strength monitoring, prosthetic control, and rehabilitation applications.",
    links: [
      { label: "Visit Website", url: "https://mechanomyography.vercel.app", primary: true },
    ],
    tags: ["IoT", "Biosignal", "Rehabilitation"],
  },
  {
    id: 2,
    name: "RGB-PH Detection",
    emoji: "🔬",
    description:
      "Design of an optoelectronic transducer with RGB-pH calibration on ESP32 microcontroller using TCS34725 sensor for determining fresh protein quality.",
    links: [
      { label: "Visit Website", url: "https://web-p-h-detection-based-on-rgb.vercel.app", primary: true },
    ],
    tags: ["ESP32", "Sensor", "Food Quality"],
  },
  {
    id: 3,
    name: "FreshScan",
    emoji: "🌿",
    description:
      "A smart food freshness detection system using multiple sensor technologies. Available in three series: MQ gas sensor, MEMS sensor, and Calibrated sensor variants.",
    links: [
      { label: "MQ Series", url: "https://freshscan-mq-series.web.app", primary: true },
      { label: "MEMS Series", url: "https://freshscan-mems-series.web.app", primary: false },
      { label: "Calibrated Series", url: "https://freshscan-calibrated-series.web.app", primary: false },
    ],
    tags: ["Food Safety", "MEMS", "Gas Sensor"],
  },
  {
    id: 4,
    name: "Pelantar — Foot Plantar",
    emoji: "👣",
    description:
      "A BNC hydrogel-based plantar sensor integrated with FlexiForce and IoT for real-time monitoring of pressure distribution and body balance, with applications in medical rehabilitation and health monitoring.",
    links: [
      { label: "Visit Website", url: "https://foot-plantar.vercel.app/pages/login.html", primary: true },
    ],
    tags: ["IoT", "Hydrogel", "Health Monitoring"],
  },
];

export default function OurProjects() {
  return (
    <div className="min-h-screen pt-20">

      {/* Header */}
      <section className="relative bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700 text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-emerald-300 rounded-full opacity-15 animate-bounce"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block bg-green-500/30 border border-green-400/40 text-green-200 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            SINES · Research Group
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Our Projects
          </h1>
          <p className="text-green-100 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Innovative research projects developed by the SINES team — from biosensors to smart food monitoring systems.
          </p>
          <div className="mt-8 inline-block bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm text-green-200">
            {projects.length} active projects
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 overflow-hidden flex flex-col group"
              >
                {/* Card top */}
                <div className="bg-gradient-to-br from-green-700 to-emerald-500 px-8 py-10 flex items-center gap-5">
                  <div className="text-5xl">{project.emoji}</div>
                  <div>
                    <h2 className="text-white font-bold text-xl leading-snug">
                      {project.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-white/20 text-green-100 border border-white/30 rounded-full px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-gray-600 leading-relaxed flex-1 mb-6">
                    {project.description}
                  </p>

                  {/* Links */}
                  <div className="flex flex-wrap gap-3">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          link.primary
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                        }`}
                      >
                        {link.label}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}