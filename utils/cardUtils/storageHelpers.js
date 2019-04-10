/* global window */

// eslint-disable-next-line no-unused-vars
function setItem(key, value) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    //
  }
  window.memoryCards[key] = value;
}

// eslint-disable-next-line no-unused-vars
function getItem(key) {
  let value;
  try {
    const jsonValue = window.sessionStorage.getItem(key);
    value = JSON.parse(jsonValue);
  } catch (e) {
    value = window.memoryCards[key];
  }
  return value;
}

// eslint-disable-next-line no-unused-vars
function removeItem(key) {
  try {
    window.sessionStorage.removeItem(key);
  } catch (e) {
    //
  }
  delete window.memoryCards[key];
}
