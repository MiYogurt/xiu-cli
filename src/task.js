import 'babel-polyfill'
import toml from 'toml'
import yaml from 'js-yaml'
import chalk from 'chalk'
import { pathExistsSync } from 'fs-extra'
import runscript from 'runscript'
import fs from 'fs'
import { join } from 'path'

function read_file(path) {
  return fs.readFileSync(path).toString()
}

const _skipName = ['skip', 'name']

function get_plugin(name) {
  try {
    const plugin = require(`xiu-plugin-${name}`)
    return plugin
  } catch (e) {
    console.log(
      chalk.magenta(`>>>>>> ❌ [ xiu-plugin-${name} ] Not Found <<<<<<`)
    )
    return null
  }
}

export async function queue({ env, pipes, ignore = [] }, cwd) {
  const run = text =>
    runscript(text, {
      cwd,
      env
    })
  for (let pipe of pipes) {
    // 设置了跳过则直接跳过
    if (pipe.skip) {
      console.log(
        chalk.magenta('>>>>>> 🚧 [ ') +
          chalk.underline(pipe.name) +
          chalk.magenta(' ] Skip The Task <<<<<<')
      )
      continue
    }

    // 过滤掉不用的属性
    const taskNames = Object.keys(pipe).filter(
      key => _skipName.concat(ignore).indexOf(key) < 0
    )

    // 将属性名映射成插件明
    for (let name of taskNames) {
      let plugin = get_plugin(name)

      if (!plugin) {
        //
        process.exit(-1)
      }

      if (plugin.default) {
        plugin = plugin.default
      }

      console.log(
        chalk.cyanBright('>>>>>> 🚀 [ ') +
          chalk.underline(pipe.name) +
          chalk.cyanBright(' ] Running Task <<<<<<')
      )
      await plugin(pipe, run)
    }
  }
  console.log('\n')
}

function getConfigObject(path, name, parse) {
  const filename = join(path, name)
  const exists = pathExistsSync(filename)
  if (!exists) return null
  return parse(read_file(filename))
}

export async function start(path) {
  try {
    let configObjecjt = null
    const nameMap = {
      'xiu.toml': data => toml.parse(data),
      'xiu.yaml': data => yaml.safeLoad(data),
      'xiu.yml': data => yaml.safeLoad(data)
    }
    Object.keys(nameMap).forEach(filename => {
      const fn = nameMap[filename]
      let _config = getConfigObject(path, filename, fn)
      if (configObjecjt == null) {
        configObjecjt = _config
      }
    })
    if (configObjecjt == null) {
      console.log(chalk.magenta(`>>>>>> ❌ Config File Not Found <<<<<<`))
      process.exit(-1)
    }
    await queue(configObjecjt, path)
  } catch (e) {
    console.error(e)
  }
}
