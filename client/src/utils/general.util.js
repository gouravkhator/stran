export const convertArrToObj = (arr = []) => {
  return [...arr].reduce((tempObj, element) => {
    return { ...tempObj, [element]: element };
  }, {});
};
