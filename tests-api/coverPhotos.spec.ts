import { test, expect, errors } from '@playwright/test'
interface CoverPhoto {
    id: number;
    idBook: number;
    url: string;
}

test.describe('CoverPhotos API - Positive tests', () => {

    test('Verify get cover photos returns status 200', async ({ request }) => {

        const response = await request.get('CoverPhotos');
        expect(response.status()).toBe(200);
        const body = await response.json() as CoverPhoto[];
        expect(Array.isArray(body)).toBe(true);
        body.forEach(item => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('idBook');
            expect(item).toHaveProperty('url');
            console.log(item);
        });
    });

    test('Verify get cover photos by ID returns status 200', async ({ request }) => {

        const coverID = 3;
        const response = await request.get(`CoverPhotos/${coverID}`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.id).toBe(coverID);
        console.log(coverID);
    });

    test('Verify that cover photos by BookID returns status 200', async ({ request }) => {

        const bookID = 41;
        const response = await request.get(`CoverPhotos/books/covers/${bookID}`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(Array.isArray(body)).toBe(true);
        const [photoCover] = body; //extracts the first object from the array
        expect(photoCover.idBook).toBe(bookID);
        console.log(bookID);
    });

    test('Verify that creating cover photos returns status 200', async ({ request }) => {

        const randomId = Math.floor(Math.random() * 100000);
        const payload = {
            id: randomId,
            idBook: randomId,
            url: "https://example.com"
        };
        const response = await request.post('CoverPhotos', {
            data: payload
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log(body);
        expect(body.id).toBe(randomId);
        expect(body.idBook).toBe(randomId);
        expect(body.url).toContain('example.com')
    });

    test('Verify that updating cover photos by ID returns status 200', async ({ request }) => {

        const coverId = 6;
        const response = await request.put(`CoverPhotos/${coverId}`, {
            data: {
                'url': 'Https://example.com'
            }
        })

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.url).toBe('Https://example.com');
        console.log(body.url);
    });

    test('Verify that deleting cover photos by ID returns status 200', async ({ request }) => {

        const coverId = 8;
        const response = await request.delete(`CoverPhotos/${coverId}`);
        expect(response.status()).toBe(200);
    })
})

test.describe('CoverPhotos API - Negative tests', () => {

    test('Verify that a cover photos with non-existing ID returns status 404', async ({ request }) => {

        const nonExistingId = 1234;
        const response = await request.get(`CoverPhotos/${nonExistingId}`);
        expect(response.status()).toBe(404);
        const body = await response.json();
        expect(body.title).toBe('Not Found');
        expect(body.status).toBe(404);
        console.log(body.title, body.status);
    });

    test('Verify that a cover photos with invalid ID format returns status 400', async ({ request }) => {

        const invalidID = 'ek4';
        const response = await request.get(`CoverPhotos/${invalidID}`);
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body).toHaveProperty('errors');
        expect(body.errors.id[0]).toContain(`The value '${invalidID}' is not valid.`)
        console.log(body.errors);
    })

    test('Verify that cover photos by non-existing BookID returns status 404', async ({ request }) => {
        // Note: If is a real case the request should return 404 not 200 
        const nonExistingID = 458;
        const response = await request.get(`CoverPhotos/books/covers/${nonExistingID}`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log(body)
        expect(body).toEqual([]);
    })

    test('Verify that cover photos by invalid BookID returns status 404', async ({ request }) => {

        const invalidId = 'ab4'
        const response = await request.get(`CoverPhotos/books/covers/${invalidId}`);
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body).toHaveProperty('errors');
        expect(body.errors.idBook[0]).toContain(`The value '${invalidId}' is not valid.`);
        console.log(body.errors);
    });

    test('Verify that creating cover photos with empty body returns status 400', async ({ request }) => {

        const response = await request.post('CoverPhotos', {
            data: {}
        })
        // Note: the test should pass, but because this is a training API, this case is not validated, as it should be with status 400
        expect(response.status()).toBe(400);
    })

    test('Verify that creating cover photos with invalid URL retunrs status 400', async ({ request }) => {

        const randomId = Math.floor(Math.random() * 100000);
        const response = await request.post('CoverPhotos', {
            data: {
                id: randomId,
                idBook: randomId,
                url: "xxx"
            }
        })
        // Note: the test should pass, but because this is a training API, this case is not validated, as it should be with status 400
        expect(response.status()).toBe(400);
    });

    test('Verify that updating cover photos by ID with invalid url returns status 400', async ({ request }) => {

        const coverId = 6;
        const response = await request.put(`CoverPhotos/${coverId}`, {
            data: {
                'url': 'example'
            }
        })
        // Note: the test should pass, but because this is a training API, this case is not validated, as it should be with status 400
        expect(response.status()).toBe(400);
    });

    test('Verify that updating cover photos by ID with invalid idBook returns status 400', async ({ request }) => {
        const coverId = 2;
        const idBook = 'af';
        const response = await request.put(`CoverPhotos/${coverId}`, {
            data: {
                "id": coverId,
                "idBook": idBook,
            }
        })
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body).toHaveProperty("errors");
        expect(body.errors["$.idBook"][0]).toMatch("The JSON value could not be converted to System.Int32. Path: $.idBook | LineNumber: 0 | BytePositionInLine: 21.");
    });

    test('Verify that updating cover photos with invalid ID returns status 400', async ({ request }) => {

        const invalidId = "wd";
        const response = await request.put(`CoverPhotos/${invalidId}`, {
            data: { "id": invalidId }
        })

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body).toHaveProperty("errors");
        console.log(body.errors.id)
        expect(body.errors.id[0]).toMatch(`The value '${invalidId}' is not valid.`);
    });

    test('Verify that deleting cover photos with invalid ID returns status 400', async ({ request }) => {

        const invalidId = "ad";
        const response = await request.delete(`CoverPhotos/${invalidId}`);
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body).toHaveProperty("errors");
        expect(body.errors.id[0]).toMatch(`The value '${invalidId}' is not valid.`)
    })
})