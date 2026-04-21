let cam;
let pg;
let bubbles = [];

function setup() {
  // 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  cam = createCapture(VIDEO);
  // 隱藏原始的 HTML 影片元素，確保影像只顯示在畫布中
  cam.hide();

  // 產生一個與視訊畫面一樣寬高的 Graphics 繪圖圖層
  pg = createGraphics(width * 0.6, height * 0.6);
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');
  
  // 顯示的影像寬高為整個畫布寬高的 60%
  let imgWidth = width * 0.6;
  let imgHeight = height * 0.6;
  
  // 計算將影像放置在正中間的 x 與 y 座標
  let x = (width - imgWidth) / 2;
  let y = (height - imgHeight) / 2;
  
  // 在畫布上繪製攝影機影像（並修正左右顛倒）
  push(); // 儲存目前的繪製狀態
  translate(width, 0); // 將座標原點水平推移到畫布右側
  scale(-1, 1); // 將 X 軸設定為 -1 來達到水平翻轉的效果
  image(cam, x, y, imgWidth, imgHeight); // 繪製翻轉後的影像
  pop(); // 恢復先前的繪製狀態，以免影響後續其他的繪圖

  // 在 pg 圖層上繪製內容（這裡以畫一個半透明圓形作為範例）
  pg.clear(); // 清除上一幀的畫面，保持背景透明

  // 每幀隨機產生新的泡泡
  if (random(1) < 0.5) {
    bubbles.push(new Bubble(pg.width, pg.height));
  }

  // 更新並顯示所有泡泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display(pg);
    if (bubbles[i].isOffscreen()) {
      bubbles.splice(i, 1); // 如果泡泡超出畫面，就將它從陣列中移除
    }
  }

  // 將 pg 顯示在視訊畫面的上方 (相同座標與尺寸)
  image(pg, x, y, imgWidth, imgHeight);
}

// 當視窗大小改變時，重新調整畫布尺寸以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 視窗縮放時，同步重新建立 pg 圖層的尺寸
  pg = createGraphics(windowWidth * 0.6, windowHeight * 0.6);
}

// 定義泡泡的 class
class Bubble {
  constructor(pgWidth, pgHeight) {
    // 泡泡的初始位置在圖層底部外，x 座標隨機
    this.x = random(pgWidth);
    this.y = pgHeight + random(50);
    // 泡泡的大小與上升速度隨機
    this.r = random(5, 25);
    this.speed = random(1, 4);
    // 泡泡的透明度隨機
    this.alpha = random(100, 200);
  }

  // 更新泡泡的位置（向上移動）
  update() {
    this.y -= this.speed;
  }

  // 在指定的 pg 圖層上繪製泡泡
  display(pg) {
    pg.fill(255, this.alpha);
    pg.noStroke();
    pg.ellipse(this.x, this.y, this.r, this.r);
  }

  // 檢查泡泡是否已經完全移出圖層上方
  isOffscreen() {
    return this.y < -this.r;
  }
}