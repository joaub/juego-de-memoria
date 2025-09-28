import { useState, useEffect } from 'react'


function App() {
  const [flipped, setFlipped] = useState([]);
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    async function loadPokemons() {
      const ids = Array.from({ length: 8}, () => Math.floor(Math.random() * 151) + 1);
      const data = await Promise.all(
        ids.map(id =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(res => res.json())
        )
      );
      setPokemons(data);
      setFlipped(Array(data.length).fill(false));

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
        <div>
            {pokemons.map((poke, i) => ( 
              <button key={poke.id}
              onClick={() => handleClick(i)} className='rounded-xl p-4' >
              {flipped[i] ? (
              <img
                src={poke.sprites.other["official-artwork"].front_default}
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
