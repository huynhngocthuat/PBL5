let inputUploadImg, img, spanResult;

const uploadImage = () => {
  inputUploadImg = document.querySelector("#uploadImage");
  imgShow = document.querySelector("#img-show");
  spanResult = document.querySelector("#result span");
  inputUploadImg.click();
  inputUploadImg.onchange = (e) => {
    src = URL.createObjectURL(e.target.files[0]);
    imgShow.setAttribute("src", src);
  };
};

const GARBAGE_CLASS = {
  0: 'cardboard',
  1: 'glass',
  2: 'metal',
  3: 'paper',
  4: 'plastic',
  5: 'trash'
};

const detect = () => {
  predict();
};

async function predict(){
  // Chuyển ảnh về tensor
  // let imgShow = document.getElementById("imgShow");
  let img = tf.browser.fromPixels(imgShow);
  let normalizationOffset = tf.scalar(255/2); // 127.5
  let tensor = img
          .resizeNearestNeighbor([128, 128])
          .toFloat()
          .sub(normalizationOffset)
          .div(normalizationOffset)
          // .reverse(2)
          .expandDims();
  // 2. Predict
  let predictions = await model.predict(tensor);
  predictions = predictions.dataSync();
  console.log(predictions);

  // 3. Hien thi len man hinh
  let top5 = Array.from(predictions)
  .map(function (p, i) {
      return {
          probability: p,
          className: GARBAGE_CLASS[i]
      };
  }).sort(function (a, b) {
      return b.probability - a.probability;
  });
  $("#result").empty();
  top5.forEach(function (p) {
    $("#result").append(` ${p.className}: ${p.probability.toFixed(3)}  `);  
  });

};

// const showResult = (text) => {
//   spanResult.textContent = text;
// };