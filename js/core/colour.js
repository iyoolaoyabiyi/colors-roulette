class Colour {
  #h;
  #s;
  #l;

  /**
   * Private static helper to validate input values.
   * @param {number} value - The value to validate.
   * @param {number} min - Minimum allowed value.
   * @param {number} max - Maximum allowed value.
   * @param {string} name - Name of the property (for error messages).
   */
  static #validatorUtil(value, min, max, name) {
    if (typeof value !== "number") {
      throw Error(`${name} must be a number`);
    }
    if (value < min || value > max) {
      throw Error(`${name} should be a number between ${min} and ${max}`);
    }
  }

  constructor(h, s, l) {
    // Validate constructor arguments
    Colour.#validatorUtil(h, 0, 360, "Hue");
    Colour.#validatorUtil(s, 0, 100, "Saturation");
    Colour.#validatorUtil(l, 0, 100, "Lightness");

    this.#h = h;
    this.#s = s;
    this.#l = l;
  }

  getHue() {
    return this.#h;
  }
  getSaturation() {
    return this.#s;
  }
  getLightness() {
    return this.#l;
  }

  static fromRGB(r, g, b) {
    Colour.#validatorUtil(r, 0, 255, "RGB-red");
    Colour.#validatorUtil(g, 0, 255, "RGB-green");
    Colour.#validatorUtil(b, 0, 255, "RGB-blue");

    const normR = r / 255;
    const normG = g / 255;
    const normB = b / 255;
    const max = Math.max(normR, normG, normB);
    const min = Math.min(normR, normG, normB);
    const diff = max - min;
    let h, s, l;
    l = (max + min) / 2;
    if (diff === 0) {
      h = 0;
      s = 0;
    } else {
      s = diff / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case normR:
          h = (normG - normB) / diff;
          if (normG < normB) h += 6;
          break;
        case normG:
          h = (normB - normR) / diff + 2;
          break;
        case normB:
          h = (normR - normG) / diff + 4;
          break;
      }
      h /= 6;
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    if (h > 360 && (s !== 0 || l !== 0)) h = h % 360;
    return new Colour(h, s, l);
  }

  static fromHEX(HEXstring) {
    if (typeof HEXstring !== "string")
      throw Error("HEX value must be a string");
    let hex = HEXstring.startsWith("#") ? HEXstring.slice(1) : HEXstring;
    
    // Validate hex length (3, 4, 6, or 8 digits)
    if (![3, 4, 6, 8].includes(hex.length))
      throw Error("HEX value must be 3, 4, 6, or 8 characters long (without #)");
    
    // Validate hex characters
    if (!/^[0-9a-fA-F]+$/.test(hex))
      throw Error("HEX value contains invalid characters");
    
    // Expand 3-digit and 4-digit formats
    if (hex.length === 3) {
      // #RGB -> #RRGGBB
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    } else if (hex.length === 4) {
      // #RGBA -> #RRGGBBAA
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    
    // Extract RGB (ignore alpha channel if present)
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return this.fromRGB(r, g, b);
  }

  toHSL() {
    return { h: this.#h, s: this.#s, l: this.#l };
  }

  toHex() {
    const { r, g, b } = this.toRGB();
    const toHexComponent = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHexComponent(r)}${toHexComponent(g)}${toHexComponent(
      b
    )}`.toUpperCase();
  }

  toRGB() {
    let h = this.#h / 360;
    let s = this.#s / 100;
    let l = this.#l / 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  /**
   * Return a new Colour with adjusted lightness.
   * @param {number} amount - Amount to add/subtract from lightness (-100 to 100).
   * @returns {Colour}
   */
  adjustLightness(amount) {
    let newL = Math.max(0, Math.min(100, this.getLightness() + amount));
    return new Colour(this.getHue(), this.getSaturation(), newL);
  }

  /**
   * Return a new Colour with adjusted saturation.
   * @param {number} amount - Amount to add/subtract from saturation (-100 to 100).
   * @returns {Colour}
   */
  adjustSaturation(amount) {
    let newS = Math.max(0, Math.min(100, this.getSaturation() + amount));
    return new Colour(this.getHue(), newS, this.getLightness());
  }

  /**
   * Return a new Colour with rotated hue.
   * @param {number} degrees - Degrees to rotate hue (can be negative).
   * @returns {Colour}
   */
  rotateHue(degrees) {
    let newH = (this.getHue() + degrees + 360) % 360;
    return new Colour(newH, this.getSaturation(), this.getLightness());
  }
}

export default Colour;
