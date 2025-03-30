import Image from "next/image";
import imageLoader from "../resume/helper_function/helper_function";
export default function Games() {
    return (
      
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">My Games</h1>
          <div className="relative w-96 h-64 mb-8">
            <Image
              src={imageLoader("/images/miscellaneous/under-construction.jpg")}
              alt="Coming Soon"
              layout="fill"
              objectFit="contain"
            />

          </div>
          <p className="text-lg text-gray-600 mb-4">
            This section is currently under construction. Please check back later!
          </p>
          <p className="text-sm text-gray-500">
            I am working hard to bring you some awesome games, mostly simple ones.
          </p>
      </div>
    );
  }