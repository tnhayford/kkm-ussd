const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/ussd', (req, res) => {
  const { SessionId, Message, ClientState } = req.body;
  let response = {};

  // Step 1: Initiation
  if (Message === '*713#' || Message === '' || ClientState === '') {
    response = {
      SessionId,
      Type: "response",
      Message: "Welcome to Afro Time\nParty in the Cave by KKM Events\n1. View Packages\n2. Book a Ticket\n3. Event Info\n4. Contact Us",
      Label: "Welcome page",
      ClientState: "100",
      DataType: "input",
      FieldType: "text"
    };
  }

  // Step 2: View Packages
  else if (Message === '1' && ClientState === '100') {
    response = {
      SessionId,
      Type: "response",
      Message: "Available Packages:\n1. Regular - GHS 50\n2. VIP - GHS 100",
      Label: "Packages",
      ClientState: "200",
      DataType: "input",
      FieldType: "text"
    };
  }

  // Step 3: Book a Ticket
  else if (Message === '2' && ClientState === '100') {
    response = {
      SessionId,
      Type: "response",
      Message: "Select Ticket Type:\n1. Regular - GHS 50\n2. VIP - GHS 100",
      Label: "Booking",
      ClientState: "300",
      DataType: "input",
      FieldType: "text"
    };
  }

  // Step 4: User chooses Regular
  else if (Message === '1' && ClientState === '300') {
    response = {
      SessionId,
      Type: "AddToCart",
      Message: "Your Regular ticket request has been submitted. Expect a payment prompt soon.",
      Item: {
        ItemName: "Regular Ticket",
        Qty: 1,
        Price: 50
      },
      Label: "Regular Booking",
      DataType: "display",
      FieldType: "text"
    };
  }

  // Step 5: User chooses VIP
  else if (Message === '2' && ClientState === '300') {
    response = {
      SessionId,
      Type: "AddToCart",
      Message: "Your VIP ticket request has been submitted. Expect a payment prompt soon.",
      Item: {
        ItemName: "VIP Ticket",
        Qty: 1,
        Price: 100
      },
      Label: "VIP Booking",
      DataType: "display",
      FieldType: "text"
    };
  }

  // Step 6: Event Info
  else if (Message === '3' && ClientState === '100') {
    response = {
      SessionId,
      Type: "response",
      Message: "Event: Party in the Cave\nDate: Dec 31, 2025\nLocation: Obuasi",
      Label: "Event Info",
      ClientState: "400",
      DataType: "display",
      FieldType: "text"
    };
  }

  // Step 7: Contact Us
  else if (Message === '4' && ClientState === '100') {
    response = {
      SessionId,
      Type: "response",
      Message: "For inquiries, call 233-XXX-XXXXXX",
      Label: "Contact Us",
      ClientState: "500",
      DataType: "display",
      FieldType: "text"
    };
  }

  res.json(response);
});

// Fulfilment endpoint
app.post('/fulfil', (req, res) => {
  console.log("Fulfilment received:", req.body);
  res.json({ status: "success", message: "Fulfilment received", data: req.body });
});

app.listen(3001, () => {
  console.log('USSD app running on port 3001');
});
