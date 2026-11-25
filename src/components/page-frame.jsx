import { Footer, Header, SearchDialog } from './site-chrome.jsx';
import SiteInteractions from './site-interactions.jsx';

export default function PageFrame({ page, content }) {
  return (
    <>
      <Header page={page} />
      <main id="main-content" data-page={page} tabIndex={-1} dangerouslySetInnerHTML={{ __html: content }} />
      <Footer page={page} />
      <SearchDialog />
      <SiteInteractions page={page} />
    </>
  );
}
