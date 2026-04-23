import { render, renderHook, screen } from '@testing-library/react';
import { LocaleProvider, useLocaleContext } from './LocaleProvider';
import { getMessages } from '@/lib/i18n';

function Consumer() {
  const { locale, messages } = useLocaleContext();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="skip">{messages.common.skipToContent}</span>
    </div>
  );
}

function OtherConsumer() {
  const { locale } = useLocaleContext();
  return <span data-testid="other-locale">{locale}</span>;
}

describe('LocaleProvider', () => {
  it('exposes locale and messages to consumers (en)', () => {
    const messages = getMessages('en');
    render(
      <LocaleProvider locale="en" messages={messages}>
        <Consumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    expect(screen.getByTestId('skip')).toHaveTextContent('Skip to content');
  });

  it('exposes locale and messages to consumers (ja)', () => {
    const messages = getMessages('ja');
    render(
      <LocaleProvider locale="ja" messages={messages}>
        <Consumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('locale')).toHaveTextContent('ja');
    expect(screen.getByTestId('skip')).toHaveTextContent('メインコンテンツへスキップ');
  });

  it('shares the same context across sibling consumers under one provider', () => {
    const messages = getMessages('en');
    render(
      <LocaleProvider locale="en" messages={messages}>
        <Consumer />
        <OtherConsumer />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    expect(screen.getByTestId('other-locale')).toHaveTextContent('en');
  });

  it('useLocaleContext throws when used outside a provider', () => {
    // React logs uncaught render errors to console.error; suppress the noise
    // for this intentional negative-path test.
    const original = console.error;
    console.error = () => {};
    try {
      expect(() => renderHook(() => useLocaleContext())).toThrow(
        /must be used within LocaleProvider/i,
      );
    } finally {
      console.error = original;
    }
  });
});
