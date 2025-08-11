/* eslint-disable no-console */
import { expect, test } from '@_src/merge.fixture';

test.describe('Verify locator list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/practice/simple-multiple-elements-no-ids.html');
  });

  test('Verify locator list', async ({ page }) => {
    // Arrange
    const expectedNumberOfCheckboxes = 5;
    const checkboxSelector = 'checkbox';
    const expectedMessages = [
      'Checkbox is checked! (Opt 1!)',
      'Checkbox is checked! (Opt 2!)',
      'Checkbox is checked! (Opt 3!)',
      'Checkbox is checked! (Opt 4!)',
      'Checkbox is checked! (Opt 5!)',
    ];

    const checkboxLocator = page.getByRole(checkboxSelector);
    const resultTestIdLocator = page.getByTestId('dti-results');

    await expect(checkboxLocator).toHaveCount(expectedNumberOfCheckboxes);
    // Act
    const numberOfCheckboxes = await checkboxLocator.count();
    for (let i = 0; i < numberOfCheckboxes; i++) {
      await checkboxLocator.nth(i).check();
      console.log('Checkbox clicked:', await resultTestIdLocator.textContent());
      // Assert
      await expect.soft(resultTestIdLocator).toHaveText(expectedMessages[i]);
    }
  });
});
