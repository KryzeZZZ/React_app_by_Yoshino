import './App.css';
import Login from './Pages/Login_Page/index.js';
import CallRoll from "./Pages/Callroll_Page/index.js";
import LessonChoose from "./Pages/lesson_Page/index.js";
import Student from "./Pages/Student_Page/index.js";
import Register from "./Pages/Register_Page/index.js";
import React from 'react';
import {createBrowserRouter, Route, RouterProvider, Routes, useParams} from 'react-router-dom'
const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/callroll/:courseId",
        element: <CallRoll />,
    },
    {
        path: "/lesson",
        element: <LessonChoose />,
    },
    {
        path: "/student/:courseId",
        element: <Student />
    },
    {
        path: "/register",
        element: <Register />,
    }
]);
function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
