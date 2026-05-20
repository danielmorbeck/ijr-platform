export interface ArticleReaderCountPayload {
  articleReaderCount: number;
  articleId: string;
}

export function withInitialReaderCount(
  articleId: string,
  getCount: (articleId: string) => number,
  source: AsyncIterableIterator<ArticleReaderCountPayload>,
): AsyncIterableIterator<ArticleReaderCountPayload> {
  const inner = source[Symbol.asyncIterator]();
  let sentInitial = false;

  const iterator: AsyncIterableIterator<ArticleReaderCountPayload> = {
    [Symbol.asyncIterator]() {
      return iterator;
    },
    async next(): Promise<IteratorResult<ArticleReaderCountPayload>> {
      if (!sentInitial) {
        sentInitial = true;
        return {
          value: {
            articleReaderCount: getCount(articleId),
            articleId,
          },
          done: false,
        };
      }
      return inner.next();
    },
    async return(
      value?: unknown,
    ): Promise<IteratorResult<ArticleReaderCountPayload>> {
      if (inner.return) {
        return inner.return(value);
      }
      return { done: true, value: undefined };
    },
    async throw(
      error?: unknown,
    ): Promise<IteratorResult<ArticleReaderCountPayload>> {
      if (inner.throw) {
        return inner.throw(error);
      }
      throw error;
    },
  };

  return iterator;
}
