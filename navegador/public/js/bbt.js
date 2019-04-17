//aqui los nombres de las carpetas y el alias de cada imagen
//los idx son los identificadores numerados que se asocia al nombre
const classes = ['amy', 'bernadette', 'howard', 'leonard', 'penny', 'raj', 'sheldon', 'stuart']

function getFaceImageUri(className, idx) {
  return `${className}/${className}${idx}.png`
}

function renderFaceImageSelectList(selectListId, onChange, initialValue) {
  const indices = [1, 2, 3, 4, 5]
  function renderChildren(select) {
    classes.forEach(className => {
      const optgroup = document.createElement('optgroup')
      optgroup.label = className
      select.appendChild(optgroup)
      indices.forEach(imageIdx =>
        renderOption(
          optgroup,
          `${className} ${imageIdx}`,
          getFaceImageUri(className, imageIdx)
        )
      )
    })
  }

  renderSelectList(
    selectListId,
    onChange,
    getFaceImageUri(initialValue.className, initialValue.imageIdx),
    renderChildren
  )
}
//hay un numero maximo de imagenes para el entrenamiento que esta definido que son 5 por clase
//el cual puede variar asi como el numero de imagenes que acarreay para el entrenamiento
// fetch first image of each class and compute their descriptors
async function createBbtFaceMatcher(numImagesForTraining = 1) {
  const maxAvailableImagesPerClass = 5
  numImagesForTraining = Math.min(numImagesForTraining, maxAvailableImagesPerClass)

  const labeledFaceDescriptors = await Promise.all(classes.map(
    async className => {
      const descriptors = []
      for (let i = 1; i < (numImagesForTraining + 1); i++) {
        const img = await faceapi.fetchImage(getFaceImageUri(className, i))
        descriptors.push(await faceapi.computeFaceDescriptor(img))
      }

      return new faceapi.LabeledFaceDescriptors(
        className,
        descriptors
      )
    }
  ))

  return new faceapi.FaceMatcher(labeledFaceDescriptors)
}