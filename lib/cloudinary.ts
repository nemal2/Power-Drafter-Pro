import axios from 'axios';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
}

export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset!);
  
  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export function buildCloudinaryUrl(publicId: string, width?: number, height?: number): string {
  let transformations = '';
  
  if (width || height) {
    transformations = `/c_fill,${width ? `w_${width},` : ''}${height ? `h_${height}` : ''}`;
  }
  
  return `https://res.cloudinary.com/${cloudName}/image/upload${transformations}/${publicId}`;
}
