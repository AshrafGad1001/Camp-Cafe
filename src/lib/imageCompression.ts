import imageCompression from 'browser-image-compression';

const defaultOptions = {
  maxSizeMB: 0.25,
  maxWidthOrHeight: 800,
  useWebWorker: true,
  fileType: 'image/webp',
  initialQuality: 0.8
};

export const compressImage = async (file: File): Promise<File> => {
  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed, falling back to original file:', error);
    return file; // Fallback to original image if compression fails
  }
};
