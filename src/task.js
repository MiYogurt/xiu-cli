import 'babel-polyfill'
import toml from 'toml'
import fs from 'fs'
import { join } from 'path'
import chalk from 'chalk'

import runscript from 'runscript'

function read_file(path) {
    return fs.readFileSync(join(path, 'xiu.toml')).toString()
}


const _skipName = ['skip', 'name' ]

function get_plugin(name){
    try{
        const plugin = require(`xiu-plugin-${name}`)
        return plugin
    }catch(e){
        console.log(chalk.magenta(`>>>>>> ❌ [ xiu-plugin-${name} ] Not Found <<<<<<`))
        return null;
    }
}

export async function queue({ env, pipes, ignore = [] }, cwd) {
    const run = (text) => runscript(text, {
        cwd,
        env
    });
    try {
        for(let pipe of pipes) {

            // 设置了跳过则直接跳过
            if (pipe.skip) {
                console.log(chalk.magenta(`>>>>>> 🚧 [ `) + chalk.underline(pipe.name) + chalk.magenta(` ] Skip The Task <<<<<<`))
                continue
            }

            // 过滤掉不用的属性
            const taskNames = Object.keys(pipe).filter((key) => _skipName.concat(ignore).indexOf(key) < 0);

            // 将属性名映射成插件明
            for(let name of taskNames){
                console.log(name)
                let plugin = get_plugin(name);

                if (!plugin) {
                    process.exit(-1)
                }

                if (plugin.default) {
                    plugin = plugin.default
                }

                console.log(chalk.cyanBright(`>>>>>> 🚀 [ `) + chalk.underline(pipe.name) + chalk.cyanBright(` ] Running Task <<<<<<`))
                try{
                    const skip = await plugin(pipe, run)
                    if (skip) {
                        continue
                    }
                }catch(e){
                    console.log(e)
                }
            }
        }
        console.log("\n");
    }catch (e) {
        console.log(chalk.red(e))
    }
}

export function start(path){
    const config = read_file(path)
    queue(toml.parse(config), path)
}