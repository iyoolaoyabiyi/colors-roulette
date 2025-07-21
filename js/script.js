import colorValues from "./colorValues.js";
// Buttons
const allBtns = document.querySelector(".btns");
const delayBtn = allBtns.querySelector('#delayBtn');
const startBtn = allBtns.querySelector('#startBtn');
// Time Input
const inputContainer = document.getElementById('inp-container');
const timeInp = document.getElementById('time-input');
// Color Display Container
const displayPort = document.getElementById('display-portal');
const colorInfoContainer = document.getElementById('color-info');
const closeInfoElem = document.getElementById('close-info');
// Colors Generated Container
const colorsContainer = document.getElementById("colors-container");
const colorsListElement = document.getElementById("all-colors");
// Stats
const stats = document.querySelectorAll("#stats p span");
const gStatusElement = stats[0];
const gDelayElement = stats[1];
const gColorsAmountElement = stats[2];
// Color Details
const colorDetailsP = document.querySelectorAll("#colorDetails p");
const colorDetails = document.querySelectorAll("#colorDetails p span");
// const colorSectSpans = document.querySelectorAll('.color-sect span');
const colorNameElem = colorDetails[0];
const colorHexElem = colorDetails[1];
const colorRgbElem = colorDetails[2];
const colorHslElem = colorDetails[3];
const colorInfoBtn = displayPort.querySelector(`button`);
// Color Info Section
const baseColorInfo = document.querySelectorAll("#base-color p span");
const baseColorName = baseColorInfo[0];
const baseColorHex = baseColorInfo[1];
const baseColorRgb = baseColorInfo[2];
const baseColorHsl = baseColorInfo[3];
const baseColorBox = document.getElementById('base-color-box');
const compColorInfo = document.querySelectorAll("#comp-color p span");
const compColorName = compColorInfo[0];
const compColorHex = compColorInfo[1];
const compColorRgb = compColorInfo[2];
const compColorHsl = compColorInfo[3];
const compColorBox = document.getElementById('comp-color-box');

// Global Variables
let isGenerating = false;
let colorInterval;
let delay = 1000;
let totalColors = 0;
const currentColor = {
  baseName: 'Aqua',
  baseHex: '#00FFFF',
  baseRgb: 'rgb(0, 255, 255)',
  baseHsl: 'hsl(180, 100%, 50%)',
  compName: 'Red',
  compHex: '#FF0000',
  compRgb: 'rgb(255, 0, 0)',
  compHsl: 'hsl(0, 100%, 50%)'
};

// Generate a random color
const getRandomHex = () => {
  const hexCodes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  let hex = '';
  for(let i = 0; i < 6; i++) {
    const randomNum = Math.floor(Math.random() * 16);
    hex += hexCodes[randomNum];
  }
  return hex;
}

