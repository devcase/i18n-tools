import outputFileSync from "output-file-sync";
import path from "path";
import fs from "fs";
import readdirRecursive from "fs-readdir-recursive";
import extractText from '../extract-text';
import { sync as mkdirpSync } from "mkdirp";

function readdir(
    dirname, includeDotfiles, filter
) {
    return readdirRecursive(dirname, (filename, _index, currentDirectory) => {
        const stat = fs.statSync(path.join(currentDirectory, filename));

        if (stat.isDirectory()) return true;

        return (
            (includeDotfiles || filename[0] !== ".") && (!filter || filter(filename))
        );
    });
}

function deleteDir(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            const curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteDir(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

export default async function (cliOptions) {
    const filenames = cliOptions.filenames;

    if (cliOptions.deleteDirOnStart) {
        deleteDir(cliOptions.outDir);
    }

    mkdirpSync(cliOptions.outDir)

    function getDest(filename, base) {
        if (cliOptions.relative) {
            return path.join(base, cliOptions.outDir, filename);
        }
        return path.join(cliOptions.outDir, filename);
    }

    async function handle(filenameOrDir) {
        if (!fs.existsSync(filenameOrDir)) return 0;

        console.log(`Handling: ${filenameOrDir}`)

        const stat = fs.statSync(filenameOrDir);

        if (stat.isDirectory()) {
            const dirname = filenameOrDir;

            const files = readdir(dirname, cliOptions.includeDotfiles);

            return Promise.all(files.map(filename => {
                const src = path.join(dirname, filename);
                return handleFile(src, dirname);
            }))
        } else {
            const filename = filenameOrDir;
            return handleFile(filename, path.dirname(filename));
        }
    }

    let allstrings = {}
    let allhashmap = {}
    let allignored = {}

    async function handleFile(src, base) {
        if (path.extname(src) !== ".js") {
            return;
        }
        console.log(`File: ${src}`)
        let code = fs.readFileSync(src, {
            encoding: "UTF-8"
        });
        let { strings, hashmap, ignored } = extractText(code, src)
        Object.assign(allstrings, strings)
        Object.assign(allhashmap, hashmap)
        Object.assign(allignored, ignored)
    }

    await Promise.all(filenames.map(filename => handle(filename)))

    const stringDest = getDest("translations.pt-BR.ftl", cliOptions.outDir)
    const ignoredDest = getDest("ignored.pt-BR.ftl", cliOptions.outDir)
    const hashMapDest = getDest("hashmap.i18n", cliOptions.outDir)

    Object.keys(allstrings).forEach(key => {
        fs.appendFileSync(stringDest, `${key.substring(0, key.indexOf("."))} = ${allstrings[key]}\n`)
    })
    Object.keys(allignored).forEach(key => {
        fs.appendFileSync(ignoredDest, `${key.substring(0, key.indexOf("."))} = ${allignored[key]}\n`)
    })
    fs.appendFileSync(hashMapDest, JSON.stringify(allhashmap, null, 2))

}