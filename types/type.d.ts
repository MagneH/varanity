// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SanityDocument } from '@sanity/client';

declare global {
  namespace Express {
    interface Application {
      services: any;
      initialTemplateData: Record<SanityDocument['slug']['current'], SanityDocument>;
      initialDocumentData: Record<SanityDocument['slug']['current'], SanityDocument>;
      initialAuthorData: Record<SanityDocument['_id'], SanityDocument>;
      routeSpecificData: any;
      isPreview?: boolean;
    }
    interface Request {
      app: Express.Application;
      params:
        | Partial<{
            documentSlug: string;
          }>
        | string[];
    }
  }
}
