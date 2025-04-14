'use client';
import Image from "next/image";
import drawingsData from "./data/drawings.json";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Indie_Flower } from 'next/font/google';

interface Drawing {
  src: string;
  alt?: string;
  description?: string;
}

const indieFlower = Indie_Flower({
  weight: '400',
  subsets: ['latin'],
});

export default function Drawings() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const totalImages = drawingsData?.length || 0;

  const nextImage = () => {
    if (totalImages === 0) return;
    setIsLoading(true);
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    if (totalImages === 0) return;
    setIsLoading(true);
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const currentDrawing: Drawing = drawingsData[currentImageIndex];


  useEffect(() => {
    setIsLoading(!loadedImages[currentImageIndex]);
  }, [currentImageIndex, loadedImages]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        prevImage();
      }
      if (event.key === 'ArrowLeft') { 
        nextImage();
      };
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextImage, prevImage]);


  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [index]: true
    }));

    if (index === currentImageIndex) {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <div className="flex-grow flex items-center justify-center p-4 overflow-hidden">
        <div
          id="description"
          className={`
              absolute top-5 left-5 sm:top-12 sm:left-12 lg:top-16 lg:left-16
              w-18vm sm:w-[18vw] lg:w-[20vw] xl:w-[25vw]
              h-auto min-h-[15vh] 
              z-10
              p-3 sm:p-4 lg:p-6 pt-6 sm:pt-8
              bg-yellow-50
              rounded-sm
              shadow-lg
              transform rotate-1
              ${indieFlower.className}
              xl:text-lg lg:text-sm sm:text-xs text-xs
              overflow-y-auto
              before:content-['']
              before:absolute
              before:top-0
              before:left-1/2
              before:-translate-x-1/2
              before:w-8 sm:before:w-12
              before:h-3 sm:before:h-4
            `}
        >
          <p className="rotate-3">Notes :</p>
          {currentDrawing.description || "No description available"}
        </div>

        <div className="relative w-lg max-w-xs sm:max-w-sm lg:max-w-lg xl:max-w-2xl h-[50vh] sm:h-[60vh] lg:h-[70vh]">
          {isLoading && <LoadingSpinner />}

          {/* Deck Container */}
          <div className="relative w-full h-full">
            {drawingsData.map((drawing, index) => {
              const distance = Math.abs(index - currentImageIndex);

              // Handle wrapping distance for smoother transitions at the ends
              const wrappedDistance = Math.min(distance, totalImages - distance);
              const normalizedIndex = (index - currentImageIndex + totalImages) % totalImages;
              const adjustedIndex = normalizedIndex > totalImages / 2 ? normalizedIndex - totalImages : normalizedIndex;
              const angle = adjustedIndex * 60; // Degrees

              const opacity = Math.max(0, 1 - wrappedDistance * 0.25); // Less aggressive fade
              const scale = Math.max(0, 1 - wrappedDistance * 0.08); // Less aggressive scale
              const zIndex = 100 - wrappedDistance; // Higher zIndex for closer items
              const translateX = angle * 1.5; // Adjust multiplier for horizontal spread

              const isActive = index === currentImageIndex;

              const shouldRender = distance <= 2 || wrappedDistance <= 2;

              // Blur amount for non-active images
              const blurAmount = isActive ? 0 : Math.min(wrappedDistance * 2, 6);

              return shouldRender ? (
                <div key={drawing.src || index}>
                  <div
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{
                      zIndex: zIndex,
                      opacity: opacity,
                      transform: `
                      rotate(${isActive ? 0 : angle}deg)
                      translateX(${isActive ? 0 : translateX}px)
                      scale(${scale})
                    `,
                      transformOrigin: 'bottom center',
                      filter: `blur(${blurAmount}px)`,
                    }}
                  >
                    <Image
                      src={imageLoader(drawing.src)}
                      alt={drawing.alt || 'Drawing'}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 60vw, (max-width: 1280px) 50vw, 672px"
                      className="object-contain shadow-lg rounded-lg border-2 border-gray-300 mt-10"
                      priority={isActive}
                      onLoad={() => handleImageLoad(index)}
                      loading={isActive ? "eager" : "lazy"}
                    />
                  </div>
                </div>
              ) : null;
            })}
          </div>
          <button
            onClick={nextImage}
            className="absolute left-[-12px] sm:left-[-16px]  lg:left-[-32px] xl:left-[-40px] 
                      top-1/2 -translate-y-1/2 z-[110] 
                      bg-black/50 text-white 
                      p-2
                      rounded-full hover:bg-black/80 transition-colors 
                      disabled:opacity-50 cursor-pointer"
            aria-label="Previous Image"
            disabled={totalImages <= 1}
          >
            <FaArrowLeft className="text-sm sm:text-base lg:text-lg" />
          </button>
          <button
            onClick={prevImage}
            className="absolute right-[-12px] sm:right-[-16px]  lg:right-[-32px] xl:right-[-40px] 
                      top-1/2 -translate-y-1/2 z-[110] 
                      bg-black/50 text-white 
                      p-2 
                      rounded-full hover:bg-black/80 transition-colors 
                      disabled:opacity-50 cursor-pointer"
            aria-label="Next Image"
            disabled={totalImages <= 1}
          >
            <FaArrowRight className="text-sm sm:text-base lg:text-lg" />
          </button>
        </div>
      </div>
      <footer className="bg-gray-800 text-white p-3 sm:p-4 text-center mt-auto">
        <p className="text-xs sm:text-sm">
          Disclaimer: All images are for personal hobby use.
        </p>
      </footer>
    </div>
  );
}




// helper function

const LoadingSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center z-50">
    <div className="bg-white bg-opacity-70 rounded-full p-4">
      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
  </div>
)

const imageLoader = (src: string) => {
  return `${src}`;
}
