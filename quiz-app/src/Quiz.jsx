import { useEffect, useState } from "react";



const Quiz = ({ quiz }) => {
    const [selected, setSelected] = useState({id: null,ans:false})

    const onChange = (e, ans) => {

        const obj = {
            id: Number(e.target.value),
            ans: ans
        }
        console.log(obj)
        setSelected(obj)


    }
    return (
        <div className='quiz-container'>
            <h3 className='question'>{ quiz?.questions}</h3>
            <div className='answers'>
                {quiz?.answer?.map((ans, id) => {
                    return (
                        <div  key={`option${id}`} className={selected.id === id? `option option__checked`:`option`}>
                            <label htmlFor={ans.option} style={{width:"100%",height:"100%"}}>
                                <input id={ans.option} type="radio" value={id} name={`q-${id}`} checked={selected.id === id} onChange={(e) => onChange(e, ans.result)} />
                                {ans.option}
                                </label>
                        </div>
                    )
                })}
            </div>
        </div>
    )

}

export default Quiz