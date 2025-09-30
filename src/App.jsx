import { useState, useEffect } from 'react'


function App() {
  const [flipped, setFlipped] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60); // Tiempo inicial en segundos
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    async function loadPokemons() {
      const count = level + 2; // 2 pares por nivel
      const ids = Array.from({ length: count }, () => Math.floor(Math.random() * 494) + 1);
      const data = await Promise.all(
        ids.map(id =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(res => res.json())
        )
      );
      // Creamos las cartas duplicadas
      const duplicated = data.flatMap(poke => [
        {
          uid: crypto.randomUUID(), name: poke.name,
          img: poke.sprites.other["official-artwork"].front_default,
          matched: false,
        },
        {
          uid: crypto.randomUUID(), name: poke.name,
          img: poke.sprites.other["official-artwork"].front_default,
          matched: false,
        },
      ]);

      // Mezclamos
      const shuffled = duplicated.sort(() => Math.random() - 0.5);

      setPokemons(shuffled);
      setFlipped([]);
      setScore(0);
      setTimeLeft(60); // Reiniciar el tiempo
      setGameOver(false);

    }
    loadPokemons();
  }, [level]);

  // ⏳ Temporizador
  useEffect(() => {

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          alert('¡Se acabó el tiempo! Intenta de nuevo.');
          return 0;
        }
        return prev - 1;

      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level]);


  const handleClick = (index) => {
    // no permitir más de 2 a la vez, ni cartas ya resueltas
    if (
      gameOver ||                      // si terminó el juego
      flipped.includes(index) ||        // si ya está volteada
      pokemons[index].matched ||        // si ya está encontrada
      flipped.length === 2              // si ya hay dos volteadas
    ) return;
    setFlipped(prev => [...prev, index]);
  };

  // 🔹 Comparar las dos cartas dadas vuelta
  useEffect(() => {

    if (flipped.length === 2) {
      const [firstIndex, secondIndex] = flipped;
      const firstCard = pokemons[firstIndex];
      const secondCard = pokemons[secondIndex];

      if (firstCard.name === secondCard.name) {
        //  Son iguales
        setScore(prev => prev + 1);
        setPokemons(prev =>
          prev.map((c, i) =>
            i === firstIndex || i === secondIndex
              ? { ...c, matched: true }
              : c
          )
        );
        setFlipped([]);
      } else {
        //  No son iguales → esperar 1 seg y cerrarlas
        setTimeout(() => setFlipped([]), 1000);
      }
    }

    // ✅ cuando se completan todos los pares
    if (score === pokemons.length / 2 && pokemons.length > 0) {
      setTimeout(() => {
        alert('¡Felicidades! Has encontrado todos los pares. Siguiente nivel.');
        setLevel(prev => prev + 1); // 🔥 sube el nivel
      }, 800);
    }
  }, [flipped, pokemons, score]);


  return (
    <>

      <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4">
        <h1 className='text-2xl font-bold mb-6'>Juego de la Memoria</h1>
        <p className="mb-6">Pares encontrados: {score}</p>
        <p >quedan : <span className="font-bold">{timeLeft}</span> s</p>
        {gameOver && <p className="text-red-600 text-lg mb-4">¡Tiempo agotado!</p>}

        <div className="grid grid-cols-6 gap-4">
          {pokemons.map((poke, i) => {
            const isFlipped = flipped.includes(i) || poke.matched;
            return (
              <button key={poke.uid}
                onClick={() => handleClick(i)}
                className="w-25 h-32 bg-white border rounded-xl shadow-md flex  items-center justify-center" >
                {isFlipped ? (
                  <img
                    src={poke.img}
                    alt={poke.name}
                    className="w-24 h-24 object-contain" />) : (
                  <span className="text-4xl">❓</span>
                )}
              </button>
            )
          })}

        </div>
      </div>

    </>
  )
}

export default App
