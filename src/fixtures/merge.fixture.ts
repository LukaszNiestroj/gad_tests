import { PageObjectTest } from '@_src/fixtures/page-object.fixture';
import { mergeTests } from '@playwright/test';

export const test = mergeTests(PageObjectTest);

export { expect } from '@playwright/test';
