import React, {useState} from "react";
import _ from "lodash";
import axios from "axios";
import ReactJson from 'react-json-view'

const ApiPanel = () => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<any>();
    const [method, setMethod] = useState("GET")
    const [formData, setFormData] = useState({
        url: "",
        payload: ""
    });

    const [headers, setHeaders] = useState([
        {
            "key": "",
            "value": "",
        }
    ])


    const handleInputChange = (e: any) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const onSubmit = async () => {
        setLoading(true);
        const header = _.reduce(headers, (acc: any, {key, value}) => {
            if (key !== '') {
                acc[key] = value;
            }
            return acc;
        }, {});

        try {
            let response;
            switch (method) {
                case "GET":
                    response = await axios.get(formData.url, {
                        headers: header
                    });
                    break;
                case "POST":
                    response = await axios.get(formData.url, {
                        headers: header
                    });
                    break;

            }
            console.log(response)
            setMessages(response);

        } catch (e) {
            setMessages(e)
            console.log(e)
        }

    }


    return (
        <div className="row">
            <div className="col">
                <form>
                    <div className="d-flex">
                        <div>
                            <label>Method</label>
                            <select value={method} onChange={(e) => setMethod(e.target.value)}
                                    className="form-control">
                                <option value="GET" label="GET"></option>
                                <option value="POST" label="POST"></option>
                                <option value="PUT" label="PUT"></option>
                                <option value="DELETE" label="DELETE"></option>
                            </select>
                        </div>
                        <div className="w-100 ms-2">
                            <label>Server Address</label>
                            <input name="url" onChange={handleInputChange} required className="form-control"
                                   type="text"/>
                        </div>
                    </div>

                    <div className="mt-3">
                        <label>Header</label>
                        <div className="w-100">
                            <div className="d-flex ">
                                <label className="w-50">Key</label>
                                <label>Value</label>
                            </div>
                            {headers.map((header, index) => {
                                return <div key={index} className="d-flex mb-2">
                                    <input onChange={(e) => {
                                        const {value} = e.target;
                                        setHeaders((headers) => headers.map((h, i) => {
                                            if (i === index) {
                                                return {...h, "key": value}
                                            }
                                            return h;
                                        }))
                                    }} value={header["key"]} type="text" className="me-2 form-control w-25"/>
                                    <input onChange={e => {
                                        const {value} = e.target;
                                        setHeaders((headers) => headers.map((h, i) => {
                                            if (i === index) {
                                                return {...h, "value": value}
                                            }
                                            return h;
                                        }))
                                    }} className="w-75 form-control" value={header["value"]} type="text"/>
                                    <button onClick={() => {
                                        setHeaders((headers) => headers.filter((h, i) => i !== index))
                                    }} className="form-control w-auto ms-2 bg-danger text-white">
                                        -
                                    </button>
                                </div>
                            })}
                            <div className="d-flex justify-content-end">
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    setHeaders((headers) => [...headers, {"key": "", "value": ""}])
                                }} className="form-control w-auto ">
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="mt-3">
                            <label>Payload</label>
                            <textarea name="payload" onChange={handleInputChange} rows={8} className="form-control"/>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end">
                        <button type="button" onClick={onSubmit}
                                className="btn btn-primary mt-3 ">
                            Send {loading &&
                            <div className="spinner-border spinner-border-sm fs-6 text-light"
                                 role="status">
                            </div>}
                        </button>
                    </div>
                </form>
            </div>
            <div className="col overflow-scroll">
                <div className="border mt-3 p-3 overflow-scroll">
                    <div className="fs-6 mb-2 fw-semibold">Message</div>
                    <ReactJson src={messages}/>
                </div>
            </div>
        </div>
    )
        ;
}

export default ApiPanel;