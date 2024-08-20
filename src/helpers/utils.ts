import bcrypt from 'bcrypt';
const saltRounds = 10;

export const HashPass = async (plainPassword: string) => {
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    console.log(error);
  }
}

export const ComparePass = async (plainPassword: string, hassPass: string) => {
  try {
    return await bcrypt.compare(plainPassword, hassPass);
  } catch (error) {
    console.log(error);
  }
}