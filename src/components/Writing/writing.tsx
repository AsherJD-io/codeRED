import { Link } from "react-router-dom";
import Helmet from "../Utils/SEO/helmet";
import { useSubstackFeed } from "../../hooks/useSubstackFeed";
import { SUBSTACK_PUBLICATION_URL } from "../../lib/substack";
import "./writing.scss";

/**
 * The dedicated /writing route.
 *
 * Labelled Blogs in both the heading and the navigation. The real Substack
 * feed, rendered as an image-led list with a consistent cover ratio. There is
 * no selector rail, no carousel and no featured panel.
 */
export default function Writing() {
  const { posts, loading, error, stale } = useSubstackFeed();

  return (
    <div className="writing">
      <Helmet
        title="Blogs"
        name="Delebayo Asher Blogs"
        content="Notes and essays by Delebayo Asher on data engineering, systems and building in the open."
      />

      <div className="writing_container">
        <div className="top_row">
          <h2 className="section-title">
            <span className="section-title__tag">Blogs</span>
            <span className="section-title__rule" aria-hidden="true" />
          </h2>

          <div className="buttons">
            <a
              href={SUBSTACK_PUBLICATION_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <small>
                <span>Subscribe on Substack</span>
              </small>
            </a>
          </div>
        </div>

        <p className="writing_lede">
          Latest writing on data engineering, systems and building in the open.
        </p>

        {loading && posts.length === 0 && (
          <p className="status">Loading posts&hellip;</p>
        )}

        {error && <p className="status error">Could not load posts: {error}</p>}

        {stale && (
          <p className="status stale">
            Showing the last available posts while Substack is unreachable.
          </p>
        )}

        {posts.length > 0 && (
          <div className="post_list">
            {posts.map((post) => (
              <article className="post" key={post.id}>
                <a
                  className="post_link"
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="post_image">
                    {post.image ? (
                      <img src={post.image} alt="" loading="lazy" />
                    ) : (
                      <div className="post_image_fallback" aria-hidden="true">
                        <span>23</span>
                      </div>
                    )}
                  </div>

                  <div className="post_body">
                    <div className="post_meta">
                      {post.displayDate && (
                        <span className="post_date">{post.displayDate}</span>
                      )}
                      {post.featured && (
                        <span className="post_badge">Featured</span>
                      )}
                    </div>

                    <h3 className="post_title">{post.title}</h3>

                    {post.excerpt && (
                      <p className="post_excerpt">{post.excerpt}</p>
                    )}

                    <span className="post_more">Read on Substack</span>
                  </div>
                </a>
              </article>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && !error && (
          <p className="status">No posts available right now.</p>
        )}
      </div>

      <div className="go_button_container">
        <Link to="/projects">
          <button>
            <b>&#10142; </b> Projects
          </button>
        </Link>

        <Link to="/contact">
          <button>Contact &#10142; </button>
        </Link>
      </div>
    </div>
  );
}
