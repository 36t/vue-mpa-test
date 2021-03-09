# vue-mpa-test


Vue CLI +MPA（Multiple Page Application)のテスト。

##  各ページのディレクトリ構造

- 各ページは```src/pages```以下に格納しています。
- ディレクトリ名がファイル名になります(```ディレクトリ名.html```)。
- 各ディレクトリ以下には```app.ts```と```App.vue``` を対で格納しています。
- ページタイトルは別管理で```src/pages/title.config.js``` 内で定義しています。

```
$ tree -L 3 src
src
├── pages
│   ├── about
│   │   ├── App.vue
│   │   └── app.ts
│   ├── index
│   │   ├── App.vue
│   │   └── app.ts
│   └── title.config.js
├── shims-tsx.d.ts
└── shims-vue.d.ts

```

## ページの追加手順

1. ```src/pages```に、追加したいページ名のディレクトリを作成します (例：ranking.html => ```src/pages/ranking/```)
2. 作成したディレクトリ以下に、```app.ts```と```App.vue```を作成します (各ファイルの内容は、後述の「2. サンプルページの追加」をご覧ください)
3. ```src/pages/title.config.js``` に、追加したページ名のタイトルを定義します。追加したディレクトリ名をキーに、タイトルを値に設定してください(例：```ranking: "ランキング情報"```)

## 開発環境について

```
npm ci
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## MPA化までの作業履歴

以下、```vue create```でプロジェクト作成から、MPA導入までの作業履歴になります。

### 1. vue createコマンドの実行

プリセットは基盤開発ツールのプリセット利用しています。


```
$ cd vue-mpa-test
$ vue create -m npm -r https://registry.npmjs.org .


Vue CLI v4.5.11
? Generate project in current directory? Yes


Vue CLI v4.5.11
? Please pick a preset: cocone ([Vue 2] dart-sass, babel, typescript, eslint)

# プリセットの内容
$ cat ~/.vuerc
{
  "useTaobaoRegistry": true,
  "packageManager": "yarn",
  "presets": {
    "cocone": {
      "useConfigFiles": true,
      "plugins": {
        "@vue/cli-plugin-babel": {},
        "@vue/cli-plugin-typescript": {
          "classComponent": true,
          "useTsWithBabel": true
        },
        "@vue/cli-plugin-eslint": {
          "config": "prettier",
          "lintOn": [
            "save",
            "commit"
          ]
        }
      },
      "vueVersion": "2",
      "cssPreprocessor": "dart-sass"
    }
  }
}%
```

### 2. サンプルページの追加

```
$ cd src
$ tree -L 3
.
├── App.vue
├── assets
│   └── logo.png
├── components
│   └── HelloWorld.vue
├── main.ts
├── pages # 追加
│   ├── about
│   │   ├── App.vue
│   │   └── app.ts
│   └── index
│       ├── App.vue
│       └── app.ts
├── shims-tsx.d.ts
└── shims-vue.d.ts
```

app.ts

```
import Vue from "vue";
import App from "./App.vue";

new Vue({
  el: "#app",
  render: h => h(App)
});
```

App.vue

```
<template>
  <div>
    <h1>This is ### page</h1>
    <a href="/###.html">Go to ### page</a>
  </div>
</template>

<style lang="scss"></style>

<script lang="ts">
import { Vue } from "vue-property-decorator";
export default class App extends Vue {}
</script>
```

### 3. vue.config.jsの追加

一旦、devServerの基本設定を定義。

```
module.exports = {
  devServer: {
    port: 3000,
    open: true
  }
};
```

挙動確認後、pagesのセッティングを追加。

```
module.exports = {
  devServer: {
    port: 3000,
    open: true
  },
  pages: {
    about: {
      entry: "./src/pages/about/app.ts",
      template: "public/index.html",
      filename: "about.html",
      title: "About Page",
      chunks: ["chunk-vendors", "chunk-common", "about"]
    },
    index: {
      entry: "./src/pages/index/app.ts",
      template: "public/index.html",
      filename: "index.html",
      title: "Index Page",
      chunks: ["chunk-vendors", "chunk-common", "index"]
    }
  }
};
```


### 4. 不要ファイルの削除

vue create実行後に用意される、サンプルファイルを削除

```
$ g st
On branch master
Your branch is up to date with 'origin/master'.

