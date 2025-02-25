

import db from "../db.server"; // Make sure to set up db.server.js to export Prisma client instance
import "../custom-css/custom-form.css"
import fs from 'fs';
import path from 'path';
import { sendEmail } from "../utils/email.server";


const API_KEY = process.env.SHOPIFY_API_KEY || "my-secret-api-key";
const notifyMerchant = (creationResponse) => {
  const formLink = `https://admin.shopify.com/store/6dcd6a/apps/united-b2b/app/tobaccoform/${String(creationResponse['id'])}`
  const emailToMerchant = sendEmail({
    from:process.env.EMAIL_USER,
    to:process.env.MERCHANT_EMAIL,
    subject:"Account Creation Request Received",
    text:"",
    customerName:'',
    id:'',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    html:`
    <h1>Account Creation Request from ${creationResponse['firstName'] + ' ' +creationResponse['lastName']}!</h1>
    <p>Click the link to view details.</p>
    <a href=${formLink}>${formLink}</a>
    <p>If the link doesn't work, copy and paste the URL into your browser.</p>
  `,
  })
  if (emailToMerchant.success) {
    console.log("email to merchant sent succesfully")
  } else {
    console.warn("failed to send email to merchant")
  }
}
const notifyCustomer = (creationResponse) => {
  
  const emailToApplicant = sendEmail({
    from:process.env.MERCHANT_EMAIL,
    to:creationResponse['email'],
    subject:"Registration Form & Account Application",
    text:"",
    customerName:'',
    id:'',
    auth: {
      user: process.env.MERCHANT_EMAIL,
      pass: process.env.MERCHANT_PASS
    },
    html:`
    <h3>United Wholesale Registration</h3>
    <br></br>

    <p>Thank you for applying for an account with United Wholesale and trusting us as your partner.</p>
    <br></br>
    <p>
    Prior to activating your account we need to verify your documentations. This will allow us to streamline your account approval!
    After submitting the documents, a member of our team will review your information and reach out if we are able to service your location. If you do not hear from us immediately, please rest assured that every application is being cataloged.
    We appreciate your patience and understanding during this time.
    </p>

    <p>Best regards,</p>



    <p>United Wholesale</p>
    <p>817-744-7989</p>
    <p>Whatsapp/Text. 406-499-9999</p>
    <p>Contact@united-wholesale.com</p>
  `,
  })
  if (emailToApplicant.success) {
    console.log("email to applicant sent succesfully")
  } else {
    console.warn("failed to send email to applicant")
  }
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
const buildSerializedData = (formObject)=>{
  console.log("building file urls.")
  const serializableFormObject = {}
  for (const [key, value] of Object.entries(formObject)) {
      
      if(value instanceof Blob){
        const fileName = value.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
        console.log(`${key}:  ${fileName}`)
        
        const uploadPath = path.join(process.cwd(), 'public/uploads');
        
        const businessName = formObject['businessName'].toLowerCase()
        const joinedBusinessName = businessName.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').join('-')
        const filePath = path.join(uploadPath, `${joinedBusinessName.toLowerCase()}-${key}.${fileExtension}`);
        handleFileUpload(value,filePath)
        serializableFormObject[key+'Url'] = `/uploads/${joinedBusinessName.toLowerCase()}-${key}.${fileExtension}`
      }
      
      else{
        serializableFormObject[key] = value;
      }
     
  }
  
  serializableFormObject['tobaccoPermitExpirationDate'] = new Date(serializableFormObject['tobaccoPermitExpirationDate']).toISOString()
  
  return serializableFormObject
}

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
  const serializableFormObject = buildSerializedData(formObject)
  
  
  // for (const [key, value] of Object.entries(formObject)) {
  //   if(key==='tobaccoPermitFile'){
  //     if(value instanceof Blob){
  //       console.log('tobacco permit file submitted')
  //       const uploadPath = path.join(process.cwd(), 'public/uploads');
  //       const businessName = serializableFormObject['businessName'].toLowerCase()
  //       const joinedBusinessName = businessName.split(' ').join('-')
  //       const filePath = path.join(uploadPath, `${joinedBusinessName}-tobacco-permit.png`);
  //       handleFileUpload(value,filePath)
  //       serializableFormObject['tobaccoPermitUrl'] = `/uploads/${joinedBusinessName.toLowerCase()}-tobacco-permit.png`
  //     }
  //     else{
  //       console.log("no tobacco related document submitted.")
  //       serializableFormObject['tobaccoPermitUrl'] = ''}
      
  //   }
  //   else if(key==='tobaccoPermitExpirationDate'){
  //     if(value!=''){
  //       serializableFormObject['tobaccoPermitExpirationDate'] = new Date(value).toISOString()
  //     }
  //   }
  //   else{
  //     if(value!=''){
  //       serializableFormObject[key] = value;
  //     }
  //   }
  // }
  console.log("serialized form: ",serializableFormObject)
  try {
    const creationResponse = await db.tobaccoForm.create({
      data: {...serializableFormObject}
    });
    console.log("creating response: ",creationResponse)
    
    notifyMerchant(creationResponse)
    notifyCustomer(creationResponse)
  
  } catch (error) {
    console.log("failed to save form data.",error)
    return new Response(JSON.stringify({ error: "Failed to save form data" }, { status: 500 }));
  }
  console.log("created form succesfully.")
  return new Response(JSON.stringify({status:201}))
  // return redirect(`https://jigme-store-dev.myshopify.com/`);
}
