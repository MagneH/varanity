class Service {
  public initialized = false;
  public init(): Service {
    this.initialized = true;
    return this;
  }
}

export { Service };
