import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import EditableBlock from "./EditableBlock";

const initBlocks : Array<BlockStateType> = [
    {
        id : uid(),
        text : '\r',
        isFocus : false
    }
]
const saveBlocks = [...initBlocks];
let focusTarget = '';
let focusIndex = [0,0];
function Editor(){
    const [blocks, setBlocks] = useState(initBlocks);
    const editor = useRef<HTMLDivElement>(null);
    const [focusId, setFocusId] = useState('');

    useEffect(()=>{
        if(focusId){
            moveSelection(focusId,focusIndex[0],focusIndex[1]);
            focusTarget = '';
            focusIndex = [0,0];
        }
    },[focusId]);

    function doAction(action:ActionType|Array<ActionType>){
        let actionList : Array<ActionType> = [];
        if("id" in action){
            actionList.push(action);
        } else {
            actionList = [...action];
        }

        actionList.forEach((action)=>{
            switch (action.type) {
                case "insert":
                    fnInsertAction(action);
                    break;
                case "delete":
                    fnDeleteAction(action);
                    break;
                case "update":
                    fnUpdateAction(action);
                    break;
                default:
                    break;
            }
        });
        setBlocks([...saveBlocks]);
        setFocusId(focusTarget);
    }

    function fnInsertAction(action : ActionType){
        fnCreateNewBlock(action.id, action.data!);
    }
    function fnDeleteAction(action : ActionType){
        fnDeleteBlock(action.id);
    }
    function fnUpdateAction(action : ActionType){
        fnUpdateBlock(action.id, action.data!);
    }

    function onInput(e:React.FormEvent){
        // console.log(e);
    }

    function onKeyUp(e:React.KeyboardEvent){
        // console.log(e.code);
    }

    function onKeyDown(e:React.KeyboardEvent){
        // console.log(e.code);
        if(e.nativeEvent.isComposing){
            e.preventDefault();
        } else {
            switch (e.code) {
                case "Backspace":
                    fnBackspace(e);
                    break
                case "Enter":
                    fnEnter(e);
                    break;
                default:
                    break;
            }
        }
    }

    function getSelectionRange(){
        const selection = document.getSelection();
        let anchor = selection?.anchorNode;
        let focus = selection?.focusNode;
        if(anchor?.nodeName !== 'DIV'){
            anchor = anchor?.parentElement;
        }
        if(focus?.nodeName !== 'DIV'){
            focus = focus?.parentElement;
        }
        let startId='';
        let endId='';
        let startOffset =0;
        let endOffset=0;
        if(anchor === focus){
            startId = anchor?.dataset.blockId;
            endId = anchor?.dataset.blockId;
            startOffset = selection?.anchorOffset!;
            endOffset = selection?.focusOffset!;
        } else {
            const _blocks = editor.current!.children;
            for(let i=0; i<_blocks.length;i++){
                const _block = _blocks[i];
    
                if(_block.dataset.blockId === anchor?.dataset.blockId){
                    startId = anchor?.dataset.blockId!;
                    endId = focus?.dataset.blockId!;
                    startOffset = selection?.anchorOffset!;
                    endOffset = selection?.focusOffset!;
                    break;
                }
                if(_block.dataset.blockId === focus?.dataset.blockId){
                    startId = focus?.dataset.blockId!;
                    endId = anchor?.dataset.blockId!;
                    endOffset = selection?.anchorOffset!;
                    startOffset = selection?.focusOffset!;
                    break;
                }
            }
        }
        return {startId, endId, startOffset, endOffset};
    }

    function fnBackspace(e:React.KeyboardEvent){
        const selection = document.getSelection();
        let isNotUpdate = false;
        if(selection?.anchorNode != selection?.focusNode){
            isNotUpdate = true;
        } else if(selection?.focusOffset === 0 && selection.anchorOffset === 0){
            isNotUpdate = true;
        }

        if(isNotUpdate){
            e.preventDefault();
            const sr = getSelectionRange();

            const actionList : Array<ActionType> = [];
            if(sr.startId === sr.endId){
                const act : ActionType = {
                    id : sr.startId,
                    type : "delete"
                }
                actionList.push(act);
                const prevIdx = saveBlocks.findIndex((block)=> block.id === sr.startId ? true : false) -1;
                if(prevIdx >= 0) {
                    focusTarget = saveBlocks[prevIdx].id
                } else {
                    return false;
                }
                
                focusIndex = [saveBlocks[prevIdx].text.length,saveBlocks[prevIdx].text.length];
            } else {
                const startText = editor.current?.querySelector('div[data-block-id='+sr.startId+']')?.innerHTML;
                const endText = editor.current?.querySelector('div[data-block-id='+sr.endId+']')?.innerHTML;
                const newStartText = startText!.substring(0,sr.startOffset) + endText!.substring(sr.endOffset,endText?.length);
                const act : ActionType = {
                    id : sr.startId,
                    type : "update",
                    data : {text : newStartText}
                }
                actionList.push(act);

                let isTarget = false;
                for(let i=0; i<saveBlocks.length;i++){
                    if(saveBlocks[i].id === sr.startId) {
                        isTarget = true;
                        continue;
                    }
                    if(saveBlocks[i].id === sr.endId){
                        isTarget = false;
                        break;
                    }
                    if(isTarget){
                        const act :ActionType = {
                            id : saveBlocks[i].id,
                            type : 'delete'
                        }
                        actionList.push(act);
                    }
                }
                
                const act2 : ActionType = {
                    id : sr.endId,
                    type : "delete"
                }
                actionList.push(act2);
                focusTarget = sr.startId;

                focusIndex = [sr.startOffset,sr.startOffset];
            }

            doAction(actionList);
        }

    }

    function fnEnter(e:React.KeyboardEvent){
        e.preventDefault();
        const sr = getSelectionRange();

        const actionList : Array<ActionType> = [];
        let newBlockText = '';
        if(sr.startId === sr.endId){
            const text = editor.current?.querySelector('div[data-block-id='+sr.startId+']')?.innerHTML;
            const newText = text? text.substring(0,sr.startOffset) : '';
            const act : ActionType = {
                id : sr.startId,
                type : "update",
                data : {text : newText }
            }
            actionList.push(act);
            newBlockText = text? text.substring(sr.endOffset,text!.length) : '';
        } else {
            const startText = editor.current?.querySelector('div[data-block-id='+sr.startId+']')?.innerHTML;
            const newStartText = startText!.substring(0,sr.startOffset);
            const act : ActionType = {
                id : sr.startId,
                type : "update",
                data : {text : newStartText}
            }
            actionList.push(act);

            let isTarget = false;
            for(let i=0; i<saveBlocks.length;i++){
                if(saveBlocks[i].id === sr.startId) {
                    isTarget = true;
                    continue;
                }
                if(saveBlocks[i].id === sr.endId){
                    isTarget = false;
                    break;
                }
                if(isTarget){
                    const act :ActionType = {
                        id : saveBlocks[i].id,
                        type : 'delete'
                    }
                    actionList.push(act);
                }
            }

            const endText = editor.current?.querySelector('div[data-block-id='+sr.endId+']')?.innerHTML;
            newBlockText = endText!.substring(sr.endOffset,endText?.length);
            const act2 : ActionType = {
                id : sr.endId,
                type : "delete"
            }
            actionList.push(act2);

        }

        if(newBlockText === ''){
            newBlockText = '\r';
        }
        const newId = uid();
        actionList.push({
            id : sr.startId,
            type : "insert",
            data : {
                id : newId,
                text : newBlockText
            },
        });

        focusTarget = newId;
        doAction(actionList);

    }

    function fnUpdateBlock(id:string, data : ActionDataType){
        const orgBlcok = saveBlocks.find(block=> block.id === id ? true : false);
        orgBlcok!.text = data.text ? data.text : '\r';
    }

    function fnDeleteBlock(id:string){
        const idx = saveBlocks.findIndex(block=> block.id === id ? true : false);
        saveBlocks.splice(idx,1);
    }

    function fnCreateNewBlock(id:string, data : ActionDataType){
        const newBlock:BlockStateType = {
            id : data.id!,
            text : data.text ? data.text : '\r',
            isFocus : true
        }
        const idx = saveBlocks.findIndex(block=> block.id === id ? true : false);
        saveBlocks.splice(idx+1,0,newBlock);
    }

    function moveSelection(targetId:string,start:number, end:number){
        const selection = document.getSelection()!;
        const range = selection!.getRangeAt(0);
        const newRange = range!.cloneRange();
        const target = editor.current?.querySelector(`div[data-block-id=${targetId}`);
        if(target?.firstChild){
            newRange.setStart(target.firstChild,start);
            newRange.setEnd(target.firstChild,end);
        } else {
            newRange.setStart(target!,start);
            newRange.setEnd(target!,end);
        }
        selection?.removeAllRanges();
        selection?.addRange(newRange);
    }

    return (
        <EditorDiv 
            ref={editor}
            contentEditable={true}
            style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}
            onKeyDown={(e)=>{onKeyDown(e)}}
            onKeyUp={(e)=>{onKeyUp(e)}}
            onInput={(e)=>{onInput(e)}}
        >
            {blocks.map(block=>{
                return (<EditableBlock 
                        key={block.id} 
                        id={block.id} 
                        text={block.text} />)
            })}
        </EditorDiv>
    )
}

export default Editor;


function uid(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const EditorDiv = styled.div`
    &:focus{
        outline: 0px solid transparent;
    }
`