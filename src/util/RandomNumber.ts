/**
 * @param digits 얻고자 하는 자릿 수. 기본 값으로 5 설정
 * EX) Digits = 5
 * 0 <= Math.random < 1
 * 0 <= Math.random * 90000 < 90000
 * 10,000 <= Math.random * 90000 + 10000 < 100,000
 * @returns 얻고자 하는 자리 수를 만족하는 임의의 정수
 */
export default function randomNumber(digits = 5): number {
  const minNumber = 10 ** (digits - 1);
  const maxNumber = minNumber * 9;
  return Math.floor(minNumber + Math.random() * maxNumber);
}
