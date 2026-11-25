import '../screens/home.css';
import { render } from '../screens/home.js';
import PageFrame from '../components/page-frame.jsx';
import { siteContext, sitePath } from '../site.js';

export const metadata = {
  title: 'Blinkrouter | One API for AI models and cloud GPUs',
  description: 'Route text, image, video and audio models through one API. Provider pricing with 0% markup and 0% platform fees.',
  openGraph: {
    title: 'Blinkrouter | One API for AI models',
    description: 'Route text, image, video and audio through one API at provider rates.',
    images: [sitePath('/blinkrouter-mark.png')],
  },
  twitter: { card: 'summary' },
  other: { 'page-type': 'software', 'site-kind': 'software' },
};

export default function HomePage() {
  return (
    <>
      <link rel="stylesheet" href={sitePath('/taste/motion.css')} precedence="taste" />
      <PageFrame page="home" content={render(siteContext)} />
    </>
  );
}
