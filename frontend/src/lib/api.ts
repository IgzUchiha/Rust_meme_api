const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface Meme {
  id: number;
  caption: string;
  tags: string;
  image: string;
  user_id?: number;
  evm_address?: string;
  created_at?: string;
  likes: number;
  comment_count: number;
}

export interface UploadMemeData {
  caption: string;
  tags: string;
  image: File | string;
  evm_address?: string;
}

export async function getMemes(): Promise<Meme[]> {
  const response = await fetch(`${API_URL}/memes`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch memes');
  }
  
  return response.json();
}

export async function uploadMeme(data: UploadMemeData): Promise<Meme> {
  const formData = new FormData();
  formData.append('caption', data.caption);
  formData.append('tags', data.tags);
  
  if (data.image instanceof File) {
    formData.append('image', data.image);
  } else {
    formData.append('image_url', data.image);
  }
  
  if (data.evm_address) {
    formData.append('evm_address', data.evm_address);
  }

  const response = await fetch(`${API_URL}/memes`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload meme');
  }

  return response.json();
}

export async function likeMeme(memeId: number): Promise<Meme> {
  const response = await fetch(`${API_URL}/memes/${memeId}/like`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to like meme');
  }

  return response.json();
}
