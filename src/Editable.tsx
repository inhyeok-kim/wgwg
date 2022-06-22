import React, {  useEffect, useRef } from "react"

interface EditState{
    id : string
    text : string
    readonly? : boolean
    onEnter? : Function
    isCreatedByEnter? : boolean
}

export default function Editable({id, text, readonly = false, onEnter = ()=>{}, isCreatedByEnter=false} : EditState){
    const div = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        if(div.current){
            div.current.innerHTML = text.replaceAll('\n','<br>');
        }
    }, [text]);
    
    useEffect(()=>{
        if(isCreatedByEnter) div.current?.focus();
    },[]);

    function onInput(e:any){
        const event = e.nativeEvent;
    }

    function onkeyup(e:React.KeyboardEvent){
        if(e.code === 'ShiftLeft'){
            isShift = false;
        }
    }

    function onKeyDown(e:React.KeyboardEvent){
        cursorSetting(e);
        if(e.code === 'Enter'){
            if(isShift){
                e.preventDefault();
                fnLineEnter();
            } else {
                e.preventDefault();
                fnEnter();
            }
        } else if(e.code === 'ShiftLeft'){
            isShift = true;
        }
    }

    function onFocus(e:React.FocusEvent){
        isFocus = true;
    }

    function onBlur(e:React.FocusEvent){
        isFocus = false;
    }

    function cursorSetting(e:React.KeyboardEvent){
        const selection = document.getSelection();
        const cn = div.current?.childNodes;
        let anchor=0;
        let focus=0;
        let len=0;
        let isEnd = 0;
        for(let i=0; i< cn!.length; i++){
            const c = cn![i];
            if(c.nodeName !== '#text'){
                if(c.nodeName === 'BR'){
                    len++;
                }
                continue;
            }

            if(c === selection?.anchorNode){
                anchor = len + selection.anchorOffset;
                isEnd++;
            }
            if(c === selection?.focusNode){
                focus = len + selection.focusOffset;
                isEnd++;
            }
            if(isEnd === 2){
                break;
            }
            len += c.textContent ? c.textContent.length : 0;
        }

        cursorStart = Math.min(anchor?anchor:0, focus?focus:0);
        cursorEnd = Math.max(anchor?anchor:0, focus?focus:0);
    }

    function fnLineEnter(){
        console.log(cursorStart, cursorEnd);
        const text = div.current?.innerText;
        const newText = text!.substring(0,cursorStart) + '<br>' + text!.substring(cursorEnd, text!.length);
        if(div.current){
            div.current.innerHTML = newText;
        }
    }

    function fnEnter(){
        const text = div.current?.innerText;
        const newText = text!.substring(0,cursorStart);
        const enterText = text!.substring(cursorEnd, text!.length);
        if(div.current){
            div.current.innerHTML = newText;
        }
        onEnter(enterText);
    }

    return <div 
            style={{whiteSpace: 'pre-line', wordBreak: 'break-word'}}
            ref={div}
            contentEditable={!readonly}
            onInput={(e)=>{onInput(e)}}
            onKeyDown={(e)=>{onKeyDown(e)}}
            onKeyUp={(e)=>{onkeyup(e)}}
            onFocus={(e)=>{onFocus(e)}}
            onBlur={(e)=>{onBlur(e)}}
            
            ></div>

}

let isShift = false;
let isFocus = false;
let cursorStart = 0;
let cursorEnd = 0;