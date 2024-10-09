export function isEmptyValue(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string" && value.trim() === "") {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  if (typeof value === "object" && Object.keys(value).length === 0) {
    return true;
  }

  return false;
}
export const  capitalizeFirstLetter = (text) => {
  return text
    .split(' ')
    .map((word) => {
      if (word.length > 0) {
        return word[0].toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    })
    .join(' ');
};

export const checkEmptyValuesandplaceNA = (obj) => {
  const result = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      
      const value = obj[key];
      const isEmpty = isEmptyValue(value);
      if (isEmpty) {
        result[key] = "N/A";
      } else {
        result[key] = value;
      }
    }
  }

  return result;
};

export const handleKeyPress = (e) => {
  const charCode = e.charCode;
  // Allow alphanumeric characters and space (you can adjust the regex as needed)
  // /^[a-zA-Z0-9\s!@#$%^&*()_+{}\[\]:;<>,.?~\\-]*$/

  const validCharactersRegex = /^[a-zA-Z\s]*$/;

  if (!validCharactersRegex.test(String.fromCharCode(charCode))) {
    e.preventDefault(); // Prevent input of special characters
  }
};


export const handleKeyPresscharandspecialchar = (e) => {
  const charCode = e.charCode;
  const validCharactersRegex = /^[a-zA-Z\s!@#$%^&*()_+{}\[\]:;<>,.?~\\-]*$/;
  if (!validCharactersRegex.test(String.fromCharCode(charCode))) {
    e.preventDefault(); // Prevent input of special characters
  }
};

export const mobileNochecker = (e) => {
  const value = e.target.value;

  // Check if the value already contains 10 digits, or if the key pressed is not a digit (0-9)
  if (value.length >= 10 || !/^\d$/.test(e.key)) {
    e.preventDefault(); // Prevent further input
  }
};


export const numberChecker = (e) => {
  const charCode = e.charCode;
  const validCharactersRegex = /^[0-9]/;
  if (!validCharactersRegex.test(String.fromCharCode(charCode))) {
    e.preventDefault(); // Prevent input of special characters
  }
};

