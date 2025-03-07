import type { ActionFunction } from "@remix-run/node";
import { emailAlreadyUsed,phoneAlreadyUsed } from "~/shopifyServices/cutomer";
// import { authenticateErply } from "../erplyServices/erplyAuthenticate.sever"
import { authenticate } from "../shopify.server";
export const action:ActionFunction = async ({ request }) =>{
    const form:any = request.formData()
    const { admin } = await authenticate.admin(request);
    const customerWithEmail = await emailAlreadyUsed(form['email'],admin.graphql)
    const customerWithPhone = await phoneAlreadyUsed(form['phone'],admin.graphql)
    const errors = []
    if(customerWithEmail)
        errors.push({'field':'email','error':'customer with such email already exists.'})
    if(customerWithPhone)
        errors.push({'field':'phone','error':'customer with such phone already exists.'})
    return errors
  
}