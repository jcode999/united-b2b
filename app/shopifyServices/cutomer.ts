export async function emailAlreadyUsed(emailAddr:String,graphql:any) {
    try{
    const response = await graphql(
        `
        query ($email: String!){
        customerByIdentifier(identifier: {emailAddress: $email}) {
            id
            firstName
            lastName
            email
        }
        }`,{
            variables:{
                "email":emailAddr,
                
                
            }
        }
    )
    const responseBody = await response.json()
    if(responseBody.data.customerByIdentifier?.id){
        return responseBody.data.customerByIdentifier.id
    }
    return null
}
catch(error){
    console.log(error)
    return null
}   
}
export async function phoneAlreadyUsed(phone:String,graphql:any){
    try{
        const response = await graphql(
            `
            query ($phone: String!){
            customerByIdentifier(identifier: {phoneNumber: $phone}) {
                id
                firstName
                lastName
                email
            }
            }`,{
                variables:{
                    "phone":phone, 
                }
            }
        )
        const responseBody = await response.json()
        if(responseBody.data.customerByIdentifier?.id){
            return responseBody.data.customerByIdentifier.id
        }
        return null
    }
    catch(error){
        console.log(error)
    }

}
export const buildShopifyCustomerUrl = (shopifyCustomerId:String)=>{
   const storeName = process.env.STORE_NAME
   return `https://admin.shopify.com/store/${storeName}/customers/${shopifyCustomerId}`
}
