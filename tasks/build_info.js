var path = require('path');
var fs = require('fs');
let build_file = path.join('./src', 'assets', 'json', 'build.json');
let package_local = path.join('./package.json');

try {
    let package = JSON.parse(fs.readFileSync(package_local, 'utf8'));

    let cmd = "git log --pretty=format:'%h' -n 1"
    let revision = require('child_process')
        .execSync(cmd)
        .toString().trim().replace(/\'/g, '');

    fs.writeFileSync(build_file, JSON.stringify({ str: package.version, revision: revision }), 'utf8');

} catch (error) {
    console.log(error);
}


