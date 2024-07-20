// app/routes/custom-form.jsx
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import db from "../db.server"; // Make sure to set up db.server.js to export Prisma client instance
import fs from "fs/promises";
import path from "path";
import "../custom-css/custom-form.css"

// export function meta() {
//   return {
//     title: "Custom Registration Form",
//   };
// }

export default function CustomForm() {
  const actionData = useActionData();
  
  return (
    <div class="custom-form-container-wrapper">
      <div class="form-container">
      <Form  method="post" encType="multipart/form-data">

        <div className="form-group">
          <label htmlFor="firstName">Name:</label>
          <input type="text" id="firstName" name="firstName" required />
        </div>
        <div class="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input type="text" id="lastname" name="lastname" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div class="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" required/>
        </div>

        <div class="form-group">
            <label htmlFor="taxpayerid">Tax Payer ID</label>
            <input type="text" id="taxpayerid" name="taxpayerid" required/>
        </div>

        <div class="form-group">
            <label htmlFor="tobaccopermit">Tobacco Permit</label>
            <input type="file" id="tobaccopermit" name="tobaccopermit" required/>
        </div>

        <div class="form-group">
            <label htmlFor="ecigpermit">E-Cigarette Permit</label>
            <input type="file" id="ecigpermit" name="ecigpermit" required/>
        </div>

        <div>
          <label htmlFor="file">Upload File:</label>
          <input type="file" id="file" name="file" required />
        </div>

        {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
        
        <div class="form-group">
            <button type="submit">Submit</button>
        </div>
      </Form>
      </div>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const firstName = formData.get("firstname");
  const lastName = formData.get("lastname");
  const email = formData.get("email");
  const phoneNumber = formData.get("phone");
  const taxPayerId = formData.get("taxpayerid")
  const tobaccoPermit = formData.get("tobaccopermit")
  const ecigPermit = formData.get("ecigpermit")
  const shop = 'foo-bar'

  // if (typeof customerName !== "string" || typeof email !== "string" || !(file instanceof Blob)) {
  //   return json({ error: "Invalid form data" }, { status: 400 });
  // }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join("/uploads", `${Date.now()}-${file.name}`);
  await fs.writeFile(`./public${filePath}`, fileBuffer);

  await db.tobaccoForm.create({
    data: {
      firstName,
      shop
    },
  });
  
  return json({ error: "ok" }, { status: 200 });
  
  
}
