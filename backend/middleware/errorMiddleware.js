const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(error.errors)
        .map((item) => item.message)
        .join(", "),
    });
  }

  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
};

export default errorHandler;
