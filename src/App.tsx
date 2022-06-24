import { useState } from "react";
// import Editable from "./Editable";
import Editor from "./Editor";

let ws : WebSocket;
function App(){
    const [page, setPage] = useState();
    const [actionList, setActionList] = useState();

    function connect(){
        ws = new WebSocket('ws://192.168.123.48:4000');
        ws.onopen = function(){
            console.log('socket connected');
            ws.onmessage = function(message){
                onMessage(message.data);
            }
            login(ws);
        }
    }

    function login(ws : WebSocket){
        const loginInfo = {
            method : 'login',
            data : uid()
        }
        ws.send(JSON.stringify(loginInfo));
    }

    function onMessage(message:any){
        const event = JSON.parse(message);
        const method = event.method;
        switch (method) {
            case "page_init":
                pageInit(event.data);           
                break;
            case 'action':
                receiveAction(event.data);
                break;
            default:
                break;
        }
    }

    function receiveAction(actionList :any){
        setActionList(actionList);
    }

    function pageInit(pageData:any){
        setPage(pageData);
    }

    function onAction(actionList : Array<ActionType>){
        const message = {
            method : 'action',
            data : actionList
        };
        ws.send(JSON.stringify(message));
    }

    return (
        <>
            <button onClick={connect}>접속하기</button>
            {page ? 
                (<Editor initPage={page} onAction={(actionList : Array<ActionType>)=>onAction(actionList)} actionList={actionList!} />)
                :
                ''
            }
        </>
    )
}

export default App;

function uid(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};