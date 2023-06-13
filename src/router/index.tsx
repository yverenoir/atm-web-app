import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import InsertCard from "../InsertCard";
import Withdrawal from "../Withdrawal";
import WithdrawSuccess from "../WithdrawSuccess";
import CollectCard from "../CollectCard";

export const router = createBrowserRouter([
    {
        path: "pin",
        element: <App/>,
    },
    {
        path: "/",
        element: <InsertCard/>,
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