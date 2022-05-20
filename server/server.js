const express = require('express');
const { json } = require('express/lib/response');
const { param, body, validationResult } = require('express-validator');
const dayjs = require('dayjs');
const dao = require('./dao');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.get('/api/films', (req, res) => {
    dao.getAllOrFiltered(req.query.filter)
        .then(rows => res.json(rows))
        .catch(err => res.status(500).json(err));
});

app.get('/api/films/:filmId', [
    param('filmId')
        .isNumeric().withMessage('filmId must be a number')
        .custom(value => value >= 0).withMessage('FilmId must be greater than 0')
], (req, res) => {
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    dao.getOneById(req.params.filmId)
        .then(result => res.status(result.status).json(result.responseBody))
        .catch(err => res.status(err.status || 500).json({ message: err.message }));
});

app.post('/api/films', [
    body('title')
        .exists().withMessage('Title must be present')
        .isString().withMessage('Title must be a string').trim()
        .notEmpty().withMessage('Title must not be empty'),
    body('watchedDate').optional().isDate({ format: 'YYYY-MM-DD' })
        .isBefore(dayjs().format('YYYY-MM-DD')).withMessage('No time travel allowed here!'),
    body('rating').optional().isInt({ min: 0, max: 5 }).withMessage('Must be between 0 and 5'),
    body('favorite').isBoolean() 
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    dao.addFilm(req.body).then(() => {
        res.sendStatus(201);
    }).catch(err => {
        res.status(500).json({ error: 'Error during film saving', details: err });
    });
});

app.put('/api/films/:filmId', [
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
    dao.updateFilm(req.params.filmId, req.body).then(() => {
        res.sendStatus(200);
    }).catch(err => {
        res.status(500).json({ error: 'DB Error', details: err });
    });
});

app.delete('/api/films/:filmId', [
    param('filmId')
        .isNumeric().withMessage('filmId must be a number')
        .custom(value => value >= 0).withMessage('FilmId must be greater than 0')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    dao.deleteFilm(req.params.filmId)
        .then(() => {
            res.sendStatus(204);
        }).catch(err => {
            res.status(500).json(err);
        });
});


app.listen(port, () => {
    console.log(`FilmLibrary app listening on port ${port}`);
});