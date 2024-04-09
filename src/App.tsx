import React, {useState} from 'react';
import './App.css';
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import {SocketService} from "./services/SocketService";
import {StompSubscription} from '@stomp/stompjs';

function App() {

    const [subId, setSubId] = useState<StompSubscription>()
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        url: "",
        topic: "",
        token: ""
    });
    

    const client = new SocketService({...formData});


    const handleInputChange = (e: any) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const onSubmit = () => {
        setLoading(true);
        client._connect(false)
        setTimeout(() => {
            subId && subId.unsubscribe();
            setLoading(false);
            let sid = client.stompClient?.subscribe(formData.topic, (sdkEvent => {
                const ms: any = JSON.parse(sdkEvent.body);
                console.log(ms);
                setMessages((mss) => [...mss, ms]);
            }));
            setSubId(sid);
        }, 1000)
    }


    return (
        <div className="container mt-5">
            <h2 className="text-center">Jingx Tester</h2>

            <div className="row">
                <div className="col">
                    <form>
                        <div className="">
                            <label>Server Url</label>
                            <input name="url" onChange={handleInputChange} required className="form-control"
                                   type="text"/>
                        </div>
                        <div className="mt-3">
                            <label>Topic</label>
                            <input name="topic" onChange={handleInputChange} className="form-control" type="text"/>
                        </div>

                        <div className="mt-3">
                            <label>Token</label>
                            <textarea name="token" onChange={handleInputChange} rows={8} className="form-control"/>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="button" onClick={onSubmit}
                                    className="btn btn-primary mt-3 ">
                                Connect & Subscribe {loading &&
                                <div className="spinner-border spinner-border-sm fs-6 text-light"
                                     role="status">
                                </div>}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col">
                    {subId && <div className="alert alert-success mt-3 py-2" role="alert">
                        Subscription to : {formData.topic}
                    </div>}
                    <div className="border mt-3 p-3">
                        <div className="fs-6 mb-2 fw-semibold">Message</div>
                        {messages.map((msg, index) => {
                            return (
                                <div className="mb-2" key={index}>
                                    <a className="btn btn-outline-info" data-toggle="collapse"
                                       href={`#collapseExample-${index}`}
                                       role="button" aria-expanded="false" aria-controls={`collapseExample-${index}`}>
                                        Type : {msg.type}, DrawCode: #{JSON.parse(msg.data).drawCode}
                                    </a>
                                    <div className="collapse" id={`collapseExample-${index}`}>
                                        <div className="card card-body">
                                            {msg.data}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>


        </div>
    );
}

export default App;
