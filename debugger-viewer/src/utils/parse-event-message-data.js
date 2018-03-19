const flatten = require('./flatten');
const flatObjToString = require('./flat-object-to-string');

const parseEventMessageData = messageData => {
  const data = JSON.parse(messageData);
  const flatData = flatten(data);
  const dataText = flatObjToString(flatData);

  const {
    messageId: id
  } = data;

  return {
    id,
    messageData,
    flatData,
    dataText,
    ...data,
  };
}

module.exports = parseEventMessageData;
