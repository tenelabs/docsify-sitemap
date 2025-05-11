#!/usr/bin/env node

import { Command } from "commander";
import pkg from "../package.json";

const program = new Command();

program.name(pkg.displayName).version(pkg.version).description(pkg.description);

program.parse(process.argv);
