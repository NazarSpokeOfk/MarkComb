const verifyCaptcha = async (recaptchaValue) => {
    const _secretKey = "6LcxnbQqAAAAAB55Psrs2jKIilT-5sIJ3VVVtqdr",
          _verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${_secretKey}&response=${recaptchaValue}`;

    try{
        const response = await fetch(_verificationUrl, {method : "POST"});
        const data = await response.json()

        if(data.success){
            console.log(data.success)
            return true
        } else {
            return false
        }
        
    } catch (error) {
        console.log("Возникла ошибка при проверке RECAPTCHA:",error)
    }
}
export default verifyCaptcha