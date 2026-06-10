export class SubjectSanitizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SubjectSanitizeError';
  }
}
