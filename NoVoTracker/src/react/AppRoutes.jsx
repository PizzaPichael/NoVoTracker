import React from 'react'

import { Route, Routes } from 'react-router-dom'


const AppRoutes = () => (
  <Routes>

    <Route path="/home" element={<Home />} />

  </Routes>
)

export default AppRoutes
