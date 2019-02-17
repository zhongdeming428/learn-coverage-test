## 覆盖率测试

在写代码的时候，我们有时候会进行代码测试以保证我们代码的可执行性。但是测试代码只能保证测试案例能够通过，我们怎么样才能确保我们的测试案例基本覆盖了所有的情况呢？

比如：

```js
const a = true;
if (a) {
  return 1;
} else {
  return -1;
}
```

上面这段代码只能确保 `a === true` 的情况被执行，而没有执行 `a === false` 的情况。如果在实际使用当中，a 的值为 false，那么上面的代码可能会发生不可预知的情况。

所以我们需要引入覆盖率测试对我们的测试案例进行评估。

覆盖率用于评估在代码测试的过程中，所测试的代码的比例和程度。通常而言，测试覆盖率高的代码出错的几率比较小；测试覆盖率较低的代码出现不可预知行为的几率比较大。

## 覆盖率测试的分类

根据[维基百科](https://en.wikipedia.org/wiki/Code_coverage)的资料，基本的代码覆盖率有 4 种：`函数覆盖率`、`语句覆盖率`、`分支覆盖率`和`条件覆盖率`。

其中：

* **函数覆盖率**：程序中的函数占函数总量的比重
* **语句覆盖率**：执行代码行数占代码总行数的比重
* **分支覆盖率**：表示代码逻辑的每个分支是否都测试了，比如 if 条件为 true 或者 false 时的代码是否都被执行了
* **条件覆盖率**：每个布尔子表达式都应该被赋值为了 true 或者 false，这样才满足条件覆盖率测试。

比如现在有一个函数：

```js
function foo(x, y) {
  let res = 0;
  if (x > 0 && y > 0) {
    res = x;
  }
  return res;
}
```

对于上面这个函数，我们在测试时：

* 如果 foo 函数被执行了，那么该函数的函数覆盖率被满足。当源代码只包含这一个函数时，函数覆盖率为 100%。比如：`foo(1, 2)`
* 如果函数的每一行代码（每一条语句）都被执行了，那么该函数的语句覆盖率被满足。比如：`foo(1, 2)`，因为 `res = x` 也被执行了。
* 如果 if 内的代码也被执行了，那么条件覆盖率被满足。
* 如果测试案例中包含 `x > 0` 的值为 true 和 false 的情况，以及 `y > 0` 为 true 和 false 的情况，那么条件覆盖率被满足。比如：`foo(1, -1)` 和 `foo(-1, 1)`。

> 以上案例来自维基百科

## 使用 Mocha + Istanbul 测试覆盖率

[Mocha](https://mochajs.org/) 是 JavaScript 项目的测试工具，[Istanbul](https://github.com/gotwarlost/istanbul) 是 JS 测试覆盖率报告的生成工具。

该节介绍如何结合二者测试代码并生成代码测试覆盖率报告。

[nyc](https://github.com/istanbuljs/nyc) 是 Istanbul 的命令行接口，我们将其作为开发依赖安装在项目中：

```bash
$ npm i -D nyc
```

然后在我们的 `package.json` 文件的 `scripts` 对象中新增如下属性：

```json
"coverage": "node_modules/.bin/nyc --reporter=html --reporter=text node_modules/mocha/bin/_mocha"
```

当然，根据项目情况不同，上面的命令可以不一致，具体可以参考文档进行配置。

这样当你在 `npm run test` 之后就可以在测试结果之后看到输出的覆盖率报告，而且还会额外生成覆盖率报告页面文件到项目的 coverage 目录下。

![捕获1.png](./pics/捕获1.png)

点击 `coverage/index.html` 可以看到详细的覆盖率测试结果：

![捕获2.png](./pics/捕获2.png)

## 整合 Codecov 和 TravisCI 进行覆盖率自动化测试

首先要对你的 GitHub 账号开通 Codecov 权限，访问 [Codecov](https://codecov.io/gh)，然后使用 GitHub 账号登录。之后将会自动同步一些你的 GitHub 信息，按照指引进行即可。

此后还需要在 GitHub 进行设置，对某个 repo 开通 Codecov 的服务。具体可以在 GitHub marketplace 中找到 Codecov，然后点击 configure 进行配置。

Travis CI 脚本中需要添加几句命令，以便安装对应依赖和上传覆盖率报告。

`.travis.yml` 具体配置大约如下：

```yml
language: node_js
node_js:
  - "7"
install:
  - npm i
  - npm i -g codecov
script:
  - npm run coverage
  - node_modules/.bin/nyc report --reporter=text-lcov > coverage.lcov
  - codecov
cache:
  directories:
    - node_modules
```

可以看到安装的依赖为 codecov，并且是全局安装。然后使用 `node_modules/.bin/nyc report --reporter=text-lcov > coverage.lcov` 命令生成了报告。

配置好之后，当你每次对项目进行 PR 的时候，Codecov 会自动测试覆盖率，然后将报告评论在 PR 中：

![捕获3.png](./pics/捕获3.png)

如果 Contributor 没有对新增代码写对应的测试案例，你就可以一眼看出来。如果测试覆盖率太低，你可以修改 PR，重新合并。

## 添加 Codecov Badge

