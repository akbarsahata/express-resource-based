module.exports = function errorMessageCompilers (errors) {
  let errorMessages = {}
  for (let error in errors) {
    errorMessages[error] = errors[error].message
  }

  return errorMessages
}