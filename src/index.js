const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const expressJwt = require('express-jwt');

const app= express();

app.use(bodyParser.json());

// PRIVATE and PUBLIC key
const RSA_PRIVATE_KEY = fs.readFileSync('./private/rsa_private.pem');
const RSA_PUBLIC_KEY = fs.readFileSync('./public/rsa_public.pem');

app.route('/api/login').post(loginRoute);

//MENSAJE DE ERROR AL EJECUTAR --supuestamente es algo de dependencia circular
// const checkIfAuthenticated = expressJwt({
// TypeError: expressJwt is not a function
// const checkIfAuthenticated = expressJwt({
//     secret: RSA_PUBLIC_KEY
// }); 

function checkIfAuthenticated(){
    expressJwt({secret: RSA_PUBLIC_KEY});
}

app.route('/api/lessons').get(checkIfAuthenticated);

function loginRoute(req, res) {

    const email = req.body.email,
          password = req.body.password;

    console.log(email, password)

    //if (validateEmailAndPassword()) {
    if (email === "example@example.com") {
       //const userId = findUserIdForEmail(email);

        const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
                algorithm: 'RS256',
                expiresIn: 120,
                //subject: userId
            })
            // en el ejemplo aparece con cookies, pero José nos dijo que lo ibamos a guardar en el local storage
            //localStorage.setItem('idToken', jwtBearerToken);
            
            // si se guarda en el local storage como dijo José, es necesario mandarle el token de regreso al usuario?
            // o mandamos el res.status(200).json() vacío?
            return res.status(200).json({
                idToken: jwtBearerToken, 
                expiresIn: jwtBearerToken.expiresIn
              });
    }
    else {
        res.sendStatus(401); 
    }
}

module.exports = {
    loginRoute,
    checkIfAuthenticated
}


app.listen(3001, () => {
    console.log(`listening on port 3001`);
  });