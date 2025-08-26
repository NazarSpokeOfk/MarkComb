import bcrypt from "bcrypt"
const hashPasswordModule = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};
export default hashPasswordModule