import { json } from "@remix-run/node";

import db from "../db.server"; // Make sure to set up db.server.js to export Prisma client instance
import "../custom-css/custom-form.css"
import fs from 'fs';
import path from 'path';

import { authenticate } from "../shopify.server";
const API_KEY = process.env.SHOPIFY_API_KEY || "my-secret-api-key";
const syncPriceTool = async ()=>{
  console.log("syncing pricetool.....")
  fetch('http://localhost:8000/api/price-tool/sync/')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching data:', error));
}
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
    
    
    return json(tobaccoForms, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tobacco forms.", error);
    return json({ error: "Failed to fetch tobacco forms" }, { status: 500 });
  }
  
}
export async function action({ request }) {
  console.log("request received for tobacco forms")
  if (request.method === "GET") {
    // Handle GET request
    try {
      const tobaccoForms = await db.tobaccoForm.findMany(); // Fetch all records
      
      console.log("here")
      return json(tobaccoForms, { status: 200 });
    } catch (error) {
      console.error("Failed to fetch tobacco forms.", error);
      return json({ error: "Failed to fetch tobacco forms" }, { status: 500 });
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
    await db.tobaccoForm.create({
      data: {...serializableFormObject}
    });
  } catch (error) {
    console.log("failed to save form data.",error)
    return json({ error: "Failed to save form data" }, { status: 500 });
  }
  console.log("created form succesfully.")
  return json({status:201})
  // return redirect(`https://jigme-store-dev.myshopify.com/`);
}
