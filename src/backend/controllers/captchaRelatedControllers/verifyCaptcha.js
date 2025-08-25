import logger from "../../winston/winston.js";
import "../../loadEnv.js"

const verifyCaptcha = async (recaptchaValue) => {
  const _secretKey = process.env.CAPTCHA_SECRET_KEY;
  const _verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${_secretKey}&response=${recaptchaValue}`;

  try {
    // Отправка запроса на проверку CAPTCHA
    const response = await fetch(_verificationUrl, { method: "POST" });

    // Проверка на успешный ответ от сервера
    if (!response.ok) {
      console.error("Ошибка при запросе к reCAPTCHA API:", response.status);
      return false; // В случае неудачного запроса возвращаем false
    }

    const data = await response.json();

    // Если проверка успешна
    if (data.success) {
      return true;
    } else {
      return false; // Если ошибка, то возвращаем false
    }
  } catch (error) {
    logger.error(
      " (verifyCaptcha) Возникла ошибка при проверке reCAPTCHA:",
      error
    );
    return false; // Если ошибка в процессе запроса, возвращаем false
  }
};

export default verifyCaptcha;
