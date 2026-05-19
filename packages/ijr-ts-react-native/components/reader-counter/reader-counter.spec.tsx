import { render } from '@testing-library/react-native';
import { ReaderCounter } from './reader-counter';
import { Default, Loading, SingleReader } from './reader-counter.composition';

it('shows plural reader count', () => {
  const { getByText } = render(<Default />);
  expect(getByText(/3 pessoas lendo agora/)).toBeTruthy();
});

it('shows singular reader count', () => {
  const { getByText } = render(<SingleReader />);
  expect(getByText(/1 pessoa lendo agora/)).toBeTruthy();
});

it('shows loading placeholder', () => {
  const { getByText } = render(<Loading />);
  expect(getByText(/…/)).toBeTruthy();
});

it('shows zero readers', () => {
  const { getByText } = render(<ReaderCounter count={0} />);
  expect(getByText(/0 pessoas lendo agora/)).toBeTruthy();
});
