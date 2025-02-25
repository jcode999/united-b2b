import {
    Card,
    Page,
    TextField,
    Grid,
    Banner,
    Button,


} from "@shopify/polaris";
// import db from "../db.server"; 
import {DeleteIcon} from '@shopify/polaris-icons';
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { getTobaccoForm, createCustomer, denyCustomer, deleteForm} from "../models/TobaccoForm.server"
import { useCallback, useEffect,useState } from 'react';
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";


import '../custom-css/app.css'
import { redirect } from "react-router-dom";


export async function loader({ request, params }) {
    // console.log("request recieved for ", request)
    return json(await getTobaccoForm(Number(params.id)))
}
export async function action({ request, params }) {
    const data = {
        ...Object.fromEntries(await request.formData()),
    };
    
    if(request.method==="DELETE"){
        console.log("deleting")
        deleteForm(Number(data['id']))
        return redirect("/app")
    }
    
    const { admin } = await authenticate.admin(request);
    
    console.log("-----------------------------------------------------------------")
    console.log("approve/deny request: ",data)
    console.log("id: ",data['id'])
    console.log("approve: ",data['approve'])

    console.log("-----------------------------------------------------------------")
    const approve = data['approve']
    if(approve==="true"){
    const createResponse = await createCustomer(data, admin.graphql)
    
    console.log("created customer: ", createResponse['customer'])
    console.log("errors: ",createResponse['errors'])
    return createResponse
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

    const [success,setSuccess] = useState(false)
    const [errors,setErrors] = useState('')
    const [showBanner,setShowBanner] = useState(false)
    const [showDenialForm,setShowDenialForm] = useState(false)
    const [denyReasons,setDenyReason] = useState('')

    const handleDenyValueChange = useCallback(
        (newValue) => setDenyReason(newValue),
        [],
      );

    useEffect(() => {
        console.log("action data: ", actionData)
        if(!actionData){
            return
        }
        if (actionData?.['customer']) {
            setSuccess(true)
            setErrors('')
            
        }
        else{
            setSuccess(false)
            setErrors(actionData['errors'])

        }
        setShowBanner(true)
    }, [actionData]);

    useEffect(()=>{
        console.log("errors:...")
        console.log(errors)
    },[errors])

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
        submit(formData, { method: 'post'})
    }
    const handleDenyClick = () => {
        console.log("setting show denial..")
        
        setShowDenialForm(true)
    }
    
    const handleDeny = () =>{
        
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
    const handleDelete = ()=>{
        submit(form, {method:'DELETE'})
    }
    const handleApproved = ()=>{
        console.log("redirecting to users account")
        const store_name = "jigme-store-dev"
        const customerID = String(form['shopifyAccountId']).replace("gid://shopify/Customer/",'')
        
        const link = `https://admin.shopify.com/store/${store_name}/customers/${customerID}`
        console.log("link: ",link)
        window.location.href = link;
    }

    return (

        <Page fullWidth
            title="Customer Details"
            primaryAction={form['approved'] ? {content: 'Approved', disabled: true, onAction: ()=>handleApproved()} :
            {content: 'Approve', disabled: false, onAction: ()=>handleCreate()}
         }
            secondaryActions={[
                !form['approved']&& {content: 'Deny', destructive: true, onAction:()=>handleDenyClick()},
                {content: 'Delete', destructive: true, icon: DeleteIcon, onAction:()=>handleDelete()}
              ]}

            >
            
            {showBanner && <div style={{'margin':'2em 0'}}>
            {
                success && errors==='' &&
                 <Banner
                title="Created Customer Account Succesfully"
                tone="success"
                // action={{content: 'View Customers Account', url: ''}}
                // secondaryAction={{content: 'Learn more', url: ''}}
                onDismiss={() => {setShowBanner(false)}}
              >
                <p>
                  Customer Account has been succesfully created. Don't forget to send the activation link
                </p>
              </Banner>
            }
            {
                !success && errors!=='' && <Banner
                title="Failed to create customers account."
                tone="warning"
                // action={{content: 'View Customers Account', url: ''}}
                // secondaryAction={{content: 'Learn more', url: ''}}
                onDismiss={() => {setShowBanner(false)}}
              >
                <p>Reasons</p>
                {
                    errors.map((error,index)=>(<p key={index}>{error['message']}</p>))
                }
              </Banner>
            }
            </div>}
            {
                showDenialForm && <div style={{'margin':'2em 0'}}>
                    <Banner
                    tone="warning"
                    title="Denying Application"
                    onDismiss={() => {setShowDenialForm(false)}}
                    >
                        <TextField
                        label="Denial Reson"
                        value={denyReasons}
                        onChange={handleDenyValueChange}
                        autoComplete="off"
                        ></TextField>
                        <div style={{'marginTop':'2em',display:'flex','marginLeft':'auto',flexDirection:'row-reverse'}}>
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
                        <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Sales and Use Tax ID:</span> <span>{form.salesAndUseTaxPermitNumber}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Business Name:</span> <span>{form.businessName}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Address1:</span> <span>{form.businessAddress1}</span>
                            <span >{form.businessCity},{form.businessState},{form.businessZip}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Sales and Use Tax ID Image</span><img alt="tobaccoPermitImage" src={form.salesAndUseTaxFileUrl}></img>
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

