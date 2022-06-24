"use strict";

const state = {
  filterForm: document.querySelector(".filter__form"),
  filterButtonsContainer: document.querySelector(".filter__buttons"),
  fiterButtons: document.querySelectorAll(".filter__button"),
  filterReset: document.querySelector(".filter__reset"),
  countFromSelect: 0,
  countToSelect: 0,
  countFrom: 0,
  countTo: 0,
  squareFromSelect: 0,
  squareToSelect: 0,
  squareFrom: 0,
  squareTo: 0,
  rooms: 2,
  defaultValues: false,
};

// логика работы ползунков в фильтре
import noUiSlider from "nouislider";

function showSliders() {
  var costSlider = document.getElementById("slider-cost");

  noUiSlider.create(costSlider, {
    start: [
      (state.countFrom + state.countTo) / 2 - 500000,
      (state.countFrom + state.countTo) / 2 + 500000,
    ],
    connect: true,
    step: 15000,
    range: {
      min: state.countFrom,
      max: state.countTo,
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
      state.countToSelect = Number(value.split(".")[0]);
      getCards();
    } else {
      inputNumber2.value = value
        .split(".")[0]
        .replace(/[^0-9.]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      state.countFromSelect = Number(value.split(".")[0]);
      getCards();
    }
  });

  inputNumber.addEventListener("change", function () {
    costSlider.noUiSlider.set([null, this.value]);
  });

  inputNumber2.addEventListener("change", function () {
    costSlider.noUiSlider.set([this.value, null]);
  });

  //==============================================================

  var squareSlider = document.getElementById("slider-square");

  noUiSlider.create(squareSlider, {
    start: [
      (state.squareFrom + state.squareTo) / 2 - 10,
      (state.squareFrom + state.squareTo) / 2 + 10,
    ],
    connect: true,
    step: 1,
    range: {
      min: state.squareFrom,
      max: state.squareTo,
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
      state.squareToSelect = Number(value.split(".")[0]);
      getCards();
    } else {
      inputNumber4.value = value
        .split(".")[0]
        .replace(/[^0-9.]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      state.squareFromSelect = Number(value.split(".")[0]);
      getCards();
    }
  });

  inputNumber3.addEventListener("change", function () {
    squareSlider.noUiSlider.set([null, this.value]);
  });

  inputNumber4.addEventListener("change", function () {
    squareSlider.noUiSlider.set([this.value, null]);
  });
}

// получение данных из json-файла
function getCards() {
  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      if (!state.defaultValues) {
        setDefaultValuesSliders(data);
        showSliders();
      }
      deleteAllCards();
      const filteredCards = filterCards(data);
      filteredCards.forEach((i) => {
        const { rooms, square, floor, count } = i;
        addCard(rooms, square, floor, count);
      });
    });
}

const cardsContainer = document.querySelector(".rooms__cards");

function deleteAllCards() {
  cardsContainer.innerHTML = "";
}

function filterCards(cards) {
  return cards.filter(
    (i) =>
      Number(i.count) <= state.countToSelect &&
      Number(i.count) >= state.countFromSelect &&
      Number(i.square) <= state.squareToSelect &&
      Number(i.square) >= state.squareFromSelect &&
      Number(i.rooms) === state.rooms
  );
}

function addCard(rooms, square, floor, count) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  cardElement.querySelector(".card__room").textContent = rooms;
  cardElement.querySelector(".card__square").textContent = square.replace(
    ".",
    ","
  );
  cardElement.querySelector(".card__floor").textContent = floor;
  cardElement.querySelector(".card__count").textContent = count;
  cardsContainer.append(cardElement);
}

// устанавить значения при первом запуске в соответствии с полученными данными
function setDefaultValuesSliders(cards) {
  cards.forEach((i) => {
    setCountFrom(i);
    setCountTo(i);
    setSquareFrom(i);
    setSquareTo(i);
  });
  state.defaultValues = true;
}

function setCountFrom(i) {
  if (!state.countFrom) {
    state.countFrom = Number(i.count);
  } else {
    if (Number(i.count) < state.countFrom) {
      state.countFrom = Number(i.count);
    }
  }
}

function setCountTo(i) {
  if (!state.countTo) {
    state.countTo = Number(i.count);
  } else {
    if (Number(i.count) > state.countTo) {
      state.countTo = Number(i.count);
    }
  }
}

function setSquareFrom(i) {
  if (!state.squareFrom) {
    state.squareFrom = Number(i.square);
  } else {
    if (Number(i.square) < state.squareFrom) {
      state.squareFrom = Number(i.square);
    }
  }
}

function setSquareTo(i) {
  if (!state.squareTo) {
    state.squareTo = Number(i.square);
  } else {
    if (Number(i.square) > state.squareTo) {
      state.squareTo = Number(i.square);
    }
  }
}

getCards();

state.filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

state.filterButtonsContainer.addEventListener("click", (e) => {
  console.log(e.target);
  if (
    e.target.classList.contains("filter__button") &&
    !e.target.classList.contains("filter__button_active")
  ) {
    deleteActiveClass(state.fiterButtons, "filter__button_active");
    e.target.classList.add("filter__button_active");
    state.rooms = Number(e.target.ariaLabel);
    getCards();
  }
});

function deleteActiveClass(array, activeClass) {
  array.forEach((i) => i.classList.remove(activeClass));
}

state.filterReset.addEventListener("click", () => {});
