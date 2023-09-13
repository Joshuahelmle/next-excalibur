"use client";
import { Game } from '@/game/Game'
import { NetworkClient } from '@/game/classes/NetworkClient';
import { ALL_SPRITES } from '@/game/classes/characterAnimations';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const gameContainer = useRef<HTMLCanvasElement>(null);

  const [color, setColor] = useState<keyof typeof ALL_SPRITES>('RED'); // TODO: use
  const [game, setGame] = useState<Game | null>(null); // TODO: use
  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setColor(e.target.value as keyof typeof ALL_SPRITES);
    gameContainer.current?.focus();
  }

  useEffect(() => {
    console.log('color changed', color);
    game?.player?.changeSkin(color);
    gameContainer.current?.focus();
  }, [color, game?.player]);

  useEffect(() => {
    if(!gameContainer.current) return;
    const game = new Game(gameContainer.current!);
    game.init();
    setGame(game);

  }, []);

  return (
    <main className='flex flex-col justify-center items-center h-full'>
      <canvas id="game" ref={gameContainer} tabIndex={0}></canvas>
      <select className='mt-4 w-full max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-4 bg-white sm:text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
       name="playerColor"
       id="playerColor" 
       defaultValue={'RED'}
       onChange={changeHandler}>
        {Object.keys(ALL_SPRITES).map((key) => (
          <option className="capitalize" key={key} value={key}>{key.toLowerCase()}</option>
        ))
        }
      </select>
    </main>
  )
}
