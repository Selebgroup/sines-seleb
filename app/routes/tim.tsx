import type { Route } from "./+types/tim";
import { Link } from "react-router";
import { getAllStudentMembers, type StudentMember } from "../data/studentData";
import { getAllFacultyMembers, type FacultyMember } from "../data/facultyData";
import { useState, useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Research Team - SINES" },
    { name: "description", content: "SELEB Research Team" },
  ];
}

export default function Team() {
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [studentMembers, setStudentMembers] = useState<StudentMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [researchers, students] = await Promise.all([
        getAllFacultyMembers(),
        getAllStudentMembers(),
      ]);
      setFacultyMembers(researchers);
      setStudentMembers(students);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Filter sesuai nilai dropdown di admin: "Postdoctoral", "PhD Student", "Master Student", "Bachelor Student"
  const postdocs = studentMembers.filter((m) =>
    m.position?.toLowerCase() === "postdoctoral"
  );
  const phdStudents = studentMembers.filter((m) =>
    m.position?.toLowerCase() === "phd student"
  );
  const masterStudents = studentMembers.filter((m) =>
    m.position?.toLowerCase() === "master student"
  );
  const bachelorStudents = studentMembers.filter((m) =>
    m.position?.toLowerCase() === "bachelor student"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-3 h-3 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-3 h-3 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-gray-500 text-sm">Loading team data...</p>
      </div>
    );
  }

  const totalMembers = facultyMembers.length + studentMembers.length;

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-600 text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-10 w-64 h-64 bg-green-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-green-500/30 border border-green-400/40 text-green-200 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            SELEB · Sustainable Electronics
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
            Meet Our Research Team
          </h1>
          <p className="text-green-100 text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Brilliant minds working together to advance sustainable and intelligent electronics research.
          </p>

          {/* Stats bar */}
          <div className="inline-flex flex-wrap justify-center gap-0 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden">
            {[
              { count: facultyMembers.length, label: "Researchers" },
              { count: postdocs.length, label: "Postdocs" },
              { count: phdStudents.length, label: "PhD" },
              { count: masterStudents.length, label: "Master" },
              { count: bachelorStudents.length, label: "Bachelor" },
            ].map(({ count, label }, i, arr) => (
              <div
                key={label}
                className={`px-6 py-5 text-center ${i < arr.length - 1 ? "border-r border-white/20" : ""}`}
              >
                <div className="text-3xl font-bold text-white">{count}</div>
                <div className="text-xs text-green-200 uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── 01 RESEARCHERS ── */}
      <TeamSection number="01" title="Researchers" count={facultyMembers.length} bg="bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {facultyMembers.map((faculty) => (
            <ResearcherCard key={faculty.id} faculty={faculty} />
          ))}
        </div>
      </TeamSection>

      {/* ── 02 POSTDOCTORAL ── */}
      {postdocs.length > 0 && (
        <TeamSection number="02" title="Postdoctoral Fellows" count={postdocs.length} bg="bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {postdocs.map((student, i) => <StudentCard key={i} student={student} />)}
          </div>
        </TeamSection>
      )}

      {/* ── 03 PHD ── */}
      {phdStudents.length > 0 && (
        <TeamSection number="03" title="PhD Students" count={phdStudents.length} bg="bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {phdStudents.map((student, i) => <StudentCard key={i} student={student} />)}
          </div>
        </TeamSection>
      )}

      {/* ── 04 MASTER ── */}
      {masterStudents.length > 0 && (
        <TeamSection number="04" title="Master Students" count={masterStudents.length} bg="bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {masterStudents.map((student, i) => <StudentCard key={i} student={student} />)}
          </div>
        </TeamSection>
      )}

      {/* ── 05 BACHELOR ── */}
      {bachelorStudents.length > 0 && (
        <TeamSection number="05" title="Bachelor Students" count={bachelorStudents.length} bg="bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bachelorStudents.map((student, i) => <StudentCard key={i} student={student} />)}
          </div>
        </TeamSection>
      )}

      {/* ── BOTTOM BAND ── */}
      <section className="bg-green-600 py-14 text-center text-white">
        <p className="text-green-100 text-xs font-semibold uppercase tracking-widest mb-2">Total Members</p>
        <p className="text-5xl font-bold mb-3">{totalMembers}</p>
        <p className="text-green-100 max-w-md mx-auto text-base">
          Researchers and students dedicated to sustainable electronics innovation at SINES.
        </p>
      </section>

    </div>
  );
}


/* ─── SECTION WRAPPER ─── */
function TeamSection({
  number, title, count, bg, children,
}: {
  number: string;
  title: string;
  count: number;
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`${bg} py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-1 shrink-0">
            {number}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 shrink-0">{title}</h2>
          <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1 shrink-0">
            {count} {count === 1 ? "member" : "members"}
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        {children}
      </div>
    </section>
  );
}


/* ─── RESEARCHER CARD ─── */
function ResearcherCard({ faculty }: { faculty: any }) {
  const initials = faculty.name
    ?.split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("") ?? "?";

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-green-200 flex flex-col">
      <div className="bg-gradient-to-br from-green-700 to-green-500 px-6 pt-8 pb-14 text-center relative">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-3xl" />
        <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/60 mx-auto overflow-hidden flex items-center justify-center shadow-lg relative z-10">
          {faculty.image ? (
            <img src={faculty.image} alt={faculty.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-bold text-2xl">{initials}</span>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 flex flex-col flex-1 text-center">
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 group-hover:text-green-700 transition-colors">
          {faculty.name}
        </h3>
        <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-3 py-0.5 mb-4 self-center">
          {faculty.position}
        </span>

        <div className="text-sm space-y-3 text-left flex-1">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Specialization</p>
            <p className="text-gray-700 leading-snug">{faculty.specialization}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
            <p className="text-gray-700 break-all text-xs">{faculty.email}</p>
          </div>
        </div>

        <Link
          to={`/data-tim-peneliti/${encodeURIComponent(faculty.name)}`}
          className="mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors px-4 py-2.5 rounded-lg"
        >
          View Profile
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}


/* ─── STUDENT CARD ─── */
function StudentCard({ student }: { student: any }) {
  const initials = student.name
    ?.split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("") ?? "?";

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 p-5 flex flex-col group">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-green-50 border-2 border-green-100 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
          {student.image ? (
            <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-green-600 font-bold text-lg">{initials}</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-green-700 transition-colors">
            {student.name}
          </h3>
          <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 mt-1">
            {student.position}
          </span>
        </div>
      </div>

      <div className="text-sm space-y-3 flex-1">
        {student.researchTopic && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Research Topic</p>
            <p className="text-gray-700 leading-snug line-clamp-3">{student.researchTopic}</p>
          </div>
        )}
        {student.supervisor && (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Supervisor</p>
            <p className="text-gray-700">{student.supervisor}</p>
          </div>
        )}
      </div>

      {student.researchLink && student.researchLink !== "-" && (
        <a
          href={student.researchLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-800 transition-colors border-t border-gray-100 pt-3"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View Publication
        </a>
      )}
    </div>
  );
}