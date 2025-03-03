import React from 'react';
import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/property/imageUploader';
import ImageGallery from '@/components/property/imageGallery';
import { Button } from '@/components/ui/button';

interface PropertyDetailsFormProps {
  formValues: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImagesUploaded: (urls: string[]) => void;
  handleImageRemoved: (publicId: string) => void;
  onNext: () => void;
}

export const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({
  formValues,
  handleChange,
  handleImagesUploaded,
  handleImageRemoved,
  onNext,
}) => {
  return (
    <form className="w-[70%] mx-auto">
      <h2 className="font-bold">Property Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
        {/* <label>
          <span className="block mb-1">Active</span>
          <Checkbox
            name="active"
            checked={formValues.active}
            onChange={handleChange}
          />
        </label> */}
        <label>
          <span className="block mb-1">Year Built</span>
          <Input
            type="number"
            name="year_built"
            value={formValues.year_built || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Title</span>
          <Input
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Location</span>
          <Input
            type="text"
            name="location"
            value={formValues.location}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Country</span>
          <Input
            type="text"
            name="country"
            value={formValues.country}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Property Type</span>
          <Input
            type="text"
            name="property_type"
            value={formValues.property_type}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Number of Bedrooms</span>
          <Input
            type="number"
            name="bedrooms"
            value={formValues.bedrooms || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Number of Bathrooms</span>
          <Input
            type="number"
            name="bathrooms"
            value={formValues.bathrooms || ''}
            onChange={handleChange}
          />
        </label>
        <label>
          <span className="block mb-1">Size (sq ft)</span>
          <Input
            type="number"
            name="size"
            value={formValues.size || ''}
            onChange={handleChange}
          />
        </label>
      </div>

      <h2 className="text-left font-bold">Image Uploader</h2>
      <ImageUploader
        onImagesUploaded={handleImagesUploaded}
        onImageRemoved={handleImageRemoved}
      />
      <h2 className="text-left font-bold mb-5">Property Images</h2>
      <ImageGallery images={formValues.image || []} />

      <label>
        <span className="block mb-1">Video URLs (comma-separated)</span>
        <Textarea
          name="video_urls"
          value={formValues.video_urls}
          onChange={handleChange}
        />
      </label>

      <label>
        <span className="block mb-1">Details</span>
        <Textarea
          name="details"
          value={formValues.details}
          onChange={handleChange}
        />
      </label>

      <Button onClick={onNext}>Next</Button>
    </form>
  );
};
