import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests-api',

    use: {
        baseURL: 'https://fakerestapi.azurewebsites.net/api/v1/',

    },

    reporter: [['html']],
});