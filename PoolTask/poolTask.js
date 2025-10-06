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