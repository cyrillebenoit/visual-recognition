let express = require("express");
let app = express();
var multer = require('multer');
const bodyParser = require('body-parser');
var send = multer({
  dest: 'img/'
});
let upload = require("./upload.js");

let port = process.env.PORT || 8080;

app.use('/scripts', express.static(__dirname + '/node_modules/dropzone/dist/'));
app.use('/img', express.static(__dirname + '/img/'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.post('/file-upload', send.single('file'), upload.sendImage);
app.post('/treat', upload.treat);

app.listen(port);
console.log("Listening on port ", port);
