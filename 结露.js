#!/usr/bin/env node
"use strict";

// 按气温和湿度估露点，再看物面温度会不会结露。公式不要改。
// 露点等于气温减去（100减湿度）除以5的整数商。物面不高于露点就算结露。物面高于气温叫温度倒挂。

var 缺湿度 = "没法结露：缺了湿度\n";
var 别的错 = "没法结露：请给出气温、湿度和物面温度三个整数，湿度要在零到一百\n";

function 是整数(文本, 允许负) {
  if (允许负) {
    return /^-?[0-9]+$/.test(文本);
  }
  return /^[0-9]+$/.test(文本);
}

function 主程序(参数) {
  if (参数.length === 2 || (参数.length === 3 && (参数[1] === "" || 参数[1] === "缺"))) {
    process.stderr.write(缺湿度);
    return 2;
  }
  if (参数.length !== 3 || !是整数(参数[0], true) || !是整数(参数[1], false) || !是整数(参数[2], true)) {
    process.stderr.write(别的错);
    return 2;
  }
  var 气温 = Number(参数[0]);
  var 湿度 = Number(参数[1]);
  var 物温 = Number(参数[2]);
  if (!Number.isSafeInteger(气温) || !Number.isSafeInteger(湿度) || !Number.isSafeInteger(物温) || 湿度 > 100) {
    process.stderr.write(别的错);
    return 2;
  }
  var 露点 = 气温 - Math.floor((100 - 湿度) / 5);
  var 文 = "";
  if (物温 > 气温) {
    文 += "温度倒挂\n";
  }
  文 += 物温 <= 露点 ? "会结露\n" : "不会结露\n";
  process.stdout.write(文);
  return 0;
}

if (require.main === module) {
  process.exit(主程序(process.argv.slice(2)));
}

module.exports = { 主程序: 主程序 };
