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
class Colour {
  
  //declaring private fields
  
  #h; #s; #l
  
  //private helper function to validate inputs
  
   validatorUtil(value, min, max, name){
    
    //Check if type is number
    
    if(typeof value !== "number"){
      throw Error (`${name} must be a number`)
    }
    
    //check if number is within range
    
    if (value < min || value > max){
      throw Error (`${name} should be a number between ${min} and ${max}`)
    }
  }
  
  constructor(h,s,l) {
    
    //constructor argument validation 
    
    this.validatorUtil(h, 0, 360, 'Hue')
    // this.validatorUtil(s, 0, 100, 'Saturation')
    // this.validatorUtil(l, 0, 100, 'Lightness')
    
    //Initializatiin of private variable
    
    this.#h = h
    this.#s = s
    this.#l = l
  }
  
  //getter methods for private variables 
  
  getHue() {return this.#h}
  getSaturation(){return this.#s}
  getLightness(){return this.#l}
  
  //static methods for creating new colour classes from rgb or even hex values
  
  static fromRGB(r,g,b){
    
    // Validate inputs
    this.validatorUtil(r, 0, 255, 'RGB-red')
    this.validatorUtil(g, 0, 255, 'RGB-green')
    this.validatorUtil(b, 0, 255, 'RGB-blue')

    // 1. Normalize R, G, B values from [0, 255] to [0, 1]

    const normR = r / 255;
    const normG = g / 255;
    const normB = b / 255;

    // 2. Find max, min, and difference (Chroma)
    const max = Math.max(normR, normG, normB);
    const min = Math.min(normR, normG, normB);
    const diff = max - min; // Chroma (C)

    let h, s, l;

    // 3. Calculate Lightness (L)
    l = (max + min) / 2;

    // 4. Calculate Saturation (S) and Hue (H)

    if (diff === 0) {
        // Achromatic (Gray scale): Hue and Saturation are 0
        h = 0;
        s = 0;
    } else {
        // Calculate Saturation (S)
        // Formula: S = C / (1 - |2L - 1|)
        s = diff / (1 - Math.abs(2 * l - 1));

        // Calculate Hue (H)
        switch (max) {
            case normR:
                // Red is the max component
                h = (normG - normB) / diff;
                // If G < B, the result is negative, so add 6 to keep H in [0, 6)
                if (normG < normB) {
                    h += 6;
                }
                break;
            case normG:
                // Green is the max component
                // Formula: H = (B - R) / C + 2
                h = (normB - normR) / diff + 2;
                break;
            case normB:
                // Blue is the max component
                // Formula: H = (R - G) / C + 4
                h = (normR - normG) / diff + 4;
                break;
        }

        // Convert H from [0, 6) to degrees [0, 360]
        h /= 6;
    }

    // 5. Convert HSL from [0, 1] ranges to final output scale (H:[0, 360], S/L:[0, 100])
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    // Ensure Hue is exactly 360 only when s and l are 0
    if (h === 360 && (s !== 0 || l !== 0)) {
        h = 0;
    }

    // Return a new Colour object (as implied by the original code)
    return new Colour(h, s, l);
  }

  static fromHEX(HEXstring){

    //Validate Hex to be a string
    if(typeof HEXstring !== "string"){throw Error ("HEX value mustbe a string")}

    // remove # if present
    let hex = HEXstring.startsWith("#") ? HEXstring.slice(1): HEXstring

    // check length of HEX == 6
     
    if(hex.length !== 6){throw Error ("HEX value must be 6 characters long (without #)")}
    
    //Check for invalid characters 
    
    if(!/^[0-9a-fA-F]{6}$/.test(hex)){throw Error ("HEX value contains invalid characters")}
    
    //Convert to RGB
     const r = parseInt(hex.substring(0,2), 16)
     const g = parseInt(hex.substring(2,4), 16)
     const b = parseInt(hex.substring(4,6), 16)
     
     
     //create new rgb instance that in tur be processed to hsl
     
    return this.fromRGB(r,g,b)
  }
  
  //Conversion Methods to convert from one method method to another
  
  toHSL(){
    return {
      h: this.#h,
      s: this.#s,
      l: this.#l 
    }
  }
  
  toHex() {
      
    const {r,g,b} = this.toRGB()
      
    // Helper function to convert a single color component (0-255) to a two-character hex string.
    const toHexComponent = (c) => {
        const hex = c.toString(16);
        // Pad with a leading zero if the hex string is only one character long
        return hex.length === 1 ? "0" + hex : hex;
    };

    // Get the hex strings for R, G, and B components
    const rHex = toHexComponent(r);
    const gHex = toHexComponent(g);
    const bHex = toHexComponent(b);

    // Concatenate and return the final hex string, prefixed with '#'
    return `#${rHex}${gHex}${bHex}`.toUpperCase();
  }
  
  toRGB() {
    // Convert HSL to 0-1 scale for calculation
    let h = this.#h / 360;
    let s = this.#s / 100;
    let l = this.#l / 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // Achromatic (gray)
    } else {
        // Helper function for the HSL to RGB conversion
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

    // Return the RGB values in 0-255 range
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
  }
}


//Finally export color class 
export default Colour