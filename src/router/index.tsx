import {createBrowserRouter} from "react-router-dom";
import InsertCard from "../pages/InsertCard";
import Withdrawal from "../pages/Withdrawal";
import WithdrawSuccess from "../pages/WithdrawSuccess";
import CollectCard from "../pages/CollectCard";
import Pin from "../pages/Pin";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <InsertCard/>,
    },
    {
        path: "pin",
        element: <Pin/>,
    },
    {
        path: "withdraw",
        element: <Withdrawal/>
    },
    {
        path: "withdrawal-success",
        element: <WithdrawSuccess/>
    },
    {
        path: "collect-card",
        element: <CollectCard/>
    }
]);