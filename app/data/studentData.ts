import { supabase } from "../koneksi_supabase";

export interface StudentMember {
  id: number;
  name: string;
  position: string;
  masa_program?: string; // Optional field
  researchTopic: string;
  education: string;
  supervisor: string;
  image: string;
  researchLink: string;
}

// Database response interface (matches Supabase table structure)
interface DatabaseStudentMember {
  id: number;
  name: string;
  position: string;
  masa_program: string;
  topik_riset: string;
  education: string;
  supervisor: string;
  image: string;
  link_penelitian: string;
}

// Position hierarchy mapping for sorting
function getPositionPriority(position: string): number {
  const positionLower = position.toLowerCase();
  
  if (positionLower.includes('postdoctoral')) return 1;
  if (positionLower.includes('researcher assistant')) return 2;
  if (positionLower.includes('tugas akhir')) return 3;
  if (positionLower.includes('mbkm')) return 4;
  if (positionLower.includes('magang')) return 5;
  
  // Default priority for other positions
  return 6;
}

// Sort student members by position hierarchy, then alphabetically by name
function sortStudentMembers(studentMembers: StudentMember[]): StudentMember[] {
  return studentMembers.sort((a, b) => {
    // First, sort by position priority
    const priorityA = getPositionPriority(a.position);
    const priorityB = getPositionPriority(b.position);
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // If positions have the same priority, sort alphabetically by name
    return a.name.localeCompare(b.name);
  });
}

// Transform database response to match our interface
function transformDatabaseResponse(dbData: DatabaseStudentMember[]): StudentMember[] {
  return dbData.map(student => ({
    id: student.id,
    name: student.name,
    position: student.position,
    masa_program: student.masa_program,
    researchTopic: student.topik_riset,
    education: student.education,
    supervisor: student.supervisor,
    image: student.image,
    researchLink: student.link_penelitian,
  }));
}

/**
 * Fetch all student members from the database
 * @returns Promise<StudentMember[]> - Array of student members
 */
export async function getAllStudentMembers(): Promise<StudentMember[]> {
  try {
    const { data, error } = await supabase
      .from('data_student')
      .select('*');

    if (error) {
      console.error('Error fetching student data:', error);
      throw new Error(`Failed to fetch student data: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn('No student data found in database');
      return [];
    }

    const transformedData = transformDatabaseResponse(data);
    return sortStudentMembers(transformedData);
  } catch (error) {
    console.error('Error in getAllStudentMembers:', error);
    throw error;
  }
}

/**
 * Find a student member by name
 * @param name - The name to search for
 * @returns Promise<StudentMember | null> - Student member or null if not found
 */
export async function getStudentMemberByName(name: string): Promise<StudentMember | null> {
  try {
    const { data, error } = await supabase
      .from('data_student')
      .select('*')
      .ilike('name', `%${name}%`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        console.warn(`No student member found with name: ${name}`);
        return null;
      }
      console.error('Error fetching student member by name:', error);
      throw new Error(`Failed to fetch student member: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const transformed = transformDatabaseResponse([data]);
    return transformed[0];
  } catch (error) {
    console.error('Error in getStudentMemberByName:', error);
    throw error;
  }
}

/**
 * Search student members by various criteria
 * @param searchTerm - Term to search in name, position, or research topic
 * @returns Promise<StudentMember[]> - Array of matching student members
 */
export async function searchStudentMembers(searchTerm: string): Promise<StudentMember[]> {
  try {
    const { data, error } = await supabase
      .from('data_student')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%,topik_riset.ilike.%${searchTerm}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error searching student members:', error);
      throw new Error(`Failed to search student members: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn(`No student members found matching: ${searchTerm}`);
      return [];
    }

    return transformDatabaseResponse(data);
  } catch (error) {
    console.error('Error in searchStudentMembers:', error);
    throw error;
  }
}

// Legacy export for backward compatibility (deprecated)
// Use getAllStudentMembers() instead
export const studentMembers: StudentMember[] = [];