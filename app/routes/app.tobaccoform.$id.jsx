import { useLoaderData } from "@remix-run/react";
import {getTobaccoForm} from "../models/TobaccoForm.server"

// import {CreateCustomer} from "../api-services/CreateCustomer"
import { json } from "@remix-run/node";
export async function loader({ request, params }) {
    console.log("request recieved for ",params.id)
    return json(await getTobaccoForm(Number(params.id)))
}

export default function TobaccoForm(){
    const form = useLoaderData()


    return(
        <div style={{'padding':'2em','background':'white'}}>
        
            <span style={{'fontWeight':'bold'}}>Customer: </span><span style={{'fontWeight':'small'}}>{form.firstName}</span>
            
            <h1 style={{'fontWeight':'bold'}}>Tobacco Permit</h1>
            <img width={800} height = {500} src ={`/uploads/${form.businessName.toLowerCase()}-tobacco-permit.png`} alt='tobacco-permit'/>
            
        </div>
        
    )
}