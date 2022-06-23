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

function Editor(){
    const [blocks, setBlocks] = useState(initBlocks);
    const editor = useRef<HTMLDivElement>(null);
    const [createdBlockId, setCreatedBlockId] = useState('');

    useEffect(()=>{
        if(createdBlockId){
            moveSelection(createdBlockId,0,0);
        }
    },[createdBlockId])

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
    }

    function fnInsertAction(action : ActionType){
        fnCreateNewBlock(action.id, action.data!);
    }
    function fnDeleteAction(action : ActionType){

    }
    function fnUpdateAction(action : ActionType){

    }

    function onKeyUp(e:React.KeyboardEvent){
        // console.log(e.code);
    }

    function onKeyDown(e:React.KeyboardEvent){
        console.log(document.getSelection());
        // console.log(e.code);
        switch (e.code) {
            case "Enter":
                fnEnter(e);
                break;
            default:
                break;
        }
    }

    function fnEnter(e:React.KeyboardEvent){
        e.preventDefault();
        const selection = document.getSelection();
        const anchor = selection?.anchorNode?.parentElement;
        const focus = selection?.focusNode?.parentElement;
        let startId='';
        let endId='';
        let startOffset =0;
        let endOffset=0;
        if(anchor === focus){
            startId = anchor?.getAttribute('data-block-id')!;
            endId = anchor?.getAttribute('data-block-id')!;
            startOffset = selection?.anchorOffset!;
            endOffset = selection?.focusOffset!;
        } else {
            const _blocks = editor.current!.children;
            for(let i=0; i<_blocks.length;i++){
                const _block = _blocks[i];
    
                if(_block.getAttribute('data-block-id') === anchor?.getAttribute('data-block-id')){
                    startId = anchor?.getAttribute('data-block-id')!;
                    endId = focus?.getAttribute('data-block-id')!;
                    startOffset = selection?.anchorOffset!;
                    endOffset = selection?.focusOffset!;
                    break;
                }
                if(_block.getAttribute('data-block-id') === focus?.getAttribute('data-block-id')){
                    startId = focus?.getAttribute('data-block-id')!;
                    endId = anchor?.getAttribute('data-block-id')!;
                    endOffset = selection?.anchorOffset!;
                    startOffset = selection?.focusOffset!;
                    break;
                }
            }
        }

        const actionList : Array<ActionType> = [];
        let newBlockText = '';
        if(startId === endId){
            const text = editor.current?.querySelector('div[data-block-id='+startId+']')?.innerHTML;
            const newText = text? text.substring(0,startOffset) : '';
            const act : ActionType = {
                id : startId,
                type : "update",
                data : {text : newText }
            }
            actionList.push(act);
            newBlockText = text? text.substring(endOffset,text!.length) : '';
        } else {
            const startText = editor.current?.querySelector('div[data-block-id='+startId+']')?.innerHTML;
            const newStartText = startText!.substring(0,startOffset);
            const act : ActionType = {
                id : startId,
                type : "update",
                data : {text : newStartText}
            }
            actionList.push(act);

            let isTarget = false;
            for(let i=0; i<saveBlocks.length;i++){
                if(saveBlocks[i].id === startId) {
                    isTarget = true;
                    continue;
                }
                if(saveBlocks[i].id === endId){
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

            const endText = editor.current?.querySelector('div[data-block-id='+endId+']')?.innerHTML;
            newBlockText = endText!.substring(endOffset,endText?.length);
            const act2 : ActionType = {
                id : endId,
                type : "delete"
            }
            actionList.push(act2);

        }

        if(newBlockText === ''){
            newBlockText = '\r';
        }
        actionList.push({
            id : startId,
            type : "insert",
            data : {
                id : uid(),
                text : newBlockText
            },
        });

        doAction(actionList);

    }

    function fnCreateNewBlock(id:string, data : ActionDataType){
        const newBlock:BlockStateType = {
            id : data.id!,
            text : data.text ? data.text : '\r',
            isFocus : true
        }
        const idx = saveBlocks.findIndex(block=> block.id === id ? true : false);
        saveBlocks.splice(idx+1,0,newBlock);
        setBlocks([...saveBlocks]);
        setCreatedBlockId(data.id!);
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