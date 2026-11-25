import '../styles.css';
import { siteContext, sitePath } from '../site.js';

export const metadata = {
  metadataBase: new URL('https://odhasu.github.io'),
  icons: { icon: sitePath('/blinkrouter-mark.png') },
};

export const viewport = {
  themeColor: '#090d0c',
};

const homePath = JSON.stringify(siteContext.urls.home);
const heroEntrance = `
  if (location.pathname === ${homePath} || location.pathname + '/' === ${homePath}) {
    document.documentElement.classList.add('m-enter');
    setTimeout(() => document.documentElement.classList.add('m-enter-done'), 700);
  }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-type="software" data-motion="" data-buttons="solid" data-radius="sharp" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: heroEntrance }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
