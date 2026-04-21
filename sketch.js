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
  
  // 將視訊畫面以 20x20 為單位分隔，製作馬賽克與聲波特效
  let step = 20;
  if (cam.width > 0 && cam.height > 0) {
    cam.loadPixels();
    if (cam.pixels.length > 0) {
      // 算出攝影機原始影像與畫布顯示影像的比例
      let wRatio = cam.width / imgWidth;
      let hRatio = cam.height / imgHeight;

      noStroke();
      for (let j = 0; j < imgHeight; j += step) {
        for (let i = 0; i < imgWidth; i += step) {
          // 取得該單位中心的像素座標，並做水平翻轉以修正左右顛倒
          let camX = floor((imgWidth - (i + step / 2)) * wRatio);
          let camY = floor((j + step / 2) * hRatio);
          camX = constrain(camX, 0, cam.width - 1);
          camY = constrain(camY, 0, cam.height - 1);

          // 計算像素在 cam.pixels 陣列中的索引值
          let index = (camY * cam.width + camX) * 4;
          let r = cam.pixels[index];
          let g = cam.pixels[index + 1];
          let b = cam.pixels[index + 2];

          // 取得 (R+G+B)/3 灰階值
          let gray = (r + g + b) / 3;

          // 以該灰階值作為顏色顯示
          fill(gray);

          // 類似聲波的特效：根據灰階數值改變矩形的高度
          let waveH = map(gray, 0, 255, 0, step);
          
          // 繪製置中的矩形，讓每個單位看起來像是聲波柱
          // 寬度稍微縮小(step * 0.8)產生間隔，並將 X 與 Y 置中
          rect(x + i + step * 0.1, y + j + (step - waveH) / 2, step * 0.8, waveH);
        }
      }
    }
  }

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