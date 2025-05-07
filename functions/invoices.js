const fs = require('fs');
const path = require('path');

// Helper function to read invoices
const readInvoices = () => {
  try {
    const data = fs.readFileSync('invoices.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write invoices
const writeInvoices = (invoices) => {
  fs.writeFileSync('invoices.json', JSON.stringify(invoices, null, 2));
};

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  let invoices = readInvoices();

  try {
    switch (event.httpMethod) {
      case 'GET':
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(invoices)
        };

      case 'POST':
        const invoice = JSON.parse(event.body);
        invoice.id = Date.now().toString();
        invoices.push(invoice);
        writeInvoices(invoices);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Invoice saved.' })
        };

      case 'DELETE':
        const { id } = JSON.parse(event.body);
        invoices = invoices.filter(invoice => invoice.id !== id);
        writeInvoices(invoices);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Invoice deleted.' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Internal server error', error: error.message })
    };
  }
}; 