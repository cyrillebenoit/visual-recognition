var spawn = require('child_process').spawn;

console.log("Deleting working image fragments");
var cp = spawn(process.env.comspec, ['/c', 'del ./tmp/xx*.*']);
var cp = spawn(process.env.comspec, ['/c', 'del ./tmp/zzxx*.*']);
var cp = spawn(process.env.comspec, ['/c', 'del ./tmp/captioned-*.*']);

cp.stdout.on("data", function(data) {
    console.log(data.toString());
});

cp.stderr.on("data", function(data) {
    console.error(data.toString());
});