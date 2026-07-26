'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/lib/imageCompression';

interface CategoryFormProps {
  initialData?: { name: string; imageUrl?: string };
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export default function CategoryForm({ initialData, onSubmit, isLoading }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      if (initialData.name) setName(initialData.name);
      if (initialData.imageUrl) setPreviewUrl(initialData.imageUrl);
    }
  }, [initialData]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file);
        setImageFile(compressedFile);
        setPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label className="form-label" htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Image</label>
        <div className="image-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          {previewUrl && (
            <div className="image-preview" style={{ marginTop: '1rem', position: 'relative', width: '200px', height: '200px' }}>
              <img src={previewUrl} alt="Preview" style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '8px' }} />
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Category'}
      </button>
    </form>
  );
}
