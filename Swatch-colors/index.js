
const swatches = document.querySelectorAll(".swatches__color");
const preview = document.querySelector(".preview");
export function changeColor(e) {
    console.log("here", preview);
    // if (preview.classList.length == 2) {
    //     preview.classList.remove('')
    // }
    Array.from(preview.classList).filter(cls => cls.includes('swatches')).forEach(cl => preview.classList.remove(cl))
    document
        .querySelectorAll(".swatches__color")
        .forEach((swatch) => swatch.classList.remove("selected"));

    preview.classList.add(e.target.classList[1]);
    e.target.classList.add("selected");
}
swatches.forEach((swatch) => {
    swatch.addEventListener("click", debounce(changeColor, 5000));
});


export function throttle(func, time) {

    let throttle = false
    return function (...args) {
        if (throttle) return
        throttle = true
        setTimeout(() => {
            throttle = false
        }, time)
        func.apply(this, args)
    }

}

export function debounce(func, wait) {
    let id = null
    return function (...args) {
        clearTimeout(id)
        id = setTimeout(() => {
            func.apply(this, args)
        }, wait)
    }
}