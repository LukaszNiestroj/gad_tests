import { articleTest } from '@_src/fixtures/article.fixture';
import { PageObjectTest } from '@_src/fixtures/page-object.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(PageObjectTest, articleTest);

export { expect } from '@playwright/test';
