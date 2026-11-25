import '../../screens/gpu.css';
import { render } from '../../screens/gpu.js';
import PageFrame from '../../components/page-frame.jsx';
import { siteContext } from '../../site.js';

export const metadata = {
  title: 'GPU Cloud | Blinkrouter',
  description: 'Explore dedicated GPU configurations and plan cloud compute costs.',
};

export default function GpuCloudPage() {
  return <PageFrame page="gpu" content={render(siteContext)} />;
}
