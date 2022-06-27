import { useEffect, useState } from "react";
import styled from "styled-components";
// import Editable from "./Editable";
import Editor from "./Editor";

let ws : WebSocket;
function App(){
    const [page, setPage] = useState();
    const [actionList, setActionList] = useState();
    const [pageList, setPageList] = useState([]);
    const [currentPage , setCurrentPage] = useState<PageType>();

    useEffect(()=>{
        if(!ws){
            connect();
        }
    },[]);

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
            case "pageList":
                setPageList(event.data);
                break;
            case "page_init":
                pageInit(event.data);           
                break;
            case 'action':
                receiveAction(event.data);
                break;
            case 'response_page':
                pageInit(event.data);
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
            pageId : currentPage!.id,
            data : actionList
        };
        ws.send(JSON.stringify(message));
    }

    function addPage(){
        const message = {
            method : 'addPage',
        };
        ws.send(JSON.stringify(message));
    }

    useEffect(()=>{
        if(currentPage){
            requestPage(currentPage!.id);
        }
    },[currentPage]);
    function requestPage(pageId:string){
        const message = {
            method : 'request_page',
            data : pageId
        }
        ws.send(JSON.stringify(message));
    }

    return (
        <Wrapper>
            <Header>
                {/* <button onClick={connect}>접속하기</button> */}
            </Header>
            <Aside>
                <button onClick={addPage}>+ 새 페이지</button>
                <ul>
                    {pageList ? 
                        pageList.map((page:PageType)=>{
                            return <li key={page.id} onClick={()=>{setCurrentPage(page)}}
                                style={{cursor:'pointer'}}
                            >{page.text}</li>
                        })
                        :
                        ''
                    }
                </ul>
            </Aside>
            <Page>
                {currentPage ? 
                    <h1 style={{borderBottom : '1px solid lightgrey'}}>{currentPage?.text}</h1>
                    :
                    ''
                }
                {page ? 
                    (<Editor initPage={page} onAction={(actionList : Array<ActionType>)=>onAction(actionList)} actionList={actionList!} />)
                    :
                    ''
                }
            </Page>
        </Wrapper>
    )
}

export default App;

function uid(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const Header = styled.div`
    width: 100%;
    height : 50px;
    background-color: #3bffad;
`;

const Aside = styled.div`
    width : 20%;
    height: 100vh;
    border-right: 1px solid #f1f1d4;
    background-color: ivory;
`;

const Page = styled.div`
    width : 80%;
    height: 100vh;
    padding : 10px;
`

