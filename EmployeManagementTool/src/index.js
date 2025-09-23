(async function(){
    const data = await fetch('src/data.json').then(res=>res.json())
    console.log(data)
    let empList = document.querySelector('.employee__list--col')
    let empDetails = document.querySelector('.employee__display--details')
    let selectedEmpId= data[0].id

    empList.addEventListener('onlick',(e)=>{
        if(e.target.tagName=="SPAN" && selectedEmpId != e.target.id)
            selectedEmpId = e.target.id
    })
    const renderEmpList = ()=>{
        empList.innerHTML = ""
        data?.forEach(element => {
           const emp= document.createElement('span')
           emp.id = element.id
           emp.classList.add('employee__list--items')
           emp.innerHTML = `${element.name} <i class='emp-delete'> ❌</i>`
           empList.append(emp)
           
        });

    }
    renderEmpList() 
})();