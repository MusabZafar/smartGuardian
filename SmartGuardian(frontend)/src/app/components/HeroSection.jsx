import React from 'react'
import Image from "next/image";
// import logo from "/public/letter-x.png";
import AnimatedLogo from './AnimatedLogo';
import HeroBtn from './HeroBtn';
import Header from './Header';
// import '../Animations/AnimateDIv'
import 'animate.css';


const HeroSection = () => {
  return (
    // style={{ background: ' linear-gradient(90deg, rgba(0,0,0,1) 28%, rgba(177,152,152,1) 48%, rgba(1,1,1,1) 69%)' }}
    // background-image: linear-gradient(-225deg, #FFFEFF 0%, #D7FFFE 100%);
    // style={{backgroundImage: 'linear-gradient(to top, #7028e4 0%, #e5b2ca 100%)'}}

    <section className="relative w-full h-screen bg-cover bg-center animate__animated animate__fadeIn animation-duration:3s bg-slate-950"  >
        

        {/* Header start */}
          <Header bgColor="bg-slate-950" textColorClass="text-white" option1="Getting Started" option2="Support" option3="Login" option4="Sign up"/>
        {/* Header End */}


        <div className="flex flex-row items-center justify-evenly top-32  relative">
        <div className="flex justify-start flex-col relative left-20 ">
          <p className="text-[90px] font-bold -mb-7 text-white animate__animated  animate__bounceInLeft animation-duration:3s animate__delay-1s">Grow Your Business</p>
          <p className="text-[90px]  mb-10 font-bold text-white animate__animated  animate__bounceInRight animation-duration:3s animate__delay-1s">With Smart Guardian</p>
          <div className='  animate__animated animation-duration:3s animate__delay-3s animate__shakeX '>
          <HeroBtn/>
          </div>
        </div>
        <div className="z-10 animate__animated  animation-duration:3s animate__delay-2s  animate__jackInTheBox">
          <AnimatedLogo/>
        </div>
      </div>

    
    </section>
  )
}

export default HeroSection
