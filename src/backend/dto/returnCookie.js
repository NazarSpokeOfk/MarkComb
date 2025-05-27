const returnCookie = (token,res) => {
  try {
    res.cookie("sessionToken", token, {
      httpOnly: false,
      secure: false,
      maxAge: 3600000,
      sameSite: "lax",
      path : "/"
    });
  } catch (error) {
    console.log("Ошибка при отправке куки.", error);
  }
};
export default returnCookie;
