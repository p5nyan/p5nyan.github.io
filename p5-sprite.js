'use strict';

let p5nyan; // start関数から始めるとき用

/** ピゴニャンを1体しか使わないときの初期設定（上巻） */
p5.prototype.start = (x = width / 2, y = height / 2, param = {}) => {
  if (p5nyan) return; // start関数で2体目はつくらない
  setupSprite(); // 初期設定
  p5nyan = new Sprite(x, y, param); // スプライトの生成
  noLoop(); // ループを止める
};

/** ピゴニャン用のp5.jsのセットアップ */
p5.prototype.setupSprite = (
  x = width / 2,
  y = height / 2,
  margin_y = 0,
  margin_x = 0
) => {
  // キャンバスの設定
  document.querySelector('canvas').style.border = 'solid 1px gray';
  if (margin_x) {
    document.querySelector('canvas').style.marginTop = margin_x + 'px';
  }
  if (margin_y) {
    document.querySelector('canvas').style.marginTop = margin_y + 'px';
  }
  // document.addEventListener("contextmenu", (e) => e.preventDefault());

  background(255); // 描画の装飾
  frameRate(30); // その他の設定
};

/** スプライト（ピゴニャン） */
class Sprite {
  static flushScreen = true;
  static withBody = true;

  constructor(x, y, param = {}) {
    this.x = x;
    this.y = Sprite.withBody ? y - 14 : y;
    this.dir = param.dir || { x: 1, y: 0 };
    this.col = param.col || 'coral';
    this.dcol = this.getDarkColor(this.col);
    this.pcol = this.getPaleColor(this.col);
    this.state = false;
    this.keepH = false;
    this.fishList = [];
    this.msg = undefined;
    this.draw();
  }

  /** 描画（ピゴニャンと魚） */
  draw(keepState = false, noSpeak = false) {
    if (Sprite.flushScreen) background(255);

    // 魚
    let eaten = this.eatFish();
    this.drawFish();

    // 歩き状態を更新
    this.state = keepState ? this.state : !this.state;

    // ピゴニャン
    push();
    rectMode(CENTER);
    strokeCap(ROUND);
    // 左右向き
    if (this.dir.x) {
      if (Sprite.withBody) {
        this.drawBodyH(this.x, this.y, this.dir.x);
      }
      this.drawHeadH(this.x, this.y, this.dir.x);
    }
    // 上下向き
    else {
      if (Sprite.withBody) {
        this.drawBodyV(this.x, this.y, this.dir.y);
        this.drawHeadV(this.x, this.y, this.dir.y);
      } else {
        this.drawHeadV(this.x, this.y, this.dir.y);
      }
    }
    pop();

    // しゃべる
    if (!noSpeak && this.msg != undefined) {
      this.drawMessage();
    }

    return eaten;
  }

