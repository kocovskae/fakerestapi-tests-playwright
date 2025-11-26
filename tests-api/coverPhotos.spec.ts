import { test, expect } from '@playwright/test'
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

})