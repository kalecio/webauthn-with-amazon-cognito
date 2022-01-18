// init project
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const authn = require('./libs/authn');
const helmet = require('helmet');
const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net/gh/herrjemand/Base64URL-ArrayBuffer@latest/lib/base64url-arraybuffer.js", "https://code.jquery.com/jquery-3.6.0.min.js", "https://code.jquery.com/jquery-1.12.4.js", "https://code.jquery.com/ui/1.12.1/jquery-ui.js"],
            styleSrc: ["'self'", "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css", "https://www.w3schools.com/w3css/4/w3.css"],
            connectSrc: ["'self'", "https://cognito-idp.sa-east-1.amazonaws.com/"]
        }
    },
  })
);


app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.set('views', './views');
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  if (req.get('x-forwarded-proto') &&
     (req.get('x-forwarded-proto')).split(',')[0] !== 'https') {
    return res.redirect(301, `https://${req.get('host')}`);
  }
  req.schema = 'https';
  next();
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (req, res) => {
  res.render('webauthn.html');
});

app.get('/webauthn', (req, res) => {
  res.render('webauthn.html');
});

app.use('/authn', authn);

// listen for req :)
const port = 8080;
const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
