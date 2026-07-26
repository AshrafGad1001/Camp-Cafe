'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/lib/imageCompression';
import { Category } from '@/types';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch } from '@mui/material';

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
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        margin="normal"
        id="name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        id="description"
        label="Description"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        id="price"
        label="Price"
        type="number"
        slotProps={{ htmlInput: { step: "0.01" } }}
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value) || '')}
        required
      />

      <FormControl fullWidth margin="normal" required>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          value={categoryId}
          label="Category"
          onChange={(e) => setCategoryId(e.target.value as string)}
        >
          {categories.map((cat: any) => (
            <MenuItem key={cat._id || cat.id} value={cat._id || cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mt: 2 }}>
        <FormControlLabel 
          control={
            <Switch 
              checked={isAvailable} 
              onChange={(e) => setIsAvailable(e.target.checked)} 
            />
          } 
          label="Available" 
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button component="label" variant="outlined">
          Upload Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </Button>
        {previewUrl && (
          <Box sx={{ mt: 2, position: 'relative', width: '200px', height: '200px' }}>
            <img src={previewUrl} alt="Preview" style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '8px' }} />
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Menu Item'}
        </Button>
      </Box>
    </Box>
  );
}
