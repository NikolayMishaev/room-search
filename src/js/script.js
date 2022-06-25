"use strict";
import noUiSlider from "nouislider";
import { debounce } from "debounce";

const state = {
  cardsContainer: document.querySelector(".rooms__cards"),
  loader: document.querySelector(".loader"),
  buttonUp: document.querySelector(".button-up"),
  buttonAddCards: document.querySelector(".rooms__button-add-cards"),
  inputSquareFrom: document.getElementById("square-from"),
  inputSquareTo: document.getElementById("square-to"),
  inputCostFrom: document.getElementById("cost-from"),
  inputCostTo: document.getElementById("cost-to"),
  filterButtonsContainer: document.querySelector(".filter__buttons"),
  filterButtons: document.querySelectorAll(".filter__button"),
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
  sortFloor: "asc",
  sortPrice: "asc",
  sortSquare: "asc",
};

const debounceGetCards = debounce(getCards, 300);

// логика работы ползунков в фильтре

function showSliders() {
  // ползунок стоимости квартиры
  const costSlider = document.getElementById("slider-cost");

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
    const value = values[handle];

    if (handle) {
      state.inputCostTo.value = addSpaceToValue(value.split(".")[0]);
      state.countToSelect = Number(value.split(".")[0]);
      debounceGetCards();
    } else {
      state.inputCostFrom.value = addSpaceToValue(value.split(".")[0]);
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

  // ползунок площади
  const squareSlider = document.getElementById("slider-square");

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
    const value = values[handle];

    if (handle) {
      state.inputSquareTo.value = addSpaceToValue(value.split(".")[0]);
      state.squareToSelect = Number(value.split(".")[0]);
      debounceGetCards();
    } else {
      state.inputSquareFrom.value = addSpaceToValue(value.split(".")[0]);
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
  state.loader.style.display = "block";
  setTimeout(sendRequest, Math.random() * 1000);
  function sendRequest() {
    fetch("./data.json")
      .then((res) =>
        res.ok
          ? res.json()
          : Promise.reject(`Ошибка: ${res.status} ${res.statusText}`)
      )
      .then((data) => {
        if (!state.defaultValues) {
          setDefaultValuesSliders(data);
          showSliders();
        }
        // state.numberCardsDisplayed = 5;
        deleteAllCards();
        state.filteredCards = filterCards(data);
        state.filterButtons.forEach((i) => {
          if (i.disabled) {
            i.classList.remove("filter__button_active");
            state.rooms[state.rooms.indexOf(Number(i.ariaLabel))] = 0;
          }
        });
        showCards();
        toggleVisibleButtonAddCards();
        state.loader.style.display = "none";
      })
      .catch((err) => {
        console.log(err);
        state.loader.style.display = "none";
      });
  }
}

function toggleVisibleButtonAddCards() {
  if (state.numberCardsDisplayed < state.filteredCards.length) {
    state.buttonAddCards.style.display = "block";
  } else {
    state.buttonAddCards.style.display = "none";
  }
}

function deleteAllCards() {
  state.cardsContainer.innerHTML = "";
}

function filterCards(cards) {
  state.filterButtons.forEach((i) => (i.disabled = true));
  return cards.filter((i) => {
    const result =
      Number(i.count) <= state.countToSelect &&
      Number(i.count) >= state.countFromSelect &&
      Number(i.square) <= state.squareToSelect &&
      Number(i.square) >= state.squareFromSelect;
    if (result) {
      state.filterButtons[Number(i.rooms) - 1].disabled = false;
    }
    return result && state.rooms.includes(Number(i.rooms));
  });
}

function addCard(rooms, square, floor, count, number) {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  cardElement.querySelector(".card__room").textContent = rooms;
  cardElement.querySelector(".card__number").textContent = number;
  cardElement.querySelector(".card__square").textContent = square.replace(
    ".",
    ","
  );
  cardElement.querySelector(".card__floor").textContent = floor;
  cardElement.querySelector(".card__count").textContent =
    addSpaceToValue(count);
  state.cardsContainer.append(cardElement);
}

// устанавить значения при первом запуске в соответствии с полученными данными из data.json
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

function toogleActiveClass(button, activeClass) {
  if (button.classList.contains(activeClass)) {
    button.classList.remove(activeClass);
    countActiveClass(state.filterButtons, activeClass);
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

function showCards() {
  state.filteredCards.slice(0, state.numberCardsDisplayed).forEach((i) => {
    const { rooms, square, floor, count, number } = i;
    addCard(rooms, square, floor, count, number);
  });
}

function addSpaceToValue(value) {
  return value.replace(/[^0-9.]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function deleteSpaceFromValue(value) {
  return Number(String(value).replace(/\s/g, ""));
}

function imitationEvent(element, event) {
  element.dispatchEvent(new Event(event));
}

state.filterButtonsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("filter__button")) {
    toogleActiveClass(e.target, "filter__button_active");
    debounceGetCards();
  }
});

state.filterReset.addEventListener("click", () => {
  deleteActiveClass(state.filterButtons, "filter__button_active");
  toogleActiveClass(state.filterButtons[1], "filter__button_active");
  state.inputCostFrom.value = getDefaultValueCountFrom();
  imitationEvent(state.inputCostFrom, "change");
  state.inputCostTo.value = getDefaultValueCountTo();
  imitationEvent(state.inputCostTo, "change");
  state.inputSquareFrom.value = getDefaultValueSquareFrom();
  imitationEvent(state.inputSquareFrom, "change");
  state.inputSquareTo.value = getDefaultValueSquareTo();
  imitationEvent(state.inputSquareTo, "change");
  state.numberCardsDisplayed = 5;
  toggleVisibleButtonAddCards();
  getCards();
});

state.buttonAddCards.addEventListener("click", () => {
  state.numberCardsDisplayed += 20;
  deleteAllCards();
  showCards();
  toggleVisibleButtonAddCards();
});

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

getCards();

document
  .querySelector(".rooms__button_type_floor")
  .addEventListener("click", () => {
    if (state.sortFloor === "asc") {
      state.filteredCards.sort((a, b) => a.floor - b.floor);
      state.sortFloor = "desc";
    } else {
      state.filteredCards.sort((a, b) => b.floor - a.floor);
      state.sortFloor = "asc";
    }
    deleteAllCards();
    showCards();
  });

document
  .querySelector(".rooms__button_type_price")
  .addEventListener("click", () => {
    if (state.sortPrice === "asc") {
      state.filteredCards.sort((a, b) => a.count - b.count);
      state.sortPrice = "desc";
    } else {
      state.filteredCards.sort((a, b) => b.count - a.count);
      state.sortPrice = "asc";
    }
    deleteAllCards();
    showCards();
  });

document
  .querySelector(".rooms__button_type_square")
  .addEventListener("click", () => {
    if (state.sortSquare === "asc") {
      state.filteredCards.sort((a, b) => a.square - b.square);
      state.sortSquare = "desc";
    } else {
      state.filteredCards.sort((a, b) => b.square - a.square);
      state.sortSquare = "asc";
    }
    deleteAllCards();
    showCards();
  });
