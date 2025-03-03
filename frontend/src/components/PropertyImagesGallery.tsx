import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface PropertyImagesProps {
  images: string[];
}

export const PropertyImagesGallery = ({ images }:PropertyImagesProps) => {
  return (
    <div className="relative">
      {/* Vista para pantallas grandes */}
      <div className="hidden lg:flex flex-row h-[580px] gap-4">
        {/* Primera imagen */}
        <div className="w-1/2 flex justify-center items-center h-full">
          {images[0] && (
            <img
              src={images[0]}
              alt="First Property Image"
              className="object-cover w-full h-full rounded-tl-xl rounded-bl-xl"
            />
          )}
        </div>

        {/* Galería de imágenes en la segunda columna */}
        <div className="w-1/2 grid grid-cols-2 grid-rows-2 gap-4 h-full">
          {images.length > 1 && (
            <>
              <div className="h-full cover rounded-tr-xl">
                <img
                  src={images[1]}
                  alt="Property Image 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-full cover">
                <img
                  src={images[2]}
                  alt="Property Image 3"
                  className="w-full h-full object-cover rounded-tr-xl"
                />
              </div>
              <div className="h-full cover">
                <img
                  src={images[3]}
                  alt="Property Image 4"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-full cover rounded-br-xl">
                <img
                  src={images[4]}
                  alt="Property Image 5"
                  className="w-full h-full object-cover rounded-br-xl"
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Vista para pantallas pequeñas */}
      <div className="lg:hidden relative flex flex-col items-center h-[50vh] md:h-[65vh] gap-4">
        {images[0] && (
          <img
            src={images[0]}
            alt="First Property Image"
            className="object-cover w-full h-full rounded-xl"
          />
        )}    
      </div>
      <div className="relative bottom-14 right-0 px-[20px] flex px-2 items-center justify-end lg:hidden">
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
    </div>
  );
};