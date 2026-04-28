import { supabase } from "../koneksi_supabase";

export interface Berita {
  id: number;
  judul_berita: string;
  tanggal_berita: string;
  isi_berita: string;
  foto_berita: string;
  link_yt: string;
  reporter: string;
}

// Database response interface (matches Supabase table structure)
interface DatabaseBerita {
  id: number;
  judul_berita: string;
  tanggal_berita: string;
  isi_berita: string;
  foto_berita: string;
  link_yt: string;
  reporter: string;
}

// Transform database response to match our interface
function transformDatabaseResponse(dbData: DatabaseBerita[]): Berita[] {
  return dbData.map(berita => ({
    id: berita.id,
    judul_berita: berita.judul_berita,
    tanggal_berita: berita.tanggal_berita,
    isi_berita: berita.isi_berita,
    foto_berita: berita.foto_berita,
    link_yt: berita.link_yt,
    reporter: berita.reporter,
  }));
}

/**
 * Fetch all news articles from the database
 * @returns Promise<Berita[]> - Array of news articles
 */
export async function getAllBerita(): Promise<Berita[]> {
  try {
    const { data, error } = await supabase
      .from('data_berita')
      .select('*')
      .order('tanggal_berita', { ascending: false });

    if (error) {
      console.error('Error fetching news data:', error);
      throw new Error(`Failed to fetch news data: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn('No news data found in database');
      return [];
    }

    return transformDatabaseResponse(data);
  } catch (error) {
    console.error('Error in getAllBerita:', error);
    throw error;
  }
}

/**
 * Find a news article by ID
 * @param id - The ID to search for
 * @returns Promise<Berita | null> - News article or null if not found
 */
export async function getBeritaById(id: number): Promise<Berita | null> {
  try {
    const { data, error } = await supabase
      .from('data_berita')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        console.warn(`No news article found with ID: ${id}`);
        return null;
      }
      console.error('Error fetching news article by ID:', error);
      throw new Error(`Failed to fetch news article: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const transformed = transformDatabaseResponse([data]);
    return transformed[0];
  } catch (error) {
    console.error('Error in getBeritaById:', error);
    throw error;
  }
}

/**
 * Add a new news article to the database
 * @param newBerita - The news article object to add
 * @returns Promise<Berita | null> - The added news article or null if failed
 */
export async function addBerita(newBerita: Omit<Berita, 'id'>): Promise<Berita | null> {
  try {
    const { data, error } = await supabase
      .from('data_berita')
      .insert([newBerita])
      .select()
      .single();

    if (error) {
      console.error('Error adding news article:', error);
      throw new Error(`Failed to add news article: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const transformed = transformDatabaseResponse([data]);
    return transformed[0];
  } catch (error) {
    console.error('Error in addBerita:', error);
    throw error;
  }
}

/**
 * Update an existing news article in the database
 * @param id - The ID of the news article to update
 * @param updatedBerita - The updated news article object
 * @returns Promise<Berita | null> - The updated news article or null if failed
 */
export async function updateBerita(id: number, updatedBerita: Partial<Omit<Berita, 'id'>>): Promise<Berita | null> {
  try {
    const { data, error } = await supabase
      .from('data_berita')
      .update(updatedBerita)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating news article:', error);
      throw new Error(`Failed to update news article: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const transformed = transformDatabaseResponse([data]);
    return transformed[0];
  } catch (error) {
    console.error('Error in updateBerita:', error);
    throw error;
  }
}

/**
 * Delete a news article from the database
 * @param id - The ID of the news article to delete
 * @returns Promise<boolean> - True if deleted successfully, false otherwise
 */
export async function deleteBerita(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('data_berita')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting news article:', error);
      throw new Error(`Failed to delete news article: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteBerita:', error);
    throw error;
  }
}

// Initial data for data_berita (if the table is empty)
// This function can be called once to populate the table
export async function initializeBeritaData() {
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from('data_berita')
      .select('id');

    if (fetchError) {
      console.error('Error checking existing berita data:', fetchError);
      return;
    }

    if (existingData && existingData.length === 0) {
      console.log('Initializing data_berita table with initial data...');
      const initialBerita: Omit<Berita, 'id'> = {
        judul_berita: "Penelitian Terbaru: Dampak AI pada Elektronik Berkelanjutan",
        tanggal_berita: "2025-10-10",
        isi_berita: "Sebuah studi baru oleh tim peneliti SELEB menunjukkan dampak signifikan kecerdasan buatan dalam pengembangan elektronik berkelanjutan, membuka jalan bagi inovasi ramah lingkungan.",
        foto_berita: "https://wsgqastrtdkcrgpzgzhp.supabase.co/storage/v1/object/public/foto_berita/foto%20berita_10-10-2025.jpeg",
        link_yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        reporter: "Admin SELEB",
      };

      await addBerita(initialBerita);
      console.log('Initial berita data added successfully.');
    } else {
      console.log('data_berita table already contains data. Skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing berita data:', error);
  }
}

// Call the initialization function (optional, can be called from a setup script or on app start)
// initializeBeritaData();