import fastifySession from "@fastify/session"
import ConnectMongoDBSession from "connect-mongodb-session"
import { Admin } from "../models/index.js";

export const PORT = process.env.PORT || 3000;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;

const MongoDBStore = ConnectMongoDBSession(fastifySession)

export const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_DB,
    collection:"sessions"
});

sessionStore.on("error", error => {
    console.log("Session store error ",error)
})

export const authenticate = async (email, password) => {
  // if (email === "shbz@gmail.com" && password === "12345678") {
  //   return Promise.resolve({ email: email, password: password });
  // } else {
  //   return null;
  // }

  if (email && password) {
      const user = await Admin.findOne({ email })
      if (!user) {
          return null
      }
   const verifyPassword = user.isPasswordCorrect(password)
      if (verifyPassword ) {
          return Promise.resolve({email: email, password:password})
      } else {
          return null
      }
  }
}