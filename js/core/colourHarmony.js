import Colour from "./colour.js";

/**
 * Class for generating colour harmonies from a base Colour instance.
 */
class ColourHarmony {
  /**
   * Create a ColourHarmony instance.
   * @param {Colour} baseColour - The base colour to generate harmonies from.
   * @throws {Error} If baseColour is not a Colour instance.
   */
  constructor(baseColour) {
    if (!(baseColour instanceof Colour)) {
      throw new Error("baseColour must be an instance of Colour");
    }
    this.baseColour = baseColour;
  }

  /**
   * Private static helper to validate angle values.
   * @param {number} angle - The angle to validate.
   * @param {string} methodName - Name of the method (for error messages).
   */
  static #validateAngle(angle, methodName) {
    if (typeof angle !== "number") {
      throw Error(`${methodName}: angle must be a number`);
    }
    if (!isFinite(angle)) {
      throw Error(`${methodName}: angle must be a finite number`);
    }
  }

  /**
   * Generate the complementary colour palette.
   * @returns {Colour[]} Array with the base colour and its complementary colour.
   */
  complementary() {
    const { h, s, l } = this.baseColour.toHSL();
    const newHue = (h + 180) % 360;
    return [this.baseColour, new Colour(newHue, s, l)];
  }

  /**
   * Generate an analogous colour palette.
   * @param {number} angle - The angle in degrees to offset from the base hue (default 30).
   * @returns {Colour[]} Array with the base colour and two analogous colours.
   */
  analogous(angle = 30) {
    ColourHarmony.#validateAngle(angle, "analogous");
    const { h, s, l } = this.baseColour.toHSL();
    const hue1 = (h + angle) % 360;
    const hue2 = (h - angle + 360) % 360;
    return [new Colour(hue1, s, l), this.baseColour, new Colour(hue2, s, l)];
  }

  /**
   * Generate a triadic colour palette.
   * @param {number} angle - The angle in degrees to offset from the base hue (default 120).
   * @returns {Colour[]} Array with the base colour and two triadic colours.
   */
  triadic(angle = 120) {
    ColourHarmony.#validateAngle(angle, "triadic");
    const { h, s, l } = this.baseColour.toHSL();
    const hue1 = (h + angle) % 360;
    const hue2 = (h - angle + 360) % 360;
    return [new Colour(hue1, s, l), this.baseColour, new Colour(hue2, s, l)];
  }

  /**
   * Generate a tetradic (rectangle) colour palette.
   * @returns {Colour[]} Array with the base colour and three tetradic colours.
   */
  tetradic() {
    const { h, s, l } = this.baseColour.toHSL();
    const hue1 = (h + 90) % 360;
    const hue2 = (h + 180) % 360;
    const hue3 = (h + 270) % 360;
    return [
      this.baseColour,
      new Colour(hue1, s, l),
      new Colour(hue2, s, l),
      new Colour(hue3, s, l),
    ];
  }

  /**
   * Generate a split complementary colour palette.
   * @param {number} angle - The angle in degrees to offset from the direct complement (default 30).
   * @returns {Colour[]} Array with the base colour and two split complementary colours.
   */
  splitComplementary(angle = 30) {
    ColourHarmony.#validateAngle(angle, "splitComplementary");
    const { h, s, l } = this.baseColour.toHSL();
    const hue1 = (h + angle + 180) % 360;
    const hue2 = (h - angle + 180) % 360;
    return [this.baseColour, new Colour(hue1, s, l), new Colour(hue2, s, l)];
  }

  /**
   * Generate a monochromatic palette by varying lightness and optionally saturation.
   * @param {number} steps - Number of colours in the palette (default 5).
   * @param {number[]} lightnessRange - [min, max] lightness values (default [20, 80]).
   * @param {number[]} [saturationRange] - [min, max] saturation values (optional).
   * @returns {Colour[]} Array of monochromatic colours including the base colour.
   */
  monochromatic(steps = 5, lightnessRange = [20, 80], saturationRange) {
    const base = this.baseColour;
    const h = base.getHue();
    const s = base.getSaturation();
    const [minL, maxL] = lightnessRange;
    let minS = s,
      maxS = s;
    if (Array.isArray(saturationRange) && saturationRange.length === 2) {
      [minS, maxS] = saturationRange;
    }
    const palette = [];
    for (let i = 0; i < steps; i++) {
      const l = minL + ((maxL - minL) * i) / (steps - 1);
      const sat = minS + ((maxS - minS) * i) / (steps - 1);
      palette.push(new Colour(h, sat, l));
    }
    if (
      !palette.some(
        (col) =>
          col.getHue() === h &&
          col.getSaturation() === s &&
          col.getLightness() === base.getLightness()
      )
    ) {
      palette.splice(Math.floor(steps / 2), 0, base);
    }
    return palette;
  }

  /**
   * Generate all harmony palettes for the base colour.
   * @returns {Object} An object with all harmony palettes as arrays of Colour objects.
   */
  getAllHarmonies() {
    return {
      complementary: this.complementary(),
      analogous: this.analogous(),
      triadic: this.triadic(),
      tetradic: this.tetradic(),
      splitComplementary: this.splitComplementary(),
      monochromatic: this.monochromatic(),
    };
  }
}

export default ColourHarmony;
