import {
    Card,
    Page,
    TextField,
    Grid,
    Banner,
    Button,


} from "@shopify/polaris";
import { generateTobaccoFormPdf } from "../components/FormPDF"
// import db from "../db.server"; 
// import { Test } from "./components/Test"
import ApprovedCustomer  from "../components/ApprovedCustomer"
import RegistrationForm from "../components/RegistrationForm"
import ErrorFields from "../components/ErrorFields"
import { authenticateErply } from "../erplyServices/erplyAuthenticate.sever"
import { buildErplyCustomerAccountUrl, createErplyCustomerWrapper, getBusinessByName } from "../erplyServices/erplyCustomers.server"
import { DeleteIcon,FileIcon } from '@shopify/polaris-icons';
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { getTobaccoForm, createCustomer, denyCustomer, deleteForm, sendAccountInvite, updateTobaccoForm } from "../models/TobaccoForm.server"
import { useCallback, useEffect, useState } from 'react';
import { authenticate } from "../shopify.server";

import {emailAlreadyUsed, phoneAlreadyUsed, buildShopifyCustomerUrl} from "../shopifyServices/cutomer"

import '../custom-css/app.css'
import { redirect } from "react-router-dom";
// import { sendEmail } from "../utils/email.server";


const validateForm = async (form,graphql,sessionKey)=>{
    console.log("running validation.")
    const emailUser = await emailAlreadyUsed(form['email'],graphql)
    const phoneUser = await phoneAlreadyUsed(form['phoneNumber'],graphql)
    
    const businesses = await getBusinessByName(form['businessName'],sessionKey)
    const errors = []
    if(emailUser)
        errors.push({'field':'email','error':'Customer with such email address already exists.','value':form['email'],'user':emailUser})
    if(phoneUser)
        errors.push({'field':'phoneNumber','error':'Customer with such phone number already exists.'})
    if(businesses.length>0)
        errors.push({'field':'businessName','error':'Customer with similar business name already exists.'})
    console.log("form errors: ",errors)
    return errors
}   
export async function loader({ request, params }) {
    const form = await getTobaccoForm(Number(params.id))
    const customerLinks = {
        'shopify':'',
        'erply':''
    }
    console.log("loader form: ",form)
    const { admin } = await authenticate.admin(request);
    const authResponse = await authenticateErply();
    const sessionKey = authResponse['records'][0]['sessionKey']
    const formErrors = await validateForm(form,admin.graphql,sessionKey)
    if(form['approved']){
        customerLinks['erply']=buildErplyCustomerAccountUrl(form['erplyCustomerId'])
        
        customerLinks['shopify']=buildShopifyCustomerUrl(String(form['shopifyAccountId']).replace("gid://shopify/Customer/",""))
    }
    return {form,formErrors,customerLinks}
}
export async function action({ request, params }) {
    let invitationResponse = {}
    // const stringKeys = ['phoneNumber','businessZip','ein','salesAndUseTax']
    const formData = await request.formData();
    const data = Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => {
            try {
                return [key, JSON.parse(value)]; // Parse JSON for numbers, booleans, objects, etc.
            } catch {
                return [key, value]; // If parsing fails, keep as string
            }
        })
    );


    if (request.method === "PUT") {
        console.log("saving updated form: ")
        const updatedForm = await updateTobaccoForm(Number(data['id']), 
        { ...data,
            id: Number(data['id']),
            phoneNumber:String(data['phoneNumber']),
            businessZip:String(data['businessZip']),
            ein:String(data['ein'])
         })
        console.log("updated form (response) ", updatedForm)
        return null
    }
    else if (request.method === "DELETE") {
        console.log("deleting")
        deleteForm(Number(data['id']))
        return redirect("/app")
    }

    const { admin } = await authenticate.admin(request);
    const approve = data['approve']
    if (approve === true) {
        const shopifyCustomer = await createCustomer(data, admin.graphql)
        console.log("shopify customer: ", shopifyCustomer['customer'])
        console.log("shopify customer errors: ", shopifyCustomer['errors'])
        if (shopifyCustomer['errors'].length === 0) {
            console.log("sending account activation invite")
            invitationResponse = await sendAccountInvite(shopifyCustomer['customer']['id'], admin.graphql)
        }
        console.log("erply service about to start")
        const authResponse = await authenticateErply();
        const sessionKey = authResponse['records'][0]['sessionKey']
        console.log("session key ", sessionKey)
        const erplyCustomerResponse = await createErplyCustomerWrapper(sessionKey, data)
        console.log("erply responses: ",erplyCustomerResponse)
        console.log("erply errors: ", erplyCustomerResponse.errors)
        if (erplyCustomerResponse['errors'].length==0){
            try{
                const response = await updateTobaccoForm(data['id'],
                {
                    
                    erplyCustomerId:erplyCustomerResponse['businessResponse']['results'][0]['resourceID'],
                    erplyAddressId:erplyCustomerResponse['addressResponse']['id'],
                    phoneNumber:String(data['phoneNumber']),
                    businessZip:String(data['businessZip']),
                    ein:String(data['ein'])
                }
            )
            console.log("response from updateForm: ",response)
        }
            catch(error){
                console.log("error saving registration form: ",error)
            }
        }
        return {
            'action':'save',
            'shopify': shopifyCustomer,
            'sendInvite': invitationResponse,
            'erply': erplyCustomerResponse
        }
    }
    denyCustomer(data)
    return null

}

