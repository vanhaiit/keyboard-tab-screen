const replaceArrayElementByIndex = <T>(
  array: T[],
  positions: number[],
  newData: T[],
) => {
  if (positions.length !== newData.length) {
    return array;
  }

  return array.map((item, index) => {
    if (positions.includes(index)) {
      const foundIndex = positions.findIndex(position => position === index);
      return newData[foundIndex];
    }
    return item;
  });
};

export default replaceArrayElementByIndex;
