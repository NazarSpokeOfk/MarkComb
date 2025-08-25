const sendResponseModule = (res, data, error = null) => {
  res.json({
    success: !error,
    data: error ? null : data,
    error: error ? { message: error.message } : null,
  });
}
export default sendResponseModule;
