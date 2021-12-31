const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const handleError = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.log(error);
  res.status(statusCode);
  res.json({
    message: error.message,
  });
};

module.exports = { handleError, notFound };
