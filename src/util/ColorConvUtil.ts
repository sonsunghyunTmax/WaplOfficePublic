/* eslint-disable no-bitwise */
// eslint-disable-next-line import/no-unresolved
import Color from 'color';

export function getLightness(color: string): number {
  return setAlpha(color).hsl().array()[2];
}

function getRgbPercentage(
  rRed: number,
  rGreen: number,
  rBlue: number
): {
  rRed: number;
  rGreen: number;
  rBlue: number;
} {
  return {
    rRed: (rRed / 255) * 100,
    rGreen: (rGreen / 255) * 100,
    rBlue: (rBlue / 255) * 100,
  };
}

function crgbToRgb(
  rCRed: number,
  rCGreen: number,
  rCBlue: number
): { rRed: number; rGreen: number; rBlue: number } {
  return {
    rRed: (rCRed / 100) ** (1 / 2.2) * 100,
    rGreen: (rCGreen / 100) ** (1 / 2.2) * 100,
    rBlue: (rCBlue / 100) ** (1 / 2.2) * 100,
  };
}

function rgbToCrgb(
  rRed: number,
  rGreen: number,
  rBlue: number
): { rCRed: number; rCGreen: number; rCBlue: number } {
  return {
    rCRed: (rRed / 100) ** 2.2 * 100,
    rCGreen: (rGreen / 100) ** 2.2 * 100,
    rCBlue: (rBlue / 100) ** 2.2 * 100,
  };
}

export function grayscaleHex(color: string): string {
  const hex = color.trim().replace('#', '');
  const arr: number[] = [];
  const rgb = hex.match(/[a-f\d]{2}/gi);
  if (rgb !== null) {
    rgb.forEach(function (str, x) {
      arr[x] = parseInt(str, 16);
    });
    const resultRgb = (arr[0] * 0.299 + arr[1] * 0.587 + arr[2] * 0.144).toString();
    return rgbStringToHexString(resultRgb, resultRgb, resultRgb);
  }
  // error
  return color;
}

/* 
 * DOMParser에 HTML Input값이 rgb(XXX, XXX, XXX)형식으로 Parsing되어 변환됨 해당 형식을 HEX형식으로 변형해주는 함수
 * String값인 rgb(XXX, XXX, XXX)의 내부 RGB값을 Split하여 넘겨줘야함.
 */
export function rgbStringToHexString(r: string, g: string, b: string): string {
  let hR = parseInt(r, 10).toString(16);
  let hG = parseInt(g, 10).toString(16);
  let hB = parseInt(b, 10).toString(16);

  if (hR.length === 1) {
    hR = `0${hR}`;
  }
  if (hG.length === 1) {
    hG = `0${hG}`;
  }
  if (hB.length === 1) {
    hB = `0${hB}`;
  }
  return `#${hR}${hG}${hB}`;
}

export function getHSLColor(color: string): number[] {
  return setAlpha(color).hsl().array();
}

export function getRGBColor(color: string): number[] {
  return setAlpha(color).rgb().array();
}

export function getHSVColor(color: string): number[] {
  return setAlpha(color).hsv().array();
}

export function hsvListToHexString(h: number, s: number, v: number): string {
  let hl = 0;
  let sl = 0;
  let vl = 0;
  if (h >= 360) {
    hl = 0;
  } else {
    hl = h / 60.0;
  }
  if (s >= 100) {
    sl = 1;
  } else {
    sl = s / 100.0;
  }
  if (v >= 100) {
    vl = 1;
  } else {
    vl = v / 100.0;
  }
  const hi = Math.floor(hl % 6);
  // 변환을 위한 색상값 정도
  const f = hl - hi;
  // 변환 과정에서 색상값을 이용한 계산 인자
  let p = vl * (1 - sl);
  let q = vl * (1 - sl * f);
  let t = vl * (1 - sl * (1 - f));
  // p, q, t는 rgb 값 중 하나로 정해지며 의미는 없다. 그 value는 case에 따라 나뉜다.

  vl = parseFloat(vl.toFixed(3));
  t = parseFloat(t.toFixed(3));
  p = parseFloat(p.toFixed(3));
  q = parseFloat(q.toFixed(3));

  let R = 0;
  let G = 0;
  let B = 0;

  // 색상값 정도에 따른 케이스 분류
  switch (hi) {
    case 0:
      R = vl;
      G = t;
      B = p;
      break;
    case 1:
      R = q;
      G = vl;
      B = p;
      break;
    case 2:
      R = p;
      G = vl;
      B = t;
      break;
    case 3:
      R = p;
      G = q;
      B = vl;
      break;
    case 4:
      R = t;
      G = p;
      B = vl;
      break;
    case 5:
      R = vl;
      G = p;
      B = q;
      break;
    default:
      return rgbStringToHexString(R.toString(), G.toString(), B.toString());
  }
  R *= 255;
  G *= 255;
  B *= 255;

  return rgbStringToHexString(R.toString(), G.toString(), B.toString());
}

