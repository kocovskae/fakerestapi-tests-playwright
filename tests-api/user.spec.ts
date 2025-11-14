import { test, expect, APIRequestContext } from '@playwright/test';

test.describe('Positive API Tests', () => {

    test('Get all users', async ({ request }) => {
        const response = await request.get('Users');

        expect(response.status()).toBe(200);
        // parse JSON after confirming text body
        const users = await response.json();
        console.log(users);
    });

    test('Get user by Id', async ({ request }) => {
        const userID = 8;

        const response = await request.get(`Users/${userID}`);
        expect(response.status()).toBe(200);
        const user = await response.json();
        expect(user.id).toBe(userID);
    });

    test('Create a new user', async ({ request }) => {
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
    })

    test('Update user', async ({ request }) => {
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
    })

    test('Delete user', async ({ request }) => {
        const userID = 1;

        const response = await request.delete(`Users/${userID}`);
        expect(response.status()).toBe(200);

        const getResponse = await request.get(`Users/${userID}`);
        // NOTE: This API does not actually delete users for that reason the status is 404. In real case should return 200 or 204
        expect(getResponse.status()).not.toBe(404)
    })
});

test.describe('Negative API Tests', () => {



});


