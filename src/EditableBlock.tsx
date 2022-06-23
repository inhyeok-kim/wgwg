import React, { useEffect, useRef, useState } from "react";
import styled from 'styled-components';

function EditableBlock({id, text, readonly = false, onAction = ()=>{}, isFocus=false} : BlockStateType){

    const div = useRef<HTMLDivElement>(null);
    useEffect(()=>{
        div.current!.innerHTML = text;
    }, [text]);

    return (
        <Block
            ref={div}
            data-block-id={id}
        >
        </Block>
    )
}

export default EditableBlock;

const Block = styled.div`
    &:focus{
        background-color: black;
    }
`
