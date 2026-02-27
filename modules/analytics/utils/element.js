export function getElementInfo(element) {
  if (!element) {
    return { type: 'unknown', text: '' }
  }

  const tagName = element.tagName ? element.tagName.toLowerCase() : 'unknown'
  const type = element.type || ''

  let elementType = tagName
  if (tagName === 'input') {
    if (type === 'checkbox') elementType = 'checkbox'
    else if (type === 'radio') elementType = 'radio'
    else if (type === 'text' || type === 'email' || type === 'password') elementType = 'input'
    else if (type === 'submit' || type === 'button') elementType = 'button'
    else elementType = type || 'input'
  } else if (tagName === 'select') {
    elementType = 'selectbox'
  } else if (tagName === 'textarea') {
    elementType = 'textarea'
  }

  let text = ''
  if (element.textContent) {
    text = element.textContent.trim().slice(0, 50)
  } else if (element.value) {
    text = element.value.toString().slice(0, 50)
  } else if (element.placeholder) {
    text = element.placeholder
  } else if (element.title) {
    text = element.title
  } else if (element.alt) {
    text = element.alt
  }

  if ((type === 'checkbox' || element.classList?.contains('switch')) && !text) {
    text = element.checked ? 'Checked' : 'Unchecked'
  }

  return {
    type: elementType,
    text: text || '',
  }
}

export function getElementContainer(element) {
  if (!element?.closest) return 'unknown'

  const container = element.closest(
    '[data-track-container], .form-group, .field, .input-group, .card, .modal, .section'
  )

  if (container) {
    return container.id || container.className?.split(' ')[0] || 'container'
  }

  return element.parentElement?.tagName?.toLowerCase() || 'unknown'
}

export function getElementSpecificProps(element) {
  if (!element) return {}

  const props = {}
  const tagName = element.tagName ? element.tagName.toLowerCase() : ''
  const type = element.type || ''

  if (tagName === 'a') {
    props.href = element.href
  }

  if (element.id) {
    props.id = element.id
  }

  if (tagName === 'input' && type === 'checkbox') {
    props.checked = element.checked
  }

  if (tagName === 'input' && type === 'radio') {
    props.checked = element.checked
    props.name = element.name
  }

  if (tagName === 'select') {
    props.multiple = element.multiple
  }

  if (element.dataset) {
    Object.keys(element.dataset).forEach((key) => {
      if (key.startsWith('track')) {
        props[key] = element.dataset[key]
      }
    })
  }

  return props
}
