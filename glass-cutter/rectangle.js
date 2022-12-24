class Rectangle {
  constructor(dataEl, options) {
    const widthEl = dataEl.querySelector('.input-width')
    const heightEl = dataEl.querySelector('.input-height')
    this.width = Number(widthEl.value)
    this.height = Number(heightEl.value)
    if(isNaN(this.width)) {
      this.width = 0
    }
    if(isNaN(this.height)) {
      this.height = 0
    }
    if(this.width >= this.height) {
      this.dimension = [this.width, this.height]
      this.greaterWidth = true
    } else {
      this.dimension = [this.height, this.width]
      this.greaterWidth = false
    }
    this.options = Object.assign({
      minimumGap: 0
    }, options)
    if(isNaN(this.options.minimumGap)) {
      this.options.minimumGap = 0
    }
    this.fillable = null
    this.initFillable()
  }

  initFillable() {
    this.fillable = []
    for(let rowNum = 0; rowNum < this.dimension[1]; rowNum++) {
      this.fillable[rowNum] = []
      for(let colNum = 0; colNum < this.dimension[0]; colNum++) {
        this.fillable[rowNum][colNum] = 0
      }
    }
  }

  getFillable() {
    if(!this.fillable) {
      this.initFillable()
    }
    return this.fillable
  }

  isValid() {
    return this.height > 0 && this.width > 0
  }

  toString() {
    let temp = ''
    let orientation = 0
    if(this.filledPos) {
      temp += ' (' + this.filledPos[0] + ', ' + this.filledPos[1] + ')'
      orientation = this.filledPos[2]
    }
    temp = (this.dimension[(0 + orientation) % 2] + ' x ' + this.dimension[(1 + orientation) % 2]) + temp
    return temp
  }

  sortValue() {
    return this.dimension[0]
  }

  isEmptyCell(x, y) {
    return this.getFillable()[y] && this.getFillable()[y][x] === 0
  }

  isRectangleFit(x, y, width, height) {
    let isEmpty = true
    for(let rowNum = y; rowNum < (y + height); rowNum++) {
      for(let colNum = x; colNum < (x + width); colNum++) {
        if(!this.isEmptyCell(colNum, rowNum)) {
          isEmpty = false
          break
        }
      }
      if(!isEmpty) break
    }
    return isEmpty
  }

  fillCell(x, y) {
    this.getFillable()[y][x]++
  }

  findRectangleFit(rectangle) {
    let found = null
    for(let rowNum = 0; rowNum < this.dimension[1]; rowNum++) {
      const endHeight = rowNum + rectangle.dimension[1]
      const heightValid = endHeight === this.dimension[1] || (endHeight < this.dimension[1] && this.dimension[1] - endHeight >= this.options.minimumGap)
      if(!heightValid) {
        break
      }
      for(let colNum = 0; colNum < this.dimension[0]; colNum++) {
        const endWidth = colNum + rectangle.dimension[1]
        const widthValid = endWidth === this.dimension[0] || (endWidth < this.dimension[0] && this.dimension[0] - endWidth >= this.options.minimumGap)
        if(!widthValid) {
          break
        }
        if(this.isRectangleFit(colNum, rowNum, rectangle.width, rectangle.height)) {
          found = [colNum, rowNum, 0]
          break
        }
        if(this.isRectangleFit(colNum, rowNum, rectangle.height, rectangle.width)) {
          found = [colNum, rowNum, 1]
          break
        }
      }
      if(found) break
    }
    return found
  }

  fillRectangle(rectangle) {
    const found = this.findRectangleFit(rectangle)
    if(found) {
      rectangle.filledPos = found
      const orientation = found[2]
      for(let rowNum = found[1]; rowNum < rectangle.dimension[(1 + orientation) % 2] + found[1]; rowNum++) {
        for(let colNum = found[0]; colNum < rectangle.dimension[(0 + orientation) % 2] + found[0]; colNum++) {
          this.fillCell(colNum, rowNum)
        }
      }
    }
    return found
  }
}
