import { supabase } from "../koneksi_supabase";

export interface FacultyMember {
  id: number;
  name: string;
  position: string;
  specialization: string;
  education: string;
  email: string;
  image: string;
  linkPenelitian: string;
  bibliography: string;
}

// Database response interface (matches Supabase table structure)
interface DatabaseFacultyMember {
  id: number;
  name: string;
  position: string;
  specialization: string;
  education: string;
  email: string;
  image: string;
  link_penelitian: string;
  bibliography: string;
}

// Position hierarchy mapping for sorting
function getPositionPriority(position: string): number {
  const positionLower = position.toLowerCase();
  
  if (positionLower.includes('professor')) return 1;
  if (positionLower.includes('senior')) return 2;
  if (positionLower.includes('junior')) return 3;
  if (positionLower.includes('associate')) return 4;
  
  // Default priority for other positions
  return 5;
}

// Sort faculty members by position hierarchy, then alphabetically by name
function sortFacultyMembers(facultyMembers: FacultyMember[]): FacultyMember[] {
  return facultyMembers.sort((a, b) => {
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
function transformDatabaseResponse(dbData: DatabaseFacultyMember[]): FacultyMember[] {
  return dbData.map(faculty => ({
    id: faculty.id,
    name: faculty.name,
    position: faculty.position,
    specialization: faculty.specialization,
    education: faculty.education,
    email: faculty.email,
    image: faculty.image,
    linkPenelitian: faculty.link_penelitian,
    bibliography: faculty.bibliography,
  }));
}

/**
 * Fetch all faculty members from the database
 * @returns Promise<FacultyMember[]> - Array of faculty members
 */
export async function getAllFacultyMembers(): Promise<FacultyMember[]> {
  try {
    const { data, error } = await supabase
      .from('data_peneliti')
      .select('*');

    if (error) {
      console.error('Error fetching faculty data:', error);
      throw new Error(`Failed to fetch faculty data: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn('No faculty data found in database');
      return [];
    }

    const transformedData = transformDatabaseResponse(data);
    return sortFacultyMembers(transformedData);
  } catch (error) {
    console.error('Error in getAllFacultyMembers:', error);
    throw error;
  }
}

/**
 * Find a faculty member by name
 * @param name - The name to search for
 * @returns Promise<FacultyMember | null> - Faculty member or null if not found
 */
export async function getFacultyMemberByName(name: string): Promise<FacultyMember | null> {
  try {
    const { data, error } = await supabase
      .from('data_peneliti')
      .select('*')
      .ilike('name', `%${name}%`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        console.warn(`No faculty member found with name: ${name}`);
        return null;
      }
      console.error('Error fetching faculty member by name:', error);
      throw new Error(`Failed to fetch faculty member: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const transformed = transformDatabaseResponse([data]);
    return transformed[0];
  } catch (error) {
    console.error('Error in getFacultyMemberByName:', error);
    throw error;
  }
}

/**
 * Search faculty members by various criteria
 * @param searchTerm - Term to search in name, position, or specialization
 * @returns Promise<FacultyMember[]> - Array of matching faculty members
 */
export async function searchFacultyMembers(searchTerm: string): Promise<FacultyMember[]> {
  try {
    const { data, error } = await supabase
      .from('data_peneliti')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%,specialization.ilike.%${searchTerm}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error searching faculty members:', error);
      throw new Error(`Failed to search faculty members: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn(`No faculty members found matching: ${searchTerm}`);
      return [];
    }

    return transformDatabaseResponse(data);
  } catch (error) {
    console.error('Error in searchFacultyMembers:', error);
    throw error;
  }
}

// Legacy export for backward compatibility (deprecated)
// Use getAllFacultyMembers() instead
export const facultyMembers: FacultyMember[] = [];