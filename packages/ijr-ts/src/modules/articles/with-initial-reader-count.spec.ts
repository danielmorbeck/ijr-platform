import { withInitialReaderCount } from './with-initial-reader-count';

async function collect<T>(iterable: AsyncIterableIterator<T>): Promise<T[]> {
  const values: T[] = [];
  for await (const value of iterable) {
    values.push(value);
  }
  return values;
}

describe('withInitialReaderCount', () => {
  it('yields current count first, then source events', async () => {
    async function* source() {
      yield { articleReaderCount: 2, articleId: 'a1' };
    }

    const iterator = withInitialReaderCount(
      'a1',
      () => 1,
      source() as AsyncIterableIterator<{
        articleReaderCount: number;
        articleId: string;
      }>,
    );

    const values = await collect(iterator);

    expect(values).toEqual([
      { articleReaderCount: 1, articleId: 'a1' },
      { articleReaderCount: 2, articleId: 'a1' },
    ]);
  });
});