export function hsvStringToHexString(h: number, s: number, v: number): string {
  const hl = h / 60;
  const sl = s / 100;
  let vl = v / 100;
  const hi = Math.floor(hl) % 6;

  const f = hl - Math.floor(hl);
  const p = 255 * vl * (1 - sl);
  const q = 255 * vl * (1 - sl * f);
  const t = 255 * vl * (1 - sl * (1 - f));
  vl *= 255;

  let R = '0';
  let G = '0';
  let B = '0';

  switch (hi) {
    case 0:
      R = vl.toString();
      G = t.toString();
      B = p.toString();
      return rgbStringToHexString(R, G, B);
    case 1:
      R = q.toString();
      G = vl.toString();
      B = p.toString();
      return rgbStringToHexString(R, G, B);
    case 2:
      R = p.toString();
      G = vl.toString();
      B = t.toString();
      return rgbStringToHexString(R, G, B);
    case 3:
      R = p.toString();
      G = q.toString();
      B = vl.toString();
      return rgbStringToHexString(R, G, B);
    case 4:
      R = t.toString();
      G = p.toString();
      B = vl.toString();
      return rgbStringToHexString(R, G, B);
    case 5:
      R = vl.toString();
      G = p.toString();
      B = q.toString();
      return rgbStringToHexString(R, G, B);
    default:
      return rgbStringToHexString(R, G, B);
  }
}

export function setAlpha(hexString: string): Color {
  if (hexString.length === 6) {
    const rgbString = `#${hexString}`;
    return Color(rgbString);
  }
  // rgba(255, 255, 255, 0.5)
  if (hexString.startsWith('rgba')) {
    const numbersString = hexString.substring(5, hexString.length - 1); // 255, 255, 255, 0.5
    const numbers = numbersString.split(', ');
    const alphaString = numbers[3];
    const r = Number(numbers[0]).toString(16).padStart(2, '0');
    const g = Number(numbers[1]).toString(16).padStart(2, '0');
    const b = Number(numbers[2]).toString(16).padStart(2, '0');
    const rgbString = `#${r}${g}${b}`;
    return Color(rgbString).alpha(Number(alphaString));
  }
  if (hexString.startsWith('rgb')) {
    const numbersString = hexString.substring(4, hexString.length - 1); // 255, 255, 255
    const numbers = numbersString.split(', ');
    const r = Number(numbers[0]).toString(16).padStart(2, '0');
    const g = Number(numbers[1]).toString(16).padStart(2, '0');
    const b = Number(numbers[2]).toString(16).padStart(2, '0');
    const rgbString = `#${r}${g}${b}`;
    return Color(rgbString);
  }
  if (hexString.length > 7) {
    const alphaString = `0x${hexString.substring(1, 3)}`;
    const rgbString = `#${hexString.substring(3, 9)}`;
    return Color(rgbString).alpha(Number(alphaString) / 255);
  }

  return Color(hexString);
}

export function applyAlphaSet(color: string, percentage: number): string {
  return setAlpha(color)
    .alpha(percentage / 100)
    .toString();
}

export function applyAlphaMod(color: string, percentage: number): string {
  const oldAlpha = setAlpha(color).alpha();

  return setAlpha(color)
    .alpha(oldAlpha * (percentage / 100))
    .string();
}

export function applyAlphaOff(color: string, percentage: number): string {
  const oldAlpha = setAlpha(color).alpha();

  return setAlpha(color)
    .alpha(percentage / 100 + oldAlpha)
    .toString();
}

