import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: string[]; 
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  console.log(images);
  
  return (
    <section className="relative">
      <div className="relative flex flex-col items-center h-[50vh] md:h-[65vh]">
          {images && (
            <img
              src={images[0]}
              alt="First Property Image"
              className="object-cover w-full h-full rounded-xl"
            />
          )}   
          {/* <button 
              className=" absolute h-8 top-[10px] right-[10px]"
              onClick={() => onDelete(images[0])}
            >
              <XCircle/>
            </button>  */}
        </div>
        <div className="absolute bottom-[10px]  right-[10px] flex  items-center justify-end ">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">
                      <span className="sr-only">Open main menu</span>
                      <svg className="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="4" r="2" fill="currentColor" />
                        <circle cx="12" cy="4" r="2" fill="currentColor" />
                        <circle cx="20" cy="4" r="2" fill="currentColor" />
                        <circle cx="4" cy="12" r="2" fill="currentColor" />
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                        <circle cx="20" cy="12" r="2" fill="currentColor" />
                        <circle cx="4" cy="20" r="2" fill="currentColor" />
                        <circle cx="12" cy="20" r="2" fill="currentColor" />
                        <circle cx="20" cy="20" r="2" fill="currentColor" />
                      </svg>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[100%]">
                  <SheetHeader>
                      <SheetTitle className="mt-5">Property Images</SheetTitle>
                    </SheetHeader>
                  <div className="grid grid-cols-2 mt-5 gap-4">
                    {images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Property Image ${index + 2}`}
                        className="object-cover w-full h-40 rounded-lg"
                      />
                    ))}
                  </div>                
                  </SheetContent>
                </Sheet>
            </div>
          </section>
  );
};

export default ImageGallery;
