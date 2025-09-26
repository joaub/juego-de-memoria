import { useState, useEffect } from 'react'


function App() {
  const [flipped, setFlipped] = useState([]);
  const [image, setImage] = useState([]);

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/3`)
      .then((response) => {
        if (!response.ok) throw new Error("Pokémon no encontrado");
        return response.json();
      })
      .then((data) => {
        setImage(data.sprites.other.dream_world.front_default);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


  const handleClick = () => {
    setFlipped(prev => !prev);
  };



  return (
    <>

      <div className='bg-gray-200 flex flex-col justify-center h-screen'>
        <h1 className='text-2xl font-bold'>Juego de la Memoria</h1>
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
