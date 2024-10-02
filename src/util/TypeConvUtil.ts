type StringYN = 'Y' | 'N';
type String01 = '1' | '0';

export function booleanToStringYN(b: boolean): StringYN {
  return b ? 'Y' : 'N';
}

export function stringTFToBoolean(tf: string): boolean {
  if (tf === 'true' || tf === 'Y') {
    return true;
  }

  return false;
}

export function StringYNToBoolean(yn: StringYN): boolean {
  if (yn === 'Y') {
    return true;
  }
  if (yn === 'N') {
    return false;
  }
  throw new Error('TypeError: Y 또는 N 이외의 값을 Boolean 타입으로 변환하려 시도했습니다');
}

export function String01ToStringYN(b: String01): StringYN {
  if (b === '1') {
    return 'Y';
  }
  if (b === '0') {
    return 'N';
  }
  throw new Error('TypeError: 1 또는 0 이외의 값을 StringYN 타입으로 변환하려 시도했습니다');
}

export function StringYNToString01(yn: StringYN): String01 {
  return StringYNToBoolean(yn) ? '1' : '0';
}

export type { StringYN, String01 };
