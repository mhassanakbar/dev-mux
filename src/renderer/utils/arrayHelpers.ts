export function removeFirstByProp<T>(arr: T[], key: keyof T, targetValue: T[keyof T]): T[] {
  const len = arr.length;
  const result: T[] = [];
  let found = false;

  for (let i = 0; i < len; i++) {
    const item = arr[i];
    if (found || item[key] !== targetValue) {
      result.push(item);
    } else {
      found = true;
    }
  }
  return result;
}
