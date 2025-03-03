import { Skeleton } from "@/components/ui/skeleton"; // Asegúrate de que la ruta sea correcta

export const MarketplaceSkeleton = () => {
  return (
    <div className="space-y-6 px-[20px] lg:px-[60px]">
      {/* Banner skeleton */}
      <Skeleton className="rounded-lg mt-5 h-[200px] w-full" />



      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-4 mt-6">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Cards skeleton - rows of 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(4)].map((_, index) => (
          <article key={index} className="relative rounded-lg mt-6">
            {/* Badge skeleton */}
            <Skeleton className="absolute left-4 top-[215px] h-6 w-16 rounded-full" />
            <Skeleton className="absolute top-4 left-4 h-6 w-16 rounded-full" />

            {/* Carousel skeleton */}
            <div className="h-64 relative block">
              <Skeleton className="w-full h-full rounded-md" />
            </div>

            <div className="py-3">
              {/* Status and tokens left skeleton */}
              <div className="flex items-center justify-end mb-1">
                <Skeleton className="h-4 w-24" />
              </div>

              {/* Title skeleton */}
              <Skeleton className="h-6 w-3/4 mb-2" />

              {/* Location skeleton */}
              <Skeleton className="h-4 w-1/2 mb-4" />

              {/* Price and min token skeleton */}
              <div className="flex justify-between mb-2">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>

              {/* Est. annual returns skeleton */}
              <div className="flex justify-between">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};