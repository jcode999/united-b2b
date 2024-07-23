
import { json, } from "@remix-run/node";
import {
  
  useLoaderData,useNavigate
  
} from "@remix-run/react";

// import {CreateCustomer} from "../api-services/CreateCustomer"

import { authenticate } from "../shopify.server";
// import db from "../db.server";
import { getTobaccoForms } from "../models/TobaccoForm.server";

export async function loader({request,params}){
    const { admin } = await authenticate.admin(request);
    return json(await getTobaccoForms())
}

export default function TobaccoForms() {
  
  const forms = useLoaderData();
  const navigate = useNavigate();
  


  return (
      <div style={{'background':'white','padding':'2em'}}>
        <h1 style={{'fontSize':'large','fontWeight':'bold','marginBottom':'2em'}}>Tobacco Related Documents</h1>
          {forms.map((form)=>(
          <div key ={form.firstName} style={{'display':'flex','border':'1px solid black','margin':'1em','padding':'1em','alignItems':'center','gap':'0.5em','borderRadius':'20px'}}
          onClick={() => navigate("/app/tobaccoform/"+String(form.id))}>
            {/* <Avatar customer size="md" name={form.firstName} /> */}
            <img width={30} height={30} src = '/user.png' alt="foo"></img>
            <h2>{form.firstName}</h2>
            <h2>{form.lastName}</h2>
            
          </div>
          
        ))}
        
      </div>
)
}

