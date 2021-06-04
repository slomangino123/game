const path = require('path');
module.exports = {
 "mode": "none",
 "entry": "./src/index.js",
 "output": {
   "path": __dirname + '/dist',
   "filename": "main.js"
 },
devServer: {
   contentBase: path.join(__dirname, 'dist')
 }
}