const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users'); // pull out User from model class

passport.serializeUser((user, done) => { // set cookie
	done(null, user.id); // this id is record _id shortcut
});

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then(user => done(null, user))
		.catch(err => console.log('deserialize user: ', err));
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback'
		},
		(accessToken, refreshToken, profile, done) => {
			// console.log(accessToken, profile);
			User.findOne({ googleId: profile.id })
				.then((existingUser) => {
					if (existingUser) {
						//we already have a record
						done(null, existingUser);
					} else {
						new User({ googleId: profile.id }) // creating model instance
							.save() // saving to db
							.then(user => done(null, user)) // finishing process with new instace which should be further use
							.catch(err => console.log('save() new user:', err));
						}
				})
		}
	)
);