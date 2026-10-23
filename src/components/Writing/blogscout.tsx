import { useSubstackFeed } from "../../hooks/useSubstackFeed";
import Helmet from "../Utils/SEO/helmet";
import { SUBSTACK_PUBLICATION_URL } from "../../lib/substack";
import "./blogscout.scss";

/* ==========================================================================
   Blogs — the homepage writing section.

   An image-led grid of real Substack articles: a consistent cover ratio, the
   verbatim title, the real excerpt and the publication date, with a centred
   "View all articles" link below. No selector rail, no carousel, no featured
   panel. One column on mobile.
   ========================================================================== */

/** How many articles the grid shows before the "view all" link. */
const GRID_COUNT = 3;

export default function BlogScout() {
  const { posts, loading, error, stale } = useSubstackFeed();
  const hasPosts = posts.length > 0;

  if (!hasPosts) {
    return (
      <div className="blogs blogs--empty">
        {loading && <p className="blogs__status">Loading posts&hellip;</p>}
        {error && (
          <p className="blogs__status">Could not load posts: {error}</p>
        )}
        {stale && (
          <p className="blogs__status blogs__status--stale">
            Last known posts shown while Substack is unreachable.
          </p>
        )}
        <p className="blogs__status">
          Writing is published on{" "}
          <a
            href={SUBSTACK_PUBLICATION_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Substack
          </a>
          .
        </p>
      </div>
    );
  }

  const shown = posts.slice(0, GRID_COUNT);

  return (
    <section className="blogs" aria-labelledby="blogs-heading">
      <Helmet
        title="Blogs"
        name="Delebayo Asher Blogs"
        content="Latest writing by Delebayo Asher on data engineering, systems and building in the open."
      />

      <div className="blogs__grid">
        {shown.map((post) => (
          <article className="blogs__card" key={post.id}>
            <a
              className="blogs__media"
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={post.title}
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt=""
                  loading="lazy"
                  width={1200}
                  height={675}
                />
              ) : (
                <span className="blogs__media-fallback" aria-hidden="true">
                  23
                </span>
              )}
            </a>

            <div className="blogs__body">
              <p className="blogs__meta">
                {post.displayDate && (
                  <span className="blogs__date">{post.displayDate}</span>
                )}
                {post.featured && (
                  <span className="blogs__badge">Featured</span>
                )}
              </p>

              <h3 className="blogs__title">
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  {post.title}
                </a>
              </h3>

              {post.excerpt && <p className="blogs__excerpt">{post.excerpt}</p>}

              <a
                className="blogs__read"
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read on Substack
                <i className="fas fa-arrow-right" aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="blogs__all">
        <a
          className="blogs__all-link"
          href={SUBSTACK_PUBLICATION_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          View all articles
          <i className="fas fa-arrow-right" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
