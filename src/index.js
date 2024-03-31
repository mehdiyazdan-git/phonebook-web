import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./components/Main";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./components/hooks/useAuth";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                    <Main/>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
