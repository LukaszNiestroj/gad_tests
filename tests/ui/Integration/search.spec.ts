import { expect, test } from '@_src/ui/fixtures/merge.fixture';
import { waitForResponse } from '@_src/ui/utils/wait.util';

test.describe('Verify search component for articles', () => {
  test('go button should fetch articles @GAD-R07-01', async ({
    articlesPage,
    page,
  }) => {
    // Arrange
    const expectDefaultArticlesNumber = 6;
    await expect(articlesPage.goSearchButton).toBeInViewport();

    const responsePromise = waitForResponse({ page, url: '/api/articles' });

    // Act
    await articlesPage.goSearchButton.click();
    const response = await responsePromise;
    const body = await response.json();
    // Assert
    expect(response.ok()).toBeTruthy();
    expect(body).toHaveLength(expectDefaultArticlesNumber);
  });
});
