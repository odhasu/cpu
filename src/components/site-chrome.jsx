import { siteContext, sitePath } from '../site.js';
import { iconBody } from '../ui.js';

const { urls } = siteContext;
const navigation = [
  ['models', 'Models'],
  ['pricing', 'Pricing'],
  ['gpu', 'GPU Cloud'],
  ['docs', 'Docs'],
];

function Icon({ name }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: iconBody(name) }}
    />
  );
}

function NavigationLinks({ page }) {
  return navigation.map(([key, label]) => (
    <a key={key} href={urls[key]} aria-current={page === key ? 'page' : undefined}>{label}</a>
  ));
}

function Brand() {
  return (
    <a className="site-brand" href={urls.home} aria-label="Blinkrouter home">
      <img className="brand-mark" src={sitePath('/blinkrouter-mark.png')} width="35" height="35" alt="" />
      <span>Blinkrouter</span>
    </a>
  );
}

export function Header({ page }) {
  return (
    <header className="site-header nav">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="site-header-inner shell wrap">
        <div className="site-header-links">
          <Brand />
          <nav className="site-nav" aria-label="Main navigation"><NavigationLinks page={page} /></nav>
        </div>
        <div className="site-tools">
          <div className="site-search-control">
            <button type="button" className="site-search" data-search="" aria-label="Search Blinkrouter" aria-keyshortcuts="Meta+K Control+K" aria-haspopup="dialog" aria-expanded="false">
              <Icon name="search" /> <span>Search</span>
            </button>
            <kbd aria-hidden="true">Ctrl K</kbd>
          </div>
          <a className="button header-playground" href={urls.playground}>Playground <Icon name="upRight" /></a>
          <button type="button" className="menu-toggle button" aria-controls="mobile-navigation" aria-expanded="false" aria-label="Open navigation">
            <Icon name="menu" />
          </button>
        </div>
      </div>
      <nav className="mobile-navigation shell" id="mobile-navigation" aria-label="Mobile navigation" hidden>
        <NavigationLinks page={page} />
        <a href={urls.playground}>Playground <Icon name="upRight" /></a>
      </nav>
    </header>
  );
}

export function Footer({ page }) {
  return (
    <footer className="site-footer closing">
      <div className="shell wrap">
        {page === 'home' && (
          <div className="site-footer-close">
            <h2>API playground</h2>
            <a className="button btn btn--primary button--primary" href={urls.playground}>Try an API request <Icon name="arrow" /></a>
          </div>
        )}
        <div>
          <div className="site-footer-main">
            <div><Brand /><p>One port for AI models and cloud compute.</p></div>
            <nav className="footer-link-group" aria-label="Product">
              <p className="footer-group-title">Product</p>
              <NavigationLinks />
            </nav>
            <nav className="footer-link-group" aria-label="Developers">
              <p className="footer-group-title">Developers</p>
              <a href={urls.quickstart}>API quickstart</a>
              <a href={urls.playground}>API playground</a>
              <a href={urls.github}><Icon name="github" /> GitHub <Icon name="upRight" /></a>
            </nav>
          </div>
          <div className="site-footer-bottom">
            <span>© {new Date().getFullYear()} Blinkrouter</span>
            <span><i /> Product preview</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SearchDialog() {
  return (
    <dialog className="search-dialog" aria-labelledby="search-heading">
      <div className="search-dialog-input">
        <Icon name="search" />
        <label htmlFor="site-search-query" id="search-heading" className="sr-only">Search models and pages</label>
        <input type="search" id="site-search-query" placeholder="Search models and pages" autoComplete="off" autoFocus />
        <button type="button" className="search-close" aria-label="Close search"><Icon name="close" /></button>
      </div>
      <div className="search-results" />
    </dialog>
  );
}
