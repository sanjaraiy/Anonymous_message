import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req: Request){
//----------- use this in older version of nextjs----------------
//   //TODO: use this in all other routes
//    if(req.method !== 'GET'){
//      return Response.json({
//         success: false,
//         message: 'Method not allowed',
//      },{status: 405})
//    }



    await dbConnect()

    try {
        const {searchParams} = new URL(req.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validate with zod
      const result = UsernameQuerySchema.safeParse(queryParam)
       //   console.log(result);
    if(!result.success){
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json({
            success: false,
            message: usernameErrors?.length>0 ? usernameErrors.join(', ') : 'Invalid query parameters',
        },{
            status: 400
        })
    }
      
    const {username} = result.data;

    const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
    
    if(existingVerifiedUser){
        return Response.json({
            success: false,
            message: 'Usename is already taken',
        },{
            status: 400
        })

    }

    return Response.json({
        success: true,
        message: 'Usename is unique',
    },{
        status: 200
    })

    } catch (error) {
        console.log("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        },{
            status: 500
        })
    }
}