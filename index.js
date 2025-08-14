"use strict";

/*
 * Name: Yvonne Wang
 * Date: October 17, 2024
 * Section: CSE 154 AA
 *
 * This is the JS implementation for my mystery scoop generator. It displays the
 * flavor choices randomly, allows users to enter today's flavors and choose
 * the size for the ice cream, and generates a random ice cream flavor result.
 */
(function() {

  window.addEventListener("load", init);

  const FLAVOR_LIST = [
    "strawberry", "chocolate", "peppermint-stick", "dawg-tracks", "french-vanilla",
    "wildberry-sorbet", "chocolate-peanut-butter", "cookies-&-cream", "birthday-cake",
    "mint-chocolate-chip", "cinnamon-brown-sugar", "acai", "rainbow-sorbet",
    "strawberry-cheesecake", "raspberry-sherbet", "huckleberry", "butter-pecan",
    "pistachio-almond", "salted-caramel", "vanilla", "orange-sherbet", "vanilla-bean",
    "coconut-toasted-pineapple", "mocha-almond-fudge", "chocolate-chip-cookie-dough", "spumoni",
    "salted-caramel-brownie-chocolate", "rocky-road"
  ];

  let todaysFlavors = [];
  let chosenSize = 2;

  /**
   * This function generates ice cream flavor choices, adds event listeners
   * to the drag area to allow dragging flavors and adding flavors, adds an event
   * listener to selecting sizes, and adds an event listener to pushing the go
   * button and generate the result.
   */
  function init() {
    generateICImages();

    const DROP_AREA = qs("#flavors div");
    DROP_AREA.addEventListener("dragover", (evt) => {
      evt.preventDefault();
      evt.dataTransfer.dropEffect = "move";
    });
    DROP_AREA.addEventListener("drop", (evt) => {
      evt.preventDefault();
      let droppedFlavor = gen("img");
      let flavorInfo = evt.dataTransfer.getData("text/plain");
      moveFlavor(droppedFlavor, flavorInfo);
    });

    let sizeChoice = qs("section#size select");
    sizeChoice.addEventListener("change", chooseSize);

    const GO_BUTTON = qs("#go button");
    GO_BUTTON.addEventListener("click", iceCreamResult);
  }

  /**
   * This function generates random ice cream flavor results according to today's
   * flavors that the user indicated and the ice cream size they chose. It shows
   * the results as scoop representations in the "Your ice cream: " area.
   */
  function iceCreamResult() {
    let outputArea = qs("#output section");
    if (outputArea.classList.contains("present-result")) {
      outputArea.innerHTML = "";
    } else {
      outputArea.classList.add("present-result");
    }

    if (todaysFlavors.length === 0) {
      warnNoIceCreamChosen(outputArea);

    } else {
      let result = [];
      for (let i = 0; i < chosenSize; i++) {
        let randomIndex = Math.floor(Math.random() * todaysFlavors.length);
        let randomFlavor = todaysFlavors[randomIndex];
        result.push(randomFlavor);
      }
      for (let i = 0; i < result.length; i++) {
        let thisScoop = gen("img");
        let thisSrc = "img/scoops-cropped/" + result[i].split('/')[2];
        thisScoop.src = thisSrc;
        thisScoop.alt = result[i].split('/')[2].split('.')[0] + " scoop";
        outputArea.appendChild(thisScoop);
      }
      let cone = gen("img");
      cone.src = "img/cone.png";
      cone.alt = "cone";
      cone.classList.add("cone");
      outputArea.appendChild(cone);
    }
  }

  /** This function changes the value of chosenSize based on the user's choice. */
  function chooseSize() {
    let sizeChoice = qs("section#size select");
    const SMALL_SCOOP = 2;
    const LARGE_SCOOP = 4;
    const ARE_YOU_SERIOUS = 15;
    if (sizeChoice.value === "small") {
      chosenSize = SMALL_SCOOP;
    } else if (sizeChoice.value === "large") {
      chosenSize = LARGE_SCOOP;
    } else if (sizeChoice.value === "are-you-serious") {
      chosenSize = ARE_YOU_SERIOUS;
    }
  }

  /**
   * This function adds an ice cream flavor to the drop area and adds it as
   * one of today's flavors.
   * @param {String} droppedFlavor - the ice cream flavor that is choosen to be
   * moved to the drop area
   * @param {String} flavorInfo - the image source of the chosen flavor
   */
  function moveFlavor(droppedFlavor, flavorInfo) {
    const DROP_AREA = qs("#flavors div");

    // add image to drop area
    let shortFlavorInfo = flavorInfo.split('/').slice(-3);
    shortFlavorInfo = shortFlavorInfo.join('/');
    droppedFlavor.src = shortFlavorInfo;
    droppedFlavor.alt = shortFlavorInfo.split('/')[2].split('.')[0];
    droppedFlavor.classList.add("ice-cream-img");

    DROP_AREA.appendChild(droppedFlavor);
    todaysFlavors.push(shortFlavorInfo);

    droppedFlavor.addEventListener("dblclick", doubleClickRemove);

    // modify drop_area class
    if (DROP_AREA.classList.contains("before-drop")) {
      DROP_AREA.classList.replace("before-drop", "after-drop");
    }
  }

  /**
   * This function removes an ice cream flavor from the drop area and the
   * today's flavor list
   */
  function doubleClickRemove() {
    const DROP_AREA = qs("#flavors div");
    this.remove();
    if (DROP_AREA.children.length === 0) {
      DROP_AREA.classList.replace("after-drop", "before-drop");
    }
    let shortFlavorInfo = this.src.split('/').slice(-3);
    shortFlavorInfo = shortFlavorInfo.join('/');
    todaysFlavors.splice(todaysFlavors.indexOf(shortFlavorInfo), 1);
  }

  /**
   * This function adds an ice cream flavor to the drop area and adds it as
   * one of today's flavors when the user double clicks the flavor.
   */
  function doubleClickAdd() {
    let clickedFlavor = gen("img");
    moveFlavor(clickedFlavor, this.src);
  }

  /** This function generates all the ice cream flavor choices in an random order. */
  function generateICImages() {
    // make a temporary list for randomize
    let tempFlavorList = [];
    for (let i = 0; i < FLAVOR_LIST.length; i++) {
      tempFlavorList.push(FLAVOR_LIST[i]);
    }

    for (let i = 0; i < FLAVOR_LIST.length; i++) {
      let newIceCream = gen("img");
      let randomIndex = Math.floor(Math.random() * tempFlavorList.length);
      let theFlavor = tempFlavorList[randomIndex];
      tempFlavorList.splice(randomIndex, 1);

      // set the src and alt
      newIceCream.src = "img/flavors/" + theFlavor + ".png";
      newIceCream.alt = theFlavor;
      newIceCream.classList.add("ice-cream-img");
      qs("section#flavors article").appendChild(newIceCream);

      // add drag event listener
      newIceCream.addEventListener("drag", (evt) => {
        evt.dataTransfer.setData("text/plain", newIceCream.src);
      });
      newIceCream.addEventListener("dblclick", doubleClickAdd);
    }
  }

  /**
   * This function displays a warning message when the user hit the "Go!" button
   * without entering any today's flavors.
   * @param {node} outputArea - the section element under the article with
   * id "output", where the ice cream result is displayed
   */
  function warnNoIceCreamChosen(outputArea) {
    let warningMessage = gen("p");
    warningMessage.textContent = "No ice cream chosen, try again!";
    outputArea.appendChild(warningMessage);
  }

  /**
   * This function returns the first element that matches the CSS selector String
   * @param {String} selector - the CSS selector String
   * @return {node} the first node that matches the CSS selector String or null
   * if no element matches
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * This function creates and returns a new empty DOM node representing an
   * element of the given type
   * @param {String} tagName - the given type
   * @return {node} - an empty node of the given type
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
}
)();