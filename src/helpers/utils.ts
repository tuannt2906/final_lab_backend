import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export const HashPass = async (plainPassword: string) => {
  return await bcrypt.hash(plainPassword, saltRounds);
};

export const ComparePass = async (plainPassword: string, hassPass: string) => {
  return await bcrypt.compare(plainPassword, hassPass);
};
