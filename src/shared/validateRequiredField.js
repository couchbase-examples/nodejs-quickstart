function validateRequiredFields(req, res, requiredFields) {
  const missingFields = []

  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field)
    }
  }

  if (missingFields.length > 0) {
    const errorMessage =
      missingFields.length === 1
        ? `${missingFields[0]} is required`
        : `The following fields are required: ${missingFields.join(', ')}`

    res.status(400).send({ message: errorMessage })
    return false
  }
  return true
}

module.exports = {
  validateRequiredFields,
}
