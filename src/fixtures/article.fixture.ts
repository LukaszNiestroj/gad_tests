import { prepareRandomArticle } from '@_src/factories/article.factory';
import { PageObjectTest } from '@_src/fixtures/page-object.fixture';
import { AddArticleModel } from '@_src/models/article.model';
import { ArticlePage } from '@_src/pages/article.page';

interface ArticleCreationContext {
  articlePage: ArticlePage;
  articleData: AddArticleModel;
}
interface ArticleFixtures {
  createRandomArticle: ArticleCreationContext;
  randomArticle: (
    articleData?: AddArticleModel,
  ) => Promise<ArticleCreationContext>;
}

export const articleTest = PageObjectTest.extend<ArticleFixtures>({
  createRandomArticle: async ({ addArticlesView }, use) => {
    const articleData = prepareRandomArticle();
    const articlePage = await addArticlesView.createArticle(articleData);
    await use({ articlePage, articleData });
  },
  randomArticle: async ({ addArticlesView }, use) => {
    const create = async (
      articleData?: AddArticleModel,
    ): Promise<ArticleCreationContext> => {
      const finalArticleData = articleData ?? prepareRandomArticle();
      const articlePage = await addArticlesView.createArticle(finalArticleData);
      return { articlePage, articleData: finalArticleData };
    };
    await use(create);
  },
});
