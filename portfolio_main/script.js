let bdy = document.querySelector('body')
let mode = document.querySelector('.mode')
let check = false
mode.addEventListener('click', ()=>{
    bdy.classList.toggle('background')
    check = !check
    let img = document.createElement('img')
    if(check){
        img.setAttribute('src', './image/night.png')
        img.setAttribute('width', '30px')
        mode.innerHTML = "";
        mode.appendChild(img)
    }
    else{
        img.setAttribute('src', './image/light.png')
        img.setAttribute('width', '40px')
        mode.innerHTML = "";
        mode.appendChild(img)
    }
})