import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Header } from '../components/Layouts/Header'
import { Login } from '../components/pages/Login'
import { Dashboard } from '../components/pages/Dashboard'
import { Footer } from '../components/Layouts/Footer'
import { Home } from '../components/pages/Home'
import { Register } from '../components/pages/Register'
import { ProtectedRoute } from './ProtectedRoute'

export const AllRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
  return (
    <>
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path='/home' element={<Home />} />
        <Route path='/register' element={<ProtectedRoute><Register /></ProtectedRoute>} />
        <Route path='/header' element={<ProtectedRoute><Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} /></ProtectedRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/footer' element={<Footer />} />
    </Routes>
    </>
  )
}
