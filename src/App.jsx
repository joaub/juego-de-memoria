import { useState, useEffect } from 'react'


function App() {
  const [flipped, setFlipped] = useState([]);
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    async function loadPokemons() {
      const ids = Array.from({ length: 6 }, () => Math.floor(Math.random() * 494) + 1);
      const data = await Promise.all(
        ids.map(id =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(res => res.json())
        )
      );
      // Creamos las cartas duplicadas
       const duplicated = data.flatMap(poke => [
        { uid: crypto.randomUUID(), name: poke.name,
          img: poke.sprites.other["official-artwork"].front_default },
        { uid: crypto.randomUUID(), name: poke.name,
          img: poke.sprites.other["official-artwork"].front_default },
      ]);

      // Mezclamos
      const shuffled = duplicated.sort(() => Math.random() - 0.5);

      setPokemons(shuffled);
      setFlipped(Array(shuffled.length).fill(false));// una posición por carta

    }
    loadPokemons();
  }, []);


  const handleClick = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };



  return (
    <>

      <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4">
        <h1 className='text-2xl font-bold mb-6'>Juego de la Memoria</h1>
        <div className="grid grid-cols-4 gap-4">
            {pokemons.map((poke, i) => ( 
              <button key={poke.uid}
              onClick={() => handleClick(i)} className='rounded-xl p-4' >
              {flipped[i] ? (
              <img
                src={poke.img}
                alt={poke.name}
                className="w-28 h-28 object-contain"/> ): (
                <span className="text-4xl">❓</span>
              )}
            </button>
            ))}
          
        </div>
      </div>

    </>
  )
}

export default App
