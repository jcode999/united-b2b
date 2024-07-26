// app/routes/custom-form.jsx
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import db from "../db.server"; // Make sure to set up db.server.js to export Prisma client instance
import "../custom-css/custom-form.css"

import fs from 'fs';
import path from 'path';
// import "bootstrap/dist/css/bootstrap.min.css"




export default function CustomForm() {
  const actionData = useActionData();
  
  return (
    <div className="custom-form-container-wrapper" >
    <div className="form-container">
      
    <Form  style = {{'fontSize':'12px','color':'white'}} method="post"  action = '/apps/proxy' encType="multipart/form-data">
        {/*--------------------------------Personal Details---------------------------------------------------------------------------*/}
    <div style={{'marginTop':'2em'}}>
        <h3 style={{'fontFamily':'"DM Sans", sans-serif;','letterSpacing':'-.02em','margin':'0 0 2.4rem'}}>Personal Details</h3>
        <div className="row">
            <div className="col">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" className="form-control" placeholder="First name"/>
            </div>
            <div className="col">
                <label htmlFor="lastName">Last Name</label>
                <input id= "lastName" type="text" className="form-control" placeholder="Last name"/>
            </div>
        </div>
        <div className="form-row">
            <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Email</label>
                <input type="email" className="form-control" id="email" placeholder="Email"/>
            </div>
            <div className="form-group col-md-6">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input type="phone" className="form-control" id="phoneNumber" placeholder="(888)-123-1231"/>
            </div>
        </div>
    </div>
{/*--------------------------------Business Details---------------------------------------------------------------------------*/}
    <div style={{'marginTop':'2em'}}>
        <h3 style={{'fontFamily':'"DM Sans", sans-serif;','letterSpacing':'-.02em','margin':'0 0 2.4rem'}}>Business Details</h3>
        <div className="form-group col-md-6">
            <label htmlFor="inputAddress">Business Name</label>
            <input type="text" className="form-control" id="businessName" placeholder="My Business."/>
        </div>
        <div className="form-group col-md-6">
            <label htmlFor="businessAddress1">Address</label>
            <input type="text" className="form-control" id="businessAddress1" placeholder="1234 Main St"/>
        </div>
        <div className="form-group col-md-6">
            <label htmlFor="businessAddress2">Address 2</label>
            <input type="text" className="form-control" id="businessAddress2" placeholder="Apartment, studio, or floor"/>
        </div>
        <div className="form-row">
            <div className="form-group col-md-6">
            <label htmlFor="city">City</label>
            <input type="text" className="form-control" id="city"/>
            </div>
            <div className="form-group col-md-4">
            <label htmlFor="state">State</label>
            <select id="state" className="form-control">
                <option selected>Choose...</option>
                <option>...</option>
            </select>
            </div>
            <div className="form-group col-md-2">
            <label htmlFor="zip">Zip</label>
            <input type="text" className="form-control" id="zip"/>
            </div>
        </div>
    </div>
{/*-----------------------------------Permits and Licenses*/}   
    <div style={{'marginTop':'2em'}}>
        <h3 style={{'fontFamily':'"DM Sans", sans-serif;','letterSpacing':'-.02em','margin':'0 0 2.4rem'}}>Licenses and Permits</h3>
        <div className="form-group mb-3">
                <div className="mb-3">
                    <label htmlFor="tobaccoPermit" className="form-label">Tobacco Permit</label>
                    <input className="form-control" type="file" id="tobaccoPermit"/>
                </div>
        </div>
        <div className="form-group mb-3">
                <div className="mb-3">
                    <label htmlFor="ecigsPermit" className="form-label">Ecigs Permit</label>
                    <input className="form-control" type="file" id="ecigsPermit"/>
                </div>
        </div>
    </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </Form>
      </div>
      <p>hello</p>
      
    </div>
  );
}

export async function action({ request }) {
  
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const businessName = formData.get("businessName")
  const file = formData.get('tobaccoPermit');
  const uploadPath = path.join(process.cwd(), 'public/uploads');

//   if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
//   }
//   const filePath = path.join(uploadPath, String(businessName).toLowerCase()+'-tobacco-permit.png');
//   const fileStream = fs.createWriteStream(filePath);
//   const reader = file.stream().getReader();

//   let fileData = new Uint8Array();
//   let done = false;

//   while (!done) {
//     const { done: doneReading, value } = await reader.read();
//     if (doneReading) {
//       done = true;
//     } else {
//       fileData = new Uint8Array([...fileData, ...value]);
//     }
//   }

//   fileStream.write(fileData);
//   fileStream.end();
//   const tobaccoPermitUrl = '/uploads/'+String(businessName).toLowerCase()+'-tobacco-permit.png'
  const tobaccoPermitUrl = ''
  // const email = formData.get("email");
  // const phoneNumber = formData.get("phone");
  // const taxPayerId = formData.get("taxpayerid")
  // const tobaccoPermit = formData.get("tobaccopermit")
  // const ecigPermit = formData.get("ecigpermit")
  

  // if (typeof customerName !== "string" || typeof email !== "string" || !(file instanceof Blob)) {
  //   return json({ error: "Invalid form data" }, { status: 400 });
  // }

  // const fileBuffer = Buffer.from(await file.arrayBuffer());
  // const filePath = path.join("/uploads", `${Date.now()}-${file.name}`);
  // await fs.writeFile(`./public${filePath}`, fileBuffer);


  await db.tobaccoForm.create({
    data: {
      firstName,
      lastName,
      businessName,
      tobaccoPermitUrl,
    },
  });
 
  
  return redirect(`https://united-wholesale.com/pages/confirmation-page`);
  
  
}
