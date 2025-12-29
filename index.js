const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Menus
const menus = {
  100: {
    message: "Welcome to Afro Time\nParty in the Cave by KKM Events\n1. View Packages\n2. Book a Ticket\n3. Event Info\n4. Contact Us",
    label: "Welcome page"
  },
  200: {
    message:
      "Available Packages:\n" +
      "1. Regular - GHS 50 (Entry + 1 drink)\n" +
      "2. VIP Package - GHS 100 (Entry + Champagne)\n" +
      "3. VVIP Package - GHS 200 (Entry + Kayaking + Champagne)\n" +
      "4. Executive - GHS 1000 (Table of 5 + Kayaking + 2 Champagne each)\n" +
      "5. Executive Plus - GHS 1800 (Table of 10 + Champagne + All adventurous activities)\n" +
      "6. Executive Deluxe - GHS 2000 (Table of 5 + Kayaking + 2 Champagne + Canopy Private Room)\n" +
      "0. Back",
    label: "Packages"
  },
  300: {
    message:
      "Select Ticket Type:\n" +
      "1. Regular - GHS 50\n" +
      "2. VIP Package - GHS 100\n" +
      "3. VVIP Package - GHS 200\n" +
      "4. Executive - GHS 1000\n" +
      "5. Executive Plus - GHS 1800\n" +
      "6. Executive Deluxe - GHS 2000\n" +
      "0. Back",
    label: "Booking"
  },
  400: {
    message: "Event: Party in the Cave\nDate: Sat, Jan 3, 2026\nTime: 10AM - 8PM\nVenue: Truba - The Enclave, Off Kenyase\n0. Back",
    label: "Event Info"
  },
  500: {
    message: "For reservations or inquiries call:\n0549296106 / 0240040584\n0. Back",
    label: "Contact Us"
  }
};

// Ticket options
const ticketOptions = {
  '1': { name: "Regular", price: 50 },
  '2': { name: "VIP Package", price: 100 },
  '3': { name: "VVIP Package", price: 200 },
  '4': { name: "Executive", price: 1000 },
  '5': { name: "Executive Plus", price: 1800 },
  '6': { name: "Executive Deluxe", price: 2000 }
};

app.post('/ussd', (req, res) => {
  const { SessionId, Message, ClientState, Type, ServiceCode } = req.body || {};
  let response = {};

  console.log("Incoming request:", req.body);

  // Back navigation
  if (Message === '0') {
    const prevState = {
      '200': 100,
      '300': 100,
      '400': 100,
      '500': 100
    }[ClientState];

    if (prevState) {
      response = {
        SessionId,
        Type: "response",
        Message: menus[prevState].message,
        Label: menus[prevState].label,
        ClientState: String(prevState),
        DataType: "input",
        FieldType: "text"
      };
    }
  }

  // Step 1: Initiation
  else if ((Type && Type.toLowerCase() === "initiation") || Message === ServiceCode) {
    response = {
      SessionId,
      Type: "response",
      Message: menus[100].message,
      Label: menus[100].label,
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
      Message: menus[200].message,
      Label: menus[200].label,
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
      Message: menus[300].message,
      Label: menus[300].label,
      ClientState: "300",
      DataType: "input",
      FieldType: "text"
    };
  }

  // Package selection inside View Packages (200) OR Booking (300)
  else if ((ClientState === '200' || ClientState === '300') && ticketOptions[Message]) {
    const selected = ticketOptions[Message];
    response = {
      SessionId,
      Type: "AddToCart",
      Message: `You selected ${selected.name}. Please confirm payment of GHS ${selected.price}.`,
      Item: {
        ItemName: selected.name,
        Qty: 1,
        Price: selected.price
      },
      Label: `${selected.name} Booking`,
      DataType: "display",
      FieldType: "text"
    };
  }

  // Step 4: Event Info
  else if (Message === '3' && ClientState === '100') {
    response = {
      SessionId,
      Type: "response",
      Message: menus[400].message,
      Label: menus[400].label,
      ClientState: "400",
      DataType: "display",
      FieldType: "text"
    };
  }

  // Step 5: Contact Us
  else if (Message === '4' && ClientState === '100') {
    response = {
      SessionId,
      Type: "response",
      Message: menus[500].message,
      Label: menus[500].label,
      ClientState: "500",
      DataType: "display",
      FieldType: "text"
    };
  }

  // Fallback for invalid inputs
  else {
    response = {
      SessionId,
      Type: "response",
      Message: "Invalid option. Please try again.\n0. Back",
      Label: "Error",
      ClientState: ClientState || "100",
      DataType: "input",
      FieldType: "text"
    };
  }

  res.json(response);
});

// Fulfilment endpoint
app.post('/fulfil', (req, res) => {
  console.log("Fulfilment received:", req.body);

  const { SessionId, Item } = req.body;
  const response = {
    SessionId,
    Type: "response",
    Message: `Payment successful! Your ${Item?.ItemName} has been booked.`,
    Label: "Confirmation",
    ClientState: "600",
    DataType: "display",
    FieldType: "text"
  };

  res.json({ status: "success", message: "Fulfilment processed", data: response });
});

app.listen(3001, () => {
  console.log('USSD app running on port 3001');
});