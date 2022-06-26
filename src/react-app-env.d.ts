/// <reference types="react-scripts" />

interface BlockStateType{
    id : string
    text : string
    readonly? : boolean
    onAction? : Function
    isFocus? : boolean
}

interface ActionType{
    id : string
    type : 'update' | 'delete' | 'insert'
    start? : number
    end? : number
    data? : ActionDataType
    noRender? : boolean
}

interface ActionDataType {
    id? : string
    text? : string
}

interface SelectionType{
    anchorNode? : any
    focusNode? : any
    anchorId : string
    focusId : string
    anchorOffset : number
    focusOffset : number
}

interface Node {
    dataset : any
}

interface Event{
    data : any
}
