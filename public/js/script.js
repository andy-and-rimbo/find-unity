document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("find-unity JS imported successfully!");
  },
  false
);

function myFunction() {
  const nav = document.querySelector('nav');
  if (nav.className === "topnav") {
    nav.className += " responsive";
  } else {
    nav.className = "topnav";
  }
}

// document.querySelector(".icon").addEventListener("click", () => {
//   console.log('clicked');
  
// })
