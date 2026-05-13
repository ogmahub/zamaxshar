export const notFound = (req, res, next) => {
  res.status(404).json({ error: `Topilmadi - ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: err.message || "Server xatosi",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
};
