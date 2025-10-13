/*
JIO STAR
Your team is processing thousands of network requests, but hitting too many endpoints in parallel can overwhelm the browser or server. 
You need to execute a list of asynchronous tasks with limited concurrency. 
Requirements Function Signature function promisePool(tasks, limit) { /* ...
 tasks Array of functions that return a Promise (e.g., () => fetch(url) or () => delay(1000)). limit: Maximum number of tasks running concurrently.
  Return: A Promise that resolves when all tasks complete. 
  Behavior Start at most limit tasks at a time. When a task resolves, start the next queued task until all are done. 
  The output order should match the input order. If a task rejects, continue processing the remaining tasks (don’t halt). 
  Constraints Use only native Promises (no external libraries). Do not modify tasks or convert them into a single Promise.all without limiting concurrency. 
  Assume tasks can take variable time to resolve.
 */

async function promisePool(tasks, limit) {
    let result = new Array(tasks.length)
    let count = 0

    const executeTask = async () => {
        while (count < tasks.length) {
            const idx = count++
            try {
                const res = await tasks[idx]()
                result[idx] = res
                console.log(`✅ Finished task ${idx}`);
            }
            catch (e) {
                console.log(`❌ Task ${idx} failed:`, e);
                result[idx] = e
            }
        }
    }

    const limitTasks = Array.from({ length: Math.min(limit, tasks.length) }, executeTask)
    await Promise.all(limitTasks)
    console.log("🏁 All tasks complete");
    return result
}

const delay = (ms, label) => () =>
    new Promise(resolve => {
        console.log(`Task ${label} scheduled for ${ms}ms`);
        setTimeout(() => resolve(label), ms);
    });

const tasks = [
    delay(300, "A"),
    delay(100, "B"),
    delay(200, "C"),
    delay(50, "D")
];

(async () => {
    const results = await promisePool(tasks, 2);
    console.log("Results:", results);
})();


function debounce(func, duration) {
    let id;
    return function (...args) {
        clearTimeout(id)
        id = setTimeout(() => {
            func.call(this, args)
        }, duration)
    }
}

function throttle(func, duration) {
    let trottle = false
    return function (...args) {
        if (trottle) return
        trottle = true
        setTimeout(() => {
            trottle = false
        }, duration)
        func.call(this, args)
    }
}

function myPromiseAllSettled(iteratable) {
    let result = new Array(iteratable.length)
    let count = iteratable.length()

    return new Promise((resolve, reject) => {
        iteratable.forEach((item, i) => {
            Promise.resolve(item).then(val => {
                result[i] = { status: 'fullfilled', value: val }
            }, (reason) => {
                result[i] = { status: 'rejected', reason }
            }).finally(() => {
                completed++;
                if (count === iteratable.length) {
                    resolve(result);
                }
            })

        })


    })

}


function myMap(func, thisArg) {
    const res = []
    const arr = this
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr)) continue
        res[i] = func.call(thisArg, arr[i], i, arr)
    }
    return res
}

function filter(func, thisArg) {
    const res = []
    const arr = this
    for (let i = 0; i < arr.length; i++) {
        if (!(i in arr)) continue
        if (func.call(thisArg, arr[i], i, arr)) {
            res.push(arr[i])
        }

    }
    return res
}

function myReduce(func, initialVal) {

    const arr = this
    if (arr.length < 1) {
        throw new TypeError('d')
    }
    const hasInitial = false
    if (arguments > 1) {
        hasInitial = true
    }
    let res = initialVal ? initialVal : arr[0]
    let idx = initialVal ? 0 : 1

    for (let i = idx; i < arr.length; i++) {
        res = func(res, arr[i], i, arr)
    }
    return res
}