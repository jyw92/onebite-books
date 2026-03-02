import {NextIntlClientProvider} from 'next-intl';

export default function NotFound() {
  return (
    <html>
      <body>
        <NextIntlClientProvider>
          <main>404</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
