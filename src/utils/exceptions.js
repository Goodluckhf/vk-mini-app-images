export class FaceNotFound extends Error {
  constructor() {
    super('Face not found');
    this.name = 'FaceNotFound'; //
  }
}

export class LimitError extends Error {
  constructor() {
    super('Limit exceeded');
    this.name = 'LimitError'; //
  }
}

export class UnknownError extends Error {
  constructor() {
    super('Unknown error image processing');
    this.name = 'UnknownError'; //
  }
}
