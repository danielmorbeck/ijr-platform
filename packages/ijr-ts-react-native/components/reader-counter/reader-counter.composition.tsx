import { ReaderCounter } from './reader-counter';

export const Default = () => <ReaderCounter count={3} />;

export const SingleReader = () => <ReaderCounter count={1} />;

export const Loading = () => <ReaderCounter count={null} loading />;

export const ZeroReaders = () => <ReaderCounter count={0} />;
