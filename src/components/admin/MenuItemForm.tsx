'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/lib/imageCompression';
import { Category } from '@/types';

interface MenuItemFormProps {
  categories: Category[];
  initialData?: {
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    imageUrl?: string;
  };
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export default function MenuItemForm({ categories, initialData, onSubmit, isLoading }: MenuItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price || '');
      setCategoryId(initialData.category || '');
      setIsAvailable(initialData.isAvailable ?? true);
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
    formData.append('description', description);
    formData.append('price', String(price));
    formData.append('category', categoryId);
    formData.append('isAvailable', String(isAvailable));
    
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
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea"
          rows={3}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || '')}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="category">Category</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="form-select"
          required
        >
          <option value="" disabled>Select a category</option>
          {categories.map((cat: any) => (
            <option key={cat._id || cat.id} value={cat._id || cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Available</label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
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
        {isLoading ? 'Saving...' : 'Save Menu Item'}
      </button>
    </form>
  );
}
