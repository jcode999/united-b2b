import db from "../db.server";

export async function getTobaccoForms() {
  const forms = await db.tobaccoForm.findMany();
  if(!forms){
    return null
  }
  return forms
  };

export async function getTobaccoForm(id){

  const form = await db.tobaccoForm.findFirst({where:{id}});
  
  if(!form){
    return null
  }

  return form


}

export async function updateTobaccoForm(id, data) {
  try {
    const updatedForm = await db.tobaccoForm.update({
      where: { id: id },
      data: data,
    });
    console.info("updated app customer successfully. ")
    return updatedForm;
  } catch (error) {
    console.error('Error updating tobacco form:', error);
    throw error;
  }
}
export async function updateIsTobaccoCustomerMetaField(customerId,value,graphql)
{
  try{
    const response = await graphql(
      `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            namespace
            value
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }`,
      {
        variables: {
          
            "metafields": [
              
              {
                "key": "isTobaccoCustomer",
                "namespace": "custom",
                "ownerId": customerId,
                "type": "boolean",
                "value": value,
              }
            ]
          }
          
        
      }
      )
      const jsonResponse = await response.json()
      return jsonResponse;
  }
  catch(error){
    console.error("error setting isTobaccoCustomer field.")
    return null
  }

}
export async function createCustomer(app_customer,graphql){
  console.log("going to create customer in db...",app_customer)
  console.log("app_customer: ",app_customer.firstName)
  try{
  const response = await graphql(
   ` mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        userErrors {
          field
          message
        }
        customer {
          id
          email
          phone
          taxExempt
          firstName
          lastName
          smsMarketingConsent {
            marketingState
            marketingOptInLevel
          }
          addresses {
            address1
            city
            country
            phone
            zip
          }
        }
      }
    }`,
    {
      variables: {
        input: {
          firstName:app_customer.firstName,
          lastName:app_customer.lastName,
          email:app_customer.email,
          phone:app_customer.phoneNumber,
          addresses: [
                {
                  "address1": app_customer.businessAdress1,
                  "city": app_customer.businessCity,
                  "phone": app_customer.phoneNumber,
                  "zip": app_customer.businessZip,
                  "lastName": app_customer.lastName,
                  "firstName": app_customer.firstName,
                }
    ]
        },
      },
    },
  )
  const responseBody = await response.json();
  if (responseBody.errors) {
    console.error("GraphQL errors:", responseBody.errors);
    return null;
  }
  const {
    data: {
      customerCreate: { customer, userErrors },
    },
  } = responseBody;
  if (userErrors.length > 0) {
    console.error("User errors:", userErrors);
    return null;
  }

  const new_app_customer = {
    approved:true,
    shopifyAccountId:customer.id
  }
  updateTobaccoForm(Number(app_customer.id),new_app_customer)
  if(app_customer.tobaccoPermitUrl)
  return customer;
}
catch(error){
console.log("error creating customer.",error)
}

  
}