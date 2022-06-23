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
}

interface ActionDataType {
    id? : string
    text? : string
}
