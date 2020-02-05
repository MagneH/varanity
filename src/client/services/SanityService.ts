import Sanity, { InitializedSanityClient, SanityConfigurator } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

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

const builder = imageUrlBuilder({
  projectId: PROJECT_ID,
  dataset: DATASET,
});

const urlFor = (source: string) => {
  return builder.image(source);
};

export { ClientSanityClient, PROJECT_ID, DATASET, urlFor };