  /** 左右向きの胴体 */
  drawBodyH(x, y, d) {
    // 手前脚が前
    if (this.state) {
      // tail
      strokeWeight(2.5);
      stroke(this.dcol);
      let p = { x: x - 13 * d, y: y + 35 };
      line(p.x + 10 * d, p.y - 5, p.x, p.y);
      line(p.x, p.y, p.x - 5 * d, p.y);
      // back arm
      stroke(this.pcol);
      strokeWeight(4.3);
      line(x + 12 * d, y + 24.5, x + 17 * d, y + 27.5);
      // back leg
      strokeWeight(5.5);
      p = { x: x - 6 * d, y: y + 38 };
      line(p.x + 9 * d, p.y - 9, p.x, p.y);
      line(p.x, p.y, p.x + 5 * d, p.y + 2);
      // front arm
      stroke(this.col);
      strokeWeight(5);
      line(x - 8.5 * d, y + 23.5, x - 16 * d, y + 27.5);
      // front leg
      strokeWeight(6);
      p = { x: x + 10 * d, y: y + 38 };
      line(p.x - 14 * d, p.y - 8, p.x, p.y);
      line(p.x, p.y, p.x + 4 * d, p.y - 2);
    }
    // 手前脚が後
    else {
      // tail
      strokeWeight(2.5);
      stroke(this.dcol);
      let p = { x: x - 15 * d, y: y + 35 };
      line(p.x + 9 * d, p.y - 4, p.x, p.y);
      line(p.x, p.y, p.x - 4 * d, p.y - 2);
      // back arm
      stroke(this.pcol);
      strokeWeight(4.5);
      line(x - 7 * d, y + 24, x - 12 * d, y + 27.5);
      // back leg
      strokeWeight(5.5);
      p = { x: x + 9 * d, y: y + 38.5 };
      line(p.x - 5 * d, p.y - 7, p.x, p.y);
      line(p.x, p.y, p.x + 4 * d, p.y);
      // front leg
      stroke(this.col);
      strokeWeight(6);
      p = { x: x - 8 * d, y: y + 39 };
      line(p.x + 4 * d, p.y - 8, p.x, p.y);
      line(p.x, p.y, p.x + 7 * d, p.y);
    }
    // body
    noStroke();
    fill(this.col);
    square(x + 2 * d, y + 22, 22, 5);
    // 手前脚が前
    if (this.state) {
      // bell
      fill(this.dcol);
      ellipse(x + 4 * d, y + 20, 18, 6);
      noStroke();
      fill('gold');
      circle(x + 10 * d, y + 23, 5);
    }
    // 手前脚が後
    else {
      // bell
      fill(this.dcol);
      ellipse(x + 6 * d, y + 20, 14, 5);
      noStroke();
      fill('gold');
      circle(x + 12 * d, y + 23, 5);
      // front arm
      strokeWeight(5);
      stroke(this.col);
      line(x, y + 23.5, x + 16 * d, y + 27.5);
    }
  }

  /** 左右向きの頭部 */
  drawHeadH(x, y, d) {
    // ear
    noStroke();
    fill(this.dcol);
    triangle(x + 8 * d, y - 20, x + 24 * d, y - 12, x + 20 * d, y - 28);
    // head
    fill(this.col);
    ellipse(x, y, 60, 44);
    // eyes
    fill(0);
    circle(x, y, 6);
    circle(x + 22 * d, y, 5.75);
    // ear
    fill(this.dcol);
    triangle(x, y - 18, x - 22 * d, y - 12, x - 12 * d, y - 32);
    // nose
    triangle(x + 12 * d, y + 6, x + 20 * d, y + 6, x + 16 * d, y + 9);
    // whiskers
    strokeWeight(1);
    stroke(this.dcol);
    line(x - 12 * d, y + 6, x - 18 * d, y + 6);
    line(x - 12 * d, y + 3, x - 18 * d, y + 3);
    line(x + 31 * d, y + 6, x + 29 * d, y + 6);
    line(x + 31 * d, y + 3, x + 30 * d, y + 3);
    // mouth
    if (this.msg != undefined) {
      fill('crimson');
      noStroke();
      ellipse(x + 14 * d, y + 14, 4, 5);
    }
  }

