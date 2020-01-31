import { SanityService } from './SanityService';
import { TestService2 } from './TestService2';
import { Service } from './Service';

const services: Record<string, Service> = {
  SanityService: new SanityService(),
  TestService2: new TestService2(),
};

export { services };
