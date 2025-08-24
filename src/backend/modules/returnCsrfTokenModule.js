const returnCsrftoken = (csrfToken,res) => {
  try {
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: true,
      maxAge: 3600000,
      sameSite: "strict",
    });
  } catch (error) {
    console.log("Ошибка при загрузке csrfТокена на сайт", error);
  }
};
export default returnCsrftoken;
