import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Withdrawal from "./Withdrawal";
import InsertCard from "./InsertCard";
import WithdrawSuccess from "./WithdrawSuccess";
import {ThemeProvider} from "@mui/material";
import {theme} from "./theme";

const router = createBrowserRouter([
    {
        path: "pin",
        element: <App/>,
    },
    {
        path: "/",
        element: <InsertCard/>
    },
    {
        path: "withdraw",
        element: <Withdrawal/>
    },
    {
        path: "withdrawal-success",
        element: <WithdrawSuccess/>
    }
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}/>
        </ThemeProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
