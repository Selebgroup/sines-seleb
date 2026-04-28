import { supabase } from "../koneksi_supabase";

export interface Riset {
  id: number;
  judul_riset: string;
  deskripsi_riset: string;
}

// Database response interface (matches Supabase table structure)
interface DatabaseRiset {
  id: number;
  judul_riset: string;
  deskripsi_riset: string;
}

// Transform database response to match our interface
function transformDatabaseResponse(dbData: DatabaseRiset[]): Riset[] {
  return dbData.map(riset => ({
    id: riset.id,
    judul_riset: riset.judul_riset,
    deskripsi_riset: riset.deskripsi_riset,
  }));
}

/**
 * Fetch all research data from the database
 * @returns Promise<Riset[]> - Array of research data
 */
export async function getAllRiset(): Promise<Riset[]> {
  try {
    const { data, error } = await supabase
      .from('data_riset')
      .select('*')
      .order('judul_riset', { ascending: true });

    if (error) {
      console.error('Error fetching research data:', error);
      throw new Error(`Failed to fetch research data: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn('No research data found in database');
      return [];
    }

    return transformDatabaseResponse(data);
  } catch (error) {
    console.error('Error in getAllRiset:', error);
    throw error;
  }
}

/**
 * Find a research data by ID
 * @param id - The ID to search for
 * @returns Promise<Riset | null> - Research data or null if not found
 */
export async function getRisetById(id: number): Promise<Riset | null> {
  try {
    const { data, error } = await supabase
      .from('data_riset')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        console.warn(`No research data found with ID: ${id}`);
        return null;
      }
      console.error('Error fetching research data by ID:', error);
      throw new Error(`Failed to fetch research data: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const transformed = transformDatabaseResponse([data]);
    return transformed[0];
  } catch (error) {
    console.error('Error in getRisetById:', error);
    throw error;
  }
}

/**
 * Add a new research data to the database
 * @param newRiset - The research data object to add
 * @returns Promise<Riset | null> - The added research data or null if failed
 */
export async function addRiset(newRiset: Omit<Riset, 'id'>): Promise<Riset | null> {
  try {
    const { data, error } = await supabase
      .from('data_riset')
      .insert([newRiset])
      .select()
      .single();

    if (error) {
      console.error('Error adding research data:', error);
      throw new Error(`Failed to add research data: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const transformed = transformDatabaseResponse([data]);
    return transformed[0];
  } catch (error) {
    console.error('Error in addRiset:', error);
    throw error;
  }
}

/**
 * Update an existing research data in the database
 * @param id - The ID of the research data to update
 * @param updatedRiset - The updated research data object
 * @returns Promise<Riset | null> - The updated research data or null if failed
 */
export async function updateRiset(id: number, updatedRiset: Partial<Omit<Riset, 'id'>>): Promise<Riset | null> {
  try {
    const { data, error } = await supabase
      .from('data_riset')
      .update(updatedRiset)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating research data:', error);
      throw new Error(`Failed to update research data: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const transformed = transformDatabaseResponse([data]);
    return transformed[0];
  } catch (error) {
    console.error('Error in updateRiset:', error);
    throw error;
  }
}

/**
 * Delete a research data from the database
 * @param id - The ID of the research data to delete
 * @returns Promise<boolean> - True if deleted successfully, false otherwise
 */
export async function deleteRiset(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('data_riset')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting research data:', error);
      throw new Error(`Failed to delete research data: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteRiset:', error);
    throw error;
  }
}

/**
 * Search research data by various criteria
 * @param searchTerm - Term to search in judul_riset or deskripsi_riset
 * @returns Promise<Riset[]> - Array of matching research data
 */
export async function searchRiset(searchTerm: string): Promise<Riset[]> {
  try {
    const { data, error } = await supabase
      .from('data_riset')
      .select('*')
      .or(`judul_riset.ilike.%${searchTerm}%,deskripsi_riset.ilike.%${searchTerm}%`)
      .order('judul_riset', { ascending: true });

    if (error) {
      console.error('Error searching research data:', error);
      throw new Error(`Failed to search research data: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn(`No research data found matching: ${searchTerm}`);
      return [];
    }

    return transformDatabaseResponse(data);
  } catch (error) {
    console.error('Error in searchRiset:', error);
    throw error;
  }
}

// Initial data for data_riset (if the table is empty)
// This function can be called once to populate the table
export async function initializeRisetData() {
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from('data_riset')
      .select('id');

    if (fetchError) {
      console.error('Error checking existing riset data:', fetchError);
      return;
    }

    if (existingData && existingData.length === 0) {
      console.log('Initializing data_riset table with initial data...');
      const initialRiset: Omit<Riset, 'id'> = {
        judul_riset: "Penelitian Awal: Dampak Teknologi X pada Masyarakat",
        deskripsi_riset: "Studi ini mengeksplorasi bagaimana adopsi teknologi X telah memengaruhi berbagai aspek kehidupan sosial dan ekonomi masyarakat di wilayah perkotaan.",
      };

      await addRiset(initialRiset);
      console.log('Initial riset data added successfully.');
    } else {
      console.log('data_riset table already contains data. Skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing riset data:', error);
  }
}

// Call the initialization function (optional, can be called from a setup script or on app start)
// initializeRisetData();