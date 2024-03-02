npm link 本地仓库

1. 切换到 huatian-model 根目录
   cd packages/huatian-model
   瞄一眼 model 目录的 package 名，也就是对应 package.json 中的 name，可以看到是@huatian/model

2. link
   npm link

3. 切换回 huatian-svc 根目录
   cd packages/huatian-svc

4. link model 目录
   npm link @huatian/model

5. npm 会帮你把 model 中文件安装到 svc 的 node_modules 目录下

注意事项

1. package.json 中不会显示你 link 的本地目录，所以初始化的 npm install 是不会自动搞这个的，需要手动操作

2. 打包的模块要声明入口， 才能直接 import
   如`import { User } from "@huatian/model";`
   在 model 目录 src 下新建 index.ts

```js
export * from "./User";
export * from "./Message";
export * from "./ChatSession";
export * from "./UserChat";
```