export function applyRedSet(color: string, value: number): string {
  return setAlpha(color).red(value).toString();
}

export function applyRedMod(color: string, percentage: number): string {
  const oldRed = setAlpha(color).red();

  return setAlpha(color)
    .red(oldRed * (percentage / 100))
    .toString();
}

export function applyRedOff(color: string, percentage: number): string {
  const oldRed = setAlpha(color).red();

  return setAlpha(color)
    .red((percentage / 100) * 255 + oldRed)
    .toString();
}

export function applyGreenSet(color: string, value: number): string {
  return setAlpha(color).green(value).toString();
}

export function applyGreenMod(color: string, percentage: number): string {
  const oldgreen = setAlpha(color).green();

  return setAlpha(color)
    .green(oldgreen * (percentage / 100))
    .toString();
}

export function applyGreenOff(color: string, percentage: number): string {
  const oldgreen = setAlpha(color).green();

  return setAlpha(color)
    .green((percentage / 100) * 255 + oldgreen)
    .toString();
}

export function applyBlueSet(color: string, value: number): string {
  return setAlpha(color).blue(value).toString();
}

export function applyBlueMod(color: string, percentage: number): string {
  const oldblue = setAlpha(color).blue();

  return setAlpha(color)
    .blue(oldblue * (percentage / 100))
    .toString();
}

export function applyBlueOff(color: string, percentage: number): string {
  const oldblue = setAlpha(color).blue();

  return setAlpha(color)
    .blue((percentage / 100) * 255 + oldblue)
    .toString();
}

export function applyHueSet(color: string, value: number): string {
  return setAlpha(color).hue(value).toString();
}

export function applyHueMod(color: string, percentage: number): string {
  const hslColor = getHSLColor(color);
  const h = hslColor[0];
  const s = hslColor[1];
  const l = hslColor[2];

  const p = percentage / 100;
  let newHue = h * p;
  if (newHue > 360) {
    newHue = 360;
  }

  return Color.hsl(newHue, s, l).hex().toString();
}

export function applyHueOff(color: string, percentage: number): string {
  const hslColor = getHSLColor(color);
  const h = hslColor[0];
  const s = hslColor[1];
  const l = hslColor[2];

  let newHue = h + percentage;

  if (newHue > 360) newHue = 360;
  else if (newHue < 0) newHue = 0;

  return Color.hsl(newHue, s, l).hex().toString();
}

export function applyLum(color: string, percentage: number): string {
  const hslColor = getHSLColor(color);
  const h = hslColor[0];
  const s = hslColor[1];

  let cL = percentage;

  if (cL > 100) cL = 100;
  else if (cL < -100) cL = -100;

  return Color.hsl(h, s, cL).hex().toString();
}

export function applyLumSet(color: string, value: number): string {
  return setAlpha(color).lightness(value).toString();
}

export function applyLumMod(color: string, percentage: number): string {
  const hslColor = getHSLColor(color);
  const h = hslColor[0];
  const s = hslColor[1];
  const l = hslColor[2];

  const p = percentage / 100;

  return Color.hsl(h, s, l * p)
    .hex()
    .toString();
}

export function applyLumOff(color: string, percentage: number): string {
  const hslColor = getHSLColor(color);
  const h = hslColor[0];
  const s = hslColor[1];
  const l = hslColor[2];

  let cL = l + percentage;

  if (cL > 100) cL = 100;
  else if (cL < -100) cL = -100;

  return Color.hsl(h, s, cL).hex().toString();
}

export function applySatSet(color: string, value: number): string {
  return setAlpha(color).saturationl(value).toString();
}

export function applySatMod(color: string, percentage: number): string {
  const hslColor = setAlpha(color).hsl().array();
  const h = hslColor[0];
  const s = hslColor[1];
  const l = hslColor[2];

  const p = percentage / 100;

  return Color.hsl(h, s * p, l)
    .hex()
    .toString();
}

export function applySatOff(color: string, percentage: number): string {
  const hslColor = getHSLColor(color);
  const h = hslColor[0];
  const s = hslColor[1];
  const l = hslColor[2];

  let newSaturation = s + percentage;

  if (newSaturation > 100) newSaturation = 100;
  else if (newSaturation < -100) newSaturation = -100;

  return Color.hsl(h, newSaturation, l).hex().toString();
}

