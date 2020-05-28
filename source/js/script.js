"use strict";

let header = document.querySelector(".page-header");
let headerToggle = document.querySelector(".page-header__toggle");
let businessButton = document.querySelector(".add-profile__show-business-text");
let businesModal = document.querySelector(".busines-modal");
let businessCloseButton = document.querySelector(".business-modal__close-button");

header.classList.remove("page-header--no-js");

window.addEventListener("scroll", function (evt) {
  evt.preventDefault();
  if (window.pageYOffset > 1) {
    header.classList.add("page-header--scroll");
  } else {
    header.classList.remove("page-header--scroll");
  }
});

headerToggle.addEventListener("click", function (evt) {
  evt.preventDefault();
  header.classList.toggle("page-header--open");
});

businessButton.addEventListener("click", function (evt) {
  evt.preventDefault();
  businesModal.classList.remove("busines-modal--close");
});

businessCloseButton.addEventListener("click", function (evt) {
  evt.preventDefault();
  businesModal.classList.add("busines-modal--close");
});
