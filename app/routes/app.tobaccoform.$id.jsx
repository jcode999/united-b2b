import {
    Card,
    Page,
    TextField,
    Grid,
    Banner,
    Button,


} from "@shopify/polaris";
// import db from "../db.server"; 
import { authenticateErply } from "../erplyServices/erplyAuthenticate.sever"
import { createErplyCustomerWrapper } from "../erplyServices/erplyCustomers.server"
import { DeleteIcon } from '@shopify/polaris-icons';
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { getTobaccoForm, createCustomer, denyCustomer, deleteForm, sendAccountInvite} from "../models/TobaccoForm.server"
import { useCallback, useEffect, useState } from 'react';
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";


import '../custom-css/app.css'
import { redirect } from "react-router-dom";
// import { sendEmail } from "../utils/email.server";


export async function loader({ request, params }) {
    // console.log("request recieved for ", request)
    return json(await getTobaccoForm(Number(params.id)))
}
export async function action({ request, params }) {
    let invitationResponse = {}
    const data = {
        ...Object.fromEntries(await request.formData()),
    };

    if (request.method === "DELETE") {
        console.log("deleting")
        deleteForm(Number(data['id']))
        return redirect("/app")
    }

    const { admin } = await authenticate.admin(request);
    const approve = data['approve']
    if (approve === "true") {
        const shopifyCustomer = await createCustomer(data, admin.graphql)
        console.log("shopify customer: ", shopifyCustomer['customer'])
        console.log("shopify customer errors: ", shopifyCustomer['errors'])
        if(shopifyCustomer['errors'].length === 0){
            console.log("sending account activation invite")
            invitationResponse = await sendAccountInvite(shopifyCustomer['customer']['id'],admin.graphql)   
        }
        console.log("erply service about to start")
        const authResponse = await authenticateErply();
        const sessionKey = authResponse['records'][0]['sessionKey']
        console.log("session key ",sessionKey)
        const erplyCustomerResponse = await createErplyCustomerWrapper(sessionKey, data)
        console.log("erply errors: ",erplyCustomerResponse.errors)
        
        return {
            'shopify': shopifyCustomer,
            'sendInvite':invitationResponse,
            'erply': erplyCustomerResponse
        }




    }
    denyCustomer(data)
    return null

}

