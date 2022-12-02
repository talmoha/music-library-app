import MainPage from './components/mainPage';
import React, {useEffect, useState} from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './components/Login';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route exact path="/" element={<MainPage/>}/>
        <Route exact path="/login" element={<Login/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
