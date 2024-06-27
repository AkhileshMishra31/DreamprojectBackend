// src/services/userService.ts


import prisma from "../util/db";
import { AppError } from "../util/AppError";


const { user: User } = prisma



export const findUser = async (email: string): Promise<any> => {
    // Your logic to fetch a single user
    const user = await User.findFirst({
        where: {
            email: email
        }
    })

    return user
};




export const user_service = {
    findUser
};


