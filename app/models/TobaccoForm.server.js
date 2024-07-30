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

// export async function createCustomer(app_customer,graphql){
//   const response = await graphql(
//    ` mutation customerCreate($input: CustomerInput!) {
//       customerCreate(input: $input) {
//         userErrors {
//           field
//           message
//         }
//         customer {
//           id
//           email
//           phone
//           taxExempt
//           acceptsMarketing
//           firstName
//           lastName
//           ordersCount
//           totalSpent
//           smsMarketingConsent {
//             marketingState
//             marketingOptInLevel
//           }
//           addresses {
//             address1
//             city
//             country
//             phone
//             zip
//           }
//         }
//       }
//     }`
//   )
// }