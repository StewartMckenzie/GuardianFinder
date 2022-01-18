const fs = require('fs');
const path = require('path');

module.exports = {
  collection: path.resolve(__dirname, './history.json'),
  add: function (data) {
    try {
      // read the file
      const file = fs.readFileSync(this.collection);

      // parse the file into a JS object
      const parsed = JSON.parse(file);

      // add the new entry into the parsed file which is an array
      parsed.push(data);

      // write the updated array back to the file
      fs.writeFileSync(this.collection, JSON.stringify(parsed));
    } catch (error) {
      throw error;
    }
  },
  search: function (key, value) {
    try {
      // read the file
      const file = fs.readFileSync(this.collection);

      // parse the file into a JS object
      const parsed = JSON.parse(file);

      // if there is a key and value for searching then attempt to find matching data
      if (key && value) {
        return parsed.filter((data) => data[key] === value);
      }

      // return the javascript object
      return parsed;
    } catch (error) {
      throw error;
    }
  },
};
