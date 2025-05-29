const clearCookie = (req,res) => {
  res.clearCookie("sessionToken", {
    path: "/",
    sameSite: "lax",
    secure: false,
    httpOnly: false, 
  });

  res.clearCookie("csrfToken", {
    path: "/",
    sameSite: "lax",
    secure: false,
    httpOnly: false, 
  });

  res.clearCookie("connect.sid", {
    path: "/",
    secure: false,
    httpOnly: false, 
  });

  res.status(200).send({message : "Выход выполнен"})

  console.log("Отправлен заголовок очистки куки:");
  console.log(res.getHeaders()["set-cookie"]);
};

export default clearCookie