  /** 上下向きの胴体 */
  drawBodyV(x, y, dy) {
    let p = { x: x, y: y };
    let dx = this.state ? 1 : -1;

    // 下向き
    if (dy > 0) {
      // front leg
      stroke(this.col);
      strokeWeight(6);
      p = { x: x - 8 * dx, y: y + 39 };
      line(p.x + 2 * dx, p.y - 8, p.x, p.y);
      line(p.x, p.y, p.x - 4 * dx, p.y - 2);
      // back leg
      stroke(this.pcol);
      strokeWeight(5.5);
      line(x + 6 * dx, y + 33, x + 8 * dx, y + 36);
      // front arm
      strokeWeight(5);
      stroke(this.col);
      line(x + 6 * dx, y + 20, x + 17 * dx, y + 28.5);
      // back arm
      strokeWeight(4.5);
      stroke(this.pcol);
      line(x - 4 * dx, y + 18, x - 14 * dx, y + 26);
      // body
      noStroke();
      fill(this.col);
      square(x, y + 22, 22, 5);
      // bell
      fill(this.dcol);
      ellipse(x, y + 20, 20, 7);
      noStroke();
      fill('gold');
      circle(x, y + 23, 5);
    }
    // 上向き
    else {
      // front leg
      stroke(this.col);
      strokeWeight(6);
      p = { x: x - 6 * dx, y: y + 39 };
      line(p.x, p.y - 8, p.x, p.y);
      line(p.x, p.y, p.x - 3 * dx, p.y - 2);
      // back leg
      stroke(this.pcol);
      strokeWeight(5.5);
      p = { x: x + 6 * dx, y: y + 35 };
      line(p.x, p.y - 6, p.x, p.y);
      line(p.x, p.y, p.x + 3 * dx, p.y - 2);
      // front arm
      strokeWeight(5);
      stroke(this.col);
      line(x + 6 * dx, y + 20, x + 17 * dx, y + 28.5);
      // back arm
      strokeWeight(4.5);
      stroke(this.pcol);
      line(x - 4 * dx, y + 18, x - 14 * dx, y + 26);
      // body
      noStroke();
      fill(this.col);
      square(x, y + 22, 22, 5);
      // belt
      fill(this.dcol);
      ellipse(x, y + 20, 20, 7);
      // tail
      strokeWeight(2.5);
      stroke(this.dcol);
      const d = this.state ? 1 : -1;
      p = { x: x, y: y + 38 };
      line(p.x, p.y - 7, p.x, p.y);
      line(p.x, p.y, p.x + 4 * d, p.y + 3);
    }
  }

  /** 上下向きの頭部 */
  drawHeadV(x, y, d) {
    // head
    noStroke();
    fill(this.col);
    ellipse(x, y, 60, 44);
    if (Sprite.withBody) {
      if (d < 0) {
        // ears
        fill(this.dcol);
        triangle(x - 6, y - 14, x - 26, y - 7, x - 22, y - 27);
        triangle(x + 6, y - 14, x + 26, y - 7, x + 22, y - 27);
      } else {
        // eyes
        fill(0);
        circle(x - 12, y, 6);
        circle(x + 12, y, 6);
        // ears
        fill(this.dcol);
        triangle(x - 6, y - 18, x - 26, y - 11, x - 22, y - 29);
        triangle(x + 6, y - 18, x + 26, y - 11, x + 22, y - 29);
        // nose
        triangle(x + 4, y + 6, x - 4, y + 6, x, y + 9);
        // whiskers
        strokeWeight(1);
        stroke(this.dcol);
        line(x - 24, y + 6, x - 30, y + 6);
        line(x - 24, y + 3, x - 30, y + 3);
        line(x + 24, y + 6, x + 30, y + 6);
        line(x + 24, y + 3, x + 30, y + 3);
        // mouth
        if (this.msg != undefined) {
          fill('crimson');
          noStroke();
          ellipse(x, y + 15, 4, 5);
        }
      }
    } else {
      // eyes
      fill(0);
      circle(x - 12, y + 6 * d, 6);
      circle(x + 12, y + 6 * d, 6);
      // ears
      fill(this.dcol);
      triangle(x - 6, y - 10 * d, x - 26, y - 6 * d, x - 18, y - 26 * d);
      triangle(x + 6, y - 10 * d, x + 26, y - 6 * d, x + 18, y - 26 * d);
      // nose
      triangle(x + 4, y + 13 * d, x - 4, y + 13 * d, x, y + 16 * d);
      // whiskers
      strokeWeight(1);
      stroke(this.dcol);
      line(x - 22, y + 10 * d, x - 28, y + 10 * d);
      line(x - 22, y + 13 * d, x - 28, y + 13 * d);
      line(x + 22, y + 10 * d, x + 28, y + 10 * d);
      line(x + 22, y + 13 * d, x + 28, y + 13 * d);
      // mouth
      if (this.msg != undefined) {
        fill('crimson');
        noStroke();
        ellipse(x, y + 20 * d, 4, 4);
      }
    }
  }

