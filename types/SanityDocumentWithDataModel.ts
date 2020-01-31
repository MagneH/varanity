import { SanityDocument } from '@sanity/client';

export type SanityDocumentWithDataModel = SanityDocument & {
  name: string;
  displayname: string;
  metadescription: string;
};
