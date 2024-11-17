import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import db from "../db.server"; // Make sure to set up db.server.js to export Prisma client instance
import "../custom-css/custom-form.css"
import fs from 'fs';
import path from 'path';
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
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

export default function CustomForm() {
  return (
    <></>
  );
}

export async function action({ request }) {
  if (request.method === "GET") {
    // Handle GET request
    try {
      const tobaccoForms = await db.tobaccoForm.findMany(); // Fetch all records
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
