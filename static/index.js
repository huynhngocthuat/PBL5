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
  0: "battery",
  1: "biological",
  2: "cardboard",
  3: "clothes",
  4: "glass",
  5: "metal",
  6: "paper",
  7: "plastic",
  8: "trash",
};

const detect = () => {
  predict();
};

async function predict() {
  $("#result").hide();
  // 1. Chuyển ảnh về tensor
  let img = tf.browser.fromPixels(imgShow);
  let tensor = img
    .resizeNearestNeighbor([128, 128])
    .toFloat()
    .div(255)
    .expandDims();
  // 2. Predict
  let predictions = await model.predict(tensor);
  predictions = predictions.dataSync();
  console.log(predictions);

  // 3. Hien thi len man hinh
  let rs = Array.from(predictions)
    .map((p, i) => ({ probability: p, className: GARBAGE_CLASS[i] }))
    .sort((a, b) => b.probability - a.probability);

  $("#result table tbody").empty();
  $("#result table tbody").append(`
  <tr>
    <th>Loại</th>
    <th>Xác suất</th>
  </tr>
  `);

  rs.forEach(function (p) {
    $("#result table tbody").append(
      `
      <tr>
        <td>${p.className}</td>
        <td>${p.probability.toFixed(3)}</td>
      </tr>
    `
    );
  });
  $("#result").show();
}
