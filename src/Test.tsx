export default function Test(){

    function onInput(e : any){
        console.log(e);
        document.getElementById('div')?.dispatchEvent(e.nativeEvent);
    }

    return (
        <div id={'div'} contentEditable onInput={onInput}></div>
    )
}