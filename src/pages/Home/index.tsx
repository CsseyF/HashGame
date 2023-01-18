import React, { useState } from 'react'
import * as C from '../../global/colors'
import HomeModal from './components/HomeModal'
import './style.css'

const Home = () => {
  const [color, setColor] = useState<C.GameColor>(C.IceCreamColor)
  return (
    <div className='home-container' style={{backgroundColor : color.HEAVY_DARK}}>
      <HomeModal palette={color}/>
      <div className='home-color-selector-container' style={{backgroundColor: color.LIGHT}}>
        <button
          className='home-color-selector-button'
          style={{backgroundColor: C.IceCreamColor.DARK}}
          onClick={() => setColor(C.IceCreamColor)}
        >
          Ice Cream
        </button>
        <button
          className='home-color-selector-button'
          style={{backgroundColor: C.MistColor.DARK}}
          onClick={() => setColor(C.MistColor)}
        >
          Mist
        </button>
        <button
          className='home-color-selector-button'
          style={{backgroundColor: C.SpaceHazeColor.DARK}}
          onClick={() => setColor(C.SpaceHazeColor)}
        >
          Space Haze
        </button>
        <button
          className='home-color-selector-button'
          style={{backgroundColor: C.LollipopColor.DARK}}
          onClick={() => setColor(C.LollipopColor)}
        >
          Lollipop
        </button>
      </div>
    </div>
  )
}

export default Home