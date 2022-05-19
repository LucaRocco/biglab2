# FilmLibrary

## APIs

### __List All/Filtered Films__

URL: `/api/films[?filter=<filter_name>]`

Method: GET

Description: Get all the the films or filtered films

Request body: _None_

Response: `200 OK` or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a film.

    [
        {
            "id": 2,
            "title": "21 Grams",
            "favorite": 1,
            "watchedDate": "2022-03-17",
            "rating": 4,
            "user": 1
        },
        {
            "id": 3,
            "title": "Star Wars",
            "favorite": 0,
            "watchedDate": null,
            "rating": null,
            "user": 1
        }
        ...
    ]

### __Get a Film (By id)__

URL: `/api/film/<id>`

Method: GET

Description: Get the film identified by the id `<id>`.

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (wrong code), `400 filmId not present` or `500 Internal Server Error` (generic error).

Response body: An object, describing a single film.

    {
        "id": 2,
        "title": "21 Grams",
        "favorite": 1,
        "watchedDate": "2022-03-17",
        "rating": 4,
        "user": 1
    }

### __Add a New Film__

URL: `/api/films`

Method: POST

Description: Add a new film to the Film Library.

Request body: An object representing a film without id which is assigned  automatically by the db (Content-Type: `application/json`).

    {
        "title": "21 Grams",
        "favorite": 1,
        "watchedDate": "2022-03-17",
        "rating": 4,
        "user": 1
    }

Response: `201 Created` (success). If the request body is not valid, `422 Unprocessable Entity` (validation error).
Finally `500 Internal Server Error` (generic error).

Response body: _None_

### __Update a Film__

URL: `/api/films/<filmId>`

Method: PUT

Description: Update a film in the Film Library.

Request body: An object representing a film without id (Content-Type: `application/json`).

    {
        "title": "21 Grams",
        "favorite": 1,
        "watchedDate": "2022-03-17",
        "rating": 4,
        "user": 1
    }

Response: `200 Success`. If the request body is not valid, `422 Unprocessable Entity` (validation error).
Finally `500 Internal Server Error` (generic error).

### __Delete an Exam__

URL: `/api/films/<filmId>`

Method: DELETE

Description: Delete an existing (passed) film, identified by its code.

Request body: _None_

Response: `204 No Content` (success) or `500 Internal Server Error` (generic error).

Response body: _None_
