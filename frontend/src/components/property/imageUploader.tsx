import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '../ui/button';

const cloudName = 'dhyrv5g3w';
const uploadPreset = 'ptwmh2mt';

interface ImageFile {
  file: File;
  previewUrl: string;
  publicId?: string; 
}

interface ImageUploaderProps {
  onImagesUploaded: (urls: string[]) => void; 
  onImageRemoved: (publicId: string) => void; 
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded, onImageRemoved }) => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleFiles(Array.from(selectedFiles));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      handleFiles(Array.from(droppedFiles));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const filePreviews = newFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setFiles((prevFiles) => [...prevFiles, ...filePreviews]);
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    
    // Si el archivo fue subido, elimínalo de Cloudinary
    if (fileToRemove.publicId) {
      deleteFromCloudinary(fileToRemove.publicId);
      onImageRemoved(fileToRemove.publicId); // Notifica al padre
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(url, { method: 'POST', body: formData });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Failed to upload image');
    }
  };

  const deleteFromCloudinary = async (publicId: string) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', 'your_api_key'); // Reemplaza con tu clave API de Cloudinary

    const response = await fetch(url, { method: 'POST', body: formData });
    if (!response.ok) {
      console.error('Failed to delete image from Cloudinary');
    }
  };

  const handleUpload = async () => {
    if (files.length > 0) {
      // Show loading toast
      toast({
        title: "Uploading...",
        description: "Your images are being uploaded, please wait.",
        variant: "default", // You can create a variant for loading in your toast component
      });

      try {
        const uploadPromises = files.map(async ({ file }) => {
          const data = await uploadToCloudinary(file);
          return data.secure_url; // Return the secure URL
        });
        const uploadedUrls = await Promise.all(uploadPromises);
        onImagesUploaded(uploadedUrls); // Pass the uploaded URLs to the parent
        
        // Clean up after upload
        setFiles([]); // Clear files after upload

        // Show success toast
        toast({
          title: "Success",
          description: "Your images have been uploaded!",
          variant: "default",
        });
      } catch (error) {
        console.error('Error uploading images:', error);

        // Show error toast
        toast({
          title: "Error",
          description: "Your images were not uploaded, try again!",
          variant: "destructive", // Use a different variant for errors
        });
      } 
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div
        className="flex flex-col justify-center items-center w-full max-w-lg p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow ease-in-out duration-300 cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="upload-file"
          name="uploaded-file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-file" className="text-center cursor-pointer">
          <p className="text-gray-500 font-medium">Click to upload or drag & drop multiple images</p>
          <p className="text-gray-400 text-sm mt-2">PNG, JPG, GIF up to 5MB</p>
        </label>
      </div>
      {files.length > 0 && (
        <Button
          className="mt-3 px-4 focus:outline-none transition-colors duration-300"
          onClick={handleUpload}
        >
          Save Images
        </Button>
      )}
      {files.length > 0 && (
        <div className="w-full max-w-4xl">
          <h2 className="font-bold text-gray-700 text-sm mb-4">Image Previews</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-gray-200 overflow-hidden shadow-sm"
              >
                <img
                  src={file.previewUrl}
                  alt={`Preview ${index}`}
                  className="object-cover w-full h-24"
                />
                <button
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  onClick={() => removeFile(index)}
                >
                  &times;
                </button>
                <p className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 text-white text-xs text-center py-1 truncate">
                  {file.file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
