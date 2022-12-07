import MainPage from './components/mainPage';
import React, {useEffect, useState} from 'react'
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from './components/Login';
import Signup from './components/signup';
import Signin from './components/signin';
import ForgotPassword from './components/ForgotPassword';
import Verify from './components/verify';
import Admin from './components/admin';
import Copyright from './components/copyright';
import Policies from './components/policies';
import { AuthProvider } from './contexts/AuthContext';


function App() {
  return (
    <div>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route exact path="/" element={<MainPage/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route path="/register" element={<Signup/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/verify" element={<Verify/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/copyright" element={<Copyright/>}/>
          <Route path="/policies" element={<Policies/>}/>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
