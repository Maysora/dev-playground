addEventListener('DOMContentLoaded', function(){
  const canvas = new Canvas(document.getElementById('result'))
  window.canvas = canvas
  const form = document.getElementById('form_calculate')
  form.addEventListener('submit', function(event) {
    event.preventDefault()
    event.stopPropagation()
    form.checkValidity()
    form.classList.add('was-validated')
    const fromContainer = form.querySelector('.from-container')
    const rectangle = new Rectangle(fromContainer)
    canvas.drawContainer(rectangle)

    const toContainers = form.querySelectorAll('.to-container')
    let toRectangles = []
    toContainers.forEach(function(toContainer) {
      const rectangle = new Rectangle(toContainer)
      toRectangles.push(rectangle)
    })
    toRectangles.sort(function(a, b){
      return b.sortValue() - a.sortValue();
    })
    canvas.drawRectangles(toRectangles)
  })

  const toContainer = document.querySelector('.to-container')
  const toContainerParent = toContainer.parentElement
  const toContainerTemplate = toContainer.cloneNode(true)
  toContainerTemplate.querySelectorAll('input').forEach(function(input){
    input.value = input.defaultValue
  })
  const addBtn = document.querySelector('.button-add')
  addBtn.addEventListener('click', function(event) {
    event.preventDefault()
    const newContainer = (toContainerParent.lastElementChild || toContainerTemplate).cloneNode(true)
    newContainer.style.width = 0
    newContainer.classList.add('transition')
    toContainerParent.appendChild(newContainer)
    setTimeout(function(){
      newContainer.style.width = null
    }, 10)
  })
  toContainerParent.addEventListener('click', function(event){
    event.preventDefault()
    if(!event.bubbles) {
      return
    }
    let button = null
    try {
      button = event.originalTarget.closest('.button-remove')
    } catch(e) {}
    if(!button) {
      return
    }
    const parent = event.originalTarget.closest('.to-container')
    if(parent) {
      parent.classList.add('transition')
      parent.ontransitionend = parent.remove
      parent.style.width = 0
    }
  })
})
