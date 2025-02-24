import { useState } from 'react';
import { Button } from '@/components/ui/button';

import reactLogo from '@/assets/react.svg';
import viteLogo from '/vite.svg';

const Home = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
      <div className="mb-6 flex space-x-6">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="w-24 transform transition duration-300 hover:scale-110" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="w-24 transform transition duration-300 hover:scale-110" alt="React logo" />
        </a>
      </div>

      <h1 className="text-primary mb-4 text-4xl font-extrabold">Vite + React</h1>

      <div className="bg-card w-80 rounded-lg p-6 text-center shadow-lg">
        <p className="mb-4 text-lg">Clique sur le bouton pour augmenter le compteur :</p>

        <Button onClick={() => setCount(count + 1)} className="hover:bg-primary-foreground text-accent-foreground bg-background rounded-lg px-4 py-2 transition">
          Compteur : {count}
        </Button>

        <p className="text-muted-foreground mt-4 text-sm">
          Édite <code className="bg-muted rounded p-1">src/App.tsx</code> et sauvegarde pour voir les changements !
        </p>
      </div>

      <p className="text-muted-foreground mt-6 text-sm">Clique sur les logos pour en savoir plus</p>
    </div>
  );
};

export default Home;
