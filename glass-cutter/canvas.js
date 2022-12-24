class Canvas {
  constructor(el) {
    this.el = el
    this.invalidEl = document.getElementById('invalid_result')
    this.fromText = document.getElementById('from_dimension')
    this.toText = document.getElementById('to_dimension')
  }

  randomColor() {
    const hue = Math.random()
    const goldenRatioConjugate = 0.618033988749895
    const resultHue = (hue + goldenRatioConjugate) % 1
    const saturation = (~~(Math.random() * 100) % 80) + 10
    const lightness = (~~(Math.random() * 100) % 40) + 30
    return 'hsla(' + (resultHue * 360) + ', ' + saturation + '%, ' + lightness + '%, 1)';
  }

  drawContainer(rectangle) {
    if(!rectangle.isValid()) {
      this.reset
      return
    }
    this.rectangle = rectangle
    this.rectangle.multiplier = (rectangle.dimension[0] < 10) ? 200 : (rectangle.dimension[0] < 100 ? 20 : 2)
    this.el.classList.remove('d-none')
    this.el.classList.add('position-relative')
    this.el.style.width = (rectangle.dimension[0] * rectangle.multiplier) + 'px'
    this.el.style.height = (rectangle.dimension[1] * rectangle.multiplier) + 'px'
    this.fromText.innerText = rectangle.toString()
  }

  drawRectangles(rectangles) {
    let validRectangles = []
    rectangles.forEach((rectangle) => {
      if(rectangle.isValid()) {
        validRectangles.push(rectangle)
      }
    })

    const rectangleEls = []
    const invalidRectangleEls = []
    validRectangles.forEach((rectangle) => {
      this.rectangle.fillRectangle(rectangle)
      const rectangleEl = document.createElement('div')
      rectangleEl.classList.add('border', 'border-secondary')
      const color = this.randomColor()
      rectangleEl.style.backgroundColor = color
      rectangleEl.style.width = (rectangle.width * this.rectangle.multiplier) + 'px'
      rectangleEl.style.height = (rectangle.height * this.rectangle.multiplier) + 'px'
      new bootstrap.Tooltip(rectangleEl, { title: rectangle.toString() })
      if(rectangle.filledPos) {
        rectangleEl.classList.add('position-absolute')
        rectangleEl.style.top = (rectangle.filledPos[1] * this.rectangle.multiplier) + 'px'
        rectangleEl.style.left = (rectangle.filledPos[0] * this.rectangle.multiplier) + 'px'
        if(rectangle.filledPos[2]) {
          const temp = rectangleEl.style.width
          rectangleEl.style.width = rectangleEl.style.height
          rectangleEl.style.height = temp
        }
        rectangleEls.push(rectangleEl)
      } else {
        invalidRectangleEls.push(rectangleEl)
      }
    })
    this.el.replaceChildren.apply(this.el, rectangleEls)
    this.invalidEl.replaceChildren.apply(this.invalidEl, invalidRectangleEls)
    this.invalidEl.classList.remove('d-none')
    const collapseEl = (invalidRectangleEls.length) ? this.invalidEl.closest('.collapse:not(.show)') : this.invalidEl.closest('.collapse.show')
    if(collapseEl) {
      collapseEl.querySelector('a').click()
    }

    this.toText.innerText =
      validRectangles.map((rectangle) => {
        return rectangle.toString()
      }).join(', ')
  }

  reset() {
    this.el.classList.add('d-none')
    this.invalidEl.classList.add('d-none')
    this.fromText.innerText = ''
    this.toText.innerText = ''
  }
}

