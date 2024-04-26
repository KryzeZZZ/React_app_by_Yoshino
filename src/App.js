import './App.css';
import Login from './Pages/Login_Page/index.js';
import CallRoll from "./Callroll";
import React from 'react';
import {createBrowserRouter, Route, RouterProvider, Routes} from 'react-router-dom'
const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/callroll",
        element: <CallRoll />,
    },
]);
function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
