import slash from "slash";
import path from "path";
import fs from "fs";
import readdirRecursive from "fs-readdir-recursive";
import extractText from '../extract-text';

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


export default async function (cliOptions) {
    const filenames = cliOptions.filenames;

    async function handle(filenameOrDir) {
        if (!fs.existsSync(filenameOrDir)) return 0;

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

    async function handleFile(src, base) {
        let code = fs.readFileSync(src, {
            encoding: "UTF-8"
        });
        let {strings, hashmap} = extractText(code)
        Object.assign(allstrings, strings)
        Object.assign(allhashmap, hashmap)
    }

    await Promise.all(filenames.map(filename => handle(filename)))

    console.log(allstrings)
}