export default function TobaccoForm() {
    const {form,formErrors,customerLinks} = useLoaderData()
    console.log("formErrors: ",formErrors)
    
    const [updateFormData, setUpdatedFormData] = useState({ ...form })
    
    const fullName = `${form.firstName} ${form.lastName}`
    const expirationDate = new Date(form.tobaccoPermitExpirationDate);
    const submit = useSubmit();
    const actionData = useActionData()

    const [success, setSuccess] = useState(false)
    const [shopifyErrors, setShopifyErrors] = useState([])
    const [erplyErrors, setErplyErrors] = useState([])
    const [showBanner, setShowBanner] = useState(false)
    const [showDenialForm, setShowDenialForm] = useState(false)
    const [denyReasons, setDenyReason] = useState('')
    const clientCode = "544739"
    // const storeName = "6dcd6a"
    const [shopifyCustomerID, setShopifyCustomerId] = useState('')
    const [erplyCustomerID, setErplyCustomerId] = useState('')

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
        if (actionData['erply']['errors'].length == 0) {
            setErplyCustomerId(actionData['erply']['businessResponse']['results'][0]['resourceID'])
        }
        if (actionData['shopify']['customer'] && actionData['erply']['errors'].length == 0) {
            setSuccess(true)
            setShopifyErrors([])
            setErplyErrors([])
            setShopifyCustomerId(String(actionData['shopify']['customer']['id']).replace("gid://shopify/Customer/", ""))
            setErplyCustomerId(actionData['erply']['businessResponse']['results'][0]['resourceID'])
        }

        else {
            setSuccess(false)

            if (!actionData['shopify']['customer'])
                setShopifyErrors(actionData['shopify']['errors'])
            if (actionData['erply']['errors'].length > 0) {
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
    
    // }
    const handleChange = (field,value) => {
        // e.preventDefault();
        
        setUpdatedFormData({
            ...updateFormData,
            [field]: value,
        });
    };

    const handleSubmit = () => {
        
        console.log("Saved Data:", updateFormData);
        submit(updateFormData, { 'method': 'PUT' })
    };

    // useEffect(()=>{
    //     console.log("form data updated")
    //     console.log(updateFormData)
    // },[updateFormData])

    return (

        <Page fullWidth
            title="Request Details"
            primaryAction={form['approved'] ? { content: 'Approved', disabled: true, onAction: () => {} } :
                { key:"1", content: 'Approve', disabled: false, onAction: () => handleCreate(true) }
            }
            secondaryActions={[
                !form['approved'] && {key:0, content: 'Deny', destructive: true, onAction: () => handleDenyClick() },
                {key:1, content: 'Delete', destructive: true, icon: DeleteIcon, onAction: () => handleDelete() },
                { key:2, content:"Download",icon: FileIcon,onAction:()=>generateTobaccoFormPdf(form)}
            ]}

        >   
            {form['approved'] &&
                <div>
                    <ApprovedCustomer erplyCustomerId={customerLinks['erply']} shopifyCustomerId={customerLinks['shopify']}/>
                </div>}

            {!form['approved'] && formErrors.length>0 && 
                <ErrorFields
                    errorFields={formErrors}
                    form={updateFormData}
                    handleFormChange={handleChange}
                    handleSubmit={handleSubmit}
                 /> }

            {showBanner && <div style={{ 'margin': '2em 0' }}>

                {/* {
                    shopifyErrors.length === 0 && <Banner
                        title="Created Shopify Customer Account Succesfully"
                        tone="success"
                        onDismiss={() => { setShowBanner(false) }}
                    >
                        {(actionData['sendInvite'] && actionData['sendInvite']['data']['customerSendAccountInviteEmail']['userErrors'].length === 0) ? <p>Sent customer invite succesfully</p> : <p>Failed to send account invitation link.</p>}
                        <p>Link to Shopify Customers Account</p>
                        <br></br>
                        <a href={`https://admin.shopify.com/store/jigme-store-dev/customers/${shopifyCustomerID}`} target="__blank" rel="noopener noreferrer">Shopify Customer Link</a>
                    </Banner>
                }
                {
                    erplyErrors.length === 0 && <Banner
                        title="Created Erply Account Succesfully"
                        tone="success"
                        onDismiss={() => { setShowBanner(false) }}
                    >
                        <p>Click the link below to visit customer account in Erply.</p>
                        <br></br>
                        
                        <a 
                        href={`https://us.erply.com/${clientCode}/?lang=eng&section=orgperC&edit=${String(erplyCustomerID)}`}
                        target="_blank" rel="noopener noreferrer"
                        >Erply Customer Link</a>
                    </Banner>
                } */}

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
                            erplyErrors.map((error, index) => (
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
            
            <RegistrationForm form={form}/>



        </Page>




    )
}

