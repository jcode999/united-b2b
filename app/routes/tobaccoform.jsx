

import db from "../db.server"; // Make sure to set up db.server.js to export Prisma client instance
import "../custom-css/custom-form.css"
import fs from 'fs';
import path from 'path';
import { sendEmail } from "../utils/email.server";

const API_KEY = process.env.SHOPIFY_API_KEY || "my-secret-api-key";

const handleFileUpload = async (tobaccoPermitFile,filePath)=>{
  
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
  
}

// export default function CustomForm() {
//   return (
//     <></>
//   );
// }
export async function loader({request}){
  console.log("loader function [tobacco form]",request)
  // const { admin } = await authenticate.admin(request);
  // if (admin){
  //   console.log("you are authenticated")
  // }
  const apiKey = request.headers.get("SHOPIFY_API_KEY");
  
  if (!apiKey || apiKey !== API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const tobaccoForms = await db.tobaccoForm.findMany(); // Fetch all records
    
    
    return new Response(JSON.stringify(tobaccoForms, { status: 200 }));
  } catch (error) {
    console.error("Failed to fetch tobacco forms.", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tobacco forms" }, { status: 500 }));
  }
  
}
export async function action({ request }) {
  console.log("request received for tobacco forms")
  if (request.method === "GET") {
    // Handle GET request
    try {
      const tobaccoForms = await db.tobaccoForm.findMany(); // Fetch all records
      
      
      return new Response(JSON.stringify(tobaccoForms, { status: 200 }));
    } catch (error) {
      console.error("Failed to fetch tobacco forms.", error);
      return new Response(JSON.stringify({ error: "Failed to fetch tobacco forms" }, { status: 500 }));
    }
    
  }
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData.entries());
  const serializableFormObject = {};
  for (const [key, value] of Object.entries(formObject)) {
    if(key==='tobaccoPermitFile'){
      if(value instanceof Blob){
        console.log('tobacco permit file submitted')
        const uploadPath = path.join(process.cwd(), 'public/uploads');
        const businessName = serializableFormObject['businessName']
        const filePath = path.join(uploadPath, `${businessName.toLowerCase()}-tobacco-permit.png`);
        handleFileUpload(value,filePath)
        serializableFormObject['tobaccoPermitUrl'] = `/uploads/${businessName.toLowerCase()}-tobacco-permit.png`
      }
      else{
        console.log("no tobacco related document submitted.")
        serializableFormObject['tobaccoPermitUrl'] = ''}
      
    }
    else if(key==='tobaccoPermitExpirationDate'){
      if(value!=''){
        serializableFormObject['tobaccoPermitExpirationDate'] = new Date(value).toISOString()
      }
    }
    else{
      if(value!=''){
        serializableFormObject[key] = value;
      }
    }
  }
  console.log("request received...",serializableFormObject)
  try {
    const creationResponse = await db.tobaccoForm.create({
      data: {...serializableFormObject}
    });
    console.log("creating response: ",creationResponse)
    const emailResult = sendEmail({
      to:"contact@united-wholesale.com",
      subject:"Account Creation Request Received",
      text:"",
      customerName:creationResponse['firstName'] + ' ' +creationResponse['lastName']
    })
    if (emailResult.success) {
      console.log("email sent succesfully")
    } else {
      console.warn("failed to send email")
    }
  
  } catch (error) {
    console.log("failed to save form data.",error)
    return new Response(JSON.stringify({ error: "Failed to save form data" }, { status: 500 }));
  }
  console.log("created form succesfully.")
  return new Response(JSON.stringify({status:201}))
  // return redirect(`https://jigme-store-dev.myshopify.com/`);
}
