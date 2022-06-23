 import React, {  useEffect, useRef } from "react"

// export default function Editable({id, text, readonly = false, onAction = ()=>{}, isFocus=false} : BlockStateType){
//     const div = useRef<HTMLDivElement>(null);
//     useEffect(()=>{
//         if(div.current){
//             div.current.innerHTML = text;
//             // div.current.innerHTML = text.replaceAll('\n','<br>');
//         }
//     }, [text]);
    
//     useEffect(()=>{
//         if(div.current){
//             if(isFocus) div.current.focus();
//         }
//     },[isFocus])

//     function onInput(e:any){
//         const event = e.nativeEvent;
//         const act : actionType = {
//             type : 'Input',
//             start : cursorStart,
//             end : cursorEnd,
//             data : div.current ? div.current.innerText : ''
//         }
//         sendAction(act);
//     }

//     function onkeyup(e:React.KeyboardEvent){
//         if(e.code === 'ShiftLeft'){
//             isShift = false;
//         }
//     }

//     function onKeyDown(e:React.KeyboardEvent){
//         // cursorSetting(e);
//         // switch (e.code) {
//         //     case 'Enter':
//         //         if(isShift){
//         //             e.preventDefault();
//         //             fnLineEnter();
//         //         } else {
//         //             e.preventDefault();
//         //             fnEnter();
//         //         }
//         //         break;
//         //     case 'ShiftLeft':
//         //         isShift = true;
//         //         break;
//         //     case 'Backspace':
//         //         if(cursorStart + cursorEnd === 0){
//         //             fnBackspace();
//         //         }
//         //         break;
//         //     default:
//         //         break;
//         // }
//     }

//     function onFocus(e:React.FocusEvent){
//         isFocus = true;
//     }

//     function onBlur(e:React.FocusEvent){
//         isFocus = false;
//     }

//     function fnLineEnter(){
//         const text = div.current?.innerHTML;
//         let br = '\n';
//         if(cursorEnd == text?.length){
//             br += '\r';
//         }
//         const newText = text!.substring(0,cursorStart) + br + text!.substring(cursorEnd, text!.length);
//         div.current!.innerHTML = newText;
//         moveCursor(cursorStart+1,cursorStart+1);
        
//     }

//     function moveCursor(start:number, end:number){
//         const selection = document.getSelection()!;
//         const range = selection!.getRangeAt(0);
//         const newRange = range!.cloneRange();
//         if(div.current){
//             newRange.setStart(div.current.firstChild!,start);
//             newRange.setEnd(div.current.firstChild!,end);
//         }
//         selection?.removeAllRanges();
//         selection?.addRange(newRange);
//     }

//     function fnBackspace(){
//         const act : actionType = {
//             type : 'Backspace',
//             start : cursorStart,
//             end : cursorEnd,
//             data : div.current ? div.current.innerText : ''
//         }
//         sendAction(act);
//     }

//     function cursorSetting(e:React.KeyboardEvent){
//         const selection = document.getSelection();
//         let anchor=0;
//         let focus=0;
//         // let len=0;
//         // let isEnd = 0;
//         // const cn = div.current?.childNodes;
//         // for(let i=0; i< cn!.length; i++){
//         //     const c = cn![i];
//         //     if(c.nodeName !== '#text'){
//         //         if(c.nodeName === 'BR'){
//         //             len++;
//         //         }
//         //         continue;
//         //     }

//         //     if(c === selection?.anchorNode){
//         //         anchor = len + selection.anchorOffset;
//         //         isEnd++;
//         //     }
//         //     if(c === selection?.focusNode){
//         //         focus = len + selection.focusOffset;
//         //         isEnd++;
//         //     }
//         //     if(isEnd === 2){
//         //         break;
//         //     }
//         //     len += c.textContent ? c.textContent.length : 0;
//         // }

//         anchor = selection!.anchorOffset;
//         focus = selection!.focusOffset;

//         cursorStart = Math.min(anchor?anchor:0, focus?focus:0);
//         cursorEnd = Math.max(anchor?anchor:0, focus?focus:0);
//     }

//     function fnEnter(){
//         const text = div.current?.innerText;
//         const newText = text!.substring(0,cursorStart);
//         const enterText = text!.substring(cursorEnd, text!.length);
//         console.log(newText, enterText);
//         const enterAct : actionType = {
//             type : 'Enter',
//             start : cursorStart,
//             end : cursorEnd,
//             data : enterText
//         }
//         const inputAct : actionType = {
//             type : 'Input',
//             start : cursorStart,
//             end : cursorEnd,
//             data : newText
//         }
//         sendAction(inputAct);
//         sendAction(enterAct);
//     }

//     function sendAction(act : actionType){
//         onAction(act);
//     }

//     return <div 
//             style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}
//             ref={div}
//             contentEditable={!readonly}
//             onInput={(e)=>{onInput(e)}}
//             onKeyDown={(e)=>{onKeyDown(e)}}
//             onKeyUp={(e)=>{onkeyup(e)}}
//             onFocus={(e)=>{onFocus(e)}}
//             onBlur={(e)=>{onBlur(e)}}
            
//             ></div>

// }

// let isShift = false;
// let isFocus = false;
// let cursorStart = 0;
// let cursorEnd = 0;