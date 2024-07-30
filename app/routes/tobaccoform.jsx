import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import db from "../db.server"; // Make sure to set up db.server.js to export Prisma client instance
import "../custom-css/custom-form.css"
import fs from 'fs';
import path from 'path';
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
const isValidPermitNumber = (permitNumber) => /^\d{11}$/.test(permitNumber);

export default function CustomForm() {
  
  const actionData = useActionData();
  
  
  return (
    <div className="custom-form-container-wrapper">
      <div className="form-container">
        
        <Form method="post" action='/apps/proxy' encType="multipart/form-data" style={{ fontSize: '12px', color: 'black' }}>
          {actionData?.error && <div className="error">{actionData.error}</div>}
          {actionData?.success && <div className="success">{actionData.success}</div>}
          
          
          {/*--------------------------------Business Details---------------------------------------------------------------------------*/}
          
          {/*-----------------------------------Permits and Licenses*/}   
          
            
          

          
          <button type="submit" className="btn btn-primary">Submit</button>
        </Form>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  console.log("request received...")
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const phoneNumber = formData.get("phoneNumber")
  const email = formData.get("email")
  
  const businessName = formData.get("businessName");
  const businessAddress1 = formData.get("businessAddress1");
  const businessAddress2 = formData.get("businessAddress2")
  const businessCity = formData.get("businessCity");
  const businessState = 'Tx'
  const businessZip = formData.get("businessZip")

  // const firstName = 'test';
  // const lastName = 'test';
  // const phoneNumber = '123123'
  // const email = 'test@gmail.com'
  
  // const businessName = 'test-business';
  // const businessAddress1 = 'test-business';
  // const businessAddress2 = 'test'
  // const businessCity = 'test';
  // const businessState = 'Tx'
  // const businessZip = '123123'

  const salesAndUseTaxPermitNumber = formData.get("salesAndUseTaxPermitNumber")
  const tobaccoPermitNumber = formData.get("tobaccoPermitNumber")
  


  const tobaccoPermitFile = formData.get('tobaccoPermitFile');
  const uploadPath = path.join(process.cwd(), 'public/uploads');
  
  

  //Ensure the upload directory exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  let tobaccoPermitUrl = '';

  if (tobaccoPermitFile && tobaccoPermitFile instanceof Blob) {
    const filePath = path.join(uploadPath, `${businessName.toLowerCase()}-tobacco-permit.png`);
    const fileStream = fs.createWriteStream(filePath);
    const reader = tobaccoPermitFile.stream().getReader();

    let fileData = new Uint8Array();
    let done = false;

    while (!done) {
      const { done: doneReading, value } = await reader.read();
      if (doneReading) {
        done = true;
      } else {
        fileData = new Uint8Array([...fileData, ...value]);
      }
    }

    fileStream.write(fileData);
    fileStream.end();
    tobaccoPermitUrl = `/uploads/${businessName.toLowerCase()}-tobacco-permit.png`;
  } else {
    return json({ error: "Invalid file upload" }, { status: 400 });
  }

  // if (!isValidPermitNumber(salesAndUseTaxPermitNumber)) {
  //   return json({ error: "Sales and Use Tax Permit Number must contain 11 digits", formData: Object.fromEntries(formData) }, { status: 400 });
  // }
  
  try {
    await db.tobaccoForm.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        email,
        businessName,
        businessAddress1,
        businessAddress2,
        businessCity,
        businessState,
        businessZip,
        salesAndUseTaxPermitNumber,
        tobaccoPermitNumber,
        tobaccoPermitUrl,
      },
    });
  } catch (error) {
    console.log("failed to save form data.",error)
    return json({ error: "Failed to save form data" }, { status: 500 });
  }
  console.log("created form succesfully.")
  return json({status:201})
  // return redirect(`https://jigme-store-dev.myshopify.com/`);
}
