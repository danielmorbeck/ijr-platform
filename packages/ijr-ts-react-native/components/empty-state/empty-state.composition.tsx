import { EmptyState } from './empty-state';

export const Default = () => (
  <EmptyState title="Nenhum artigo publicado" />
);

export const WithMessage = () => (
  <EmptyState
    title="Artigo não encontrado"
    message="O link pode estar incorreto ou o conteúdo foi removido."
    icon="📭"
  />
);

export const WithCta = () => (
  <EmptyState
    title="Nenhuma categoria"
    message="Crie uma categoria para organizar seus artigos."
    ctaLabel="Ver artigos"
    onCtaPress={() => {}}
  />
);
