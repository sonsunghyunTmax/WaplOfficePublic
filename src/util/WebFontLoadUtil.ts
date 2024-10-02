// Font Data
import webFontData from '/resource/fonts/WebFontData';

type FontFamily = string;

interface FontStyle {
  [key: string]: string;
}

type FontFaceData = {
  name1: FontFamily;
  koreanName1?: FontFamily;
  name2?: FontFamily;
  koreanName2?: FontFamily;
  name16?: FontFamily;
  koreanName16?: FontFamily;
  name17?: FontFamily;
  koreanName17?: FontFamily;
  name17Origin?: FontFamily;
  styleName: string;
  style?: FontStyle;
  unicodeRange?: string;
  isSymbolFont?: boolean;
};

type FontFileExts = 'woff' | 'woff2';
type FontFaceParam = [string, string, Nullable<FontStyle>];
/** font url 생성 시 woff2 파일은 제외한 url을 만들 font. */
const woff2ExcludeFont = [
  'NewTmaxGothic_CJK/NewTmaxGothic_CJK-Regular',
  'SeoulHangang/SeoulHangangM',
];

let webFontSet: Nullable<Set<string>>;

const URL_RESOURCE = '';

function makeFontUrlString(key: string): string {
  let extsOrder: FontFileExts[] = [];
  // 폰트 확장자별 우선순위 woff2 > woff

  if (woff2ExcludeFont.includes(key)) {
    extsOrder = ['woff'];
  } else {
    extsOrder = ['woff2', 'woff'];
  }

  return extsOrder
    .map(curExt => `url('${URL_RESOURCE}/font/${key}.${curExt}') format('${curExt}')`)
    .join(',');
}

export function getFontName(font: FontFaceData): string {
  return font.koreanName16 || font.name16 || font.koreanName1 || font.name1;
}

export function getFontFaceParam(fontFileName: string): FontFaceParam {
  const { style, unicodeRange } = webFontData[fontFileName];
  if (style !== undefined && unicodeRange) {
    style.unicodeRange = unicodeRange;
  }
  return [getFontName(webFontData[fontFileName]), makeFontUrlString(fontFileName), style];
}

export function loadWebFont(fontFileName: string): void {
  let font: Nullable<FontFace>;
  try {
    font = new FontFace(...getFontFaceParam(fontFileName));
  } catch (error) {
    console.log(`ladWebFont 실패: ${error} `);
    font = undefined;
  }
  if (!font) {
    return;
  }

  font.display = 'swap';
  font
    .load()
    .then(webFont => {
      document.fonts.add(webFont);
      return webFont.family;
    })
    .catch(error => {
      // TODO: 개발모드일때만 코드 포함
      console.log(`web font : ${fontFileName} 로딩 실패 : ${error} `);
      console.log(getFontFaceParam(fontFileName));
    });
}

/**
 * 웹폰트에 대한 FontFace를 생성하여 document.fonts에 add함.
 * 폰트 load는 하지 않기 때문에 웹폰트가 사용될 때 해당 폰트를 다운로드함.
 */
export function addWebFont(webFontDataKey: string): void {
  const font = new FontFace(...getFontFaceParam(webFontDataKey));
  font.display = 'swap';
  document.fonts.add(font);
}

/**
 * office에서 builtIn으로 제공하는 webFont인지 확인.
 * @param fontName 확인하려는 font name.
 * @returns office에서 builtIn으로 제공하는 webFont이면 true, 그렇지 않으면 false.
 */
export function isBuiltInWebFont(fontName: string): boolean {
  if (!webFontSet) {
    webFontSet = getWebFontSet();
  }

  if (webFontSet.has(fontName)) {
    return true;
  }
  return false;
}

/**
 * webFontData.ts 파일에 있는 FONT_DATA의 font들의 name을 Set<string>에 add하여 반환.
 * @returns office에서 제공하는 webFont name Set.
 */
function getWebFontSet(): Set<string> {
  if (webFontSet !== undefined) {
    return webFontSet;
  }

  webFontSet = new Set<string>();

  for (const value of Object.entries(webFontData)) {
    const webFontDataValue = value[1];
    webFontSet.add(getFontName(webFontDataValue));
  }

  return webFontSet;
}
