class Rectangle {
  constructor(width, height) {
    if(typeof width === 'object' && width.classList.contains('rectangle-data')) {
      const widthEl = width.querySelector('.input-width')
      const heightEl = width.querySelector('.input-height')
      this.width = Number(widthEl.value)
      this.height = Number(heightEl.value)
    } else {
      this.width = Number(width)
      this.height = Number(height)
    }
    if(isNaN(this.width)) {
      this.width = 0
    }
    if(isNaN(this.height)) {
      this.height = 0
    }
    this.fillable = null
    this.options = {
      minimumGap: 0
    }
    if(this.width >= this.height) {
      this.dimension = [this.width, this.height]
      this.greaterWidth = true
    } else {
      this.dimension = [this.height, this.width]
      this.greaterWidth = false
    }
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

  isValid() {
    return this.height > 0 && this.width > 0
  }

  toString() {
    let temp = this.width + ' x ' + this.height
    if(this.filledPos) {
      temp += ' (' + this.filledPos[0] + ', ' + this.filledPos[1] + ')'
    }
    return temp
  }

  sortValue() {
    return this.dimension[0]
  }

  isEmptyCell(x, y) {
    return this.fillable[y][x] === 0
  }

  isRectangleFit(x, y, rectangle) {
    let isEmpty = true
    for(let rowNum = y; rowNum < (y + rectangle.dimension[1]); rowNum++) {
      for(let colNum = x; colNum < (x + rectangle.dimension[0]); colNum++) {
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
    this.fillable[y][x]++
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
        const endWidth = colNum + rectangle.dimension[0]
        const widthValid = endWidth === this.dimension[0] || (endWidth < this.dimension[0] && this.dimension[0] - endWidth >= this.options.minimumGap)
        if(!widthValid) {
          break
        }
        if(this.isRectangleFit(colNum, rowNum, rectangle)) {
          found = [colNum, rowNum]
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
      for(let rowNum = found[1]; rowNum < rectangle.dimension[1] + found[1]; rowNum++) {
        for(let colNum = found[0]; colNum < rectangle.dimension[0] + found[0]; colNum++) {
          this.fillCell(colNum, rowNum)
        }
      }
    }
    return found
  }
}
