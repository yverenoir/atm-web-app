import {createBrowserRouter} from "react-router-dom";
import InsertCard from "../InsertCard";
import Withdrawal from "../Withdrawal";
import WithdrawSuccess from "../WithdrawSuccess";
import CollectCard from "../CollectCard";
import Pin from "../Pin";

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