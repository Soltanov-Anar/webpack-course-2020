const start = async () => await Promise.resolve("async is working");

start().then(console.log);

//* @babel/plugin-proposal-class-properties

class Util {
  static id = Date.now();
}

console.log("Util.id", Util.id);

const unused = "check eslint";
console.log(unused);

import("lodash").then(lodash => {
  if (lodash["random"]) console.log("Lodash", lodash, lodash.random(5));

  console.log("Failed to load Lodash");
});