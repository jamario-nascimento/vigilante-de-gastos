export function isFirebaseError(err: unknown): err is { code: string; message: string } {
  return !!err && typeof err === 'object' && 'code' in err && typeof (err as any).code === 'string';
}

