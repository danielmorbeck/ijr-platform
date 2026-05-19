import { useMutation, useSubscription } from '@apollo/client/react';
import { useEffect, useRef } from 'react';

import {
  ARTICLE_READER_COUNT,
  JOIN_ARTICLE_SESSION,
  LEAVE_ARTICLE_SESSION,
} from '@/src/graphql/reader-session';

export function useArticleReaderSession(articleId: string | undefined) {
  const sessionIdRef = useRef<string | null>(null);

  const [joinSession, { loading: joining, error: joinError }] = useMutation<{
    joinArticleSession: string;
  }>(JOIN_ARTICLE_SESSION);

  const [leaveSession] = useMutation<{
    leaveArticleSession: boolean;
  }>(LEAVE_ARTICLE_SESSION);

  const { data, loading: subscriptionLoading, error: subscriptionError } =
    useSubscription<{
      articleReaderCount: number;
    }>(ARTICLE_READER_COUNT, {
      variables: { articleId: articleId ?? '' },
      skip: !articleId,
    });

  useEffect(() => {
    if (!articleId || subscriptionLoading) {
      return;
    }

    let cancelled = false;

    void joinSession({ variables: { articleId } }).then((result) => {
      if (cancelled) {
        const sessionId = result.data?.joinArticleSession;
        if (sessionId) {
          void leaveSession({ variables: { articleId, sessionId } });
        }
        return;
      }
      sessionIdRef.current = result.data?.joinArticleSession ?? null;
    });

    return () => {
      cancelled = true;
      const sessionId = sessionIdRef.current;
      sessionIdRef.current = null;
      if (sessionId) {
        void leaveSession({ variables: { articleId, sessionId } });
      }
    };
  }, [articleId, subscriptionLoading, joinSession, leaveSession]);

  const error = joinError ?? subscriptionError;

  return {
    readerCount: data?.articleReaderCount,
    joining,
    error,
  };
}
