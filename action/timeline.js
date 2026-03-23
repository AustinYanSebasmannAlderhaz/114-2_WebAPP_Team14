/**
 * timeline.js
 * JavaScript for the Timeline page (src/timeline.html).
 *
 * Contains the IntersectionObserver logic that was previously in the
 * root-level script.js. This reveals timeline entries with a fade-in
 * animation as they scroll into view.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Timeline entry scroll-reveal animation
    const entries = document.querySelectorAll('.tl-entry');
    const io = new IntersectionObserver((items) => {
        items.forEach((item) => {
            if (item.isIntersecting) {
                item.target.classList.add('show');
            }
        });
    }, { threshold: 0.15 });

    entries.forEach((entry) => io.observe(entry));

    console.log('[Timeline] Page loaded, observing', entries.length, 'entries.');
});
