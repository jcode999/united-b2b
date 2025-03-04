import {
  Card,
  Page,
  Badge,
  Button,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import {sendAccountInvite} from "../models/TobaccoForm.server";
import { useSubmit } from "@remix-run/react";
export async function action({ request }:any){
  console.log("request to send invite received. sending invite.")
  const { admin } = await authenticate.admin(request);
  sendAccountInvite("gid://shopify/Customer/7921928634618",admin.graphql)
  return null
}

export default function AdditionalPage() {
  const submit = useSubmit();
  const handleSendInvite = () =>{
    console.log("send invite clicked, submitting...")
    submit({},{ method:'post' })
    
  }
  
  const handleTest = ()=>{
    console.log("hello there..")
  }
 
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
      <Card>
        <Button onClick={handleSendInvite}>Send Activation Email</Button>
        <Button onClick={handleTest}>Hello world</Button>
      </Card>

    </Page>
  );
}
