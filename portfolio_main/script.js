let bdy = document.querySelector("body");
let mode = document.querySelector(".mode");
let check = false;
mode.addEventListener("click", () => {
  bdy.classList.toggle("background");
  check = !check;
  let img = document.querySelector(".mode img");
  if (check) {
    img.setAttribute("src", "./image/night.png");
  } else {
    img.setAttribute("src", "./image/light.png");
  }
});
const messages = () => {
  alert("contact me to get email and resume info ");
};
