const sendResponseModule = (res, data, error = null , statusCode = 200) => {
  if(error){
    return res.status(statusCode).json({
      success : false,
      data : null,
      error : {message : error.message}
    })
  }

  return res.status(statusCode).json({
    success : true,
    data,
    error : null
  })
}
export default sendResponseModule;
