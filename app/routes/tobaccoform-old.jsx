import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import db from "../db.server"; // Make sure to set up db.server.js to export Prisma client instance
import "../custom-css/custom-form.css"
import fs from 'fs';
import path from 'path';

const isValidPermitNumber = (permitNumber) => /^\d{11}$/.test(permitNumber);

export default function CustomForm() {
  const actionData = useActionData();

  return (
    <div className="custom-form-container-wrapper">
      <div className="form-container">
        {actionData?.error && <div className="error">{actionData.error}</div>}
        {actionData?.success && <div className="success">{actionData.success}</div>}
        <Form method="post" action='/apps/proxy' encType="multipart/form-data" style={{ fontSize: '12px', color: 'white' }}>
          {/*--------------------------------Personal Details---------------------------------------------------------------------------*/}
          <div style={{ marginTop: '2em' }}>
            <h3 style={{ fontFamily: '"DM Sans", sans-serif', letterSpacing: '-.02em', margin: '0 0 2.4rem' }}>Personal Details</h3>
            <div className="row">
              <div className="col">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" type="text" className="form-control" placeholder="First name" required />
              </div>
              <div className="col">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" type="text" className="form-control" placeholder="Last name" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" name="email" placeholder="Email" required />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input type="phone" className="form-control" id="phoneNumber" name="phoneNumber" placeholder="(888)-123-1231" required />
              </div>
            </div>
          </div>
          {/*--------------------------------Business Details---------------------------------------------------------------------------*/}
          <div style={{ marginTop: '2em' }}>
            <h3 style={{ fontFamily: '"DM Sans", sans-serif', letterSpacing: '-.02em', margin: '0 0 2.4rem' }}>Business Details</h3>
            <div className="form-group col-md-6">
              <label htmlFor="businessName">Business Name</label>
              <input type="text" className="form-control" id="businessName" name="businessName" placeholder="My Business." required />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="businessAddress1">Business Address</label>
              <input type="text" className="form-control" id="businessAddress1" name="businessAddress1" placeholder="1234 Main St" required />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="businessAddress2">Business Address 2</label>
              <input type="text" className="form-control" id="businessAddress2" name="businessAddress2" placeholder="Apartment, studio, or floor" />
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="businessCity">City</label>
                <input type="text" className="form-control" id="businessCity" name="businessCity" required />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="businessState">State</label>
                <select id="businessState" name="businessState" className="form-control">
                  <option selected>Choose...</option>
                  <option>Tx</option>
                </select>
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="businessZip">Zip</label>
                <input type="text" className="form-control" id="businessZip" name="businessZip" />
              </div>
            </div>
          </div>
          {/*-----------------------------------Permits and Licenses*/}
          <div style={{ marginTop: '2em' }}>
            <h3 style={{ fontFamily: '"DM Sans", sans-serif', letterSpacing: '-.02em', margin: '0 0 2.4rem' }}>Licenses and Permits</h3>
            <div className="form-group mb-3">
              <div className="mb-3">
                <label htmlFor="salesAndUseTaxPermitNumber" className="form-label">Texas Sales and Use Tax Permit Number (Must contain 11 digits)</label>
                <input className="form-control" type="text" id="salesAndUseTaxPermitNumber" name="salesAndUseTaxPermitNumber" required defaultValue={actionData?.formData?.tobaccoPermitNumber || ''} />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="mb-3">
                <label htmlFor="tobaccoPermitNumber" className="form-label">Texas Tobacco Tax Permit Number (required for tobacco!)</label>
                <input className="form-control" type="text" id="tobaccoPermitNumber" name="tobaccoPermitNumber" />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="mb-3">
                <label htmlFor="tobaccoPermitFile" className="form-label">Upload Tobacco Permit Image</label>
                <input className="form-control" type="file" id="tobaccoPermitFile" name="tobaccoPermitFile" />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="mb-3">
                <label htmlFor="tobaccoPermitExpirationDate" className="form-label">Tobacco Permit Expiration Date</label>
                <input className="form-control" type="date" id="tobaccoPermitExpirationDate" name="tobaccoPermitExpirationDate" />
              </div>
            </div>
          </div>
          {actionData?.error && <p>{actionData.error}</p>}
          <button type="submit" className="btn btn-primary">Submit</button>
        </Form>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();

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

  const salesAndUseTaxPermitNumber = formData.get("salesAndUseTaxPermitNumber")
  const tobaccoPermitNumber = formData.get("tobaccoPermitNumber")


  const tobaccoPermitFile = formData.get('tobaccoPermitFile');
  const uploadPath = path.join(process.cwd(), 'public/uploads');



  // Ensure the upload directory exists
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

  if (!isValidPermitNumber(salesAndUseTaxPermitNumber)) {
    return json({ error: "Sales and Use Tax Permit Number must contain 11 digits", formData: Object.fromEntries(formData) }, { status: 400 });
  }

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
    return json({ error: "Failed to save form data" }, { status: 500 });
  }

  return redirect(`https://united-wholesale.com/pages/confirmation-page`);
}
