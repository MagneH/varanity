import Sanity, { InitializedSanityClient, SanityConfigurator } from '@sanity/client';
import Boom from '@hapi/boom';
import dotenv from 'dotenv';
import { Service } from './Service';

dotenv.config();

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
          useCdn: true,
        });
        this.initialized = true;
      } catch (err) {
        Boom.boomify(err);
      }
    } else {
      throw new Boom.Boom('Missing parameters in config object');
    }
  }

  public async getDocumentById(id: string, isDraft: string) {
    if (this.ServerPreviewClient && this.initialized) {
      const query = isDraft === 'true' ? `drafts.${id}` : id;
      return this.ServerPreviewClient.getDocument(query);
    }
    throw new Boom.Boom('Client not initialized');
  }

  public async getDocumentBySlug(slug: string) {
    if (this.ServerClient && this.initialized) {
      const query = `
        *[slug.current == $slug]
      `;
      const params = {
        slug,
      };
      return this.ServerClient.fetch(query, params);
    }
    throw new Boom.Boom('Client not initialized');
  }

  public async getAllPages() {
    if (this.ServerClient && this.initialized) {
      const query = `
        *[_type == "page"]
      `;
      const params = {};
      return this.ServerClient.fetch(query, params);
    }
    throw new Boom.Boom('Client not initialized');
  }

  public async getAllTemplateDocuments() {
    if (this.ServerClient && this.initialized) {
      const query = `
        *[_type == "templates"]
      `;
      const params = {};

      return this.ServerClient.fetch(query, params);
    }
    throw new Boom.Boom('Client not initialized');
  }
}

export { SanityService };
