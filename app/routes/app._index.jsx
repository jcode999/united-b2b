
import { json, } from "@remix-run/node";
import {

  useLoaderData, useNavigate

} from "@remix-run/react";

import {
  Card,
  ResourceList,
  Avatar,
  ResourceItem,
  Text,
  Badge,
  Page,
} from '@shopify/polaris';

import { authenticate } from "../shopify.server";

import { getTobaccoForms } from "../models/TobaccoForm.server";

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request);
  return json(await getTobaccoForms())
}

export default function TobaccoForms() {

  const forms = useLoaderData();
  
  const navigate = useNavigate();
  
  


  return (
    <Page title="Registration Requests"
      compactTitle>
      <Card>
        <ResourceList
          resourceName={{ singular: 'app-customer', plural: 'app-customers' }}
          items={forms}
          renderItem={(item) => {
            const { firstName, lastName, id, businessName, tobaccoPermitNumber,approved } = item;
            const fullName = `${firstName} ${lastName}`
            const media = <Avatar customer size="md" name={`${firstName} ${lastName}`} />;

            return (
              <ResourceItem
                id={id}
                url={"/app/tobaccoform/" + String(id)}
                media={media}
                accessibilityLabel={`View details for ${firstName}`}
              >
                <div style={{ 'display': 'flex', 'gap': '1em' }}>
                  <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {fullName}
                  </Text>
                  {tobaccoPermitNumber && <Badge tone="success">Tobacco Permit </Badge>}
                  {approved && <Badge tone="success">Approved</Badge>}

                </div>

                <div>{businessName}</div>
              </ResourceItem>
            );
          }}
        />
      </Card>
    </Page>

  )
}

