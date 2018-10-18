#!/usr/bin/env node

import dir from './dir'

import parseArgv from "./options";

const opts = parseArgv(process.argv);

dir(opts).catch(err => {
    console.error(err);
    process.exit(1);
})