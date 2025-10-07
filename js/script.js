// Import color utilities (if available)
let colorValues;
try {
  colorValues = (await import("./colorValues.js")).default;
} catch (error) {
  console.log("Color values module not found, using fallback");
  colorValues = null;
}

// DOM Elements
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const delayBtn = document.getElementById('delayBtn');
const setSpeedBtn = document.getElementById('setSpeedBtn');
const moreInfoBtn = document.getElementById('moreInfoBtn');
const exportBtn = document.getElementById('exportBtn');
const closeInfoBtn = document.getElementById('close-info');

// Time Input
const inputContainer = document.getElementById('inp-container');
const timeInp = document.getElementById('time-input');

// Color Display Container
const displayPort = document.getElementById('display-portal');
const colorInfoContainer = document.getElementById('color-info');

// Colors Generated Container
const colorsContainer = document.getElementById("colors-container");
const colorsListElement = document.getElementById("all-colors");

// Statistics Elements
const statusElement = document.getElementById('status');
const speedElement = document.getElementById('speed');
const colorCountElement = document.getElementById('colorCount');

// Color Details Elements
const colorNameElem = document.getElementById('colorName');
const colorHexElem = document.getElementById('colorHex');
const colorRgbElem = document.getElementById('colorRgb');
const colorHslElem = document.getElementById('colorHsl');
const swatches = document.querySelectorAll('.color-swatch');
console.log(swatches);


// Color Info Section Elements
const baseColorName = document.getElementById('baseColorName');
const baseColorHex = document.getElementById('baseColorHex');
const baseColorRgb = document.getElementById('baseColorRgb');
const baseColorHsl = document.getElementById('baseColorHsl');
const baseColorBox = document.getElementById('base-color-box');

const compColorName = document.getElementById('compColorName');
const compColorHex = document.getElementById('compColorHex');
const compColorRgb = document.getElementById('compColorRgb');
const compColorHsl = document.getElementById('compColorHsl');
const compColorBox = document.getElementById('comp-color-box');

// Loading Spinner
const loadingSpinner = document.getElementById('loading');

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

document.querySelectorAll('.lock-button')

// Utility Functions
const showLoading = (show = true) => {
  if (loadingSpinner) {
    loadingSpinner.classList.toggle('hidden', !show);
  }
};

const getRandomHex = () => {
  const hexCodes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  let hex = '';
  for (let i = 0; i < 6; i++) {
    const randomNum = Math.floor(Math.random() * 16);
    hex += hexCodes[randomNum];
  }
  return hex;
};

const fetchColorValues = (hex) => {
  try {
    if (colorValues) {
      const colorObj = colorValues(hex);
      return [colorObj.base, colorObj.complementary];
    }
  } catch (error) {
    console.log("Color values lookup failed:", error);
  }
  // Fallback: return basic color info
  return [
    { name: 'Unknown', hex: `#${hex}`, rgb: `rgb(${parseInt(hex.slice(0,2),16)},${parseInt(hex.slice(2,4),16)},${parseInt(hex.slice(4,6),16)})`, hsl: 'hsl(0,0%,0%)' },
    { name: 'Unknown', hex: '#000000', rgb: 'rgb(0,0,0)', hsl: 'hsl(0,0%,0%)' }
  ];
};

const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

const hexToHsl = (hex) => {
  // Simple HSL conversion (can be enhanced)
  return 'hsl(180, 100%, 50%)';
};

const updateColorDisplay = (hex) => {
  const colorHex = `#${hex}`;
  const [colorObj, compColorObj] = fetchColorValues(hex);

  // Update currentColor object
  currentColor.baseName = colorObj.name;
  currentColor.baseHex = colorObj.hex;
  currentColor.baseRgb = colorObj.rgb;
  currentColor.baseHsl = colorObj.hsl;
  currentColor.compName = compColorObj.name;
  currentColor.compHex = compColorObj.hex;
  currentColor.compRgb = compColorObj.rgb;
  currentColor.compHsl = compColorObj.hsl;

  // Update UI elements
  colorNameElem.textContent = currentColor.baseName;
  colorHexElem.textContent = currentColor.baseHex;
  colorRgbElem.textContent = currentColor.baseRgb;
  colorHslElem.textContent = currentColor.baseHsl;



};

const changeColor = async () => {
  showLoading(true);
  const hex = getRandomHex();
  const colorHex = `#${hex}`;

  // Update color display
  updateColorDisplay(hex);

  // Show colors container
  colorsContainer.classList.remove('hidden');

  // Add to colors list with modern styling
  const colorItem = document.createElement('li');
  colorItem.className = 'px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md';
  colorItem.style.backgroundColor = `${colorHex}20`;
  colorItem.style.color = colorHex;
  colorItem.textContent = colorHex;

  // Add click functionality
  colorItem.addEventListener('click', () => {
    stopGenerating();
    updateColorDisplay(hex);
  });

  colorsListElement.appendChild(colorItem);

  // Update counter
  totalColors++;
  colorCountElement.textContent = totalColors;

  showLoading(false);
};

