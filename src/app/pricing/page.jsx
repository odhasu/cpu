import '../../screens/pricing.css';
import { render } from '../../screens/pricing.js';
import PageFrame from '../../components/page-frame.jsx';
import { siteContext } from '../../site.js';

export const metadata = {
  title: 'Pricing | Blinkrouter',
  description: 'Compare model rates with 0% platform fees and 0% markup.',
};

export default function PricingPage() {
  return <PageFrame page="pricing" content={render(siteContext)} />;
}
