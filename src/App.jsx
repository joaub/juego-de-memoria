import { useState, useEffect } from 'react'


function App() {
  const [flipped, setFlipped] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);


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

    }
    loadPokemons();
  }, [level]);


  const handleClick = (index) => {
    // no permitir más de 2 a la vez, ni cartas ya resueltas
    if (
      flipped.length < 2 &&
      !flipped.includes(index) &&
      !pokemons[index].matched
    ) {
      setFlipped(prev => [...prev, index]);
    }
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
        <button >queda</button>
        <div className="grid grid-cols-4 gap-4">
          {pokemons.map((poke, i) => {
            const isFlipped = flipped.includes(i) || poke.matched;
            return (
              <button key={poke.uid}
                onClick={() => handleClick(i)} className='rounded-xl p-4' >
                {isFlipped ? (
                  <img
                    src={poke.img}
                    alt={poke.name}
                    className="w-28 h-28 object-contain" />) : (
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
