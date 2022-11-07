const manifest = require("./src/manifest.json");
const fs = require('fs');
const archiver = require('archiver');
const zip = require('adm-zip');

const Files = true

const version = manifest.version
const source_dir = "./src"
const excludedFiles = []

const outputZip = `./dist/${version}/zip/`
const outputFiles = `./dist/${version}/src/`


if (!fs.existsSync(outputZip)){
    fs.mkdirSync(outputZip, {recursive: true});
}
if (!fs.existsSync(outputFiles) && Files){
    fs.mkdirSync(outputFiles, {recursive: true});
}

let output = fs.createWriteStream(outputZip+"BetterEDT.zip");
let archive = archiver('zip');


console.log("----- Création du ZIP -----")
output.on('close', function () {
    console.log(`✅    ZIP version ${version} créé : ${outputZip}BetterEDT.zip`);
    console.log(archive.pointer() + ' total bytes');

    console.log("----- Décompression du ZIP -----")
    let file = new zip(outputZip+"BetterEDT.zip");
    file.extractAllTo(outputFiles, true)
    console.log(`✅    ZIP version ${version} décompressé : ${outputFiles}`);
})

archive.on('error', function(err){
    throw err;
});
archive.pipe(output);
archive.directory(source_dir, false);
archive.finalize()

