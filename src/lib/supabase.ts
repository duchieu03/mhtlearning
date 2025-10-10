import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Document {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  document_id: string;
  status: 'pending' | 'completed' | 'cancelled';
  payment_qr_code: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
}