export function applyShade(color: string, percentage: number): string {
  const rgbColor = getRGBColor(color);
  const r = rgbColor[0];
  const g = rgbColor[1];
  const b = rgbColor[2];
  const rgbp = getRgbPercentage(r, g, b);
  const crgb = rgbToCrgb(rgbp.rRed, rgbp.rGreen, rgbp.rBlue);

  const p = percentage / 100;
  const fCrgb = crgbToRgb(crgb.rCRed * p, crgb.rCGreen * p, crgb.rCBlue * p);
  return Color({
    r: (fCrgb.rRed / 100) * 255,
    g: (fCrgb.rGreen / 100) * 255,
    b: (fCrgb.rBlue / 100) * 255,
  })
    .hex()
    .toString();
}

export function applyTint(color: string, percentage: number): string {
  const rgbColor = getRGBColor(color);
  const r = rgbColor[0];
  const g = rgbColor[1];
  const b = rgbColor[2];
  const rgbp = getRgbPercentage(r, g, b);
  const crgb = rgbToCrgb(rgbp.rRed, rgbp.rGreen, rgbp.rBlue);

  const p = percentage / 100;
  const fCrgb = crgbToRgb(
    100 - (100 - crgb.rCRed) * p,
    100 - (100 - crgb.rCGreen) * p,
    100 - (100 - crgb.rCBlue) * p
  );
  return Color({
    r: (fCrgb.rRed / 100) * 255,
    g: (fCrgb.rGreen / 100) * 255,
    b: (fCrgb.rBlue / 100) * 255,
  })
    .hex()
    .toString();
}

export function applyComp(color: string): string {
  return setAlpha(calcComplementaryColor(color)).toString();
}

export function applyInv(color: string): string {
  return setAlpha(calcComplementaryColor(color)).toString();
}

export function applyGray(color: string): string {
  return setAlpha(color).gray().toString();
}

export function applyGamma(color: string): string {
  return setAlpha(color).toString();
}

export function applyInvGamma(color: string): string {
  return setAlpha(color).toString();
}

export function applyBrightness(color: string, percentage: number): string {
  if (percentage === 0) return color;
  if (percentage > 0) {
    // 밝게
    let chandgedColor = applyLumMod(color, 100 - percentage);
    chandgedColor = applyLumOff(chandgedColor, percentage);
    return chandgedColor;
  }
  // 어둡게
  const chandgedColor = applyLumMod(color, 100 + percentage);
  return chandgedColor;
}

/* 
 * 보색 구하는 함수
 */
export function calcComplementaryColor(color: string): string {
  const c = color.substring(1); // 색상 앞의 # 제거
  const rgb = parseInt(c, 16); // rrggbb를 10진수로 변환
  const red = (rgb >> 16) & 0xff; // red 추출
  const green = (rgb >> 8) & 0xff; // green 추출
  const blue = (rgb >> 0) & 0xff; // blue 추출
  const pRed = (255 - red) << 16;
  const pGreen = (255 - green) << 8;
  const pBlue = (255 - blue) << 0;
  const pRgb = pRed + pGreen + pBlue;
  let pRgbString = `${pRgb.toString(16)}`;
  while (pRgbString.length < 6) {
    pRgbString = `0${pRgbString}`;
  }
  return `#${pRgbString}`;
}

/**
 * colorString(ex. rgb(...), hsl(...) 등)을 hex 형식의 color string(ex. #000000)으로 변환.
 * 변환이 불가할 경우, 입력받은 defaultColor를 반환.
 * @param param0 color: 변환할 string, defaultColor: 변환 불가할 경우 반환할 string.
 * @returns hex 형식으로 변환된 color string.
 */
export function colorStringToHex({
  color,
  defaultColor,
}: {
  color?: string;
  defaultColor?: string;
}): Nullable<string> {
  if (color === undefined || color === '' || color === 'transparent' || color === 'initial') {
    return undefined;
  }
  let hex: Nullable<string>;
  try {
    hex = Color(color).hex();
  } catch (error) {
    console.error(`invalid color string: '${color}'`);
    hex = defaultColor;
  }
  return hex;
}

