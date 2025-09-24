(function () {

    const reset = document.querySelector('.reset')
    const start = document.querySelector('.start')
    const stop = document.querySelector('.stop')


    const hour = document.querySelector('.hour')
    const mins = document.querySelector('.min')
    const secs = document.querySelector('.secs')
    console.log(hour.value)
    start.addEventListener('click', startTimer)
    reset.addEventListener('click', resetTimer)
    let secintervalId = null
    function startTimer(e) {

        // mins.value = '01'
        secintervalId = setInterval(() => {
            timer()
        }, 1000)
    }

    function timer() {
        start.style.display = 'none'
        stop.style.display = 'block'
        if (secs.value > 60) {
            if (mins.value != '') {
                mins.value++
            }
            else mins.value = '01'
            secs.value = Number(secs.value) - 59
        }
        if (mins.value > 60) {
            if (hour.value != '') {
                hour.value++
            }
            else hour.value = '01'
            mins.value = Number(mins.value) - 60
        }

        if (hour.value == '00' && mins.value == '00' && secs.value == '00') {
            hour.value = ''
            mins.value = ''
            secs.value = ''
            start.style.display = 'block'
            stop.style.display = 'none'
        }
        else if (secs.value != 0) {
            secs.value = `${secs.value <= 10 ? '0' : ''}${secs.value - 1}`
        }
        else if (mins.value != 0 && secs.value == 0) {
            mins.value = `${mins.value <= 10 ? '0' : ''}${mins.value - 1}`
            secs.value = 59
        }
        else if (hour.value != 0 && mins.value == 0) {
            hour.value = `${hour.value <= 10 ? '0' : ''}${hour.value - 1}`
            mins.value = 60
        }
    }
    function resetTimer(e) {
        hour.value = '00'
        mins.value = '00'
        secs.value = '00'
        clearInterval(secintervalId)
    }

})()