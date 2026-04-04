var fs = require("fs");
var path = require("path");
var FtpDeploy = require("ftp-deploy");
var ftpDeploy = new FtpDeploy();

let revision = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim();

fs.writeFileSync(path.join(__dirname, '../www', 'revision'), JSON.stringify({ revision: revision }), 'utf8');
var argv = require("minimist")(process.argv.slice(2));
let system = 'geomem';

let config_base = {
    sftp: true,
    port: 22022,
    include: ["*", "**/*"], // this would upload everything except dot files
    exclude: ["assets/**/*", "svg/**/*"], //[],// e.g. exclude sourcemaps - ** exclude: [] if nothing to exclude **
    forcePasv: true // Passive mode is forced (EPSV command is not sent)
};

let cfgs = {
    geomem: {
        user: "root", // NOTE that this was username in 1.x
        password: "1@Lk.vps", // optional, prompted if none given
        host: "129.121.53.56",
        localRoot: path.join(__dirname, "../www"),
        remoteRoot: "/var/www/html/geomem",
    },
}

let config = {};
console.log(system);
let system_config = cfgs[system];
config = Object.assign(config, config_base, system_config);





// DEPLOY ASSETS

ftpDeploy.on("uploading", function (data) {
    data.totalFilesCount; // total file count being transferred
    data.transferredFileCount; // number of files transferred
    data.filename; // partial path with filename being uploaded
});
ftpDeploy.on("uploaded", function (data) {
    console.log(data); // same data as uploading event
});
ftpDeploy.on("log", function (data) {
    // console.clear();
    data.transferredFileCount = 0;
    console.log(data); // same data as uploading event
});

// ASSETS
return Promise.resolve(true)
    .then(async start => {
        if (argv.assets) {
            await ftpDeploy.deploy(Object.assign({}, config, {
                include: ["assets/**/*"],
                exclude: [],
                remoteRoot: "/var/www/html/assets/geomem"
            }))
        }

        // use with promises
        if (argv.app)
            await ftpDeploy.deploy(config);

        return;
    })
    .then(res => console.log("finished"))
    .catch(err => console.log(err));
