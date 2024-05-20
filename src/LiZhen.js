import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [data, setData] = useState('');

    useEffect(() => {
        axios.get('https://localhost:5050/user').then(res => setData(res.data));
    }, []);

    return data;
}

export default App;