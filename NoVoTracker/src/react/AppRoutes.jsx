import React from 'react'

import { Route, Routes, Navigate } from 'react-router-dom'

import Home from './Pages/Home/Home'
import Pantry from './Pages/Pantry/Pantry'
import EmergencyList from './Pages/EmergencyList/EmergencyList'
import Settings from './Pages/Settings/Settings'
import Test from './Pages/Test'

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path="/home" element={<Home />} />
    <Route path="/pantry" element={<Pantry />} />
    <Route path="/emergency" element={<EmergencyList />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/test" element={<Test />} />
  </Routes>
)

export default AppRoutes
