 'use client';
import Image from "next/image";
import drawingsData from "./data/drawings.json"; // Import your JSON file
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import imageLoader from "../resume/helper_function/helper_function";


export default function Drawings() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = drawingsData.length;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl">
        <div className="relative w-full h-0 pb-[95%]">
          <Image
            src={imageLoader(drawingsData[currentImageIndex].src)}
            alt={`Drawing ${currentImageIndex + 1}`}
            sizes="(max-width: 950px) 200vw, 950px" 
            className="object-contain"
            priority
            fill
          />
          </div>
          <button
            onClick={prevImage}
            className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full  hover:opacity-80"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={nextImage}
            className="cursor-pointer  absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:opacity-80"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p className="text-sm">
          Disclaimer: All images on this page are for personal hobby use and are
          inspired by or referenced from Pinterest.
        </p>
      </footer>
    </div>
  );
}