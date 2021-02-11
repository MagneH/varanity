import Sanity, {
  InitializedSanityClient,
  SanityConfigurator,
  SanityDocument,
} from '@sanity/client';
import Boom from '@hapi/boom';
import dotenv from 'dotenv';
import { Service } from './Service';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const sanityClientConfigurator: SanityConfigurator['configurator'] = Sanity;

class SanityService extends Service {
  public ServerPreviewClient: InitializedSanityClient | undefined;
  public ServerClient: InitializedSanityClient | undefined;
  public constructor() {
    super();
    const { PROJECT_ID, DATASET, PREVIEW_TOKEN } = process.env;
    if (PROJECT_ID && DATASET && PREVIEW_TOKEN) {
      try {
        this.ServerPreviewClient = sanityClientConfigurator({
          projectId: PROJECT_ID,
          dataset: DATASET,
          token: PREVIEW_TOKEN,
          useCdn: false,
        });
        this.ServerClient = sanityClientConfigurator({
          projectId: PROJECT_ID,
          dataset: DATASET,
          token: PREVIEW_TOKEN,
          useCdn: false,
        });
        this.initialized = true;
      } catch (err) {
        Boom.boomify(err);
      }
    } else {
      throw new Boom.Boom('Missing parameters in config object');
    }
  }

  public async getDocumentById(id: string, isDraft: string): Promise<SanityDocument[]> {
    if (this.ServerPreviewClient && this.initialized) {
      const query = isDraft === 'true' ? `drafts.${id}` : id;
      return this.ServerPreviewClient.getDocument(query);
    }
    throw new Boom.Boom('Client not initialized');
  }

  public async getCategoriesBySlug(): Promise<SanityDocument[]> {
    if (this.ServerClient && this.initialized) {
      const query = `
        *[_type == "category"]{
          _type, _id, slug, title, parent, mainImage
        }
      `;
      return this.ServerClient.fetch(query, {});
    }
    throw new Boom.Boom('Client not initialized');
  }

  public async getArticleBySlug(slug: string): Promise<SanityDocument[]> {
    if (this.ServerClient && this.initialized) {
      const query = `
        *[slug.current == $slug]{
          _type, authors[], slug, title, categories, mainCategory, mainImage, body, isOnFrontPage, isFeatured, _updatedAt
        }
      `;
      const params = {
        slug,
      };
      return this.ServerClient.fetch(query, params);
    }
    throw new Boom.Boom('Client not initialized');
  }

  public async getArticlesByCategorySlug(slug: string): Promise<SanityDocument[]> {
    if (this.ServerClient && this.initialized) {
      const query = `
        *[references(*[slug.current == $slug]._id)]{
          _type, authors[], slug, title, categories, mainCategory, mainImage, body, isFeatured, isOnFrontPage, _updatedAt
        }
      `;
      const params = {
        slug,
      };
      return this.ServerClient.fetch(query, params);
    }
    throw new Boom.Boom('Client not initialized');
  }

  public async getAllAuthors(): Promise<SanityDocument[]> {
    if (this.ServerClient && this.initialized) {
      const query = `
        *[_type == "author"]{bio, image, name, slug, _id}
      `;
      return this.ServerClient.fetch(query, {});
    }
    throw new Boom.Boom('Client not initialized');
  }

  public async getNewestArticles(): Promise<SanityDocument[]> {
    if (this.ServerClient && this.initialized) {
      const query = `
        *[_type == "article"] | order(_createdAt desc) [0..9] {
          _type, authors[], slug, title, categories, mainCategory, mainImage, body, isFeatured, isOnFrontPage, _updatedAt
        }
      `;
      return this.ServerClient.fetch(query, {});
    }
    throw new Boom.Boom('Client not initialized');
  }

  public async getAllPages(): Promise<SanityDocument[]> {
    if (this.ServerClient && this.initialized) {
      const query = `
        *[_type == "page"]{
          _type, authors[], slug, title, categories, mainImage, body, _updatedAt
        }
      `;
      return this.ServerClient.fetch(query, {});
    }
    throw new Boom.Boom('Client not initialized');
  }

  public async getAllTemplateDocuments(): Promise<SanityDocument[]> {
    if (this.ServerClient && this.initialized) {
      const query = `
        *[_type == "templates"]
      `;

      return this.ServerClient.fetch(query, {});
    }
    throw new Boom.Boom('Client not initialized');
  }
}

export { SanityService };
