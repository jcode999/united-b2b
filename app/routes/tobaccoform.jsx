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
    <Form className='customForm' method="post" encType="multipart/form-data">
      <div>
        <label htmlFor="customerName">Name:</label>
        <input type="text" id="customerName" name="customerName" required />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
      </div>

      <div>
        <label htmlFor="file">Upload File:</label>
        <input type="file" id="file" name="file" required />
      </div>

      {actionData?.error && <p style={{ color: "red" }}>{actionData.error}</p>}
      
      <button type="submit">Submit</button>
    </Form>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const customerName = formData.get("customerName");
  const email = formData.get("email");
  const file = formData.get("file");
  const shop = 'foo-bar'

  // if (typeof customerName !== "string" || typeof email !== "string" || !(file instanceof Blob)) {
  //   return json({ error: "Invalid form data" }, { status: 400 });
  // }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join("/uploads", `${Date.now()}-${file.name}`);
  await fs.writeFile(`./public${filePath}`, fileBuffer);

  await db.tobaccoForm.create({
    data: {
      customerName,
      shop
    },
  });
  
  return json({ error: "ok" }, { status: 200 });
  
  
}
