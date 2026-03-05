// next.config.ts
import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
// 또는 커스텀 경로를 지정하고 싶을 때 (보통은 생략 가능)
// const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* 기존에 있던 다른 설정들 여기에 추가하면 됨 */
  // 예시:
  // images: { ... },
  // experimental: { ... },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shopping-phinf.pstatic.net',
      },
    ],
    // domains: ['shopping-phinf.pstatic.net'],
  },
};

export default withNextIntl(nextConfig);
