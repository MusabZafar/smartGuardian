import React from 'react'
import 'animate.css';
const Header = ( { bgColor , textColorClass , option1,option2,option3,option4 }) => {
  return (
  

    // background: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(0,0,0,1) 95%);

    // style={{ 
    //   // background: 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 23%, rgba(255,255,255,1) 100%)' 
    // }}

    // ${bgColorClass} use this approunch when passing tailwind clases as a prop

    <div className='flex w-full animate__animated animation-duration:3s animate__delay-1s animate__bounceInDown shadow-lg' style={{ backgroundColor: bgColor }}>
    <header className="flex flex-row items-center justify-between w-full p-3" >
      <div className={`flex flex-row items-center ${textColorClass}`}>
        <p className="md:ml-4 text-lg md:text-3xl font-extrabold">Smart Guardian</p>
      </div>
      <div className={`${textColorClass}`}>
        <button className="mx-4 p-2  hover:bg-white hover:text-black ease-in-out  duration-300 font-bold">
          {option1}
        </button>
        <button className="mx-4 p-2   hover:bg-white hover:text-black ease-in duration-300 font-bold">
          {option2}
        </button>
        <button className="mx-4 p-2   hover:bg-white hover:text-black ease-in duration-300 font-bold">
          {option3}
        </button>
        <button className="mx-4 p-2   hover:bg-white hover:text-black ease-in duration-300 font-bold">
          {option4}
        </button>
       
      </div>
    </header>
  </div>
  
  )
}

export default Header
