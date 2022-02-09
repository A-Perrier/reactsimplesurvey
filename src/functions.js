export function disableScroll() {
  document.body.style.overflow = 'hidden';
}

export function enableScroll() {
  document.body.style.overflow = ''
}

/**
 * Clones an array, edit the chosen element then returns the copy modified
 */
 export function editFromArray(array, itemUpdated, itemToUpdate) {
  const copy = array.slice()
  const index = copy.indexOf(itemToUpdate)
  index !== -1 && copy.splice(index, 1, itemUpdated)
  return copy
}

export function rand() {
  return Math.floor(Math.random() * 1000);
}