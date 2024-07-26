import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import db from "../db.server"; // Make sure to set up db.server.js to export Prisma client instance
import "../custom-css/custom-form.css"
import fs from 'fs';
import path from 'path';

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
                <input id="firstName" name="firstName" type="text" className="form-control" placeholder="First name" />
              </div>
              <div className="col">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" type="text" className="form-control" placeholder="Last name" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" name="email" placeholder="Email" />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input type="phone" className="form-control" id="phoneNumber" name="phoneNumber" placeholder="(888)-123-1231" />
              </div>
            </div>
          </div>
          {/*--------------------------------Business Details---------------------------------------------------------------------------*/}
          <div style={{ marginTop: '2em' }}>
            <h3 style={{ fontFamily: '"DM Sans", sans-serif', letterSpacing: '-.02em', margin: '0 0 2.4rem' }}>Business Details</h3>
            <div className="form-group col-md-6">
              <label htmlFor="businessName">Business Name</label>
              <input type="text" className="form-control" id="businessName" name="businessName" placeholder="My Business." />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="businessAddress1">Address</label>
              <input type="text" className="form-control" id="businessAddress1" name="businessAddress1" placeholder="1234 Main St" />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="businessAddress2">Address 2</label>
              <input type="text" className="form-control" id="businessAddress2" name="businessAddress2" placeholder="Apartment, studio, or floor" />
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="city">City</label>
                <input type="text" className="form-control" id="city" name="city" />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="state">State</label>
                <select id="state" name="state" className="form-control">
                  <option selected>Choose...</option>
                  <option>...</option>
                </select>
              </div>
              <div className="form-group col-md-2">
                <label htmlFor="zip">Zip</label>
                <input type="text" className="form-control" id="zip" name="zip" />
              </div>
            </div>
          </div>
          {/*-----------------------------------Permits and Licenses*/}   
          <div style={{ marginTop: '2em' }}>
            <h3 style={{ fontFamily: '"DM Sans", sans-serif', letterSpacing: '-.02em', margin: '0 0 2.4rem' }}>Licenses and Permits</h3>
            <div className="form-group mb-3">
              <div className="mb-3">
                <label htmlFor="tobaccoPermit" className="form-label">Tobacco Permit</label>
                <input className="form-control" type="file" id="tobaccoPermit" name="tobaccoPermit" />
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="mb-3">
                <label htmlFor="ecigsPermit" className="form-label">Ecigs Permit</label>
                <input className="form-control" type="file" id="ecigsPermit" name="ecigsPermit" />
              </div>
            </div>
          </div>
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
  const businessName = formData.get("businessName");
  const file = formData.get('tobaccoPermit');
  const uploadPath = path.join(process.cwd(), 'public/uploads');

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  let tobaccoPermitUrl = '';

  if (file && file instanceof Blob) {
    const filePath = path.join(uploadPath, `${businessName.toLowerCase()}-tobacco-permit.png`);
    const fileStream = fs.createWriteStream(filePath);
    const reader = file.stream().getReader();

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

  try {
    await db.tobaccoForm.create({
      data: {
        firstName,
        lastName,
        businessName,
        tobaccoPermitUrl,
      },
    });
  } catch (error) {
    return json({ error: "Failed to save form data" }, { status: 500 });
  }

  return redirect(`https://united-wholesale.com/pages/confirmation-page`);
}
