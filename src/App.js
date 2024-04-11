import './App.css';
import Login from './Login';
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
