import React from 'react'

import { Route, Routes, Navigate } from 'react-router-dom'

import Home from './Pages/Home/Home'
import Pantry from './Pages/Pantry/Pantry'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/home" element={<Home />} />
    <Route path="/pantry" element={<Pantry />} />
  </Routes>
)

export default AppRoutes
