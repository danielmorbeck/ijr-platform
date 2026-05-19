import { render, fireEvent } from '@testing-library/react-native';
import { ArticleCard } from './article-card';
import { Default, WithCategory } from './article-card.composition';

it('renders title and meta', () => {
  const { getByText } = render(<Default />);
  expect(getByText('Como estruturar um monorepo com pnpm')).toBeTruthy();
  expect(getByText(/Maria Silva/)).toBeTruthy();
});

it('renders category badge when provided', () => {
  const { getByText } = render(<WithCategory />);
  expect(getByText('Tecnologia')).toBeTruthy();
});

it('calls onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <ArticleCard
      title="Test"
      authorName="Author"
      publishedAt="2026-05-19"
      onPress={onPress}
    />
  );
  fireEvent.press(getByText('Test'));
  expect(onPress).toHaveBeenCalledTimes(1);
});
