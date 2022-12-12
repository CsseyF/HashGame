import React from "react";
import { Route, Routes } from 'react-router-dom';
import "./App.css";
import Board from "./components/Board";
import Home from './pages/Home';

function App() {
  return (
    <div className="main">
      <Routes>
        <Route path='/:id' element={ <Home/> }/>
      </Routes>
    </div>
  );
}

export default App;
