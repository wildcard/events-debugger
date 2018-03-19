const flatObjToString = (flatObj) => (
  Object.keys(flatObj).reduce((text, key) => {
    return text += `${key} ${flatObj[key]}`;
  }, '')
);

module.exports = flatObjToString
