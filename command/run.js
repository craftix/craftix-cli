var exec = require('child_process').exec;

module.exports = function(craftix)
{
    console.log('=> Launching Craftix project');
    var config = craftix.build();

    console.log('> Launching electron');

    exec(process.cwd() + '/node_modules/.bin/electron ' + config.buildFolder, function (stdout, stderr, err) {
        if (err) {
            console.error('Launching error: ' + err);
        }

        if (stdout && stdout != '')
        {
            console.log('Electron: ' + stdout);
        }

        if (stderr && stderr != '')
        {
            console.error('Electron err: ' + stderr);
        }

        console.log('\n=> Launcher exited');
    });
};