const startGenerating = () => {
  if (!isGenerating) {
    isGenerating = true;
    startBtn.textContent = 'Stop';
    startBtn.classList.remove('bg-color-primary', 'hover:bg-blue-600');
    startBtn.classList.add('bg-red-500', 'hover:bg-red-600');

    statusElement.textContent = 'Generating...';
    speedElement.textContent = `${delay} ms`;

    colorInterval = setInterval(changeColor, delay);
  }
};

const stopGenerating = () => {
  if (isGenerating) {
    clearInterval(colorInterval);
    isGenerating = false;

    startBtn.textContent = 'Start';
    startBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
    startBtn.classList.add('bg-color-primary', 'hover:bg-blue-600');

    statusElement.textContent = 'Stopped';
  }
};

const resetChanges = () => {
  stopGenerating();
  delay = 1000;
  totalColors = 0;

  // Reset UI
  speedElement.textContent = `${delay} ms`;
  colorCountElement.textContent = totalColors;
  colorsListElement.innerHTML = '';
  colorsContainer.classList.add('hidden');
  inputContainer.classList.add('hidden');
  delayBtn.textContent = '⚡ Set Speed';
  statusElement.textContent = 'Idle';

  // Reset to initial color
  updateColorDisplay('00FFFF');
};

const showColorInfo = () => {
  stopGenerating();

  // Update color info display
  baseColorBox.style.backgroundColor = currentColor.baseHex;
  baseColorName.textContent = currentColor.baseName || 'Unknown';
  baseColorHex.textContent = currentColor.baseHex;
  baseColorRgb.textContent = currentColor.baseRgb;
  baseColorHsl.textContent = currentColor.baseHsl;

  compColorBox.style.backgroundColor = currentColor.compHex;
  compColorName.textContent = currentColor.compName || 'Unknown';
  compColorHex.textContent = currentColor.compHex;
  compColorRgb.textContent = currentColor.compRgb;
  compColorHsl.textContent = currentColor.compHsl;

  // Show color info
  colorInfoContainer.classList.remove('hidden');
  closeInfoBtn.classList.remove('hidden');
};

const hideColorInfo = () => {
  colorInfoContainer.classList.add('hidden');
  closeInfoBtn.classList.add('hidden');
};

const exportColors = () => {
  const colors = Array.from(colorsListElement.children).map(li => li.textContent);
  const exportData = {
    colors,
    total: totalColors,
    currentColor,
    exportedAt: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `color-roulette-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const checkInput = (num) => {
  if (num < 100 || num > 5000) {
    alert('Please enter a number between 100 and 5000 milliseconds');
    return false;
  }
  return true;
};

// Event Listeners
startBtn.addEventListener('click', () => {
  if (isGenerating) {
    stopGenerating();
  } else {
    startGenerating();
  }
});

resetBtn.addEventListener('click', resetChanges);

delayBtn.addEventListener('click', () => {
  if (inputContainer.classList.contains('hidden')) {
    inputContainer.classList.remove('hidden');
    delayBtn.textContent = 'Cancel';
    timeInp.focus();
  } else {
    inputContainer.classList.add('hidden');
    delayBtn.textContent = '⚡ Set Speed';
    timeInp.value = '';
  }
});

setSpeedBtn.addEventListener('click', () => {
  const newDelay = Number(timeInp.value);
  if (checkInput(newDelay)) {
    delay = newDelay;
    speedElement.textContent = `${delay} ms`;
    inputContainer.classList.add('hidden');
    delayBtn.textContent = '⚡ Set Speed';
    timeInp.value = '';

    if (isGenerating) {
      stopGenerating();
      startGenerating();
    }
  }
});

moreInfoBtn.addEventListener('click', showColorInfo);
exportBtn.addEventListener('click', exportColors);
closeInfoBtn.addEventListener('click', hideColorInfo);

// Close color info when clicking outside
document.addEventListener('click', (event) => {
  if (colorInfoContainer && !colorInfoContainer.contains(event.target) &&
      !moreInfoBtn.contains(event.target) && closeInfoBtn && !closeInfoBtn.classList.contains('hidden')) {
    hideColorInfo();
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    event.preventDefault();
    startBtn.click();
  } else if (event.key === 'Escape') {
    if (!colorInfoContainer.classList.contains('hidden')) {
      hideColorInfo();
    } else if (!inputContainer.classList.contains('hidden')) {
      delayBtn.click();
    }
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎲 Color Roulette initialized');
  updateColorDisplay('00FFFF');
});
