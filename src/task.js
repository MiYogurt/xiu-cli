import 'babel-polyfill'
import toml from 'toml'
import fs from 'fs'
import { join } from 'path'
import chalk from 'chalk'

import shell from './shell'
import runscript from 'runscript'

function read_file(path) {
    return fs.readFileSync(join(path, 'xiu.toml')).toString()
}

export async function queue({ env, pipes }, cwd , stdout, stderr) {
    const run = (text) => runscript(text, {
        cwd,
        env,
        stdout,
        stderr
    });
    try {
        for(let currentTask of pipes) {
            if (currentTask.skip) {
                stdout.write(chalk.magenta(`>>>>>> 🚧 [ `) + chalk.underline(currentTask.name) + chalk.magenta(` ] Skip The Task <<<<<<`))
                continue
            }
            console.log(chalk.cyanBright(`>>>>>> 🚀 [ `) + chalk.underline(currentTask.name) + chalk.cyanBright(` ] Running Task <<<<<<`))

            const skip = await shell(currentTask, run)

            if (skip) {
                continue
            }

        }
        console.log("\n");
    }catch (e) {
        console.log(e)
    }
}

export function start(path){
    const config = read_file(path)
    queue(toml.parse(config), path, process.stdout, process.stdin)
}