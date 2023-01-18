import React from 'react'
import { GameColor } from '../../../../global/colors'
import { useNavigate } from "react-router-dom";
import './style.css'

interface ModalProps {
  palette: GameColor
}

const HomeModal = (props : ModalProps) => {
  let history = useNavigate();
  const handleStartMatch = () => {
    var id = (Math.random() + 1).toString(36).substring(7);
    history(`/${id}`)
  }
  return (
    <div className='home-modal-container' style={{backgroundColor: props.palette.LIGHT}}>
      <h1
        className='game-title'
        style={{color: props.palette.DARK}}
      >
        HashGame.io
      </h1>
      <div className='home-modal-about-container'>
        <p
          className='home-modal-about-text'
          style={{color: props.palette.DARK}}
        >
          Jogue o famoso jogo da velha
          com seus amigos em uma partida online!
        </p>
      </div>
      <div className='home-modal-buttons-container'>
        <button
          className='home-modal-button'
          style={{backgroundColor: props.palette.DARK}}
          onClick={handleStartMatch}
        >
          Iniciar uma partida 
        </button>
        <button
          className='home-modal-button'
          style={{backgroundColor: props.palette.DARK}}
        >
          Entrar numa partida existente
        </button>
      </div>
    </div>
  )
}

export default HomeModal