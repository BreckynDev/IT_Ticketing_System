import dotenv from "dotenv"
import bcrypt from "bcrypt";
dotenv.config()

const password = process.env.PASSWORD;
const saltRounds = Number(process.env.SALT_ROUNDS);

const passwordHash = await bcrypt.hash(password, saltRounds);
console.log(passwordHash);