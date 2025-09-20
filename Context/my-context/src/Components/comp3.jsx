import { useContext } from "react"
import { NameContext } from "./name-context"

export const Comp3 = ()=>{
    const getContext = useContext(NameContext)
    return(
        <>
                <h2>This is comp3</h2>
        <div>{getContext.name}</div>
        <button onClick={()=>getContext.setName('clicked name')}>Click Me!</button>
        </>
    )
}