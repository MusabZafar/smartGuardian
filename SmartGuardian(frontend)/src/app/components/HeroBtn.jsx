import React from 'react'
import '../../styles/HeroBtn.css'
import Link from 'next/link'

function HeroBtn(){
  return (
   /* From Uiverse.io by ShrinilDhorda */ 
<button className="btn">
  <Link href="/register"> Get Started </Link>
</button>


  )
}

export default HeroBtn
