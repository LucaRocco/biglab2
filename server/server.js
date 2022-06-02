const express = require('express');
const morgan = require('morgan');
const { json, download } = require('express/lib/response');
const { param, body, validationResult } = require('express-validator');
const filmDao = require('./film-dao');
const userDao = require('./user-dao');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cors = require('cors');
const dayjs = require('dayjs');

//next()
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});

const app = express();
const port = 3001;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'not authenticated' });
}


app.use(cors(corsOptions));

app.use(session({ secret: "quello che mi pare", resave: false, saveUninitialized: false }))
app.use(express.json());
app.use(morgan('dev'));

app.use(passport.initialize());
app.use(passport.session());

app.get('/api/films', isLoggedIn, (req, res) => {
    filmDao.getAllOrFiltered(req.query.filter, req.user.id)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
});

app.get('/api/films/:filmId', isLoggedIn, [
    param('filmId')
        .isNumeric().withMessage('filmId must be a number')
        .custom(value => value >= 0).withMessage('FilmId must be greater than 0')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    filmDao.getOneById(req.params.filmId)
        .then(result => res.status(result.status).json(result.responseBody))
        .catch(err => res.status(err.status || 500).json({ message: err.message }));
});

app.post('/api/films', isLoggedIn, [
    body('title')
        .exists().withMessage('Title must be present')
        .isString().withMessage('Title must be a string').trim()
        .notEmpty().withMessage('Title must not be empty'),
    body('watchedDate').optional().isDate({ format: 'YYYY-MM-DD' })
        .isBefore(dayjs().format('YYYY-MM-DD')).withMessage('No time travel allowed here!'),
    body('rating').optional().isInt({ min: 0, max: 5 }).withMessage('Must be between 0 and 5'),
    body('favorite').isBoolean()
], (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    filmDao.addFilm(req.body).then(() => {
        res.sendStatus(201);
    }).catch(err => {
        res.status(500).json({ error: 'Error during film saving', details: err });
    });
});

app.put('/api/films/:filmId', isLoggedIn, [
    body('title')
        .exists().withMessage('Title must be present')
        .isString().withMessage('Title must be a string').trim()
        .notEmpty().withMessage('Title must not be empty'),
    body('watchedDate')
        .optional()
        .isDate({ format: 'YYYY-MM-DD' })
        .isBefore(dayjs().format('YYYY-MM-DD')),
    body('rating')
        .optional()
        .isInt({ min: 0, max: 5 }),
    body('favorite')
        .isBoolean()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    filmDao.updateFilm(req.params.filmId, req.body).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        res.status(500).json({ error: `DB Error on film ${req.params.filmId}`, details: err });
    });
});

app.delete('/api/films/:filmId', isLoggedIn, [
    param('filmId')
        .isNumeric().withMessage('filmId must be a number')
        .custom(value => value >= 0).withMessage('FilmId must be greater than 0')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    filmDao.deleteFilm(req.params.filmId)
        .then(() => {
            res.sendStatus(204);
        }).catch(err => {
            res.status(500).json(err);
        });
});

//USER API
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json(info);
        req.login(user, (err) => {
            if (err) return next(err);
            return res.json(req.user);
        });
    })(req, res, next);
});

app.delete('/api/sessions/current', (req, res) => {
    req.logOut(() => { res.end(); })
});

app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ error: "Unauthenticated user!" })
    }
}
);



app.listen(port, () => {
    console.log(`FilmLibrary app listening on port ${port}`);
});
