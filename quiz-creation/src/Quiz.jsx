import React, { useState } from 'react'

const Quiz = ({ data, selected, answerCallback }) => {

    return (
        <div className='flex flex-col rounded-4xl border-1 border-blue-400 bg-white p-16'>
            <h3 className='font-bold text-2xl w-full py-8'>{data.id}. {data.questions}</h3>
            <div className='grid grid-cols-2 gap-4 '>
                {data?.answer?.map((ans, idx) => {
                    const id = data.id + idx
                    return (
                        <label className='border-1 border-solid border-blue-700 p-4 rounded-xl' key={id} htmlFor={id} >
                            <input className='mr-8' id={id} type={data.type ? data.type : 'radio'} name={data.id} value={idx} checked={selected === idx} onChange={() => { answerCallback(data.id, idx, ans.result) }} />
                            {ans.option}</label>
                    )
                })}

            </div>

        </div>
    )
}

export default Quiz