import {
    Card,
    Page,
    Badge,
    Grid,


} from "@shopify/polaris";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { getTobaccoForm, createCustomer } from "../models/TobaccoForm.server"

import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
export async function loader({ request, params }) {
    console.log("request recieved for ", params.id)
    return json(await getTobaccoForm(Number(params.id)))
}
export async function action({ request, params }) {
    console.log("request to create customer received.")

    const { admin } = await authenticate.admin(request);
    const data = {
        ...Object.fromEntries(await request.formData()),
    };
    const customer = await createCustomer(data, admin.graphql)

    console.log(customer)
    return customer
}

export default function TobaccoForm() {
    const form = useLoaderData()
    const fullName = `${form.firstName} ${form.lastName}`
    const expirationDate = new Date(form.tobaccoPermitExpirationDate);
    const submit = useSubmit();
    const detailStyles = {
        'display': 'flex',
        'flexDirection': 'column',
        'marginTop': '1em',
    }

    const handleCreate = () => {

        submit(form, { method: 'post' })
    }
    const action1 = {
        content: 'Save',
        disabled: true,
        onAction: { handleCreate }
    }
    // const action2 = {
    //     content: 'Save',
    //     disabled: false,
    //     onAction: { handleCreate }
    // }


    return (

        <Page fullWidth
            title="Customer Details">
            
            <Grid>

                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Card>
                        <p style={{ 'fontWeight': 'bold' }}>Personal Details</p>
                        <div style={detailStyles}>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '0.25em' }}>Name:</span> <span>{fullName}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '0.25em' }}>Email:</span> <span>{form.email}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '0.25em' }}>Phone:</span> <span>{form.phoneNumber}</span>
                        </div>


                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Card title="Orders" sectioned>
                        <p style={{ 'fontWeight': 'bold' }}>Business Details</p>
                        <div style={detailStyles}>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '0.25em' }}>Business Name:</span> <span>{form.businessName}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '0.25em' }}>Address1:</span> <span>{form.businessAddress1}</span>
                            <span style={{ 'marginTop': '0.25em' }}>{form.businessCity},{form.businessState},{form.businessZip}</span>
                        </div>
                    </Card>
                </Grid.Cell>

                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                    <Card title="Orders" sectioned>
                        <p style={{ 'fontWeight': 'bold' }}>Submitted Tobacco Documents</p>
                        {form.tobaccoPermitNumber && <div style={detailStyles}>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '0.25em' }}>Tobacco Permit Number:</span> <span>{form.tobaccoPermitNumber}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '0.25em' }}>Tobacco Permit Expiration Date:</span> <span>{expirationDate.toDateString()}</span>
                            <span style={{ 'fontWeight': 'bold', 'marginTop': '0.25em' }}>Permit Image</span><img alt="tobaccoPermitImage" src={`/uploads/${form.businessName.toLowerCase()}-tobacco-permit.png`}></img>
                        </div>}
                    </Card>
                </Grid.Cell>

            </Grid>
            

            <div style={{'marginBottom':'9em'}}>
                <button style={
                    {
                        'background': 'black',
                        'color': 'white',
                        'width': '8em',
                        'height': '2em',
                        'border': 'none',
                        'borderRadius': '10px',
                        
                        
                        
                    }}
                    onClick={handleCreate} >Approve</button>
            </div>
        </Page>

        // <div style={{'padding':'2em','background':'white'}}>

        //     <span style={{'fontWeight':'bold'}}>Customer: </span><span style={{'fontWeight':'small'}}>{form.firstName}</span>

        //     <h1 style={{'fontWeight':'bold'}}>Tobacco Permit</h1>
        //     <img width={300} height = {100} src ={`/uploads/${form.businessName.toLowerCase()}-tobacco-permit.png`} alt='tobacco-permit'/>
        //     
        // </div>


    )
}