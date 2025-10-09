import { useState, useEffect } from 'react'

const click = new Audio('/click.mp3');
const match = new Audio('/match.mp3');
const lose = new Audio('/perder.mp3');
const win = new Audio('/winning.mp3');

const TYPES = ["fire", "water", "grass", "electric", "psychic", "rock",
  "bug", "ghost", "ice", "dragon", "dark", "fighting", "flying",
  "ground", "poison", "steel", "normal"];

function App() {
  const [flipped, setFlipped] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60); // Tiempo inicial en segundos
  const [gameOver, setGameOver] = useState(false);
  const [levelReady, setLevelReady] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [showMessage, setShowMessage] = useState(false);
  const [winMessage, setWinMessage] = useState(false);


  async function getPokemonType(type, count) {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    const data = await res.json();

    const selected = data.pokemon
      .map(p => p.pokemon.url)
      .sort(() => Math.random() - 0.5)
      .slice(0, count * 3); // margen extra por si algunos > 494

    const details = await Promise.all(
      selected.map(url => fetch(url).then(res => res.json()))
    );

    return details.filter(p => p.id <= 721).slice(0, count);
  }

  useEffect(() => {
    async function loadPokemons() {
      // 🧩 Más pares en difícil
      const baseCount = level + 2;
      const count = difficulty === "hard" ? baseCount + 2 : baseCount;
      let data = [];


      let choseDifficulty = difficulty;
      if (difficulty === "hard") {
        const randomIndex = Math.floor(Math.random() * TYPES.length);
        choseDifficulty = TYPES[randomIndex];
        console.log("Tipo elegido aleatoriamente:", choseDifficulty);
      }
      if (difficulty === "easy") {
        let ids = [];
        while (ids.length < count) {
          const randomId = Math.floor(Math.random() * 721) + 1;
          if (!ids.includes(randomId)) ids.push(randomId);
        }
        data = await Promise.all(
          ids.map(id =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
              .then(res => res.json())
          )
        );
      } else {
        data = await getPokemonType(choseDifficulty, count);
      }


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
      setTimeLeft(difficulty === "hard" ? 45 : 60); // Reiniciar el tiempo
      setGameOver(false);
      setLevelReady(true);

    }
    loadPokemons();
  }, [level, difficulty]);

  // ⏳ Temporizador
  useEffect(() => {
    if (gameOver || !levelReady) return; // no iniciar si el juego terminó

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          lose.play();
          setWinMessage(false);
          setShowMessage(true);
          return 0;
        }
        return prev - 1;

      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level, gameOver, levelReady]);


  const handleClick = (index) => {
    // no permitir más de 2 a la vez, ni cartas ya resueltas
    if (
      gameOver ||                      // si terminó el juego
      flipped.includes(index) ||        // si ya está volteada
      pokemons[index].matched ||        // si ya está encontrada
      flipped.length === 2              // si ya hay dos volteadas
    ) return;
    click.play();
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
        match.play();
        setFlipped([]);
      } else {
        //  No son iguales → esperar 1 seg y cerrarlas
        setTimeout(() => setFlipped([]), 1000);
      }
    }

    const allMatched = pokemons.length > 0 && pokemons.every(p => p.matched);
    // ✅ cuando se completan todos los pares
    if (allMatched && levelReady) {
      setTimeout(() => {
        setWinMessage(true);
        setShowMessage(true);
        win.play();

      }, 800);
    }
  }, [flipped, pokemons, levelReady, level]);


  return (
    <>

      <div className="min-h-screen bg-blue-400 flex flex-col items-center p-4">
        <h1 className='text-2xl font-bold mb-6'>Juego de la Memoria</h1>
        {/* Selector de dificultad */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <button onClick={() => setDifficulty("easy")} className={`px-3 py-1 rounded ${difficulty === "easy" ? "bg-green-400" : "bg-gray-300"}`}>Fácil 🟢</button>
          <button onClick={() => setDifficulty("hard")} className={`px-3 py-1 rounded ${difficulty === "hard" ? "bg-red-400" : "bg-gray-300"}`}>dificil 🔴</button>
        </div>
        <p className="mb-6">Pares encontrados: {score}</p>
        <p className={`font-bold ${timeLeft <= 10 ? "text-red-500 scale-110 animate-pulse" : "text-black"}`}>quedan : <span >{timeLeft}</span> s</p>
        {gameOver && <p className="text-red-600 text-lg mb-4">¡Tiempo agotado!</p>}

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
          {pokemons.map((poke, i) => {
            const isFlipped = flipped.includes(i) || poke.matched;
            return (
              <button key={poke.uid}
                onClick={() => handleClick(i)}
                className="w-18 h-22 sm:w-24 sm:h-28 md:w-28 md:h-32 bg-white border rounded-xl shadow-md flex  items-center justify-center transition duration-300 ease-in  hover:scale-110" >
                {isFlipped ? (
                  <img
                    src={poke.img}
                    alt={poke.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24  object-contain" />) : (
                  <span className="text-3xl sm:text-4xl md:text-5xl">❓</span>
                )}
              </button>
            )
          })}

        </div>
        <p className="mt-6">Nivel: {level} / 6</p>
        {gameOver && <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => { setLevel(1), setLevelReady(false), setGameOver(false) }}>Reiniciar Juego</button>}
        {showMessage && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
            <div
              className={`rounded-3xl shadow-2xl p-8 text-center animate-fade-in border-4 ${winMessage ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                }`}
            >
              <div className="text-6xl mb-4">{winMessage ? '🎉' : '💀'}</div>

              <h2
                className={`text-3xl font-extrabold mb-3 ${winMessage ? 'text-green-700' : 'text-red-700'
                  }`}
              >
                {winMessage ? '¡Has ganado!' : '¡Has perdido!'}
              </h2>

              <p className="text-gray-700 mb-6 text-lg">
                {winMessage
                  ? `¡Excelente memoria, Entrenador Pokémon! Nivel ${level} completado.`
                  : 'Se acabó el tiempo, intenta otra vez.'}
              </p>

              <button className='border border-black rounded-full px-6 py-2 font-bold hover:bg-black hover:text-white transition'
                onClick={() => {
                  setShowMessage(false);

                  if (winMessage) {
                    // 🟢 Ganó → pasa de nivel
                    if (level < 6) {
                      setLevel(prev => prev + 1);
                      setLevelReady(false);
                      setGameOver(false);
                    } else {
                      // 🎯 Nivel máximo → mostrar opción de reinicio
                      setGameOver(true);
                    }
                  } else {
                    // 🔴 Perdió → mantener estado de "gameOver" para mostrar el botón de reiniciar
                    setGameOver(true);
                  }
                }}
              >
                Continuar
              </button>
            </div>


          </div>
        )}

      </div>

    </>
  )
}

export default App
