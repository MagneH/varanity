import Sanity, { InitializedSanityClient, SanityConfigurator } from '@sanity/client';

// @ts-ignore
const sanityClientConfigurator: SanityConfigurator['configurator'] = Sanity;

const PROJECT_ID = 'bq0ivwom';
const DATASET = 'production';

const ClientSanityClient: InitializedSanityClient = sanityClientConfigurator({
  projectId: PROJECT_ID,
  dataset: DATASET,
  withCredentials: true,
  useCdn: false, // skip cache layer for faster previews
});

export { ClientSanityClient, PROJECT_ID, DATASET };
