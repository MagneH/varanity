// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SanityDocument } from '@sanity/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SanityService } from '../src/server/services/SanityService';

declare global {
  namespace Express {
    interface Application {
      services: { SanityService: SanityService };
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