const fetchColorValues = hex => {
  try {
    const colorObj = colorValues(hex);
    return [colorObj.base, colorObj.complementary];
  } catch (error) {
    console.log(error);
  }
}
// Change colors in ui
const changeElementColors = hex => {
  try {
    const colorHex = `#${hex}`;
    const [colorObj, compColorObj] = fetchColorValues(hex)
    // Update currentColor
    currentColor.baseName = colorObj.name;
    currentColor.baseHex = colorObj.hex;
    currentColor.baseRgb = colorObj.rgb
    currentColor.baseHsl = colorObj.hsl;
    currentColor.compName = compColorObj.name;
    currentColor.compHex = compColorObj.hex;
    currentColor.compRgb = compColorObj.rgb;
    currentColor.compHsl = compColorObj.hsl;
    // Change Elements Color
    displayPort.style.background = currentColor.baseHex;
    colorDetailsP.forEach(p => {
      p.style.color = currentColor.compHex;
    });
    colorInfoBtn.style.background = currentColor.compHex;
    colorInfoBtn.style.color = currentColor.baseHex;
    // Change Elements Text
    colorNameElem.innerText = currentColor.baseName;
    colorHexElem.innerText = currentColor.baseHex;
    colorRgbElem.innerText = currentColor.baseRgb;
    colorHslElem.innerText = currentColor.baseHsl;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}
// Handle color generation
const changeColor = async () => {
  const hex = getRandomHex();
  const colorHex = `#${hex}`;
  changeElementColors(hex);

  colorsContainer.style.display = "flex";
  colorsListElement.innerHTML += `<li>${colorHex}</li>`;

  totalColors += 1;
  gColorsAmountElement.innerText = totalColors;

  colorsListElement.querySelectorAll('li').forEach(colorItem => {
    const color = colorItem.textContent;
    colorItem.style.color = color;
    colorItem.addEventListener("click", () => {
      stopGenerating();
      changeElementColors(color.replace('#',''));
    });
    colorItem.addEventListener("mouseenter", () => {
      colorItem.style.color = `${color}88`;
    });
    colorItem.addEventListener("mouseleave", () => {
      colorItem.style.color = `${color}`;
    });
  });
}
// Start generating colors
const startGenerating = () => {
  gDelayElement.innerText = delay;
  inputContainer.style.display = 'none';
  delayBtn.textContent = 'set speed';
  gStatusElement.innerText = "Generating...";
  timeInp.value = "";
  if (!isGenerating) {
    colorInterval = setInterval(changeColor, delay);
    isGenerating = true;
  }
}
// Stop generating colors
const stopGenerating = () => {
  if(isGenerating) {
    clearInterval(colorInterval);
    isGenerating = false;
    gStatusElement.innerText = "Stopped generating";
  }
}
// Reset Program
const resetChanges = () => {
  stopGenerating();
  delay = 1000;
  totalColors = 0;
  gDelayElement.innerHTML = delay;
  gColorsAmountElement.innerText = totalColors;
  colorsListElement.innerHTML = "";
  colorsContainer.style.display = "none";
  inputContainer.style.display = 'none';
  delayBtn.textContent = 'set speed';
  startBtn.textContent = 'start';
  gStatusElement.innerText = "Idle";
  changeElementColors("00FFFF");
}
// Show Full Color Information 
const showColorInfo = () => {
  stopGenerating();
  colorInfoContainer.classList.remove('hidden');
  baseColorBox.style.background = currentColor.baseHex;
  baseColorName.innerText = currentColor.baseName ? currentColor.baseName : `Unknown`;;
  baseColorHex.innerText = currentColor.baseHex;
  baseColorRgb.innerText = currentColor.baseRgb;
  baseColorHex.innerText = currentColor.baseHex;
  compColorBox.style.background = currentColor.compHex;
  compColorName.innerText = currentColor.compName ? currentColor.compName : `Unknown`;
  compColorHex.innerText = currentColor.compHex;
  compColorRgb.innerText = currentColor.compRgb;
  compColorHsl.innerText = currentColor.compHsl;
}
// Check speed input
const checkInput = num => {
  if (num < 100 || num > 5000) {
    alert('Enter a number between 100 and 5000');
    return false;
  } else {
    return true;
  }
}
// Button Events
allBtns.addEventListener('click', (e) => {
  const btn = e.target;
  switch(btn.textContent) {
    case "start":
    case 'continue':
      startGenerating();
      btn.textContent = 'stop';
      break;
    case "stop":
        stopGenerating();
        btn.textContent = 'continue';
        break;
    case "reset":
      resetChanges();
      break;
    case "set speed":
      stopGenerating();
      inputContainer.style.display = 'flex';
      btn.textContent = 'cancel';
      break;
    case "cancel":
      stopGenerating();
      inputContainer.style.display = 'none';
      btn.textContent = 'set speed';
      timeInp.value = "";
      break;
    default:
      break;
  }
});
timeInp.nextElementSibling.addEventListener('click', () => {
  let isInput = checkInput(Number(timeInp.value));
  if (isInput) {
    delay = Number(timeInp.value);
    startGenerating();
  }
});
colorInfoBtn.addEventListener('click', showColorInfo);
closeInfoElem.addEventListener('click', () => {
  colorInfoContainer.classList.add('hidden');
});
document.addEventListener('click', function(event) {
  // Check if the clicked element is not the target element
  if (!colorInfoContainer.contains(event.target) && event.target !== colorInfoBtn) {
    colorInfoContainer.classList.add('hidden');
  }
});
