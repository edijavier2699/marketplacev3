import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface ShadcnCarouselProps {
  images: string[];
  title: string;
}

const CustomCarousel = ({ images, title }: ShadcnCarouselProps) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowControls(true)} // Mostrar controles al hacer hover
      onMouseLeave={() => setShowControls(false)} // Ocultar controles al salir
    >
      <Carousel className="h-full">
        <CarouselContent>
          {images.slice(0, 3).map((img, index) => (
            <CarouselItem key={index}>
              <img
                src={img}
                alt={`${title} image ${index + 1}`}
                className="w-full rounded-lg h-[250px] object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controles con transición suave */}
        <div
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 ${
            showControls ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <CarouselPrevious />
        </div>
        <div
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 ${
            showControls ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
};

export default CustomCarousel;
