const fs = require("fs");
const path = require('path');

const readData = () => {
    const dataPath = path.join(__dirname, './../data/data.json');
    const rawData = fs.readFileSync(dataPath);
    return JSON.parse(rawData);
};

const writeData = (data) => {
    const dataPath = path.join(__dirname, './../data/data.json');
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };