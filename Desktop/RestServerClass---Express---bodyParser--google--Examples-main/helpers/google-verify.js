const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify ( googleToken = '' ) {

  const ticket = await client.verifyIdToken({
      idToken: googleToken,
      requiredAudience: process.env.GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  //Aqui viene la información del usuario, desesctrucutramos sólo lo que necesitamos
  const { name, picture, email  } = ticket.getPayload();
  

  return {
    nombre: name,
    img: picture,
    correo: email
  }
  
}

module.exports = {
    googleVerify
}
