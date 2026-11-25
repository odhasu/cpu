import '../../screens/docs.css';
import { render } from '../../screens/docs.js';
import PageFrame from '../../components/page-frame.jsx';
import { siteContext } from '../../site.js';

export const metadata = {
  title: 'API Docs | Blinkrouter',
  description: 'Build an API request, preview the response and connect your own gateway.',
};

export default function DocsPage() {
  return <PageFrame page="docs" content={render(siteContext)} />;
}
