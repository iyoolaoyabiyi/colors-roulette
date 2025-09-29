// imports from colour class
import Colour from "./colour.js";

/**
 * Class for generating color harmonies from a base Colour instance.
 */
class ColorHarmony {
  /**
   * Create a ColorHarmony instance.
   * @param {Colour} baseColour - The base color to generate harmonies from.
   * @throws {Error} If baseColour is not a Colour instance.
   */
  constructor(baseColour) {
    if (!(baseColour instanceof Colour)) {
      throw new Error("baseColour must be an instance of Colour");
    }
    this.baseColour = baseColour;
  }

  /**
   * Generate the complementary color palette.
   * @returns {Colour[]} Array with the base color and its complementary color.
   */
  complementary() {
    const { h, s, l } = this.baseColour.toHSL();
    const newHue = (h + 180) % 360;
    return [this.baseColour, new Colour(newHue, s, l)];
  }

  /**
   * Generate an analogous color palette.
   * @param {number} angle - The angle in degrees to offset from the base hue (default 30).
   * @returns {Colour[]} Array with the base color and two analogous colors.
   */
  analogous(angle = 30) {
    const { h, s, l } = this.baseColour.toHSL();
    const hue1 = (h + angle) % 360;
    const hue2 = (h - angle + 360) % 360;
    return [new Colour(hue1, s, l), this.baseColour, new Colour(hue2, s, l)];
  }

  /**
   * Generate a triadic color palette.
   * @param {number} angle - The angle in degrees to offset from the base hue (default 120).
   * @returns {Colour[]} Array with the base color and two triadic colors.
   */
  triadic(angle = 120) {
    const { h, s, l } = this.baseColour.toHSL();
    const hue1 = (h + angle) % 360;
    const hue2 = (h - angle + 360) % 360;
    return [new Colour(hue1, s, l), this.baseColour, new Colour(hue2, s, l)];
  }

  /**
   * Generate a tetradic (rectangle) color palette.
   * @returns {Colour[]} Array with the base color and three tetradic colors.
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
   * Generate a split complementary color palette.
   * @param {number} angle - The angle in degrees to offset from the direct complement (default 30).
   * @returns {Colour[]} Array with the base color and two split complementary colors.
   */
  splitComplementary(angle = 30) {
    const { h, s, l } = this.baseColour.toHSL();
    const hue1 = (h + angle + 180) % 360;
    const hue2 = (h - angle + 180) % 360;
    return [this.baseColour, new Colour(hue1, s, l), new Colour(hue2, s, l)];
  }

  /**
   * Generate a monochromatic palette by varying lightness and optionally saturation.
   * @param {number} steps - Number of colors in the palette (default 5).
   * @param {number[]} lightnessRange - [min, max] lightness values (default [20, 80]).
   * @param {number[]} [saturationRange] - [min, max] saturation values (optional).
   * @returns {Colour[]} Array of monochromatic colors including the base color.
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
    // Optionally, ensure the base color is included
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
   * Generate all harmony palettes for the base color.
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

export default ColorHarmony;
