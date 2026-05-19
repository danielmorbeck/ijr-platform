import { render, fireEvent } from '@testing-library/react-native';
import { EmptyState } from './empty-state';
import { Default, WithCta } from './empty-state.composition';

it('renders title', () => {
  const { getByText } = render(<Default />);
  expect(getByText('Nenhum artigo publicado')).toBeTruthy();
});

it('renders message and icon when provided', () => {
  const { getByText } = render(
    <EmptyState title="Artigo não encontrado" message="Tente outro link." icon="📭" />
  );
  expect(getByText('Artigo não encontrado')).toBeTruthy();
  expect(getByText('Tente outro link.')).toBeTruthy();
  expect(getByText('📭')).toBeTruthy();
});

it('calls onCtaPress when CTA is pressed', () => {
  const onCtaPress = jest.fn();
  const { getByText } = render(
    <EmptyState title="Vazio" ctaLabel="Recarregar" onCtaPress={onCtaPress} />
  );
  fireEvent.press(getByText('Recarregar'));
  expect(onCtaPress).toHaveBeenCalledTimes(1);
});

it('renders CTA from composition', () => {
  const { getByText } = render(<WithCta />);
  expect(getByText('Ver artigos')).toBeTruthy();
});
