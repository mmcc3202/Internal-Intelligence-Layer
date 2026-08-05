export function downloadSvgAsPng(svgEl, fileName = 'value-chain.png', scale = 2) {
  const { width, height } = svgEl.viewBox.baseVal.width ? { width: svgEl.viewBox.baseVal.width, height: svgEl.viewBox.baseVal.height } : svgEl.getBoundingClientRect()
  const serializer = new XMLSerializer()
  const clone = svgEl.cloneNode(true)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const svgString = serializer.serializeToString(clone)
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = height * scale
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    URL.revokeObjectURL(url)
    canvas.toBlob(blob => {
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      link.click()
      URL.revokeObjectURL(link.href)
    }, 'image/png')
  }
  img.src = url
}
