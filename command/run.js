var exec = require('child_process').exec;

module.exports = function(craftix)
{
    console.log('=> Launching Craftix project');
    var config = craftix.build();

    console.log('=> Launching electron\n');

    exec(process.cwd() + '/node_modules/.bin/electron ' + config.buildFolder, function (err, stdout, stderr) {
        if (err) {
            console.error('Unable to launch !  ' + err);
        }

        if (stdout && stdout != '')
        {
            console.log('STDOUT: ' + stdout);
        }

        if (stderr && stderr != '')
        {
            console.error('STDERR: ' + stderr);
        }

        console.log('\n=> Launcher exited\n');
    });
};