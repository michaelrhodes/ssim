module.exports = ssim

function ssim (img1, img2) {
  var c1 = Math.pow((0.01 * 255), 2)
  var c2 = Math.pow((0.03 * 255), 2)
  var imgW = img1.width, imgH = img1.height
  var winS = 8, ms = 0, windows = 0
  var winW, winH, lum1, lum2, avg1, avg2
  var num, den, sigxy, sigsqx, sigsqy
  var y, x, i, li

  for (y = 0; y < imgH; y += winS) {
    for (x = 0; x < imgW; x += winS) {
      winW = Math.min(winS, imgW - x)
      winH = Math.min(winS, imgH - y)
      lum1 = lum(winW, winH, x, y, img1.data, imgW)
      lum2 = lum(winW, winH, x, y, img2.data, imgW)
      avg1 = avg(lum1), avg2 = avg(lum2)
      sigxy = sigsqx = sigsqy = 0
      i = 0, li = lum1.length - 1
      for (; i <= li; i++) {
        sigsqx += Math.pow((lum1[i] - avg1), 2)
        sigsqy += Math.pow((lum2[i] - avg2), 2)
        sigxy += (lum1[i] - avg1) * (lum2[i] - avg2)
      }

      sigsqx /= li
      sigsqy /= li
      sigxy /= li

      num = (2 * avg1 * avg2 + c1) * (2 * sigxy + c2)
      den = (Math.pow(avg1, 2) + Math.pow(avg2, 2) + c1) * (sigsqx + sigsqy + c2)
      ms += num / den
      windows++
    }
  }

  return ms / windows
}

function avg (lum) {
  var i = 0, l = lum.length, sum = 0
  for (; i < l; i++) sum += lum[i]
  return sum / l
}

function lum (winW, winH, x, y, imgD, imgW) {
  var lum = new Float32Array(winW * winH * 4)
  var j = y, mj = y + winH, v = 0, o, i, mi

  for (; j < mj; j++) {
    o = j * imgW
    i = (o + x) * 4
    mi = (o + x + winW) * 4
    while (i < mi) lum[v++] = (
      (imgD[i++] * 0.212655 + imgD[i++] * 0.715158 + imgD[i++] * 0.072187) *
      (imgD[i++] / 255)
    )
  }

  return lum
}