  /** 動く */
  move(steps) {
    if (!isFinite(steps)) return;
    this.x += this.dir.x * steps;
    this.y += this.dir.y * steps;
    if (Sprite.flushScreen) {
      return this.draw();
    } else {
      return this.draw(false, true);
    }
  }

  /** 〜に向ける */
  turn(dir) {
    switch (dir) {
      case '上':
      case 0:
        this.dir.x = 0;
        this.dir.y = -1;
        break;
      case '下':
      case 180:
        this.dir.x = 0;
        this.dir.y = 1;
        break;
      case '右':
      case 90:
        this.dir.x = 1;
        this.dir.y = 0;
        break;
      case '左':
      case -90:
      case 270:
        this.dir.x = -1;
        this.dir.y = 0;
        break;
      default:
        console.error('方向は 上/下/左/右 か 0/90/180/270 で指定してください');
        noLoop();
        break;
    }

    if (Sprite.flushScreen) {
      this.draw(true);
    }
  }

  /** 方向反転 */
  turnBack() {
    if (this.dir.x) {
      this.dir.x *= -1;
    } else {
      this.dir.y *= -1;
    }
    if (Sprite.flushScreen) {
      this.draw(true);
    }
  }

  /** 方法を取得 */
  getDirection() {
    if (this.dir.x == 1) {
      return '右';
    }
    if (this.dir.x == -1) {
      return '左';
    }
    if (this.dir.y == 1) {
      return '下';
    }
    if (this.dir.y == -1) {
      return '上';
    }
  }

  /** セリフを設定 */
  say(msg = undefined) {
    if (msg === '') {
      this.msg = undefined;
    } else {
      this.msg = msg;
    }
    this.draw(true);
  }

  /** しゃべる（描画） */
  drawMessage() {
    push();
    textAlign(CENTER, CENTER);
    fill(0);
    noStroke();
    if (this.dir.x) {
      text(this.msg, this.x + 2 * this.dir.x, this.y - 42);
    } else {
      text(this.msg, this.x, this.y - 42);
    }
    pop();
  }

  /** 色を変える */
  changeColor(col = 'coral') {
    if (col === 'random') {
      col = this.randomColor(this.col);
    }
    this.col = col;
    this.dcol = this.getDarkColor(col);
    this.pcol = this.getPaleColor(col);
    this.draw(true);
  }

  /** 次のポーズにする */
  nextCostume() {
    this.draw();
  }

  /** ツール（ランダムに色を選ぶ） */
  randomColor(cur_col) {
    const list = [
      'coral',
      'silver',
      'skyblue',
      'gold',
      'lightgreen',
      'plum',
      'lightpink',
    ];
    let col;
    do {
      col = random(list);
    } while (col === cur_col);
    return col;
  }

  /** ツール（耳・鼻・しっぽの色） */
  getDarkColor(col, s = 0.5) {
    push();
    colorMode(HSL, 360, 100, 100);
    const dcol = color(hue(col), saturation(col), lightness(col) * s);
    pop();
    return dcol;
  }

  /** ツール（後ろの手足の色） */
  getPaleColor(col, s = 0.75) {
    push();
    colorMode(HSL, 360, 100, 100);
    const pcol = color(hue(col), saturation(col) * s, lightness(col) * 0.9);
    pop();
    return pcol;
  }

  getColor() {
    return this.col;
  }

