import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './components/layouts/Layout'
import Login from './pages/authantication/Login'
import Register from './pages/authantication/Registration'
import OTPVerification from './pages/authantication/Otp'
import Images from './pages/Images'
import Videos from './pages/Videos'
import Audios from './pages/Audios'
import Upload from './pages/Upload'
import Documents from './pages/Documents'
import Cookies from 'js-cookie'
import { Slide, ToastContainer } from 'react-toastify'

const App = () => {
    const token = Cookies.get('token')
    
    const routes = createBrowserRouter([
        {
            path:'/',
            element: token ? <Layout /> : <Navigate to="/login" replace />,
            children:[
                {
                    path:'/',
                    element: <Home />
                },
                {
                    path:'/images',
                    element: <Images />
                },
                {
                    path:'/videos',
                    element: <Videos />
                },
                {
                    path:'/audios',
                    element: <Audios />
                },
                {
                    path:'/documents',
                    element: <Documents />
                },
                {
                    path:'/upload',
                    element: <Upload />
                },
            ]
        },
        {
            path:'/login',
            element:token ? <Navigate to="/" replace /> : <Login />
        },
        {
            path:'/register',
            element: token ? <Navigate to="/" replace /> : <Register />
        },
        {
            path:'/register/otp',
            element: token ? <Navigate to="/" replace /> : <OTPVerification />
        }
    ])

  return (
    <>
    <RouterProvider router={routes}>
    </RouterProvider>
    <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
transition={Slide}
/>
    </>
  )
}

export default App
