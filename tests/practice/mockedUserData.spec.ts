/* eslint-disable no-console */
import { expect, test } from '@playwright/test';

test.describe('Test User Data', () => {
  test('Check user name visibility', async ({ page }) => {
    // Arrange:
    const userNameTestId = 'user-full-name';
    const userNameLocator = page.getByTestId(userNameTestId);

    await page.route('/api/v1/data/random/simple-user', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      console.log(json);
      await route.fulfill({ json: json });
    });

    // Act:
    await page.goto('/practice/random-simple-user-v1.html');

    // Assert:
    await expect(userNameLocator).toBeVisible();

    const userName = await userNameLocator.innerText();
    console.log(userName);
  });

  test('Check user name', async ({ page }) => {
    // Arrange:
    const userNameTestId = 'user-full-name';
    const userNameLocator = page.getByTestId(userNameTestId);
    const expectedUserName = 'John Doe';

    await page.route('/api/v1/data/random/simple-user', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      console.log(json);
      await route.fulfill({ json: mockedUserData });
    });

    // Act:
    await page.goto('/practice/random-simple-user-v1.html');

    // Assert:
    await expect(userNameLocator).toHaveText(expectedUserName);
  });

  test('Missing birthdate (will fail on a bug!)', async ({ page }) => {
    // Arrange:
    const birthdateTestId = 'user-date-of-birth';
    const birthdateLocator = page.getByTestId(birthdateTestId);
    const expectedBirthdate = '[No Data]';

    await page.route('/api/v1/data/random/simple-user', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      console.log(json);
      json.dateOfBirth = undefined;
      await route.fulfill({ json: json });
    });

    // Act:
    await page.goto('/practice/random-simple-user-v1.html');

    // Assert:
    await expect(birthdateLocator).toHaveText(expectedBirthdate);
  });

  test('birth date 100 years ago (will fail on a bug!)', async ({ page }) => {
    // Arrange:
    const ageTestId = 'user-age';
    const ageLocator = page.getByTestId(ageTestId);
    const expectedAge = '101';
    const bithDate = '1923-04-02T00:00:00.000Z';

    await page.route('/api/v1/data/random/simple-user', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      console.log(json);
      json.dateOfBirth = bithDate;
      await route.fulfill({ json: json });
    });

    // Act:
    await page.goto('/practice/random-simple-user-v1.html');

    // Assert:
    await expect(ageLocator).toHaveText(expectedAge);
  });
});

const mockedUserData = {
  userId: 'U7800',
  username: 'frankgonzalez282',
  firstName: 'John',
  lastName: 'Doe',
  email: 'frankgonzalez282@test2.test.com',
  phone: '+845-666-357-2761',
  dateOfBirth: '1966-04-02T00:00:00.000Z',
  profilePicture: '83d80aca-da5a-4582-88d6-34a42574a9fe.jpg',
  address: {
    street: '203 Hill Street',
    city: 'Zoar',
    postalCode: 79484,
    country: 'UK',
  },
  lastLogin: '2022-05-21T00:00:00.000Z',
  accountCreated: '2019-09-26T00:00:00.000Z',
  status: 1,
};
