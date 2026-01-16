import { createClient } from '@supabase/supabase-js';

// These should be set as environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      packages: {
        Row: {
          id: string;
          title: string;
          destination: string;
          duration: string;
          price: number;
          image_url: string;
          description: string;
          max_travelers: number;
          status: 'published' | 'draft';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['packages']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['packages']['Insert']>;
      };
      cars: {
        Row: {
          id: string;
          name: string;
          brand: string;
          model: string;
          price_per_day: number;
          image_url: string;
          fuel_type: string;
          seats: number;
          transmission: string;
          features: string[];
          status: 'published' | 'draft';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cars']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['cars']['Insert']>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contact_messages']['Row'], 'id' | 'created_at'>;
      };
    };
  };
}