export function applyShadeWithHSL(color: string, percentage: number): string {
  const hslColor = getHSLColor(color);
  const h = hslColor[0];
  const s = hslColor[1];
  const l = hslColor[2];
  const shade = (l * percentage) / 100;

  return Color.hsl(h, s, shade).hex().toString();
}

export function applyTintWithHSL(color: string, percentage: number): string {
  const hslColor = getHSLColor(color);
  const h = hslColor[0];
  const s = hslColor[1];
  const l = hslColor[2];
  const tint = (l * percentage) / 100 + (100 - percentage);

  return Color.hsl(h, s, tint).hex().toString();
}

/*
 * index를 넘기고 color string 값을 가져온다
 */
export function getIndexedColor(index: number): string {
  let color;
  switch (index) {
    case 0:
      color = '#000000';
      break;
    case 1:
      color = '#FFFFFF';
      break;
    case 2:
      color = '#FF0000';
      break;
    case 3:
      color = '#00FF00';
      break;
    case 4:
      color = '#0000FF';
      break;
    case 5:
      color = '#FFFF00';
      break;
    case 6:
      color = '#FF00FF';
      break;
    case 7:
      color = '#00FFFF';
      break;
    case 8:
      color = '#000000';
      break;
    case 9:
      color = '#FFFFFF';
      break;
    case 10:
      color = '#FF0000';
      break;
    case 11:
      color = '#00FF00';
      break;
    case 12:
      color = '#0000FF';
      break;
    case 13:
      color = '#FFFF00';
      break;
    case 14:
      color = '#FF00FF';
      break;
    case 15:
      color = '#00FFFF';
      break;
    case 16:
      color = '#800000';
      break;
    case 17:
      color = '#008000';
      break;
    case 18:
      color = '#000080';
      break;
    case 19:
      color = '#808000';
      break;
    case 20:
      color = '#800080';
      break;
    case 21:
      color = '#008080';
      break;
    case 22:
      color = '#C0C0C0';
      break;
    case 23:
      color = '#808080';
      break;
    case 24:
      color = '#9999FF';
      break;
    case 25:
      color = '#993366';
      break;
    case 26:
      color = '#FFFFCC';
      break;
    case 27:
      color = '#CCFFFF';
      break;
    case 28:
      color = '#660066';
      break;
    case 29:
      color = '#FF8080';
      break;
    case 30:
      color = '#0066CC';
      break;
    case 31:
      color = '#CCCCFF';
      break;
    case 32:
      color = '#000080';
      break;
    case 33:
      color = '#FF00FF';
      break;
    case 34:
      color = '#FFFF00';
      break;
    case 35:
      color = '#00FFFF';
      break;
    case 36:
      color = '#800080';
      break;
    case 37:
      color = '#800000';
      break;
    case 38:
      color = '#008080';
      break;
    case 39:
      color = '#0000FF';
      break;
    case 40:
      color = '#00CCFF';
      break;
    case 41:
      color = '#CCFFFF';
      break;
    case 42:
      color = '#CCFFCC';
      break;
    case 43:
      color = '#FFFF99';
      break;
    case 44:
      color = '#99CCFF';
      break;
    case 45:
      color = '#FF99CC';
      break;
    case 46:
      color = '#CC99FF';
      break;
    case 47:
      color = '#FFCC99';
      break;
    case 48:
      color = '#3366FF';
      break;
    case 49:
      color = '#33CCCC';
      break;
    case 50:
      color = '#99CC00';
      break;
    case 51:
      color = '#FFCC00';
      break;
    case 52:
      color = '#FF9900';
      break;
    case 53:
      color = '#FF6600';
      break;
    case 54:
      color = '#666699';
      break;
    case 55:
      color = '#969696';
      break;
    case 56:
      color = '#003366';
      break;
    case 57:
      color = '#339966';
      break;
    case 58:
      color = '#003300';
      break;
    case 59:
      color = '#333300';
      break;
    case 60:
      color = '#993300';
      break;
    case 61:
      color = '#993366';
      break;
    case 62:
      color = '#333399';
      break;
    case 63:
      color = '#333333';
      break;
    case 64:
      color = '#000000'; // 임시코드 system foreground color를 가져와야함
      break;
    case 65:
      color = '#ffffff'; // 임시코드 system background color를 가져와야함
      break;
    default:
      color = '#000000';
      break;
  }

  return color;
}
