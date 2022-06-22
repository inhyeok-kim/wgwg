import { useState } from "react";
import Editable from "./Editable";

interface BlockType {
    id : string
    text : string
    isCreatedByEnter : boolean
}

const initBlocks : Array<BlockType> = [
    {
        id : uid(),
        text : 'hi\n?',
        isCreatedByEnter : false
    }
]

const saveBlocks = {...initBlocks};

function App(){
    const [blocks, setBlocks] = useState(initBlocks);
    
    function onEnter(id : string, text : string){
        const newBlocks = [...blocks];
        const newBlock:BlockType = {
            id : uid(),
            text : text,
            isCreatedByEnter : true
        }
        newBlocks.splice(newBlocks.findIndex(block=> block.id === id ? true : false)+1,0,newBlock);
        
        setBlocks(newBlocks);
    }

    return (
        <div className="app">
            {blocks.map(block=>{
                return (<Editable 
                        key={block.id} 
                        id={block.id} 
                        text={block.text} 
                        onEnter={(text:string)=>{onEnter(block.id,text)}} 
                        isCreatedByEnter={block.isCreatedByEnter} />)
            })}
        </div>
    )
}

export default App;


function uid(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};