export default function TobaccoForm() {
    const form = useLoaderData()
    const fullName = `${form.firstName} ${form.lastName}`
    const expirationDate = new Date(form.tobaccoPermitExpirationDate);
    const submit = useSubmit();
    const actionData = useActionData()

    const [success, setSuccess] = useState(false)
    const [shopifyErrors, setShopifyErrors] = useState([])
    const [erplyErrors,setErplyErrors] = useState([])
    const [showBanner, setShowBanner] = useState(false)
    const [showDenialForm, setShowDenialForm] = useState(false)
    const [denyReasons, setDenyReason] = useState('')
    const clientCode = "545614"
    const [shopifyCustomerID,setShopifyCustomerId] = useState('')
    const [erplyCustomerID,setErplyCustomerId] = useState('')

    const handleDenyValueChange = useCallback(
        (newValue) => setDenyReason(newValue),
        [],
    );
    
    // console.log("env: ",import.meta.env.VITE_ERPLY_CLIENTCODE)
    useEffect(() => {
        console.log("action data: ", actionData)
        if (!actionData) {
            return
        }
        if(actionData['erply']['errors'].length == 0){
            setErplyCustomerId(actionData['erply']['businessResponse']['results'][0]['resourceID'])
        }
        if (actionData['shopify']['customer'] && actionData['erply']['errors'].length == 0) {
            setSuccess(true)
            setShopifyErrors([])
            setErplyErrors([])
            setShopifyCustomerId(String(actionData['shopify']['customer']['id']).replace("gid://shopify/Customer/",""))
            setErplyCustomerId(actionData['erply']['businessResponse']['results'][0]['resourceID'])
        }
        
        else {
            setSuccess(false)
            
            if (!actionData['shopify']['customer'])
                setShopifyErrors(actionData['shopify']['errors'])
            if(actionData['erply']['errors'].length > 0){
               setErplyErrors(actionData['erply']['errors'])
            }
            
            // setErrors(actionErrors)

        }
        setShowBanner(true)
    }, [actionData]);

    // useEffect(() => {
    //     console.log("errors:...")
    //     console.log(errors)
    // }, [errors])

    const detailStyles = {
        'display': 'flex',
        'flexDirection': 'column',
        'marginTop': '1em',
    }
    // const [message,setMessage] = useState(null)

    const handleCreate = () => {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });
        // Assuming form has an id property
        formData.append("approve", "true");
        formData.append("reason", denyReasons);
        submit(formData, { method: 'post' })
    }
    const handleDenyClick = () => {
        console.log("setting show denial..")

        setShowDenialForm(true)
    }

    const handleDeny = () => {

        // Create a new FormData object
        const formData = new FormData();

        // Manually append data from the loader object
        Object.entries(form).forEach(([key, value]) => {
            formData.append(key, value);
        });
        // Assuming form has an id property
        formData.append("approve", "false");
        formData.append("reason", denyReasons);

        submit(formData, { method: "post" });
    }
    const handleDelete = () => {
        submit(form, { method: 'DELETE' })
    }
    const handleApproved = () => {
        console.log("redirecting to users account")
        const store_name = "jigme-store-dev"
        const customerID = String(form['shopifyAccountId']).replace("gid://shopify/Customer/", '')

        const link = `https://admin.shopify.com/store/${store_name}/customers/${customerID}`
        console.log("link: ", link)
        window.location.href = link;
    }

    return (

        <Page fullWidth
            title="Customer Details"
            primaryAction={form['approved'] ? { content: 'Approved', disabled: true, onAction: () => handleApproved() } :
                { content: 'Approve', disabled: false, onAction: () => handleCreate() }
            }
            secondaryActions={[
                !form['approved'] && { content: 'Deny', destructive: true, onAction: () => handleDenyClick() },
                { content: 'Delete', destructive: true, icon: DeleteIcon, onAction: () => handleDelete() }
            ]}

        >

            {showBanner && <div style={{ 'margin': '2em 0' }}>
                {/* {
                    success && 
                    <Banner
                        title="Created Customer Account Succesfully"
                        tone="success"
                        // action={{content: 'View Customers Account', url: ''}}
                        // secondaryAction={{content: 'Learn more', url: ''}}
                        onDismiss={() => { setShowBanner(false) }}
                    >
                        <p>Created Customers succesfuuly both on Shopify and Erply.</p>
                        <p>Please send customer account activation email.</p>
                    </Banner>
                } */}
                {
                    shopifyErrors.length ===0 && <Banner
                    title="Created Shopify Customer Account Succesfully"
                    tone="success"
                    onDismiss={() => { setShowBanner(false) }}
                    >
                    {(actionData['sendInvite'] && actionData['sendInvite']['data']['customerSendAccountInviteEmail']['userErrors'].length === 0) ? <p>Sent customer invite succesfully</p> : <p>Failed to send account invitation link.</p>}
                    <p>Copy and paste this link in your browser to view customer account.</p>
                    <br></br>
                    <p>{`https://admin.shopify.com/store/jigme-store-dev/customers/${shopifyCustomerID}`}</p>
                    </Banner>
                }
                {
                    erplyErrors.length ===0 && <Banner
                    title="Created Erply Account Succesfully"
                    tone="success"
                    onDismiss={() => { setShowBanner(false) }}
                    >
                    <p>Copy and paste this link in your browser to view customer account.</p>
                    <br></br>
                    <p>{`https://us.erply.com/${clientCode}/?lang=eng&section=orgperC&edit=${String(erplyCustomerID)}`}</p>
                    </Banner>
                }

                {
                    !success && <Banner
                        title="Issue With Creating Customer Account"
                        tone="warning"
                        // action={{content: 'View Customers Account', url: ''}}
                        // secondaryAction={{content: 'Learn more', url: ''}}
                        onDismiss={() => { setShowBanner(false) }}
                    >
                        <p>Reasons</p>
                        {
                            shopifyErrors.map((error, index) => (<li key={index}>{error.message}</li>))
                        }
                        {
                            erplyErrors.map((error,index)=>(
                                <li key={index}>Issue with creating Erply {error.resource}</li>
                            ))
                        }
                    </Banner>
                }
            </div>}
            {
                showDenialForm && <div style={{ 'margin': '2em 0' }}>
                    <Banner
                        tone="warning"
                        title="Denying Application"
                        onDismiss={() => { setShowDenialForm(false) }}
                    >
                        <TextField
                            label="Denial Reson"
                            value={denyReasons}
                            onChange={handleDenyValueChange}
                            autoComplete="off"
                        ></TextField>
                        <div style={{ 'marginTop': '2em', display: 'flex', 'marginLeft': 'auto', flexDirection: 'row-reverse' }}>
                            <Button variant="primary" tone="critical" onClick={handleDeny}>Confirm</Button>
                        </div>

                    </Banner>
                </div>
            }
            <form>
                <Grid>

                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <Card>
                            <div className="detail-heading">
                                <h1 style={{ 'fontWeight': 'bold' }}>Personal Details</h1>
                            </div>

                            <div style={detailStyles}>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Name:</span> <span>{fullName}</span>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Email:</span> <span>{form.email}</span>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Phone:</span> <span>{form.phoneNumber}</span>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>ID Image</span><img alt="validIdFile" src={form.validIdFileUrl}></img>
                            </div>


                        </Card>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <Card title="Orders" sectioned>
                            <div className="detail-heading">
                                <h3 style={{ 'fontWeight': 'bold' }}>Business Details</h3>
                            </div>
                            <div style={detailStyles}>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>EIN:</span> <span>{form.ein}</span>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Sales and Use Tax ID:</span> <span>{form.salesAndUseTaxPermitNumber}</span>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Business Name:</span> <span>{form.businessName}</span>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Address1:</span> <span>{form.businessAddress1}</span>
                                <span >{form.businessCity},{form.businessState},{form.businessZip}</span>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Sales and Use Tax ID Image</span><img alt="tobaccoPermitImage" src={form.salesAndUseTaxFileUrl}></img>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>EIN File</span><img alt="tobaccoPermitImage" src={form.einFileUrl}></img>
                            </div>
                        </Card>
                    </Grid.Cell>

                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <Card title="Orders" sectioned>
                            <div className="detail-heading">
                                <h4 style={{ 'fontWeight': 'bold' }}>Tobacco License</h4>
                            </div>
                            {form.tobaccoPermitNumber && <div style={detailStyles}>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Tobacco Permit Number:</span> <span>{form.tobaccoPermitNumber}</span>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Tobacco Permit Expiration Date:</span> <span>{expirationDate.toDateString()}</span>
                                <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Permit Image</span><img alt="tobaccoPermitImage" src={form.tobaccoPermitFileUrl}></img>
                            </div>}
                        </Card>
                    </Grid.Cell>


                </Grid>
            </form>



        </Page>




    )
}

