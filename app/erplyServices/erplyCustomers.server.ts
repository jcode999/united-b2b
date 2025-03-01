import axios from "axios";
import chalk from 'chalk';
export const createErplyContactPerson = async (sessionKey: string, registrationRequest: any, employerId: number) => {
  const headers = {
    sessionKey: sessionKey,
    clientCode: '544739',
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
  const headers = {
    sessionKey: sessionKey,
    clientCode: '544739',
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
    // console.error('Error creating address:', error);
    throw new Error('Failed to create address');
  }

}

export const createErplyCustomer = async (sessionKey: string, registrationForm: any) => {
  const headers = {
    sessionKey: sessionKey,
    clientCode: '544739',
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
    // console.error('Error creating business:');
    throw new Error('Failed to create business');
  }
};


export const generateErplyCustomerRequest = (registrationForm: any) => {
  return {
    requests: [
      {
        'name': registrationForm['businessName'],
        'customerGroupId': 14,
        "eInvoiceEmail": registrationForm['email'],
        "eInvoicesViaEmailEnabled": true,
        "emailOptOut": true,
        "invoicesViaDocuraEnabled": false,
        "invoicesViaEmailEnabled": true,
        "isStarred": false,
        "mobile": registrationForm['phoneNumber'],
        "paperMailsEnabled": false,
        "paysViaFactoring": true,
        "penaltyForOverdue": 0,
        "phone": registrationForm['phoneNumber'],
        "salesForCashOnly": false,
        "shipGoodsWithWaybills": true,
        "taxExempt": false,
        "typeId": 33,
        "mail": registrationForm["email"],
      }
    ]
  }
}

export const generateErplyIndividualRequest = (employerId: number, registrationForm: any) => {
  return {
    "requests": [
      {
        "customerGroupId": 14,
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
    "customerId": customerId,
    "postCode": registrationRequest['businessZip'],
    "state": registrationRequest['businessState'],
    "street": registrationRequest['businessAddress1'],
    "typeId":1,
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
