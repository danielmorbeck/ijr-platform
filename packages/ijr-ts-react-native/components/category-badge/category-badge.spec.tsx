import { render } from '@testing-library/react-native';
import { CategoryBadge } from './category-badge';
import { Default } from './category-badge.composition';

it('renders category name', () => {
  const { getByText } = render(<Default />);
  expect(getByText('Tecnologia')).toBeTruthy();
});

it('accepts custom name and color', () => {
  const { getByText } = render(<CategoryBadge name="Negócios" color="#e67e22" />);
  expect(getByText('Negócios')).toBeTruthy();
});
