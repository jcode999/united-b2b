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

export const searchCustomerByName = async (customerName:String,graphql:any)=>{
    try{
        const response = await graphql(
            `query($query:String) {
                customers(first: 50, query: $query) {
                  edges {
                    node {
                      id
                      firstName
                      lastName
                      
                      addresses(first:5){
                        company
                        address1
                        address2
                        city
                        zip
                        province
                        country
                        
                      }
                    }
                  }
                }
              }`,{
                variables:{
                    "query":customerName
                }
              }
        )
        const responseBody = await response.json()
        const customers = responseBody.data['customers']['edges']
        const customResponse:any = []
        customers.forEach((edge:any) => {
            
            
            customResponse.push({
                'id':edge.node.id,
                'firstName':edge.node.firstName,
                'lastName':edge.node.lastName,
                'addresses':edge.node.addresses

            })
            
          });
        
          return customResponse

    }
    catch(error){
        console.log(error)
    }

}

export const updateMetaFields = async (graphql:any,customerId:string,value:string)=>{
    console.log("value: ",String(value))
    try{
        const response = await graphql(
            `mutation updateCustomerMetafields($input: CustomerInput!) {
                customerUpdate(input: $input) {
                  customer {
                    id
                    metafields(first: 3) {
                      edges {
                        node {
                          
                          namespace
                          key
                          
                          value
                        }
                      }
                    }
                  }
                  userErrors {
                    message
                    field
                  }
                }
              }`,{
                variables:{
                    "input":{
                        "id":customerId,
                        "metafields":[
                            {
                                "namespace":"custom",                             
                                "key": "recomended_prods",
                                "type": "single_line_text_field",
                                "value":value,
                            }
                        ]
                    }
                }
              }
        )
        const responseBody = await response.json()
        console.log("response[meta]", responseBody.data)
        console.log(responseBody.data.customerUpdate.userErrors)

    }
    catch(errors){
        console.log(errors)
    }

}

export const updateMetaFieldsList = async (graphql:any,customerId:string,value:string)=>{
    console.log("value: ",String(value))
    try{
        const response = await graphql(
            `mutation updateCustomerMetafields($input: CustomerInput!) {
                customerUpdate(input: $input) {
                  customer {
                    id
                    metafields(first: 3) {
                      edges {
                        node {
                          namespace
                          key
                          value
                        }
                      }
                    }
                  }
                  userErrors {
                    message
                    field
                  }
                }
              }`,{
                variables:{
                    "input":{
                        "id":customerId,
                        "metafields":[
                            {
                                "namespace":"custom",                             
                                "key": "recommended_products",
                                "type": "list.single_line_text_field",
                                "value":value,
                            }
                        ]
                    }
                }
              }
        )
        const responseBody = await response.json()
        return responseBody

    }
    catch(errors){
        console.log(errors)
        return null
    }

}