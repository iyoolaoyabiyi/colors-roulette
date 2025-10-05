import Colour from "./colour.js";
import ColourHarmony from "./colourHarmony.js";

/**
 * Class to manage a palette of colours, including lock/unlock and random generation.
 */
class Palette {
  #colours = [];
  #locked = [];

  /**
   * Create a Palette instance.
   * @param {number} size - Number of colours in the palette (default 5).
   */
  constructor(size = 5) {
    this.generate(size);
  }

  /**
   * Generate random colours for the palette, only for unlocked positions.
   * @param {number} size - Number of colours to generate (default: current palette size).
   */
  generate(size = this.#colours.length) {
    if (this.#colours.length === 0) {
      this.#colours = Array(size).fill(null);
      this.#locked = Array(size).fill(false);
    }
    for (let i = 0; i < size; i++) {
      if (!this.#locked[i]) {
        this.#colours[i] = Palette.randomColour();
      }
    }
  }

  /**
   * Lock a colour at a given index.
   * @param {number} index
   */
  lock(index) {
    if (index >= 0 && index < this.#locked.length) {
      this.#locked[index] = true;
    }
  }

  /**
   * Unlock a colour at a given index.
   * @param {number} index
   */
  unlock(index) {
    if (index >= 0 && index < this.#locked.length) {
      this.#locked[index] = false;
    }
  }

  /**
   * Get the current palette as an array of Colour objects.
   * @returns {Colour[]}
   */
  getColours() {
    return this.#colours.slice();
  }

  /**
   * Get the lock status array.
   * @returns {boolean[]}
   */
  getLocked() {
    return this.#locked.slice();
  }

  /**
   * Export the palette as an array of HEX strings.
   * @returns {string[]}
   */
  exportHEX() {
    return this.#colours.map((col) => col.toHex());
  }

  /**
   * Import a palette from an array of HEX strings.
   * @param {string[]} hexArray
   */
  importHEX(hexArray) {
    this.#colours = hexArray.map((hex) => Colour.fromHEX(hex));
    this.#locked = Array(this.#colours.length).fill(false);
  }

  /**
   * Static method to generate a random Colour instance.
   * @returns {Colour}
   */
  static randomColour() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 41) + 60; // 60-100% for vibrancy
    const l = Math.floor(Math.random() * 41) + 40; // 40-80% for good visibility
    return new Colour(h, s, l);
  }
}

export default Palette;

if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
  console.log("=== Testing Colour Class ===");
const c1 = new Colour(200, 80, 60);
console.log("Original Colour (HSL):", c1.toHSL());
console.log("To HEX:", c1.toHex());
console.log("To RGB:", c1.toRGB());

const lighter = c1.adjustLightness(20);
console.log("Lighter Colour:", lighter.toHSL());

const moreSaturated = c1.adjustSaturation(10);
console.log("More Saturated:", moreSaturated.toHSL());

const rotated = c1.rotateHue(120);
console.log("Hue Rotated +120°:", rotated.toHSL());

console.log("\n=== Testing Palette Class ===");
const palette = new Palette(5);
console.log("Initial Palette HEX:", palette.exportHEX());

palette.lock(2);
palette.generate();
console.log(
  "Palette after locking index 2 and regenerating:",
  palette.exportHEX()
);

palette.unlock(2);
palette.generate();
console.log(
  "Palette after unlocking index 2 and regenerating:",
  palette.exportHEX()
);

const hexArray = ["#FF5733", "#33FF57", "#3357FF", "#F0F0F0", "#222222"];
palette.importHEX(hexArray);
console.log("Palette after importing HEX array:", palette.exportHEX());

console.log("\n=== Testing Colour Static Methods ===");
const fromHex = Colour.fromHEX("#FFAA00");
console.log("Colour from HEX #FFAA00:", fromHex.toHSL());

const fromRgb = Colour.fromRGB(10, 200, 100);
console.log("Colour from RGB(10,200,100):", fromRgb.toHSL());

console.log("\n=== Testing ColourHarmony Class ===");
const harmony = new ColourHarmony(c1);
console.log(
  "Complementary:",
  harmony.complementary().map((c) => c.toHex())
);
console.log(
  "Analogous:",
  harmony.analogous().map((c) => c.toHex())
);
console.log(
  "Triadic:",
  harmony.triadic().map((c) => c.toHex())
);
console.log(
  "Tetradic:",
  harmony.tetradic().map((c) => c.toHex())
);
  console.log(
    "Monochromatic:",
    harmony.monochromatic().map((c) => c.toHex())
  );
}
