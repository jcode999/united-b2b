import {
  
  Page,
  Badge,
  
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import {emailAlreadyUsed, phoneAlreadyUsed} from "../shopifyServices/cutomer"
import { authenticateErply } from "../erplyServices/erplyAuthenticate.sever"
import { getBusinessByName } from "../erplyServices/erplyCustomers.server"
// import {sendAccountInvite} from "../models/TobaccoForm.server";
import RegistrationForm from "~/components/RegistrationForm";
// import { useSubmit } from "@remix-run/react";

export async function loader({ request }:any){
  return null
}
export async function action({ request }:any){
  console.log("request to send invite received. sending invite.")
  const { admin } = await authenticate.admin(request);
  
  // sendAccountInvite("gid://shopify/Customer/7921928634618",admin.graphql)
  const customerByEmail = await emailAlreadyUsed("jimmeysherpa@yahoo.com",admin.graphql)
  const customerByPhone = await phoneAlreadyUsed("8173198184",admin.graphql)
  console.log("customer by email: ",customerByEmail)
  console.log("customer by phone: ",customerByPhone)
  const authResponse = await authenticateErply();
  const sessionKey = authResponse['records'][0]['sessionKey']
  getBusinessByName("Foo",sessionKey)


  // console.log("existing customer: ",responseBody.data.customerByIdentifier.id)
  return null
}

export default function AdditionalPage() {
  // const submit = useSubmit();
  // const handleSendInvite = () =>{
  //   console.log("send invite clicked, submitting...")
  //   submit({},{ method:'post' })
    
  // }
  
  // const handleTest = ()=>{
  //   console.log("hello there..")
  // }
  
  // const validateEmail = (email:String)=>{
  //   emailAlreadyUsed(email,)
  // }
  return (
    <Page
      backAction={{content: 'Products', url: '#'}}
      title="3/4 inch Leather pet collar"
      titleMetadata={<Badge tone="success">Paid</Badge>}
      subtitle="Perfect for any pet"
      compactTitle
      primaryAction={{content: 'Save', disabled: true}}
      secondaryActions={[
        {
          content: 'Duplicate',
          accessibilityLabel: 'Secondary action label',
          onAction: () => alert('Duplicate action'),
        },
        {
          content: 'View on your store',
          onAction: () => alert('View on your store action'),
        },
      ]}
      actionGroups={[
        {
          title: 'Promote',
          actions: [
            {
              content: 'Share on Facebook',
              accessibilityLabel: 'Individual action label',
              onAction: () => alert('Share on Facebook action'),
            },
          ],
        },
      ]}
      pagination={{
        hasPrevious: true,
        hasNext: true,
      }}
    >
      
    <RegistrationForm form={{}}/>
    </Page>
  );
}
