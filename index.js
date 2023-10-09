import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
const server = express();
const PORT = 5000
const users = [];

// Video men ne roki hai
// 2:00 authentication ke part
// reason rokne ka yeh tha ke simple node pe kaam kara raha tha express nahe use ki 
// continue hoga in future


// ****************USING MIDDLEWARES*****************
//===============================
// using express.static the public folder is set to be the static folder. 
// it means if the server cannot find the file in views folder, it will look into public folder.
server.use( express.static( path.join( path.resolve(), "public" ) ) );

//==============================
// using express.urlencoded we can get the body of the form which is sent to the url.
server.use( express.urlencoded( { extended: true } ) );

// *********************************


/***********DB CONNECTION **********/
mongoose.connect( "mongodb://127.0.0.1:27017", {
  dbName: "backend"
} )
  .then( () => console.log( 'Database is connected' ) )
  .catch( (e) => console.log('Errors = ',e))
/********************************* */

//================================
// Creating schema to store the form data.
const messageSchema = new mongoose.Schema( {
  name: String,
  email: String
} );

//================================
// Creating variable to use to save the data.
const messageData = mongoose.model( "messages", messageSchema );


//================================
// Creating route to hit to save the data.
server.get( "/add", ( req, res ) => {
  messageData.create( {
    name: "Sheryar",
    email: "sheryar@gmail.com"
  } )
  .then( () => {
    res.render( "success.ejs" , { message : "Successfully Added Data"});
  })
} )

//================================
// Creating route to hit to save the data on to the database which is entered in form fields.
server.post( "/contact", async( req, res ) => {
  
  const { name, email } = req.body;
  
  await messageData.create( { name, email} )
  .then( () => {
    res.render( "success.ejs" , { message : "Successfully Added Data"});
  })
} )

//================================
//It will add the users to the users array and redirect to the success page.
server.post( '/', ( req, res ) => { 
  const { name, email } = req.body;
  users.push( { userName: name, emailAddress: email } );
  res.redirect( "/success" );
} );


//================================
// To show the users which are being added to the users array in JSON format
server.get( "/users", ( req, res ) => {

  // To send JSON object 
  res.json( {users} );
});

//================================
// To get the success page after post method is called in form.
server.get( '/success', ( req, res ) => {
  res.render( 'success.ejs', { message : "Successfully Added Data"} );
} );

//================================
// To get the index page.
server.get( "/", ( req, res ) => {
  //ejs embedded javascript
  res.render( "index.ejs" , { name : "Sheryar"});
});

//Server starting point is to listen it to a defined PORT
server.listen( PORT, () => { 
  console.log('Server is working');
} );