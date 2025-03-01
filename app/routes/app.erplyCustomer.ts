import type { ActionFunction } from "@remix-run/node";
import { authenticateErply } from "../erplyServices/erplyAuthenticate.sever"
import { createErplyCustomer } from "../erplyServices/erplyCustomers.server"

export const action: ActionFunction = async ({ request }) => {
    console.log("api/authenticate......")
    
  try {
    const data = await authenticateErply();
    const sessionKey = data['records'][0]['sessionKey']
    const erplyCustomerRequest = request.json()
    
    const erplyCustomerResponse = await createErplyCustomer(sessionKey,erplyCustomerRequest)
    console.log("response form auth",erplyCustomerResponse)
    return new Response(JSON.stringify(erplyCustomerResponse));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Response("Failed to fetch data", { status: 500 });
  }
};