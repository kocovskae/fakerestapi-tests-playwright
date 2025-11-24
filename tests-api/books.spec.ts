import { test, expect, APIRequestContext } from '@playwright/test'

test.describe('Books APi - Positive Tests', () => {

    test('Verify that get all books returns status 200 ', async ({ request }) => {
        const response = await request.get('Books');

        expect(response.status()).toBe(200);
        const body = await response.json();
        console.log(body);
    });

    test('Verify that get book by ID returns status 200', async ({ request }) => {
        const bookID = 5;

        const response = await request.get(`Books/${bookID}`);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.id).toBe(bookID);
        console.log(body);
    })

    test('Verify that creating new book returns status 200', async ({ request }) => {
        const randomId = Math.floor(Math.random() * 100000);

        const response = await request.post('Books', {
            data: {
                "id": randomId,
                "title": `Book${randomId}`,
                "description": "New Book creating",
                "pageCount": 120,
                "excerpt": "New book new book new book",
                "publishDate": "2025-11-24T09:21:07.325Z"
            }
        });

        expect(response.status()).toBe(200);
        const newBook = await response.json();
        expect(newBook.id).toBe(randomId);
        expect(newBook.title).toBe(`Book${randomId}`);
        console.log(newBook);
    })

    test('Verify that the book updated by ID returns status 200', async ({ request }) => {
        const bookID = 101;
        const bookTitle = 'Title update'
        const bookUpdate =
        {
            "id": bookID,
            "title": bookTitle,
            "description": "string",
            "pageCount": 0,
            "excerpt": "string",
            "publishDate": "2025-11-24T09:46:35.281Z"
        };

        const response = await request.put(`Books/${bookID}`, {
            data: bookUpdate
        });
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.id).toBe(bookID);
        console.log(bookID)
        expect(body.title).toBe(bookTitle);
        console.log(bookTitle);
    })

    test('Verify that deleting a book by ID returns status 200', async ({ request }) => {
        const bookID = 5;

        const response = await request.delete(`Books/${bookID}`);
        expect(response.status()).toBe(200);
    });
});

test.describe('Books API - Negative tests', () => {

    test('Verify that a book with non-existing ID returns status 404', async ({ request }) => {
        const nonExistingID = 6874;

        const response = await request.get(`Books/${nonExistingID}`);
        expect(response.status()).toBe(404);
        const body = await response.json();
        expect(body.title).toBe('Not Found');
    });

    test('Verify that a book with invalid ID format returns status 400', async ({ request }) => {
        const invalidID = 'sde';

        const response = await request.get(`Books/${invalidID}`);
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body).toHaveProperty('errors');
        expect(body.errors['id'][0]).toContain(`The value '${invalidID}' is not valid.`);
    });

    test('Verify that a book cannot be created with empty fileds and returns status 400', async ({ request }) => {
        const response = await request.post('Books', {
            data: {
                "title": "",
                "description": "",
                "pageCount": 0,
                "excerpt": "string",
                "publishDate": "2025-11-24T14:25:25.964Z"
            }
        });

        expect(response.status()).toBe(400);
        console.warn('The test failed because this is a training api, and this case is not validated');

    });
})
