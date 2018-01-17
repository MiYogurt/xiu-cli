<div align=center><img width="150" height="150"  src="./other/logo.png" alt="logo"></div>

![show](./other/show.gif)

> 陈独秀坐飞机 -- 在天上秀

write bash script in toml file.

property `shell` -> plugin `xiu-plugin-shell`, default install `xiu-plugin-shell` 。

## Usage

1. Install

```bash
npm i -g xiu-cli
```

2. Create `xiu.toml` config file

```toml
[env]
NAME="Yugo"

[[pipes]]
name='test'
shell='''
echo $NAME
sleep 2
cal
echo "\a"
'''

[[pipes]]
name='build'
shell='''
echo 陈独秀同学，请你坐下
'''

[[pipes]]
name='deploy'
skip=true
shell='''
echo 买橘子
'''
```

3. Run commond

if you set skip , then will be skip the task.

```
➜ xiu
```

## How to create plugin

```js
function shell(task, shell) {
  // task is config object
  // shell is pomisefiy spawn
  // you code in here
  return shell(task.shell) // like this
}

module.exports = module.exports.default = exports = shell

Object.defineProperty(exports, '__esModule', {
  value: true
})
```

publish your package, and the package name like `xiu-plugin-deploy`, and in your config file add `deploy` property .
