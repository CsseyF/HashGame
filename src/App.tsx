import React from "react";
import { Route, Routes } from 'react-router-dom';
import "./App.css";
import Board from "./components/Board";
import GameScreen from './pages/GameScreen';
import Home from './pages/Home';

function App() {
  return (
    <div className="main">
      <Routes>
        <Route path='/' element={ <Home /> }/>
        <Route path='/:id' element={ <GameScreen /> }/>
      </Routes>
    </div>
  );
}

export default App;
