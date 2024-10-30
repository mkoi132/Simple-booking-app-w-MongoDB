import "./loadEnvironment.mjs";
import db from "./dbconnect.js";
import express from "express";

import cors from "cors";


const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//defalut return
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
app.get('/', (req, res) => {
  res.send('Hi foo');
});
//get 200 listings for initial load
app.get('/listings', async (req, res) => {
  try {
    const listingsAndReviews = db.collection("listingsAndReviews")
    const query = {}
    const listings = await listingsAndReviews.find(query).limit(200).toArray();
    res.status(200).json(listings);

  } catch(error) {
    res.status(500).json({message: error.message});  
  }
});
// get listings by query (search from front end)
app.get('/listings/find', async (req, res) => {
  try {
    const listingsAndReviews = db.collection("listingsAndReviews");
    // Get query params of 3 fields
    const { Bedrooms, PropertyType, Location } = req.query;

    // Convert bedrooms to a number
    let bedroomsNumber = parseInt(Bedrooms, 10);
    if (isNaN(bedroomsNumber)) {
      bedroomsNumber = 0;
    }
    // market is compulsory, no by pass front-end
    if (!Location) {
      res.status(400).json({ message: "Location is required" });
      return;
    }
    // Construct query object
    const query = { "address.market": Location };
    if (Bedrooms) query.bedrooms = bedroomsNumber;
    if (PropertyType) query.property_type = PropertyType;
    // console.log(req.query);
    const listings = await listingsAndReviews.find(query).toArray();
    res.status(200).json(listings);
  } catch(error) { 
    res.status(500).json({message: error.message});  
  }
});
// get all bedroom options
app.get('/listings/filter/bedroom', async (req, res) => {
  try {
    const listingsAndReviews = db.collection("listingsAndReviews");
    const options = await listingsAndReviews.distinct("bedrooms");
    res.status(200).json(options);
  } catch(error) {
    res.status(500).json({message: error.message});  
  }
});
// get all property_type options
app.get('/listings/filter/property_type', async (req, res) => {
  try {
    const listingsAndReviews = db.collection("listingsAndReviews");
    const options = await listingsAndReviews.distinct("property_type");
    res.status(200).json(options);
  } catch(error) {
    res.status(500).json({message: error.message});  
  }
});


// Posting a new booking for a specific listing
app.post('/listings/book/:_id/', async (req, res) => {
  // console.log(req.body);
  try {
    const bookings = db.collection("bookingList");

    // Extract the listing ID from the request parameters
    const listing_id = req.params._id;

    // Extract data from request body
    const {
      dateRange: { from, to },
      name,
      email,
      phone,
      postal_address,
      residential_address,
    } = req.body;
    function generateBookingId() {
      const randomId = Math.floor(Math.random() * 1000); // Generate a random number between 0 and 999999
      return randomId.toString(); // Convert to string if needed
    }
    // Create booking object
    const booking = {
      booking_id: generateBookingId(), // Implement this function to generate a unique booking ID
      arrival_date: new Date(from),
      departure_date: new Date(to),
      client: {
        name: name,
        email_address: email,
        daytime_phone: phone,
        mobile_phone: phone,
        postal_address: postal_address,
        home_address: residential_address,
      },
      listing_id: listing_id,
    };

    // Insert the booking into the database
     await bookings.insertOne(booking);
    // Return the booking id finding back from the server
    const booking_idfetched = await bookings.findOne({
      booking_id: booking.booking_id,
    });
    res.status(201).json({
      message: "Booking created successfully",
      booking_id: booking_idfetched.booking_id, // Return booking_id
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});
