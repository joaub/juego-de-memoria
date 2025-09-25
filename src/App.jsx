import { useState } from 'react'


function App() {
  const [flipped, setFlipped] = useState(false);
  
  const handleClick = () => {
    setFlipped(prev => !prev);
  };

  return (
    <>
      <body className='bg-gray-200 flex justify-center items-center h-screen'>
        
          <h1 className='text-2xl font-bold'>Juego de la Memoria</h1>
          <table className='table-auto border-collapse  border-separate border-spacing-6'>
            <tr className='bg-blue-500 text-white rounded-xl '>
              <td className='p-2 border rounded-xl '>
                <button className='rounded-xl p-2' onClick={handleClick}>{flipped ? <p>hola</p> : <p>chau</p> }</button></td>
              <td className='p-2 border rounded-xl'>
                <button className='rounded-xl p-2'>card2</button></td>
            </tr>
            <tr className='bg-blue-500 text-white rounded-xl '>
              <td className='p-2 border rounded-xl'>
                <button className='rounded-xl p-2'>card3</button></td>
              <td className='p-2 border rounded-xl'>
                <button className='rounded-xl p-2'>card4</button></td>
            </tr>
            <tr className='bg-blue-500 text-white rounded-xl '>
              <td className='p-2 border rounded-xl'>
                <button className='rounded-xl p-2'>card5</button></td>
              <td className='p-2 border rounded-xl'>
                <button className='rounded-xl p-2'>card6</button></td>
            </tr>
            
            
          </table>
        
      </body>
    </>
  )
}

export default App
