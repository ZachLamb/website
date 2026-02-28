import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { getMessages } from '@/lib/i18n';

const defaultMessages = getMessages('en');

function AllThemesProvider({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider locale="en" messages={defaultMessages}>
      {children}
    </LocaleProvider>
  );
}

export function renderWithLocale(ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, {
    wrapper: AllThemesProvider,
    ...options,
  });
}

export { defaultMessages as enMessages };
