import AdminJsFastify from "@adminjs/fastify"
import * as AdminJsMongoose from "@adminjs/mongoose"
import * as Models from "../models/index.js"
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js"
import { dark, light, noSidebar } from "@adminjs/themes"
import AdminJS from "adminjs"



AdminJS.registerAdapter(AdminJsMongoose)

export const admin = new AdminJS({
    resources: [
        {
            resource: Models.Customer,
            options: {
                listProperties: ["phone", "role", "isActivated"],
                filterProperties: ["phone", "role"],
                
            },
        },
        {
            resource: Models.DeliveryPartner,
            options: {
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
                
            },
        },
        {
            resource: Models.Admin,
            options: {
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"],
                
            },
        },
        {resource: Models.Branch},
        {resource: Models.Product},
        {resource: Models.Category},
        {resource: Models.Order},
        {resource: Models.Counter},
    ],

    branding: {
        companyName: "Nectar App",
        withMadeWithLove:false,
    },
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
    rootPath:"/admin"
})


export const buildAdminRouter = async (app) => {
    await AdminJsFastify.buildAuthenticatedRouter(
      admin,
      {
        authenticate,
        cookiePassword: COOKIE_PASSWORD,
        cookieName: "adminjs",
      },
      app,
      {
        store: sessionStore,
        saveUninitialized: true,
        secret: COOKIE_PASSWORD,
        cookie: {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
          
        },
      }
    );
}