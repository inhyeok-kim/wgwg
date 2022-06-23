import { useState } from "react";
// import Editable from "./Editable";
import Editor from "./Editor";

interface BlockType {
    id : string
    text : string
    isFocus : boolean
}

const initBlocks : Array<BlockType> = [
    {
        id : uid(),
        text : '\r',
        isFocus : false
    }
]

const saveBlocks = [...initBlocks];

function App(){
    const [blocks, setBlocks] = useState(initBlocks);
    
    // function onAction(id : string, act : actionType){
    //     switch (act.type) {
    //         case "Enter":
    //             // createNewBlock(id, act);
    //             // break;
    //         // case "Backspace":
    //         //     removeBlock(id, act);
    //         //     break;
    //         case "Input":
    //             inputBlock(id,act);
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // function createNewBlock(id : string, act : actionType){
    //     const newBlock:BlockType = {
    //         id : uid(),
    //         text : act.data,
    //         isFocus : true
    //     }
    //     const idx = saveBlocks.findIndex(block=> block.id === id ? true : false);
    //     saveBlocks.splice(idx+1,0,newBlock);
    //     setBlocks([...saveBlocks]);
    // }

    // function removeBlock(id : string, act : actionType){
    //     const idx = saveBlocks.findIndex(block=> block.id === id ? true : false);
    //     if(idx > 0){
    //         saveBlocks[idx-1].text += act.data;
    //         saveBlocks[idx-1].isFocus = true;
    //         saveBlocks.splice(idx,1);
    //         setBlocks([...saveBlocks]);
    //     }
    // }

    // function inputBlock(id : string, act : actionType){
    //     const idx = saveBlocks.findIndex(block=> block.id === id ? true : false);
    //     saveBlocks[idx].text = act.data;
    // }

    return (
        <Editor />
        // <div className="app" contentEditable={true}>
        //     {blocks.map(block=>{
        //         return (<Editable 
        //                 key={block.id} 
        //                 id={block.id} 
        //                 text={block.text} 
        //                 onAction={(act:actionType)=>{onAction(block.id,act)}} 
        //                 isFocus={block.isFocus} />)
        //     })}
        // </div>
    )
}

export default App;


function uid(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};