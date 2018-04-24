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
		async (accessToken, refreshToken, profile, done) => {
			// console.log(accessToken, profile);
			const existingUser = await User.findOne({ googleId: profile.id });
			if (existingUser) {
				//we already have a record
				done(null, existingUser);
			} else {
				const user = await new User({ googleId: profile.id }) // creating model instance
					.save() // saving to db
				done(null, user);
			}

		}
	)
);