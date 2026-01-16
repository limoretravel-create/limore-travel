import { supabase, Database } from '../lib/supabase';

type Package = Database['public']['Tables']['packages']['Row'];
type PackageInsert = Database['public']['Tables']['packages']['Insert'];
type PackageUpdate = Database['public']['Tables']['packages']['Update'];

type Car = Database['public']['Tables']['cars']['Row'];
type CarInsert = Database['public']['Tables']['cars']['Insert'];
type CarUpdate = Database['public']['Tables']['cars']['Update'];

type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert'];

// Packages Service
export const packagesService = {
  async getAll(filters?: { status?: 'published' | 'draft'; search?: string }) {
    let query = supabase.from('packages').select('*').order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      query = query.or(`title.ilike.%${filters.search}%,destination.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Package[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Package;
  },

  async create(packageData: PackageInsert) {
    const { data, error } = await supabase
      .from('packages')
      .insert(packageData)
      .select()
      .single();

    if (error) throw error;
    return data as Package;
  },

  async update(id: string, packageData: PackageUpdate) {
    const { data, error } = await supabase
      .from('packages')
      .update({ ...packageData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Package;
  },

  async delete(id: string) {
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (error) throw error;
  },
};

// Cars Service
export const carsService = {
  async getAll(filters?: { status?: 'published' | 'draft'; search?: string }) {
    let query = supabase.from('cars').select('*').order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Car[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Car;
  },

  async create(carData: CarInsert) {
    const { data, error } = await supabase
      .from('cars')
      .insert(carData)
      .select()
      .single();

    if (error) throw error;
    return data as Car;
  },

  async update(id: string, carData: CarUpdate) {
    const { data, error } = await supabase
      .from('cars')
      .update({ ...carData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Car;
  },

  async delete(id: string) {
    const { error } = await supabase.from('cars').delete().eq('id', id);
    if (error) throw error;
  },
};

// Contact Messages Service
export const contactService = {
  async create(message: ContactMessageInsert) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data as ContactMessage;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as ContactMessage[];
  },
};

