import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="mb-6 flex space-x-6">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="w-24 transition duration-300 hover:scale-110" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-24 transition duration-300 hover:scale-110" alt="React logo" />
        </a>
      </div>

      <h1 className="mb-4 text-4xl font-extrabold text-blue-400">Vite + React + TailwindCSS</h1>

      <div className="w-80 rounded-lg bg-gray-800 p-6 text-center shadow-lg">
        <p className="mb-4 text-lg">Clique sur le bouton pour augmenter le compteur :</p>
        <button onClick={() => setCount(count + 1)} className="rounded-lg bg-blue-500 px-6 py-2 font-bold text-white transition duration-300 hover:bg-blue-600">
          Compteur : {count}
        </button>
        <p className="mt-4 text-sm text-gray-400">
          Édite <code className="rounded bg-gray-700 p-1">src/App.tsx</code> et sauvegarde pour voir les changements !
        </p>
      </div>

      <p className="mt-6 text-sm text-gray-500">Clique sur les logos pour en savoir plus</p>
    </div>
  );
}

export default App;
