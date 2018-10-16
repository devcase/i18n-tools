import commander from "commander";

commander.option(
    "-d, --out-dir [out]",
    "Compile an input directory of modules into an output directory",
);

export default function parseArgv(args) {
    //
    commander.parse(args);

    const opts = commander.opts();
    return opts;
}  