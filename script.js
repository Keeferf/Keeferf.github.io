// script.js
document.addEventListener("scroll", function () {
  const scrollPercentage =
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
    100;
  const darkGray = `rgb(${51 + scrollPercentage * 0.5}, ${51 + scrollPercentage * 0.5}, ${
    51 + scrollPercentage * 0.5
  })`;
  document.body.style.background = `linear-gradient(to bottom, #f4f4f4, ${darkGray})`;
});
