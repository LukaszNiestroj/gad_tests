import { expect, test } from '@_src/ui/fixtures/merge.fixture';

test.describe('Verify locator list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('practice/simple-reservation-v1.html');
  });
  test('Making a reservation', async ({ page }) => {
    // Arrange
    const parentRow = 'row';
    const siblingText = 'Food';
    const siblingDateText = '23.10.2024';
    const expectedMessage =
      'Reservation for 23.10.2024 with features: Food for total price: 150$';

    const rowCheckbox = page
      .getByRole(parentRow)
      .filter({ has: page.getByText(siblingText) })
      .getByRole('checkbox');
    const elementRole = page
      .getByRole(parentRow)
      .filter({ has: page.getByText(siblingDateText) })
      .getByRole('button', { name: 'Reserve' });
    const checkoutButton = page.getByRole('button', { name: 'Checkout' });
    const resultElement = page.getByTestId('dti-results-container');

    // Act
    await rowCheckbox.check();
    await elementRole.click();
    await checkoutButton.click();

    // Assert
    await expect(resultElement).toHaveText(expectedMessage);
  });
});