  /** 座標で指定 */
  goTo(x, y, withTurn = true) {
    if (!isFinite(x) || !isFinite(y)) return;
    if (Sprite.withBody) y -= 14;
    // 移動時に方向転換する（通常）
    if (withTurn) {
      const keepState = this.x == x && this.y == y;
      if (this.keepH || abs(this.x - x) > abs(this.y - y)) {
        if (x != this.x) {
          this.dir.x = x > this.x ? 1 : -1;
        } // else x方向変更なし
        this.dir.y = 0;
      } else if (abs(this.x - x) < abs(this.y - y)) {
        if (y != this.y) {
          this.dir.y = y > this.y ? 1 : -1;
        } // else y方向変更なし
        this.dir.x = 0;
      } // else xy方向変更なし
      this.x = x;
      this.y = y;
      if (Sprite.flushScreen) {
        return this.draw(keepState);
      } else {
        return this.draw(keepState, true);
      }
    } else {
      this.x = x;
      this.y = y;
      if (Sprite.flushScreen) {
        return this.draw();
      } else {
        return this.draw(false, true);
      }
    }
  }

  getXY() {
    const y = Sprite.withBody ? this.y + 14 : this.y;
    return [this.x, y];
  }

  setX(x, withTurn = true) {
    if (!isFinite(x)) return;
    if (withTurn) {
      const keepState = this.x == x;
      if (this.dir.y) this.dir.y = 0;
      if (x != this.x) {
        this.dir.x = x > this.x ? 1 : -1;
      } // else x方向変更なし
      this.x = x;
      if (Sprite.flushScreen) {
        return this.draw(keepState);
      } else {
        return this.draw(keepState, true);
      }
    } else {
      this.x = x;
      if (Sprite.flushScreen) {
        return this.draw();
      } else {
        return this.draw(false, true);
      }
    }
  }

  getX() {
    return this.x;
  }

  setY(y, withTurn = true) {
    if (!isFinite(y)) return;
    if (Sprite.withBody) y -= 14;
    if (withTurn) {
      const keepState = this.y == y;
      if (this.dir.x) this.dir.x = 0;
      if (y != this.y) {
        this.dir.y = y > this.y ? 1 : -1;
      } // else y方向変更なし
      this.y = y;
      if (Sprite.flushScreen) {
        return this.draw(keepState);
      } else {
        return this.draw(keepState, true);
      }
    } else {
      this.y = y;
      if (Sprite.flushScreen) {
        return this.draw();
      } else {
        return this.draw(false, true);
      }
    }
  }

  getY() {
    const y = Sprite.withBody ? this.y + 14 : this.y;
    return y;
  }

  // 身体の方向を左右向きに限定する
  keepHorizontal(flag) {
    this.keepH = flag;
  }

  /* 以下、魚の描画  */

  /** 魚をリストに追加して描画する */
  putFish(x, y, col = 'skyblue') {
    if (!isFinite(x) || !isFinite(y)) return;
    if (col === 'random') {
      col = this.randomColor(this.col);
    }
    let sameFish = undefined;
    for (let i = 0; i < this.fishList.length; i++) {
      if (this.fishList[i].x == x && this.fishList[i].y == y) {
        if (this.fishList[i].col != col) {
          sameFish = i;
          break;
        } else {
          // 同じ位置で同色はリスト追加なし
          return;
        }
      }
    }
    if (sameFish === undefined) {
      // 新しい魚はリストに追加
      this.fishList.push({
        x: x,
        y: y,
        col: col,
        tailCol: this.getDarkColor(col),
      });
    } else {
      // 色違いは置きかえ
      this.fishList.splice(sameFish, 1, {
        x: x,
        y: y,
        col: col,
        tailCol: this.getDarkColor(col),
      });
    }
    return this.draw(true);
  }

  /** 魚を描画する */
  drawFish() {
    if (!this.fishList) return;
    for (let fish of this.fishList) {
      this.fish(fish.x, fish.y, fish.col, fish.tailCol);
    }
  }

  /** 魚1匹の描画 */
  fish(x, y, col, tailCol) {
    push();
    fill(col);
    noStroke();
    ellipse(x, y, 30, 15);
    fill(tailCol);
    circle(x - 5, y - 1, 4);
    triangle(x + 15, y, x + 22, y + 7, x + 22, y - 7);
    pop();
  }

