import { useCallback, useState } from "react"
// {
//       "id": "que_1",
//       "type": "single",           // "single" or "multi"
//       "text": "Which hook manages local state?",
//       "options": [
//         { "id": "opt_a", "text": "useEffect" },
//         { "id": "opt_b", "text": "useState" },
//         { "id": "opt_c", "text": "useMemo" }
//       ],
//       "correctIds": ["opt_b"]     // single-choice → one id; multi → many ids
//     }



const QuizGenerator = () => {
    const [quiz, setQuiz] = useState([])
    const addQuestion = () => {
        const arr = [...quiz,
        {
            id: `q_${quiz.length}`,
            title: "",
            type: 'radio',
            options: [
                { "id": "opt_a", "text": "option1" },
                { "id": "opt_b", "text": "option 2" }],
            ans: ["opt_a"]

        }]
        setQuiz(arr)
    }
    const updateOptions = (qId, opt) => {


        setQuiz(prev =>
            prev.map(q => {
                if (q.id !== qId) return q
                if (q.type === 'radio')
                    return { ...q, ans: [opt.id] }
                else {
                    const newAns = q.ans
                    if (newAns.includes(opt.id)) {
                        newAns.pop(opt.id)
                    }
                    newAns.push(opt.id)
                    return { ...q, ans: newAns }
                }
            }
            ))

    }
    const uid = () => Math.random().toString(36).slice(2, 10);
    const addOption = useCallback((id) => {

        setQuiz(prev =>
            prev.map(q =>
                q.id === id
                    ? {
                        ...q,
                        options: [
                            ...q.options,
                            { id: uid(), text: `Option ${q.options.length + 1}` }
                        ]
                    }
                    : q
            )
        )
    }, [])

    return (
        <div className="flex flex-col">
            <button className="h-10 w-40 bg-amber-300 cursor-pointer rounded-2xl" onClick={() => addQuestion()} >Add Question</button>
            {quiz && quiz.map((item, idx) => {
                return (
                    <div key={item.id} className="p-8 mt-10 border border-dashed rounded-2xl bg-gray-300 flex flex-col gap-6">
                        <div className="flex justify-between">
                            <label className="flex flex-col gap-4 text-left w-full " htmlFor={item?.id}>
                                Question {idx + 1}
                                <input className="h-10 bg-white rounded-xs pl-1" id={item.id} type="text" placeholder='Enter the question' required={true} />
                                <button className="h-10 w-40 bg-amber-300 cursor-pointer rounded-2xl" onClick={() => addOption(item.id)}>Add Option</button>
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {item.options && item.options.map((opt, opt_idx) => {
                                return (

                                    <label className='border-1 border-solid border-blue-700 p-4 rounded-xl' key={opt.id} htmlFor={opt.id} >
                                        <input className='mr-8' id={opt.id} type={item.type ? item.type : 'radio'} name={item.id} value={opt.text} checked={item.ans.includes(opt.id)} onChange={() => updateOptions(item.id, opt)} />
                                        {opt.text}</label>

                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default QuizGenerator