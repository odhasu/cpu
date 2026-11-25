import '../../screens/models.css';
import { render } from '../../screens/models.js';
import PageFrame from '../../components/page-frame.jsx';
import { siteContext } from '../../site.js';

export const metadata = {
  title: 'Models | Blinkrouter',
  description: 'Explore text, image, video and audio models from leading AI providers.',
};

export default function ModelsPage() {
  return <PageFrame page="models" content={render(siteContext)} />;
}
