let cam;

function setup() {
  // 產生一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像
  cam = createCapture(VIDEO);
  // 隱藏原始的 HTML 影片元素，確保影像只顯示在畫布中
  cam.hide();
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
  
  // 在畫布上繪製攝影機影像
  image(cam, x, y, imgWidth, imgHeight);
}

// 當視窗大小改變時，重新調整畫布尺寸以維持全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}