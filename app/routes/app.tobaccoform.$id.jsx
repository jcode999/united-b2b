import {
    Card,
    Page,
  
    Grid,
    Banner,
    Link,


} from "@shopify/polaris";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { getTobaccoForm, createCustomer } from "../models/TobaccoForm.server"
import { useEffect,useState } from 'react';
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import '../custom-css/app.css'
export async function loader({ request, params }) {
    // console.log("request recieved for ", request)
    return json(await getTobaccoForm(Number(params.id)))
}
export async function action({ request, params }) {
    console.log("[action] creating customer.")
    console.log("request: ", request)
    const { admin } = await authenticate.admin(request);
    const data = {
        ...Object.fromEntries(await request.formData()),
    };
    const createResponse = await createCustomer(data, admin.graphql)

    console.log("created customer: ", createResponse['customer'])
    console.log("errors: ",createResponse['errors'])
    return createResponse
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

        submit(form, { method: 'post' })
    }
   


    return (

        <Page fullWidth
            title="Customer Details"
            primaryAction={{content: 'Approve', disabled: false, onAction: ()=>handleCreate()}}
            >
            
            {showBanner && <div style={{'margin':'2em 0'}}>
            {
                success && errors==='' &&
                 <Banner
                title="Some of your product variants are missing weights"
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
            <Grid>

                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Card>
                        <div className="detail-heading">
                            <h4 style={{ 'fontWeight': 'bold' }}>Personal Details</h4>
                        </div>

                        <div style={detailStyles}>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Name:</span> <span>{fullName}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Email:</span> <span>{form.email}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Phone:</span> <span>{form.phoneNumber}</span>
                        </div>


                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Card title="Orders" sectioned>
                    <div className="detail-heading">
                            <h4 style={{ 'fontWeight': 'bold' }}>Business Details</h4>
                        </div>
                        <div style={detailStyles}>
                        <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Sales and Use Tax ID:</span> <span>{form.salesAndUseTaxPermitNumber}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Business Name:</span> <span>{form.businessName}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Address1:</span> <span>{form.businessAddress1}</span>
                            <span >{form.businessCity},{form.businessState},{form.businessZip}</span>
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
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '1em' }}>Permit Image</span><img alt="tobaccoPermitImage" src={`/uploads/${form.businessName.toLowerCase()}-tobacco-permit.png`}></img>
                        </div>}
                    </Card>
                </Grid.Cell>

            </Grid>


            
        </Page>

        // <div style={{'padding':'2em','background':'white'}}>

        //     <span style={{'fontWeight':'bold'}}>Customer: </span><span style={{'fontWeight':'small'}}>{form.firstName}</span>

        //     <h1 style={{'fontWeight':'bold'}}>Tobacco Permit</h1>
        //     <img width={300} height = {100} src ={`/uploads/${form.businessName.toLowerCase()}-tobacco-permit.png`} alt='tobacco-permit'/>
        //     
        // </div>


    )
}