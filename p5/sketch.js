/* jshint esversion: 8 */
// noprotect

function setup() {
  createCanvas(480, 360); // キャンバスを用意する
  start(100, 200); // ピゴニャンを呼び出す
}

async function draw() {
  await sleep(1); // 最初に1秒待つ
}
