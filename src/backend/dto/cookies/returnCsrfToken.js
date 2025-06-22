const returnCsrftoken = (csrfToken,res) => {
  try {
    res.cookie("csrfToken", csrfToken, {
      httpOnly: false,
      secure: false,
      maxAge: 3600000,
      sameSite: "lax",
    });
  } catch (error) {
    console.log("Ошибка при загрузке csrfТокена на сайт", error);
  }
};
export default returnCsrftoken;
