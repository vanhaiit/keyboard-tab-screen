export const timeDiff = (start: string, end: string) => {
  const msec = new Date(end).getTime() - new Date(start).getTime();
  return {
    days: Math.floor(msec / 1000 / 60 / 60 / 24),
    hours: Math.floor(msec / 1000 / 60 / 60),
    minutes: Math.floor(msec / 1000 / 60),
  };
};
