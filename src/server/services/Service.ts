class Service {
  public initialized = false;
  public init() {
    this.initialized = true;
    return this;
  }
}

export { Service };
