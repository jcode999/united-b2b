import React, { useState } from 'react';

const CreateCustomer = () => {
  const [customer, setCustomer] = useState({
    first_name: 'Steve',
    last_name: 'Lastnameson',
    email: 'steve.lastnameson@example.com',
    phone: '+15142546011',
    verified_email: true,
    addresses: [
      {
        address1: '123 Oak St',
        city: 'Ottawa',
        province: 'ON',
        phone: '555-1212',
        zip: '123 ABC',
        last_name: 'Lastnameson',
        first_name: 'Mother',
        country: 'CA',
      },
    ],
    password: 'newpass',
    password_confirmation: 'newpass',
    send_email_welcome: false,
  });

  const createCustomer = async () => {
    try {
      const response = await fetch('https://your-development-store.myshopify.com/admin/api/2024-07/customers.json', {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_API_SECRET,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customer }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Customer created successfully:', data);
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };

  return (
    <div>
      <button onClick={createCustomer}>Create Customer</button>
    </div>
  );
};

export default CreateCustomer;
