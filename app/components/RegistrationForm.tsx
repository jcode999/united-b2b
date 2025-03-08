import {
  
  Layout,
  Card,
  ResourceList,
  Thumbnail,
  Text,
  TextField,
 

} from '@shopify/polaris';


interface FormProps {
  form: any;
}




const RegistrationForm = ({ form }: FormProps) => {
  return (
    // <Page fullWidth>
    <div style={{margin:'1em 0'}}>
      <Layout>
        <Layout.Section variant="oneThird">
          <Card>
            <div style={{ "margin": '1em 0' }}>
              <h4 style={{ 'fontWeight': 'bold' }}>Contact Details</h4>
            </div>

            <Card>
              <TextField
                label="First Name"
                value={form['firstName']}
                onChange={() => { }}
                autoComplete="off" />

              <TextField
                label="Last Name"
                value={form['lastName']}
                onChange={() => { }}
                autoComplete="off" />

              <TextField
                label="Email"
                value={form['email']}
                onChange={() => { }}
                autoComplete="off" />

              <TextField
                label="Phone Number"
                value={form['phoneNumber']}
                onChange={() => { }}
                autoComplete="off" />
            </Card>
          </Card>

        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <div style={{ "margin": '1em 0' }}>
              <h4 style={{ 'fontWeight': 'bold' }}>Business Details</h4>
            </div>
            <Card>
              <TextField
                label="Business Name"
                value={form['businessName']}
                onChange={() => { }}
                autoComplete="off" />

              {/* <div style={{}}>
                <Icon
                  source={LocationFilledIcon}
                  tone="base"
                />
                <span>Address</span>

              </div> */}
              <TextField
                label="Address"
                value={`${form['businessAddress1']}\n${form['businessAddress2']}\n${form['businessCity']}, ${form['businessState']}, ${form['businessZip']}`}
                onChange={() => { }}
                multiline={4}
                autoComplete="off" />



            </Card>
          </Card>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <div style={{ "margin": '1em 0' }}>
              <h4 style={{ 'fontWeight': 'bold' }}>Supporting Documents</h4>
            </div>
            <Card>
              <ResourceList
                resourceName={{ singular: 'product', plural: 'products' }}
                items={[
                  {
                    id: '345',
                    url: '#',
                    name: 'EIN',
                    value: form['ein'],
                    media: (
                      <Thumbnail
                        source={form['einFileUrl']}
                        alt="EIN File"
                      />
                    ),
                  },
                  {
                    id: '260',
                    url: '#',
                    name: 'Sales and Use Tax ID',
                    value: form['salesAndUseTaxPermitNumber'],
                    
                    media:(
                      <Thumbnail
                        source={form['salesAndUseTaxPermitNumber']!=='' ? form['salesAndUseTaxFileUrl'] : "https://cdn.shopify.com/s/files/1/0738/7919/1841/files/free-no-image-icon-14597-thumb.png?v=1741422882"}
                        alt="Sales and Use Tax ID File"
                      />
                    ),
                  },
                  {
                    id: '261',
                    url: '#',
                    name: 'Tobacco Permit',
                    value: form['tobaccoPermitNumber'],
                    
                    media:(
                      <Thumbnail
                        source={form['tobaccoPermitNumber']!=='' ? form['tobaccoPermitFileUrl'] : "https://cdn.shopify.com/s/files/1/0738/7919/1841/files/free-no-image-icon-14597-thumb.png?v=1741422882"}
                        alt="Sales and Use Tax ID File"
                      />
                    ),
                  },
                  {
                    id: '262',
                    url: '#',
                    name: 'Personal ID',
                    value: "",
                    
                    media:(
                      <Thumbnail
                        source={form['validIdFileUrl']!=='' ? form['validIdFileUrl'] : "https://cdn.shopify.com/s/files/1/0738/7919/1841/files/free-no-image-icon-14597-thumb.png?v=1741422882"}
                        alt="Sales and Use Tax ID File"
                      />
                    ),
                  },
                ]}
                renderItem={(item) => {
                  const { id, url, name, value, media } = item;

                  return (
                    <ResourceList.Item
                      id={id}
                      url={url}
                      media={media}
                      accessibilityLabel={`View details for ${name}`}
                    >
                      <Text variant="bodyMd" fontWeight="bold" as="h3">
                        {name}
                      </Text>
                      
                      {
                       name!=="Personal ID" ?
                      (value!='') ? <div>{value}</div> : <div>Not Provided</div>
                      :
                      <div></div>
                    }
                    </ResourceList.Item>
                  );
                }}
              />
            </Card>
          </Card>
        </Layout.Section>
      </Layout>
      </div>
    // </Page>

  );
}

export default RegistrationForm