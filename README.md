# vue-mpa-test

MPA（Multiple Page Application) test of Vue CLI project base.

## Environment

```
$ node --version
v14.15.1

$ vue --version
@vue/cli 4.5.11

$ cat ~/.vuerc
{
  "useTaobaoRegistry": false,
  "packageManager": "npm",
  "presets": {
    "mpa-test": {
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
}
```

## Command


### Project setup

```
npm ci
```

### Compiles and hot-reloads for development
```
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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
