export const timeout = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const sleep = async (fn: any, ...args: any) => {
  await timeout(3000);
  return fn(...args);
};
