"use client";
import { Game } from '@/game/main'
import { useEffect, useRef } from 'react';

export default function Home() {
  const gameContainer = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if(!gameContainer.current) return;
    const game = new Game(gameContainer.current!);
    game.instance.start();
  }, []);

  return (
    <main>
      <canvas id="game" ref={gameContainer}></canvas>

    </main>
  )
}
