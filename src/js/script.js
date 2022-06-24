import noUiSlider from "nouislider";

var costSlider = document.getElementById("slider-cost");
const from = 1000000;
const to = 2000000;

noUiSlider.create(costSlider, {
  start: [(from + to) / 2 - 250000, (from + to) / 2 + 250000],
  connect: true,
  step: 15000,
  range: {
    min: from,
    max: to,
  },
});

var inputNumber = document.getElementById("cost-to");
var inputNumber2 = document.getElementById("cost-from");

costSlider.noUiSlider.on("update", function (values, handle) {
  var value = values[handle];

  if (handle) {
    inputNumber.value = value
      .split(".")[0]
      .replace(/[^0-9.]/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    console.log("right");
  } else {
    inputNumber2.value = value
      .split(".")[0]
      .replace(/[^0-9.]/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    console.log("left");
  }
});

inputNumber.addEventListener("change", function () {
  costSlider.noUiSlider.set([null, this.value]);
  console.log("ok1");
});

inputNumber2.addEventListener("change", function () {
  costSlider.noUiSlider.set([this.value, null]);
  console.log("ok2");
});

//==============================================================

var squareSlider = document.getElementById("slider-square");
const from1 = 20;
const to1 = 150;

noUiSlider.create(squareSlider, {
  start: [(from1 + to1) / 2 - 10, (from1 + to1) / 2 + 10],
  connect: true,
  step: 1,
  range: {
    min: from1,
    max: to1,
  },
});

var inputNumber3 = document.getElementById("square-to");
var inputNumber4 = document.getElementById("square-from");

squareSlider.noUiSlider.on("update", function (values, handle) {
  var value = values[handle];

  if (handle) {
    inputNumber3.value = value
      .split(".")[0]
      .replace(/[^0-9.]/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    console.log("right");
  } else {
    inputNumber4.value = value
      .split(".")[0]
      .replace(/[^0-9.]/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    console.log("left");
  }
});

inputNumber3.addEventListener("change", function () {
  squareSlider.noUiSlider.set([null, this.value]);
  console.log("ok1");
});

inputNumber4.addEventListener("change", function () {
  squareSlider.noUiSlider.set([this.value, null]);
  console.log("ok2");
});
