const debounce = (fn: any, delayMs: number) => {
  let timerId: NodeJS.Timer;
  return (...args: any) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delayMs);
  };
};

export default debounce;