Changes not staged for commit:
  (use "git add/rm <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	deleted:    src/App.vue
	deleted:    src/components/HelloWorld.vue
	deleted:    src/main.ts
	deleted:    src/assets/logo.png
```

### 5. globパッケージの追加

上記で設定した「pages」プロパティの内容を、動的に定義させるために追加。

- [glob \- npm](https://www.npmjs.com/package/glob)

### 6. title設定ファイルの追加

上記で設定した「pages」プロパティのtitle部分の動的に出力するための、設定ファイルを作成。

title.config.js

```
module.exports = {
  index: "Index page",
  about: "About page"
};
```

### 7. 「pages」プロパティを動的な形に変更

上記で設定した「pages」プロパティを、「src/pages/」以下の「app.ts」ファイルを参照後、動的に定義する形に変更。

※titleが未指定の場合の対応は後ほど追記予定。

```
/* eslint @typescript-eslint/no-var-requires: 0 */
const glob = require("glob");
const titles = require("./src/pages/title.config.js");
const pages = {};

glob.sync("./src/pages/**/app.ts").forEach(path => {
  const chunk = path.split("./src/pages/")[1].split("/app.ts")[0];
  pages[chunk] = {
    entry: path,
    template: "public/index.html",
    filename: `${chunk}.html`,
    title: titles[chunk],
    chunks: ["chunk-vendors", "chunk-common", chunk]
  };
});

module.exports = {
  devServer: {
    port: 3000,
    open: true
  },
  pages
};
```

※requireが「@typescript-eslint/no-var-requires」のエラーに該当するため、1行目に回避コメントを追加している。

```
$ npm run lint

> vue-mpa-test@0.1.0 lint
> vue-cli-service lint

error: Require statement not part of import statement (@typescript-eslint/no-var-requires) at vue.config.js:1:14:
> 1 | const glob = require("glob");
    |              ^
  2 | const titles = require("./src/pages/title.config.js");
  3 | const pages = {};
  4 |


error: Require statement not part of import statement (@typescript-eslint/no-var-requires) at vue.config.js:2:16:
  1 | const glob = require("glob");
> 2 | const titles = require("./src/pages/title.config.js");
    |                ^
  3 | const pages = {};
  4 |
  5 | glob.sync("./src/pages/**/app.ts").forEach(path => {
```


### 8. 「npm run build」のテスト

正しくファイルが出力されていることを確認。

```
$ npm run build

> vue-mpa-test@0.1.0 build
> vue-cli-service build


⠙  Building for production...Starting type checking service...
Using 1 worker with 2048MB memory limit
⠦  Building for production...

 DONE  Compiled successfully in 5169ms                         10:45:44

  File                                 Size           Gzipped

  dist/js/chunk-vendors.7de16857.js    103.96 KiB     36.84 KiB
  dist/js/index.bd2257ad.js            2.23 KiB       1.08 KiB
  dist/js/about.768584a9.js            2.23 KiB       1.08 KiB

  Images and other types of assets omitted.

 DONE  Build complete. The dist directory is ready to be deployed.
 INFO  Check out deployment instructions at https://cli.vuejs.org/guide/deployment.html
 
 $ tree -L 3 dist
dist
├── about.html
├── favicon.ico
├── index.html
└── js
    ├── about.768584a9.js
    ├── about.768584a9.js.map
    ├── chunk-vendors.7de16857.js
    ├── chunk-vendors.7de16857.js.map
    ├── index.bd2257ad.js
    └── index.bd2257ad.js.map

1 directory, 9 files
```



## 参考

- [Configuration Reference \| Vue CLI](https://cli.vuejs.org/config/#pages)
- [javascript \- multiple pages in Vue\.js CLI \- Stack Overflow](https://stackoverflow.com/questions/51692018/multiple-pages-in-vue-js-cli)