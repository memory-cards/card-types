const cardIndex = require('./types/choose_options/index');
const infoIndex = require('./types/info/index');
const chooseOptionsIndex = require('./types/choose_options/index');
const chooseSequenceIndex = require('./types/choose_sequence/index');

module.exports = {
  choose_options: {
    card: cardIndex,
  },
  info: {
    card: infoIndex,
  },
  order_items: {
    card: chooseOptionsIndex,
  },
  choose_sequence: {
    card: chooseSequenceIndex,
  },
};
