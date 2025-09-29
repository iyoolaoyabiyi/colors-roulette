import Colour from "./colour.js";

/**
 * Class to manage a palette of colors, including lock/unlock and random generation.
 */
class Palette {
  #colours = [];
  #locked = [];

  /**
   * Create a Palette instance.
   * @param {number} size - Number of colors in the palette (default 5).
   */
  constructor(size = 5) {
    this.generate(size);
  }

  /**
   * Generate random colors for the palette, only for unlocked positions.
   * @param {number} size - Number of colors to generate (default: current palette size).
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
   * Lock a color at a given index.
   * @param {number} index
   */
  lock(index) {
    if (index >= 0 && index < this.#locked.length) {
      this.#locked[index] = true;
    }
  }

  /**
   * Unlock a color at a given index.
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
