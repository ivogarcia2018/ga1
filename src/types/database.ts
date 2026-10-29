export type Photo = {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  storage_path: string;
  category: string;
  tags: string[];
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
};

export type PhotoCategory = 'geral' | 'paisagem' | 'retrato' | 'arquitetura' | 'natureza' | 'urbano';
