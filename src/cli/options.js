import commander from "commander";
import uniq from "lodash/uniq";
import glob from 'glob';

commander.option(
    "-d, --out-dir [out]",
    "Compile an input directory of modules into an output directory",
);

export default function parseArgv(args) {
    //
    commander.parse(args);

    let filenames = commander.args.reduce(function(globbed, input) {
        let files = glob.sync(input);
        if (!files.length) files = [input];
        return globbed.concat(files);
      }, []);
    filenames = uniq(filenames);


    const opts = commander.opts();
    return {
        ...opts,
        filenames
    };
}  