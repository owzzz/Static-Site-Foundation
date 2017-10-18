
module.exports = (() => {

  errorHandler(err, msg, errCode) {
    return {
      statusCode: errCode,
        body: {
          message: msg,
          error: err
        }
      }
    }
  }

  return {
    errorHandler
  }
})();
