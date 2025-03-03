import { Button } from '@/components/ui/button';
import singUpOwner3 from "../../assets/singUpOwner3.webp";
import singUpOwner2 from "../../assets/singUpOwner2.webp";
import singUpOwner1 from "../../assets/singUpOwner1.webp";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface OwnerFlowCarouselProps {
    onConfirm: () => void;
}

export const OwnerFlowCarousel = ({ onConfirm }: OwnerFlowCarouselProps) => {
    const slides = [
        {
            title: 'List Your Property Effortlessly!',
            description: 'Create your first listing to sell partial or full equity in just a few minutes.',
            imageUrl: singUpOwner1
        },
        {
            title: 'Simplify Your Management.',
            description: 'Everything in one place. We manage the legal paperwork, tax implications, and payment processing.',
            imageUrl: singUpOwner2
        },
        {
            title: 'Instant Withdraw',
            description: 'Cash out instantly with no delays. It’s seamless, straightforward, and built for your needs.',
            imageUrl: singUpOwner3
        },
    ];

    const handleConfirm = () => {
        onConfirm(); // Llama a la función onConfirm pasada como prop
    };

    return (
        <article className="w-full space-y-5 flex flex-col">
            <Carousel  className="overflow-hidden"> {/* overflow-hidden para evitar desbordes */}
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div className='text-center'>
                                <h2 className="text-2xl font-semibold mb-2">{slide.title}</h2>
                                <p className="text-gray-600 mb-6">{slide.description}</p>
                                <div className="flex h-[450px] w-[80%] mx-auto justify-center">
                                    <img
                                        src={slide.imageUrl}
                                        alt={slide.title}
                                        className="object-cover h-[100%] rounded-lg"  // Asegurando que la imagen se ajuste correctamente
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <Button onClick={handleConfirm}>Confirm</Button>
        </article>
    );
};
