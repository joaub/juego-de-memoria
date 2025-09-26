import { useState, useEffect } from 'react'


function App() {
  const [flipped, setFlipped] = useState([]);
  const [image, setImage] = useState([]);

  useEffect(() => {
    async function loadPokemons() {
      const ids = Array.from({ length: 6 }, () => Math.floor(Math.random() * 151) + 1);
      const data = await Promise.all(
        ids.map(id =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(res => res.json())
        )
      );
      setImage(data);
      setFlipped(Array(data.length).fill(false));

    }
    loadPokemons();
  }, []);


  const handleClick = () => {
    setFlipped(prev => !prev);
  };



  return (
    <>

      <div className="min-h-screen bg-gray-200 flex flex-col items-center p-4">
        <h1 className='text-2xl font-bold mb-6'>Juego de la Memoria</h1>
        <div>
          <div>
            <button className='rounded-xl p-4' onClick={handleClick}>
              {flipped ? image && <img className='w-20 h-20' src={image} alt="Venusaur" /> : <p>vuelta</p>}
            </button>
          </div>
          <div>
            <button className='rounded-xl p-4' onClick={handleClick}>
              {flipped ? image && <img className='w-20 h-20' src={image} alt="Venusaur" /> : <p>vuelta</p>}
            </button>
          </div>
        </div>


      </div>

    </>
  )
}

export default App
