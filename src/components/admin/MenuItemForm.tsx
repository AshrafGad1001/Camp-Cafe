'use client';

import { useState, useEffect } from 'react';
import { compressImage } from '@/lib/imageCompression';
import { Category } from '@/types';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Typography } from '@mui/material';

interface MenuItemFormProps {
  categories: Category[];
  initialData?: {
    name: string;
    description: string;
    price: number;
    category: string;
    isAvailable: boolean;
    isBestSeller?: boolean;
    hasSizes?: boolean;
    sizes?: { name: string; price: number }[];
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
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [hasSizes, setHasSizes] = useState(false);
  const [sizes, setSizes] = useState<{name: string, price: number | ''}[]>([
    { name: 'S', price: '' },
    { name: 'M', price: '' },
    { name: 'L', price: '' },
    { name: 'XL', price: '' },
  ]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price || '');
      setCategoryId(initialData.category || '');
      setIsAvailable(initialData.isAvailable ?? true);
      setIsBestSeller(initialData.isBestSeller ?? false);
      setHasSizes(initialData.hasSizes ?? false);
      if (initialData.sizes && initialData.sizes.length > 0) {
        const baseSizes = [
          { name: 'S', price: '' as number | '' },
          { name: 'M', price: '' as number | '' },
          { name: 'L', price: '' as number | '' },
          { name: 'XL', price: '' as number | '' },
        ];
        initialData.sizes.forEach(s => {
          const index = baseSizes.findIndex(b => b.name === s.name);
          if (index !== -1) {
            baseSizes[index].price = s.price;
          } else {
            baseSizes.push({ name: s.name, price: s.price });
          }
        });
        setSizes(baseSizes);
      }
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
    
    let validSizes: any[] = [];
    if (hasSizes) {
      validSizes = sizes.filter(s => s.name && s.price !== '' && Number(s.price) > 0);
    } else {
      formData.append('price', String(price));
    }
    
    formData.append('hasSizes', String(hasSizes));
    formData.append('sizes', JSON.stringify(validSizes));
    
    formData.append('category', categoryId);
    formData.append('isAvailable', String(isAvailable));
    formData.append('isBestSeller', String(isBestSeller));
    
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    try {
      await onSubmit(formData);
    } catch (error) {
      // Revert the Best Seller toggle if it fails (e.g. limit reached)
      if (isBestSeller) {
        setIsBestSeller(false);
      }
    }
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

      <Box sx={{ mt: 2 }}>
        <FormControlLabel 
          control={
            <Switch 
              checked={hasSizes} 
              onChange={(e) => setHasSizes(e.target.checked)} 
            />
          } 
          label="Multiple Sizes (S, M, L, XL)" 
        />
      </Box>

      {!hasSizes ? (
        <TextField
          fullWidth
          margin="normal"
          id="price"
          label="Price"
          type="number"
          slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
          value={price}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setPrice(isNaN(val) ? '' : Math.max(0, val));
          }}
          required={!hasSizes}
        />
      ) : (
        <Box sx={{ mt: 1, mb: 2, p: 2, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>Enter prices for available sizes (leave empty if unavailable):</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2 }}>
            {sizes.map((size, index) => (
              <TextField
                key={size.name}
                label={`Price (${size.name})`}
                type="number"
                slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
                value={size.price}
                onChange={(e) => {
                  const newSizes = [...sizes];
                  const val = parseFloat(e.target.value);
                  newSizes[index].price = isNaN(val) ? '' : Math.max(0, val);
                  setSizes(newSizes);
                }}
              />
            ))}
          </Box>
        </Box>
      )}

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
        <FormControlLabel 
          control={
            <Switch 
              checked={isBestSeller} 
              onChange={(e) => setIsBestSeller(e.target.checked)} 
              color="warning"
            />
          } 
          label={
            <Typography sx={{ fontWeight: 'bold', color: isBestSeller ? 'warning.main' : 'inherit' }}>
              Best Seller (الأكثر مبيعاً)
            </Typography>
          } 
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
