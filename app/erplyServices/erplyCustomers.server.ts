import axios from "axios";
import chalk from 'chalk';
export const createErplyContactPerson = async (sessionKey: string, registrationRequest: any, employerId: number) => {
  const headers = {
    sessionKey: sessionKey,
    clientCode: process.env.ERPLY_CLIENTCODE,
    'accept': 'application/json',
    'content-type': 'application/json',
  }
  const data = generateErplyIndividualRequest(employerId, registrationRequest)
  try {
    const response = await axios.post(
      "https://api-crm-us.erply.com/v1/customers/individuals/bulk",
      data,
      {
        headers,
      },
    );
    // console.log("response from erply(createCustomer): ", response)
    return response.data;
  } catch (error: any) {
    // console.error('Error creating contact person:', error);
    throw new Error('Failed to create contact person');
  }
};

export const createErplyAddress = async (sessionKey: string, registrationRequest: any, customerId: number) => {
  console.log("creating address...")
  const headers = {
    sessionKey: sessionKey,
    clientCode: process.env.ERPLY_CLIENTCODE,
    'accept': 'application/json',
    'content-type': 'application/json',
  }
  const data = generateErplyAddressRequest(customerId, registrationRequest)
  try {
    const response = await axios.post(
      "https://api-crm-us.erply.com/v1/addresses",
      data,
      {
        headers,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('Error creating address:', error);
    throw new Error('Failed to create address');
  }

}

// export const setAttributes = async (sessionKey:string,registrationForm:any,customerId:number) => {
//   const headers = {
//     sessionKey: sessionKey,
//     clientCode: process.env.ERPLY_CLIENTCODE,
//     'accept': 'application/json',
//     'content-type': 'application/json',
//   }
//   const requests = [
//     {
//       "entity": "customer",
//       "name": "ein",
//       "record_id": customerId,
//       "type": "text",
//       "value":registrationForm['ein']
//     },
//     {
//       "entity": "customer",
//       "name": "salesAndUseTaxPermitNumber",
//       "record_id": customerId,
//       "type": "text",
//       "value":registrationForm['salesAndUseTaxPermitNumber']
//     },
//     {
//       "entity": "customer",
//       "name": "tobaccoPermitNumber",
//       "record_id": customerId,
//       "type": "text",
//       "value":registrationForm['tobaccoPermitNumber']
//     },


//   ]

// } 
export const createErplyCustomer = async (sessionKey: string, registrationForm: any) => {
  const headers = {
    sessionKey: sessionKey,
    clientCode: process.env.ERPLY_CLIENTCODE,
    'accept': 'application/json',
    'content-type': 'application/json',
  }
  const data = generateErplyCustomerRequest(registrationForm)
  try {
    const response = await axios.post(
      "https://api-crm-us.erply.com/v1/customers/businesses/bulk",
      data,
      {

        headers,
      },
    );
    // console.log("response from erply(createCustomer): ", response)
    return response.data;
  } catch (error: any) {
    console.error('Error creating business:',error);
    throw new Error('Failed to create business');
  }
};


export const generateErplyCustomerRequest = (registrationForm: any) => {
  return {
    requests: [
      {
        'name': registrationForm['businessName'],
        'customerGroupId': Number(process.env.DEFAULT_ERPLY_CUSTOMER_GROUP_ID),
        "eInvoiceEmail": String(registrationForm['email']),
        "eInvoicesViaEmailEnabled": true,
        "emailOptOut": true,
        "invoicesViaDocuraEnabled": false,
        "invoicesViaEmailEnabled": true,
        "isStarred": false,
        "mobile": String(registrationForm['phoneNumber']),
        "paperMailsEnabled": false,
        "paysViaFactoring": true,
        "penaltyForOverdue": 0,
        "phone": String(registrationForm['phoneNumber']),
        "salesForCashOnly": false,
        "shipGoodsWithWaybills": true,
        "taxExempt": false,
        "typeId": Number(process.env.DEFAULT_ERPLY_CUSTOMER_TYPE_ID),
        "mail": registrationForm["email"],
      }
    ]
  }
}

export const generateErplyIndividualRequest = (employerId: number, registrationForm: any) => {
  return {
    "requests": [
      {
        "customerGroupId": Number(process.env.DEFAULT_ERPLY_CUSTOMER_GROUP_ID),
        "employerId": employerId,
        "firstName": registrationForm['firstName'],
        "lastName": registrationForm['lastName'],
      }
    ]
  }

}

export const generateErplyAddressRequest = (customerId: number, registrationRequest: any) => {
  return {
    "address2": registrationRequest['businessAddress2'],
    "city": registrationRequest['businessCity'],
    "country": registrationRequest['businessCountry'],
    "customerId": Number(customerId),
    "postCode": String(registrationRequest['businessZip']),
    "state": registrationRequest['businessState'],
    "street": registrationRequest['businessAddress1'],
    "typeId":Number(process.env.DEFAULT_ERPLY_ADDRESS_TYPE_ID),
    // "typeId": 0,

  }
}


export const createErplyCustomerWrapper = async (sessionkey: string, registrationRequest: any) => {
  const errors = []
  let customerId = null;
  let businessResponse = null;
  let contactResponse = null;
  let addressResponse = null;
  try {
    businessResponse = await createErplyCustomer(sessionkey, registrationRequest)
    console.log("business customer: ",businessResponse)
    customerId = businessResponse['results'][0]['resourceID']
    console.log(chalk.green("business created successfully"))
    console.log("customerId: ", businessResponse['results'][0]['resourceID'])
  }
  catch (error) {
    errors.push({
      'resource': 'business'
    })
    console.log(chalk.red("[erply] could not create business customer"))
    /* do not proceed if failed to create a business account */
    return {
      'status': 'ERROR',
      'errors': errors
    }
  }
  try {
    contactResponse = await createErplyContactPerson(sessionkey, registrationRequest, customerId)
    console.log(chalk.green("contact created successfully"))
  }
  catch (error) {
    errors.push({
      'resource': 'individual'
    })
    console.log(chalk.red("[erply] could not create individual customer"))
  }
  try {
    addressResponse = await createErplyAddress(sessionkey, registrationRequest, Number(customerId))
    console.log(chalk.green("created address successfully"))

  }
  catch (error) {
    errors.push({
      'resource': 'address'
    })
    console.log(chalk.red("[erply] could not create address"))
  }

  return {
    'businessResponse': businessResponse,
    'contactResponse': contactResponse,
    'addressResponse': addressResponse,
    'errors':errors,
  }
}

export const getBusinessByName = async (businessName:String,sessionKey:string) =>{
  try{
    const response = await axios.get("https://api-crm-us.erply.com/v1/customers/businesses",{
      params:{
        'name':businessName,
      },
      headers : {
        sessionKey: sessionKey,
        clientCode: process.env.ERPLY_CLIENTCODE,
        'accept': 'application/json',
        'content-type': 'application/json',
      }
    })
    // console.log(response.data)
    return response.data
  }
  catch(error){
    console.log("error fetching business by name")
    console.log(error)
    return null
  }
}

export const buildErplyCustomerAccountUrl = (customerId:String) =>{
  const clientCode = process.env.ERPLY_CLIENTCODE
  return `https://us.erply.com/${clientCode}/?lang=eng&section=orgperC&edit=${String(customerId)}`
}