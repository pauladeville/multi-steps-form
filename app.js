let forfaitTitles = ["Arcade", "Expert", "Pro"];
let forfaitPrices = [9, 12, 15];
let optionPrices = [1, 2, 2];
let totalPrice = 3;
let monthButton = document.querySelector("#month");
let yearButton = document.querySelector("#year");
let toggleBar = document.querySelector("#toggle-bar");
let cursor = toggleBar.querySelector(".cursor");
let cartChangeButton = document.querySelector(".cart .forfait-change");
let monthPrices = document.querySelectorAll(".forfait-details-price-month");
let yearPrices = document.querySelectorAll(".forfait-details-price-year");
let annualOffers = document.querySelectorAll(".forfait-details-offer");
let cartForfaitPrice = document.querySelector(".cart .forfait-price-number");
let cartOptionPrices = document.querySelectorAll(".cart .option-price-number");
let cartOptionFrequence = document.querySelectorAll(".cart .option-price-frequence");
let cartOptions = document.querySelectorAll(".cart .option");
let options = [0, 1];
sessionStorage.setItem("options", JSON.stringify(options));
// CALCULATE TOTAL PRICE
function updateTotal(change) {
  totalPrice = totalPrice + change;
  document.querySelector(".total-number").innerHTML = totalPrice + "€";
}
// NAVIGATION BETWEEN STEPS
let activeStep = 0;
const steps = document.querySelectorAll(".form-step");
const stepsNumbers = document.querySelectorAll(".steps-bloc-number");
const buttonPrev = document.querySelector(".navigation .prev");
const buttonNext = document.querySelector(".navigation .next");
function updateNextButton(stepNb) {
  if (stepNb == 3) {
    buttonNext.style.backgroundColor = "hsl(243, 100%, 62%)";
    buttonNext.innerHTML = "Confirmez";
  } else if (stepNb == 4) {
    document.querySelector(".navigation").style.opacity = 0;
  } else {
    buttonNext.style.backgroundColor = "hsl(213, 96%, 18%)";
    buttonNext.innerHTML = "Suivant";
  }
}
function switchStep(stepNb) {
  steps[activeStep].classList.remove("active");
  stepsNumbers[activeStep].classList.remove("active");
  activeStep = stepNb;
  steps[activeStep].classList.add("active");
  stepsNumbers[activeStep].classList.add("active");
  updateNextButton(stepNb);
}
function alertMessage(inputMissing) {
  document.querySelector(".alert-" + inputMissing).classList.add("active");
}
function deactivateAlert(validInput) {
  if (document.querySelector(".alert-" + validInput).classList.contains("active")) {
    document.querySelector(".alert-" + validInput).classList.remove("active");
  }
}
function checkInput(currentStep) {
  if (currentStep === 0) {
    let name = sessionStorage.getItem("name");
    let email = sessionStorage.getItem("email");
    let tel = sessionStorage.getItem("tel");
    let missingFields = [];
    if (!name || name === "") {
      missingFields.push("name");
    }
    if (!email || email === "") {
      missingFields.push("email");
    }
    if (!tel || tel === "") {
      missingFields.push("tel");
    }
    missingFields.forEach((input) => {
      alertMessage(input);
    });
    if (missingFields.length === 0) {
      switchStep(currentStep + 1);
    }
  }
  if (currentStep === 1) {
    let forfait = sessionStorage.getItem("forfait");
    if (forfait && forfait !== "") {
      switchStep(currentStep + 1);
    }
  }
  if (currentStep === 2) {
    switchStep(currentStep + 1);
  }
  if (currentStep === 3) {
    switchStep(currentStep + 1);
    sessionStorage.clear();
  }
}
buttonNext.addEventListener("click", () => {
  if (activeStep + 1 < steps.length) {
    checkInput(activeStep);
    showPreviousInfos();
  }
});
document.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    if (activeStep + 1 < steps.length) {
      checkInput(activeStep);
      showPreviousInfos();
    }
  }
});
buttonPrev.addEventListener("click", () => {
  if (activeStep > 0) {
    switchStep(activeStep - 1);
    showPreviousInfos();
  }
});
// REGISTER ENTRIES
function selectForfait(forfaitNumber) {
  let forfaits = document.querySelectorAll(".forfait");
  for (let i = 0; i < forfaits.length; i++) {
    if (forfaits[i].classList.contains("active")) {
      forfaits[i].classList.remove("active");
    }
  }
  forfaits[forfaitNumber].classList.add("active");
}
function selectOption(clickedOption) {
  if (options.includes(clickedOption)) {
    document.querySelectorAll(".option")[clickedOption].classList.remove("active");
    let index = options.indexOf(clickedOption);
    options.splice(index, 1);
    updateTotal(-optionPrices[clickedOption]);
  } else {
    document.querySelectorAll(".option")[clickedOption].classList.add("active");
    options.push(clickedOption);
    updateTotal(optionPrices[clickedOption]);
  }
  sessionStorage.setItem("options", JSON.stringify(options));
}
function registerEntry(inputId) {
  let inputValue = document.getElementById(inputId).value;
  function validateEntry(inputId, value) {
    sessionStorage.setItem(inputId, value);
    deactivateAlert(inputId);
  }
  switch (inputId) {
    case "name":
      validateEntry("name", inputValue);
      break;
    case "email":
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputValue)) {
        validateEntry("email", inputValue);
      } else {
        alertMessage("email");
      }
      break;
    case "tel":
      if (/^[0-9\s]*$/.test(inputValue)) {
        validateEntry("tel", inputValue);
      } else {
        alertMessage("tel");
      }
      break;
    case "forfait0":
    case "forfait1":
    case "forfait2":
      let previsouForfait = sessionStorage.getItem("forfait");
      if (previsouForfait) {
        updateTotal(-forfaitPrices[previsouForfait]);
      }
      const forfaitNumber = parseInt(inputId.charAt(inputId.length - 1));
      selectForfait(forfaitNumber);
      sessionStorage.setItem("forfait", forfaitNumber);
      updateTotal(forfaitPrices[forfaitNumber]);
      break;
    case "option0":
    case "option1":
    case "option2":
      const optionNumber = parseInt(inputId.charAt(inputId.length - 1));
      selectOption(optionNumber);
  }
}
// SHOWING PREVIOUS INFOS
function showPreviousInfos() {
  if (sessionStorage.getItem("forfait")) {
    let chosenForfait = sessionStorage.getItem("forfait");
    selectForfait(chosenForfait);
    document.querySelector(".cart .forfait-title").innerHTML = forfaitTitles[chosenForfait];
    cartForfaitPrice.innerHTML = forfaitPrices[chosenForfait];
  }
  if (sessionStorage.getItem("frequence")) {
    let frequence = sessionStorage.getItem("frequence");
    updateCartFrequence(frequence);
    if (frequence == "month") {
      document.querySelector(".cart .forfait-frequence").innerHTML = "(par mois)";
      document.querySelector(".total-text-frequence").innerHTML = "(par mois)";
      cartOptionFrequence.forEach((txt) => {
        txt.innerHTML = "mois";
      });
      document.querySelector(".total-number").innerHTML = totalPrice + "€";
    } else if (frequence == "year") {
      document.querySelector(".cart .forfait-frequence").innerHTML = "(par an)";
      document.querySelector(".total-text-frequence").innerHTML = "(par an)";
      cartOptionFrequence.forEach((txt) => {
        txt.innerHTML = "an";
      });
      document.querySelector(".total-number").innerHTML = totalPrice * 10 + "€";
    }
  }
  if (sessionStorage.getItem("options")) {
    let options = JSON.parse(sessionStorage.getItem("options"));
    for (let i = 0; i < cartOptions.length; i++) {
      if (options.includes(i)) {
        cartOptions[i].classList.add("active");
      } else {
        cartOptions[i].classList.remove("active");
      }
    }
    for (let i = 0; i < cartOptionPrices.length; i++) {
      if (sessionStorage.getItem("frequence") == "month") {
        cartOptionPrices[i].innerHTML = optionPrices[i];
      } else if (sessionStorage.getItem("frequence") == "year") {
        cartOptionPrices[i].innerHTML = optionPrices[i] * 10;
      }
    }
  }
  if (sessionStorage.getItem("name")) {
    document.getElementById("name").value = sessionStorage.getItem("name");
  }
  if (sessionStorage.getItem("email")) {
    document.getElementById("email").value = sessionStorage.getItem("email");
  }
  if (sessionStorage.getItem("tel")) {
    document.getElementById("tel").value = sessionStorage.getItem("tel");
  }
}
showPreviousInfos();
// SWITCHING FREQUENCE
function toggleClasses(elements, className, becomeActive) {
  elements.forEach((element) => {
    if (becomeActive) {
      if (!element.classList.contains(className)) {
        element.classList.add(className);
      }
    } else {
      if (element.classList.contains(className)) {
        element.classList.remove(className);
      }
    }
  });
}
function toggleClass(element, className, becomeActive) {
  if (becomeActive) {
    if (!element.classList.contains(className)) {
      element.classList.add(className);
    }
  } else {
    if (element.classList.contains(className)) {
      element.classList.remove(className);
    }
  }
}
function changeInfos(newFrequence) {
  if (newFrequence === "month") {
    toggleClasses(annualOffers, "active", false);
    toggleClasses(monthPrices, "active", true);
    toggleClasses(yearPrices, "active", false);
    toggleClass(yearButton, "active", false);
    toggleClass(monthButton, "active", true);
    toggleClass(cursor, "right", false);
  }
  if (newFrequence === "year") {
    toggleClasses(annualOffers, "active", true);
    toggleClasses(monthPrices, "active", false);
    toggleClasses(yearPrices, "active", true);
    toggleClass(yearButton, "active", true);
    toggleClass(monthButton, "active", false);
    toggleClass(cursor, "right", true);
  }
}
function updateCartFrequence(newFrequence) {
  let chosenForfait = sessionStorage.getItem("forfait");
  if (newFrequence == "month") {
    cartForfaitPrice.innerHTML = forfaitPrices[chosenForfait];
  } else if (newFrequence == "year") {
    cartForfaitPrice.innerHTML = forfaitPrices[chosenForfait] * 10;
  }
}
function setFrequence(frequence) {
  sessionStorage.setItem("frequence", frequence);
}
monthButton.addEventListener("click", () => {
  setFrequence("month");
  changeInfos("month");
});
yearButton.addEventListener("click", () => {
  setFrequence("year");
  changeInfos("year");
});
toggleBar.addEventListener("click", () => {
  let currentFrequence = sessionStorage.getItem("frequence");
  let newFrequence = currentFrequence === "month" ? "year" : "month";
  setFrequence(newFrequence);
  changeInfos(newFrequence);
});
cartChangeButton.addEventListener("click", () => {
  let currentFrequence = sessionStorage.getItem("frequence");
  let newFrequence = currentFrequence === "month" ? "year" : "month";
  setFrequence(newFrequence);
  changeInfos(newFrequence);
  updateCartFrequence(newFrequence);
  showPreviousInfos();
});
setFrequence("month");
document.addEventListener("click", () => {
  console.log(sessionStorage);
  console.log("Total : " + totalPrice);
});
