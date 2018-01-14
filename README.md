# show


## usage

```bash
npm i -g xiu-cli
```


create `xiu.toml`

```toml
[env]
NAME="Yugo"

[[pipes]]
name='say hello'
shell='''
echo $NAME
'''

[[pipes]]
name='say hello'
shell='''
echo 陈独秀
'''

[[pipes]]
name='say hello'
skip=true
shell='''
echo 买橘子
'''
```


run xiu

```
➜ xiu
Yugo
陈独秀
>>>>>> skip task [say hello]
```