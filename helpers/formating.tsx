export const lowerKey = (obj) => {
    const result = {};
  
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        result[key.toLowerCase()] = obj[key];
      }
    }
  
    return result;
  }

  export const lowerKeyArray = (arr) => {
    return arr.map(obj => {
      const newObj = {};
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          newObj[key.toLowerCase()] = obj[key];
        }
      }
      return newObj;
    });
  }