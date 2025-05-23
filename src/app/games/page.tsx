import Link from 'next/link';
import Image from 'next/image';

interface Game {
  title: string;
  summary: string; // New field for the summarized description
  imagePath: string;
  link: string;
}

const GameCard: React.FC<Game> = ({ title, summary, imagePath, link }) => (
  <div className="border rounded-md w-full shadow-md p-4 flex flex-col bg-[var(--secondary1)]">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <div className="relative w-full h-60 mb-2 rounded-md overflow-hidden">
      <Image
        src={imagePath}
        alt={title}
        layout="fill"
        objectFit="cover"
        className="rounded-md"
      />
    </div>
    <div className="my-4">
      <p className="font-semibold">Note:</p>
      <p className="mb-4 text-gray-700 leading-relaxed">{summary}</p>
    </div>
    <Link
      href={link}
      className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 self-start"
    >
      Play Now
    </Link>
  </div>
);

const GamesPage = () => {
  const games: Game[] = [
    {
      title: 'Maze Search',
      summary:
        'Explore various pathfinding algorithms like BFS, DFS, Best-First Search, and A* in a maze. Compare the performance of TypeScript and Rust (Wasm) implementations with real-time timers. Reset the visualization to try different settings and observe how each algorithm navigates the maze.',
      imagePath: '/game/maze.png',
      link: '/games/maze',
    },
    {
      title: 'Conway\'s Game of Life',
      summary:
        'I initially implemented this project as a pure React application, and I vividly recall my CPU fan working overtime/screaming! Now, I\'ve significantly improved performance by leveraging the power of WebAssembly (Wasm) with Rust. It\'s amazing how these four fundamental rules can give rise to incredibly complex and dynamic patterns.',
      imagePath: '/game/conway.png',
      link: '/games/conway-gol',
    }
    // Add more games with their summaries here
  ];


  return (
    <div 
    id="main"
    className="min-h-screen py-15 gap-16 font-[family-name:var(--font-geist-sans)]
        2xl:px-40 2xl:pb-20 // Adjusted 2xl bottom padding
        xl:py-30 xl:px-30 xl:pb-20 // Adjusted xl bottom padding
        sm:py-15 sm:px-35 sm:pb-10 // Adjusted sm bottom padding
        lg:px-20 lg:py-32 lg:pb-15 // Adjusted lg bottom padding
      ">
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Listing of Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-15">
        {games.map((game) => (
          <GameCard key={game.title} {...game} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default GamesPage;