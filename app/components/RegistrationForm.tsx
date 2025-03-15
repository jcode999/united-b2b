import {

  Layout,
  Card,
  ResourceList,
  Thumbnail,
  Text,
  TextField,
  Button,
  MediaCard

} from '@shopify/polaris';


import { useState } from 'react';

interface FormProps {
  form: any;
}




const RegistrationForm = ({ form }: FormProps) => {
  const [overlayActive, setOverlayActive] = useState(false)
  const [overlayContent, setOverlayContent] = useState<any | null>(null)

  const handleFormMediaView = (mediaUrl: string, mediaName: string) => {
    setOverlayContent({ 'mediaUrl': mediaUrl, 'mediaName': mediaName })
    setOverlayActive(true)
  }

  return (
    // <Page fullWidth>
    <div style={{ margin: '1em 0', position: 'relative' }}>

      <div>
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
                      url: "#",
                      name: 'EIN',
                      value: form['ein'],
                      media: (
                        <Thumbnail
                          source={form['einFileUrl']}
                          alt="EIN File"
                        />
                      ),
                      mediaUrl: form['einFileUrl']

                    },
                    {
                      id: '260',
                      url: '#',
                      name: 'Sales and Use Tax ID',
                      value: form['salesAndUseTaxPermitNumber'],

                      media: (
                        <Thumbnail
                          source={form['salesAndUseTaxPermitNumber'] !== '' ? form['salesAndUseTaxFileUrl'] : "https://cdn.shopify.com/s/files/1/0738/7919/1841/files/free-no-image-icon-14597-thumb.png?v=1741422882"}
                          alt="Sales and Use Tax ID File"
                        />
                      ),
                      mediaUrl: form['salesAndUseTaxFileUrl']
                    },
                    {
                      id: '261',
                      url: '#',
                      name: 'Tobacco Permit',
                      value: form['tobaccoPermitNumber'],

                      media: (
                        <Thumbnail
                          source={form['tobaccoPermitNumber'] !== '' ? form['tobaccoPermitFileUrl'] : "https://cdn.shopify.com/s/files/1/0738/7919/1841/files/free-no-image-icon-14597-thumb.png?v=1741422882"}
                          alt="Sales and Use Tax ID File"
                        />
                      ),
                      mediaUrl: form['tobaccoPermitFileUrl']
                    },
                    {
                      id: '262',
                      url: '#',
                      name: 'Personal ID',
                      value: "",

                      media: (
                        <Thumbnail

                          source={form['validIdFileUrl'] !== '' ? form['validIdFileUrl'] : "https://cdn.shopify.com/s/files/1/0738/7919/1841/files/free-no-image-icon-14597-thumb.png?v=1741422882"}
                          alt="Sales and Use Tax ID File"
                        />
                      ),
                      mediaUrl: form['validIdFileUrl']
                    },
                  ]}
                  renderItem={(item) => {
                    const { id, url, name, value, media, mediaUrl } = item;

                    return (

                      <ResourceList.Item
                        id={id}
                        url={url}
                        media={media}
                        accessibilityLabel={`View details for ${name}`}
                      >
                        <div onClick={() => console.log(name, value)}>
                          <Text variant="bodyMd" fontWeight="bold" as="h3">
                            {name}

                          </Text>
                        </div>

                        {
                          name !== "Personal ID" ?
                            (value != '') ? <div>{value}</div> : <div>Not Provided</div>
                            :
                            <div></div>
                        }
                        <Button fullWidth={true} variant='secondary' onClick={() => handleFormMediaView(mediaUrl, name)}>View</Button>
                      </ResourceList.Item>

                    );
                  }}
                />
              </Card>
            </Card>
          </Layout.Section>
        </Layout>
      </div>
      {overlayActive &&
        <div
          style={{ position: 'absolute', top: 0, left: 0, background: 'white' }}
        >

          <Layout>
            <Layout.Section variant='fullWidth' >
              <MediaCard
                title="File"
                // secondaryAction={{
                //   content: 'Learn about getting started',
                //   onAction: () => {},
                // }}
                description={overlayContent['mediaName']}
                popoverActions={[{ content: 'Dismiss', onAction: () => { setOverlayActive(false) } }]}
              >
                <img
                  alt=""
                  width="100%"
                  height="100%"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                  }}
                  src={overlayContent['mediaUrl']}
                />
              </MediaCard>
            </Layout.Section>
          </Layout>

        </div>
      }
    </div>


  );
}

export default RegistrationForm