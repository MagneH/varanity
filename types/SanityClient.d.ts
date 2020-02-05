declare module '@sanity/client' {
  export interface SanityConfigurator {
    configurator: (config: ClientConfig) => InitializedSanityClient;
  }
  export interface InitializedSanityClient {
    getUrl: (url: string) => string;
    getDocument: (id: string) => SanityDocument;
    request: (options: RequestOptions) => Promise<string>;
    fetch: (query: string, params: { [key: string]: any }) => Promise<SanityDocument>;
    listen: (query: string, params: { [key: string]: any }) => Observable;
    config: () => ClientConfig;
  }

  interface RequestOptions {
    url: string;
    headers: { [key: string]: string };
  }

  interface ClientConfig {
    projectId: string;
    dataset: string;
    token?: string;
    version?: string;
    useCdn?: boolean;
    withCredentials?: boolean;
  }

  interface SanityDocument {
    _id: string;
    _type: string;
    slug: { _type: string; current: string };
    isOnFrontPage?: boolean;
    [key: string]: any;
  }

  interface SanityBlock {
    children: {
      marks: any;
      text: string;
      _key: string;
      _type: string;
    };
    marks: any;
    text: string;
    _key: string;
    _type: string;
  }

  interface SubscriptionObserver<T> {
    closed: boolean;
    next(value: T): void;
    error(errorValue: any): void;
    complete(): void;
  }

  interface Subscription {
    closed: boolean;
    unsubscribe(): void;
  }

  interface Observer<T> {
    start?(subscription: Subscription): any;
    next?(value: T): void;
    error?(errorValue: any): void;
    complete?(): void;
  }

  type Subscriber<T> = (observer: SubscriptionObserver<T>) => void | (() => void) | Subscription;

  interface ListenerMessage {
    documentId: string;
    transition: string;
    result: SanityDocument;
  }

  interface Observable {
    pipe(...ops: any): Observable;
    subscribe(observer: Observer<ListenerMessage>): Subscription;
    subscribe(
      onNext: (value: ListenerMessage) => void,
      onError?: (error: Error) => void,
      onComplete?: () => void,
    ): Subscription;

    map<R>(callback: (value: ListenerMessage) => R): Observable;
    filter(callback: (value: ListenerMessage) => boolean): Observable;
  }
}
