
import { json, } from "@remix-run/node";
import {

  useLoaderData,

} from "@remix-run/react";

import {
  Card,
  ResourceList,
  Avatar,
  ResourceItem,
  Text,
  Badge,
  Page,
  Tabs,
} from '@shopify/polaris';


import { useState, useCallback } from 'react';
import { getTobaccoForms } from "../models/TobaccoForm.server";

export async function loader({ request, params }) {

  return json(await getTobaccoForms())
}

export default function TobaccoForms() {

  const forms = useLoaderData();
  const [selected, setSelected] = useState(0)
  const [displayedData,setDisplayedData] = useState(forms)
  const handleTabChange = useCallback(
    (selectedTabIndex) => {
      setSelected(selectedTabIndex)
      if(selectedTabIndex==0){
        setDisplayedData(forms)
        return
      }
      if(selectedTabIndex==1){
        const approved = forms.filter((form)=>form.approved===true)
        setDisplayedData(approved)
        return
      }
      const pending = forms.filter((form)=>form.approved===false)
      setDisplayedData(pending)

    },
    [],
  );
  

  const tabs = [
    {
      id: 'all-requests-1',
      content: 'All',
      accessibilityLabel: 'All Requests',
      panelID: 'all-requests-content-1',
    },
    {
      id: 'approved',
      content: 'Approved',
      panelID: 'approved-content-1',
    },
    {
      id: 'approval-pending',
      content: 'Pending Approvals',
      panelID: 'pedning-requests-content-1',
    },

  ];

  return (
    <Page title="Registration Requests"
      compactTitle>
      
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      </Tabs>
      <Card>
        <ResourceList
          resourceName={{ singular: 'app-customer', plural: 'app-customers' }}
          items={displayedData}
          renderItem={(item) => {
            const { firstName, lastName, id, businessName, tobaccoPermitNumber } = item;
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

