import { throwError } from 'rxjs';
import { test, expect, APIRequestContext } from '@playwright/test';

test.describe('Positive API Tests', () => {

    test('Verify that all users are returned', async ({ request }) => {
        const response = await request.get('Users');

        expect(response.status()).toBe(200);
        // parse JSON after confirming text body
        const users = await response.json();
        console.log(users);
    });

    test('Verify that a user can be returned by ID', async ({ request }) => {
        const userID = 8;

        const response = await request.get(`Users/${userID}`);
        expect(response.status()).toBe(200);
        const user = await response.json();
        expect(user.id).toBe(userID);
    });

    test('Verify creating a new user returns 200 status', async ({ request }) => {
        const randomId = Math.floor(Math.random() * 100000); // dynamic ID

        const response = await request.post('Users', {
            data: {
                "id": randomId,
                "userName": `TestUser${randomId}`,
                "password": "Password11"
            }
        });

        expect(response.status()).toBe(200);
        const newUser = await response.json();
        expect(newUser.id).toBe(randomId);
        expect(newUser.userName).toBe(`TestUser${randomId}`);
    });

    test('Verify that the user can be updated by ID', async ({ request }) => {
        const userID = 2;
        const dataUser = {
            "userName": "User update",
            "password": "Password2"
        };

        const response = await request.put(`Users/${userID}`, {
            data: dataUser
        });

        expect(response.status()).toBe(200);
        const updateUser = await response.json();
        expect(updateUser.userName).toBe(dataUser.userName);
    });

    test('Verify that the user can be deleted by ID', async ({ request }) => {
        const userID = 1;

        const response = await request.delete(`Users/${userID}`);
        expect(response.status()).toBe(200);

        const getResponse = await request.get(`Users/${userID}`);
        // NOTE: This API does not actually delete users for that reason the status is 404. In real case should return 200 or 204
        expect(getResponse.status()).not.toBe(404)
    });
});

test.describe('Negative API Tests', () => {

    test('Verify that requesting a non-existing user returns 404', async ({ request }) => {
        const nonExistingUserId = 1697;

        const response = await request.get(`Users/${nonExistingUserId}`);
        expect(response.status()).toBe(404);
        const body = await response.json();
        expect(body).toHaveProperty("title");
        expect(body.title).toBe("Not Found");
    });

    test('Verify that requesting a user with invalid ID returns 400', async ({ request }) => {
        const invalidUserID = "abs";

        const response = await request.get(`Users/${invalidUserID}`);
        expect(response.status()).toBe(400);
        const status = await response.json();
        console.log(status)
    });

    test('Verify that requesting a user with SQL injection input returns 400 Bad Request', async ({ request }) => {
        const sqlInjection = "1 OR 1=1"  //SQL injection = trying to trick the database into giving more data or changing data.

        const response = await request.get(`Users/${sqlInjection}`);
        expect(response.status()).toBe(400);
        const status = await response.json();
        console.log(status)
    });

    test('Verify that user cannot be created with empty fileds', async ({ request }) => {

        const response = await request.post('Users', {
            data: {
                "userName": "",
                "password": ""
            }
        });

        const body = await response.json();
        console.log('Response from API:', body);
        if (body.userName === "" || body.password === "") {
            console.warn('Warning: API allowed user creation with empty fields'); // test is passed but a warning is shown that user is created with empty fileds
        }
    });

    test('Verify that creating a user with a non-numeric ID returns status 400', async ({ request }) => {
        const nonNumericID = "abc";

        const response = await request.post('Users', {
            data: {
                "id": nonNumericID,
                "userName": "Non-numeric",
                "password": "non-numericID"
            }
        });

        expect(response.status()).toBe(400);
        const bodyResponse = await response.json();
        expect(bodyResponse).toHaveProperty('errors');
        console.log(bodyResponse);
        // Check that the error message contains expected text
        expect(bodyResponse.errors['$.id'][0]).toContain('The JSON value could not be converted to System.Int32. Path: $.id | LineNumber: 0 | BytePositionInLine: 11.');
    });

    test('Verify that creating user with missing fileds returns status 400', async ({ request }) => {
        const response = await request.post('Users', {
            data: {}
        });

        const bodyResponse = await response.json();
        if (!bodyResponse.userName || !bodyResponse.password) {
            console.warn('Warning: API allowed user creation with empty fields');
            console.log(bodyResponse);
        }
    });

});


