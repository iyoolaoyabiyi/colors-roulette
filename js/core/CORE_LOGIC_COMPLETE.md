# Color Palette Generator: Core Logic Complete

This project now has a robust core logic for generating, managing, and manipulating color palettes, similar to coolors.io. Below is a summary of the core modules, their functionality, and guidance for connecting the logic to your UI.

---

## Core Modules & Their Purpose

### 1. `Colour` Class

- **Purpose:** Represents a single color in HSL, with conversion to/from HEX and RGB.
- **Key Methods:**
  - `toHSL()`, `toHex()`, `toRGB()` — Convert between color spaces.
  - `adjustLightness(amount)` — Returns a new color with lightness adjusted.
  - `adjustSaturation(amount)` — Returns a new color with saturation adjusted.
  - `rotateHue(degrees)` — Returns a new color with hue rotated.
- **Usage:** Enables color manipulation, conversion, and harmony calculations.

### 2. `ColorHarmony` Class

- **Purpose:** Generates harmonious color palettes from a base color.
- **Key Methods:**
  - `complementary()`, `analogous()`, `triadic()`, `tetradic()`, `splitComplementary()`, `monochromatic()`
  - `getAllHarmonies()` — Returns all harmony palettes for a color.
- **Usage:** Use to create aesthetically pleasing palettes based on color theory.

### 3. `Palette` Class

- **Purpose:** Manages a group of colors (the palette), including lock/unlock and random generation.
- **Key Methods:**
  - `generate(size)` — Randomly generates colors for unlocked slots.
  - `lock(index)`, `unlock(index)` — Lock/unlock a color in the palette.
  - `getColours()`, `getLocked()` — Get current palette and lock status.
  - `exportHEX()`, `importHEX(hexArray)` — Export/import palette as HEX.
  - `static randomColour()` — Generate a random, vibrant color.
- **Usage:** Central logic for palette management, export, and import.

---

## Next Steps: Connecting Logic to the UI

1. **Display the Palette**

   - Use your main script (e.g., `script.js`) to render each color as a swatch on the page.
   - Show HEX, RGB, or HSL values for each swatch.

2. **User Interactions**

   - Add lock/unlock buttons to each swatch (toggle lock status in the `Palette` class).
   - Listen for the spacebar to generate a new palette (call `generate()` on the `Palette` instance).
   - Add copy-to-clipboard buttons for color codes.
   - Add sliders or inputs to adjust hue, saturation, and lightness (use `adjustLightness`, `adjustSaturation`, `rotateHue`).

3. **Palette Export/Import**

   - Add export buttons (HEX, JSON, or URL) using `exportHEX()`.
   - Add import functionality (parse HEX codes and use `importHEX`).

4. **Color Harmony Integration**

   - Allow users to generate palettes based on harmony rules using the `ColorHarmony` class.

5. **Accessibility & Polish**
   - Show contrast ratios for text on each swatch for accessibility.
   - Add tooltips, animations, and responsive design for a modern look.

---

## Example: How the UI Logic Might Work

- When the page loads, create a new `Palette` instance and render its colors as swatches.
- When the user clicks the lock icon on a swatch, call `lock(index)` or `unlock(index)`.
- When the user presses the spacebar, call `generate()` to refresh unlocked colors and re-render.
- When the user clicks a color code, copy it to the clipboard.
- When the user adjusts a slider, use the corresponding color adjustment method and update the swatch.
- When the user clicks export/import, use the palette’s export/import methods.
- When the user selects a harmony mode, use `ColorHarmony` to generate a new palette.

---

## Conclusion

I am now finished with the core logic! The next phase is UI integration, which will bring the color palette generator to life for users. This documentation serves as a reference for all core functions and how to connect them to the interface.
