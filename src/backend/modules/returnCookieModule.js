const returnCookie = (token,res) => {
  try {
    res.cookie("sessionToken", token, {
      httpOnly: false,
      secure: true,
      maxAge: 3600000,
      sameSite: "strict",
      path : "/"
    });
  } catch (error) {
    console.log("Ошибка при отправке куки.", error);
  }
};
export default returnCookie;
