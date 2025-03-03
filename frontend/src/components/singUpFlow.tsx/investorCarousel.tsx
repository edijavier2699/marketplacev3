import investor1 from "../../assets/investor1.webp"
import investor2 from "../../assets/investor2.webp"
import investor3 from "../../assets/investor3.svg"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';



export const InvestorCarousel = () => {
    const slides = [
      {
        title: 'Explore Investment Opportunities!',
        description: 'Browse our marketplace to discover your next commercial real estate investment.',
        imageUrl: investor3,
      },
      {
        title: 'Invest with Ease.',
        description: 'Buy equity in returns-optimised assets with just a few clicks. We take care of everything—from legal documentation to tax and payment processing.',
        imageUrl: investor2,
      },
      {
        title: 'Enjoy Flexibility and Liquidity',
        description: 'No lock-ins. Sell your investment anytime on the secondary market and withdraw your capital instantly. It’s that simple.',
        imageUrl: investor1,
      },
    ];
  
    return (
      <article className="p-6 min-w-[800px] flex flex-col w-full custom-landing-carousel">
        <h4 className="font-bold text-2xl mb-[40px] text-left">I am an accredited investor,</h4>
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
      </article>
    );
  };
  