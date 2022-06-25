"use strict";
import noUiSlider from "nouislider";
import { debounce } from "debounce";

const state = {
  // filterForm: document.querySelector(".filter__form"),
  buttonUp: document.querySelector(".button-up"),
  buttonAddCards: document.querySelector(".rooms__button-add-cards"),
  inputSquareFrom: document.getElementById("square-from"),
  inputSquareTo: document.getElementById("square-to"),
  inputCostFrom: document.getElementById("cost-from"),
  inputCostTo: document.getElementById("cost-to"),
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
  rooms: [2],
  defaultValues: false,
  numberCardsDisplayed: 5,
  filteredCards: [],
};

const debounceGetCards = debounce(getCards, 300);

// логика работы ползунков в фильтре

function showSliders() {
  var costSlider = document.getElementById("slider-cost");

  noUiSlider.create(costSlider, {
    start: [getDefaultValueCountFrom(), getDefaultValueCountTo()],
    connect: true,
    step: 1,
    range: {
      min: state.countFrom,
      max: state.countTo,
    },
  });

  costSlider.noUiSlider.on("update", function (values, handle) {
    var value = values[handle];

    if (handle) {
      state.inputCostTo.value = value
        .split(".")[0]
        .replace(/[^0-9.]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      state.countToSelect = Number(value.split(".")[0]);
      debounceGetCards();
    } else {
      state.inputCostFrom.value = value
        .split(".")[0]
        .replace(/[^0-9.]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      state.countFromSelect = Number(value.split(".")[0]);
      debounceGetCards();
    }
  });

  state.inputCostTo.addEventListener("change", function () {
    costSlider.noUiSlider.set([null, deleteSpaceFromValue(this.value)]);
  });

  state.inputCostFrom.addEventListener("change", function () {
    costSlider.noUiSlider.set([deleteSpaceFromValue(this.value), null]);
  });

  //==============================================================

  var squareSlider = document.getElementById("slider-square");

  noUiSlider.create(squareSlider, {
    start: [getDefaultValueSquareFrom(), getDefaultValueSquareTo()],
    connect: true,
    step: 1,
    range: {
      min: state.squareFrom,
      max: state.squareTo,
    },
  });

  squareSlider.noUiSlider.on("update", function (values, handle) {
    var value = values[handle];

    if (handle) {
      state.inputSquareTo.value = value
        .split(".")[0]
        .replace(/[^0-9.]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      state.squareToSelect = Number(value.split(".")[0]);
      debounceGetCards();
    } else {
      state.inputSquareFrom.value = value
        .split(".")[0]
        .replace(/[^0-9.]/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      state.squareFromSelect = Number(value.split(".")[0]);
      debounceGetCards();
    }
  });

  state.inputSquareTo.addEventListener("change", function () {
    squareSlider.noUiSlider.set([null, this.value]);
  });

  state.inputSquareFrom.addEventListener("change", function () {
    squareSlider.noUiSlider.set([this.value, null]);
  });
}

function getDefaultValueCountFrom() {
  return (state.countFrom + state.countTo) / 2 - 1500000;
}

function getDefaultValueCountTo() {
  return (state.countFrom + state.countTo) / 2 + 1500000;
}

function getDefaultValueSquareFrom() {
  return (state.squareFrom + state.squareTo) / 2 - 10;
}

function getDefaultValueSquareTo() {
  return (state.squareFrom + state.squareTo) / 2 + 10;
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
      // state.numberCardsDisplayed = 5;
      deleteAllCards();
      state.filteredCards = filterCards(data);
      showCards();
      toggleVisibleButtonAddCards();
    });
}

function toggleVisibleButtonAddCards() {
  if (state.numberCardsDisplayed < state.filteredCards.length) {
    state.buttonAddCards.style.display = "block";
  } else {
    state.buttonAddCards.style.display = "none";
  }
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
      state.rooms.includes(Number(i.rooms))
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

// state.filterForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   console.log("here");
// });

state.filterButtonsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("filter__button")) {
    toogleActiveClass(e.target, "filter__button_active");
    debounceGetCards();
  }
});

function toogleActiveClass(button, activeClass) {
  if (button.classList.contains(activeClass)) {
    button.classList.remove(activeClass);
    countActiveClass(state.fiterButtons, activeClass);
  } else {
    button.classList.add(activeClass);
    state.rooms.push(Number(button.ariaLabel));
  }
}

function countActiveClass(buttons, activeClass) {
  state.rooms = [];
  buttons.forEach((i) => {
    if (i.classList.contains(activeClass)) {
      state.rooms.push(Number(i.ariaLabel));
    }
  });
}

function deleteActiveClass(buttons, activeClass) {
  state.rooms = [];
  buttons.forEach((i) => i.classList.remove(activeClass));
}

state.filterReset.addEventListener("click", () => {
  deleteActiveClass(state.fiterButtons, "filter__button_active");
  toogleActiveClass(state.fiterButtons[1], "filter__button_active");
  state.inputCostFrom.value = getDefaultValueCountFrom();
  state.inputCostFrom.dispatchEvent(new Event("change"));
  state.inputCostTo.value = getDefaultValueCountTo();
  state.inputCostTo.dispatchEvent(new Event("change"));
  state.inputSquareFrom.value = getDefaultValueSquareFrom();
  state.inputSquareFrom.dispatchEvent(new Event("change"));
  state.inputSquareTo.value = getDefaultValueSquareTo();
  state.inputSquareTo.dispatchEvent(new Event("change"));
  state.numberCardsDisplayed = 5;
  toggleVisibleButtonAddCards();
  getCards();
});

state.buttonAddCards.addEventListener("click", () => {
  state.numberCardsDisplayed += 20;
  showCards();
  toggleVisibleButtonAddCards();
});

function showCards() {
  state.filteredCards.slice(0, state.numberCardsDisplayed).forEach((i) => {
    const { rooms, square, floor, count } = i;
    addCard(rooms, square, floor, count);
  });
}

function deleteSpaceFromValue(value) {
  return Number(String(value).replace(/\s/g, ""));
}

state.buttonUp.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

window.addEventListener("scroll", () => {
  if (scrollY > 0) {
    state.buttonUp.style.display = "inline";
  } else {
    state.buttonUp.style.display = "none";
  }
});
