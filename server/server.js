require('dotenv').config();

const express = require('express')
    , session = require('express-session')
    , bodyParser = require('body-parser')
    , cors = require('cors')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , massive = require('massive')
    , dateFormat = require('dateformat')
    , nodemailer = require('nodemailer')
    , utils = require('../utils/utils');

const app = express();
const PORT = process.env.SERVER_PORT || 3003;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

app.use(bodyParser.json());
app.use(cors());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/../build'));

passport.use(new Auth0Strategy({
  domain: process.env.AUTH_DOMAIN,
  clientID: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  callbackURL: process.env.AUTH_CALLBACK,
  scope: 'openid profile'
}, function(accessToken, refreshToken, extraParams, profile, done) {
  const db = app.get('db');

  db.find_user([ profile.user_id ])
  .then(user => {
    if (user[0]) {
      return done(null, { id: user[0].id });
    } else {
      db.create_user([ profile.displayName, profile.picture, profile.user_id ])
      .then(user => {
        return done(null, { id: user[0].id });
      });
    }
  })
}));

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
  successRedirect: process.env.REACT_APP_SUCCESS_REDIRECT,
  failureRedirect: process.env.REACT_APP_FAILURE_REDIRECT
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  app.get('db').find_session_user([user.id])
  .then(user => {
    return done(null, user[0]);
  });
});

app.get('/auth/me', (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('Log In required');
  } else {
    return res.status(200).send(req.user);
  }
});

app.get('/auth/logout', (req, res) => {
  req.logOut();
  return res.redirect(process.env.REACT_APP_REDIRECT);
});

app.post('/api/createItems', (req, res) => {
  if (req.body.userID && req.body.userID <= 7) {
    const db = req.app.get('db');

    let date = dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT"),
        items = utils.createItemsString(req.body.items);

    db.create_items(req.body.userID, req.body.userName, date, items);
  } else {
    res.status(400).send('Nice Try!');
  }
});

app.post('/api/createHours', (req, res) => {
  if (req.body.userID && req.body.userID <= 7) {
    const db = req.app.get('db');

    let date = dateFormat(new Date(), "dddd, mmmm dS, yyyy, h:MM:ss TT"),
        start_time = utils.formatTime(req.body.start_time),
        end_time = utils.formatTime(req.body.end_time),
        total_item_price = utils.getTotalItemPrice(req.body.items),
        total_hours =  utils.getTotalHours(start_time, end_time, req.body.lunch); // Extract amount of hours from times.

    db.create_hours(req.body.userID, req.body.userName, date, req.body.start_time, req.body.end_time, total_hours, total_item_price);
  } else {
    res.status(400).send('Nice Try!');
  }
});

massive(CONNECTION_STRING)
.then(db => {
  app.set('db', db);

  app.listen(PORT, () => {
    console.log('Listening on port ', PORT);

    let currentDate = String(new Date()).split(' ');
    let counter = 0;

    // Check the date every hour.
    setInterval(function() {
      const db = app.get('db');
      let date = String(new Date()).split(' ');

      // Is it a new day?
      if (date[0] !== currentDate[0])
        counter += 1

      // // 2 weeks (14 days) are up.
      if (counter === 14) {
        db.get_all_hours()
        .then((hours) => { // Get all hours, and send email.
          var finalHours = utils.addAllHours(hours),

              transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'cheddify@gmail.com',
                  pass: process.env.PASS
                }
              }),

              mailOptions = {
                from: 'cheddify@gmail.com',
                to: 'kayceeingram33@gmail.com', // Replace with Miranda's Email.
                subject: '🧀 Employee Hours 🧀',
                text: finalHours
              };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        });

        currentDate = String(new Date()).split(' ') // Reset date to two more weeks ahead.
        counter = 0; // Reset counter.
      }
    }, 3600000); // 1 hour.
  });
});