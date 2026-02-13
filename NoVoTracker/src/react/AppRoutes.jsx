import React from 'react'

import { Route, Routes, Navigate } from 'react-router-dom'

import Home from './Pages/Home/Home'
import Pantry from './Pages/Pantry/Pantry'
import Test from './Pages/Test'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/home" element={<Home />} />
    <Route path="/pantry" element={<Pantry />} />
    <Route path="/test" element={<Test />} />
  </Routes>
)

export default AppRoutes