  /** 魚を動かす */
  moveFish(step = 10) {
    if (!this.fishList) return;
    for (let i = 0; i < this.fishList.length; i += 1) {
      this.fishList[i].x -= step;
      if (this.fishList[i].x < -11) this.fishList[i].x = width + 15;
    }
    return this.draw(true);
  }

  /**  魚が食べられたらリストから外す */
  // 戻り値： 食べた魚の座標と色／食べてなかったらfalse
  eatFish() {
    if (!this.fishList) return false;
    let eaten = false;
    const x = this.x;
    const y = Sprite.withBody ? this.y + 14 : this.y;
    this.fishList = this.fishList.filter((fish) => {
      const fx = fish.x;
      const fy = fish.y;
      if (Sprite.withBody) {
        if (fx < x + 45 && fx > x - 52 && fy < y + 36 && fy > y - 44) {
          eaten = fish;
          return false;
        }
      } else {
        if (fx < x + 45 && fx > x - 52 && fy < y + 30 && fy > y - 30) {
          eaten = fish;
          return false;
        }
      }
      return true;
    });
    if (eaten) {
      return { x: eaten.x, y: eaten.y, col: eaten.col };
    } else {
      return false;
    }
  }

  /**  魚の残り数を取得する */
  getFishNum() {
    return !this.fishList ? 0 : this.fishList.length;
  }
}

/** startメソッドで生成したピゴニャンのメソッドを直接呼び出す */

p5.prototype.move = (steps) => {
  return p5nyan.move(steps);
};

p5.prototype.say = (msg) => {
  p5nyan.say(msg);
};

p5.prototype.sayFor = async (msg, sec) => {
  if (!sec) {
    p5nyan.say(msg);
  } else {
    p5nyan.say(msg);
    p5nyan.draw(true);
    await sleep(sec);
    p5nyan.say('');
  }
};

p5.prototype.turn = (dir) => {
  p5nyan.turn(dir);
};

// turnの別名
p5.prototype.pointInDirection = (dir) => {
  p5nyan.turn(dir);
};

p5.prototype.turnBack = () => {
  p5nyan.turnBack();
};

p5.prototype.getDirection = () => {
  p5nyan.getDirection();
};

p5.prototype.changeColor = (col) => {
  p5nyan.changeColor(col);
};

p5.prototype.getColor = () => {
  return p5nyan.getColor();
};

p5.prototype.goTo = (x, y, withTurn) => {
  return p5nyan.goTo(x, y, withTurn);
};

// goToの別名
p5.prototype.setXY = (x, y, withTurn) => {
  return p5nyan.goTo(x, y, withTurn);
};

p5.prototype.getXY = () => {
  return p5nyan.getXY();
};

p5.prototype.setX = (x, withTurn) => {
  return p5nyan.setX(x, withTurn);
};

p5.prototype.getX = () => {
  return p5nyan.getX();
};

p5.prototype.setY = (y, withTurn) => {
  return p5nyan.setY(y, withTurn);
};

p5.prototype.getY = () => {
  return p5nyan.getY();
};

p5.prototype.keepHorizontal = (flag = true) => {
  p5nyan.keepHorizontal(flag);
};

p5.prototype.putFish = (x, y, col) => {
  return p5nyan.putFish(x, y, col);
};

p5.prototype.moveFish = (step) => {
  return p5nyan.moveFish(step);
};

p5.prototype.getFishNum = () => {
  return p5nyan.getFishNum();
};

/*
p5.prototype.randomColor = () => {
  return p5nyan.randomColor(p5nyan.col);
};
*/

p5.prototype.nextCostume = () => {
  p5nyan.nextCostume();
};

/** ピゴニャン用のツール関数 */

p5.prototype.sleep = (sec) => {
  if (sec < 0) return;
  return new Promise((resolve) => {
    setTimeout(() => resolve(), sec * 1000);
  });
};

p5.prototype.randomInt = (min, max) => {
  if (min >= max) {
    let temp = min;
    max = min;
    min = temp;
  }
  return floor(random(min, max + 1));
};
