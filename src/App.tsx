import './App.css';
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import React, {useState} from "react";
import SocketPanel from "./components/SocketPanel";
import ApiPanel from "./components/ApiPanel";

function App() {

    const [type, setType] = useState("Api")

    return <div className="container mt-5">
        <h2 className="text-center">Jingx Tester</h2>
        <div className="mb-3">
            <select value={type} onChange={(e) => setType(e.target.value)} className="form-control w-25">
                <option value="Api" label="Api"></option>
                <option value="Socket" label="Socket"></option>
            </select>
        </div>
        {
            type === "Socket" && <SocketPanel/>
        }
        {
            type === "Api" && <ApiPanel/>
        }
    </div>

}

export default App;
