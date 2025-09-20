import { createContext, useState } from "react"
import { Comp2 } from "./comp2"
import { NameContext } from "./name-context"
export const Comp1 = () => {
    const [name, setName] = useState('secret only to comp4')
    const  nameContext = createContext(name)
    return (
        <NameContext.Provider value={{name,setName}}>
            <h2>This is comp1</h2>
            <Comp2 />
        </NameContext.Provider>
    )
}