/**
 * timeline.js
 * JavaScript for the Timeline page (src/timeline.html).
 *
 * Contains the IntersectionObserver logic that was previously in the
 * root-level script.js. This reveals timeline entries with a fade-in
 * animation as they scroll into view.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Reformat dense timeline paragraphs into readable blocks
    const formatTimelineContent = () => {
        const entryParagraphs = document.querySelectorAll('.tl-entry > p');

        entryParagraphs.forEach((paragraph) => {
            const rawText = (paragraph.innerText || '').replace(/\r/g, '').trim();
            if (!rawText) {
                return;
            }

            const lines = rawText
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean);

            const content = document.createElement('div');
            content.className = 'tl-content';

            let listEl = null;
            const flushList = () => {
                listEl = null;
            };

            lines.forEach((line) => {
                if (line.startsWith('### ')) {
                    flushList();
                    const subTitle = document.createElement('h4');
                    subTitle.textContent = line.replace(/^###\s+/, '').trim();
                    content.appendChild(subTitle);
                    return;
                }

                if (line.startsWith('#### ')) {
                    flushList();
                    const subSection = document.createElement('h5');
                    subSection.textContent = line.replace(/^####\s+/, '').trim();
                    content.appendChild(subSection);
                    return;
                }

                if (/^[-•]\s+/.test(line)) {
                    if (!listEl) {
                        listEl = document.createElement('ul');
                        listEl.className = 'tl-list';
                        content.appendChild(listEl);
                    }
                    const item = document.createElement('li');
                    item.textContent = line.replace(/^[-•]\s+/, '').trim();
                    listEl.appendChild(item);
                    return;
                }

                flushList();
                const text = document.createElement('p');
                text.className = 'tl-text';
                text.textContent = line;
                content.appendChild(text);
            });

            paragraph.replaceWith(content);
        });
    };

    formatTimelineContent();

    const setupTimelineBookmarks = () => {
        const list = document.getElementById('timeline-bookmark-list');
        if (!list) return;

        const headings = Array.from(
            document.querySelectorAll('section.section.dark h2, section.section.dark .tl-entry h3')
        );
        if (headings.length === 0) return;

        const usedIds = new Set();
        const makeSlug = (text) => {
            const slug = (text || '')
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\u4e00-\u9fff\s-]/g, '')
                .replace(/\s+/g, '-');
            return slug || '';
        };

        const ensureId = (heading, index) => {
            const existing = (heading.id || '').trim();
            if (existing && !usedIds.has(existing)) {
                usedIds.add(existing);
                return existing;
            }

            const base = makeSlug(heading.textContent) || `timeline-anchor-${index + 1}`;
            let nextId = base;
            let i = 2;
            while (usedIds.has(nextId) || document.getElementById(nextId)) {
                nextId = `${base}-${i}`;
                i += 1;
            }

            heading.id = nextId;
            usedIds.add(nextId);
            return nextId;
        };

        const linksById = new Map();

        headings.forEach((heading, index) => {
            const id = ensureId(heading, index);

            const item = document.createElement('li');
            const link = document.createElement('a');
            link.className = `timeline-bookmark-link ${heading.tagName === 'H2' ? 'h2-link' : 'h3-link'}`;
            link.href = `#${id}`;
            link.textContent = (heading.textContent || '').trim();
            link.addEventListener('click', (event) => {
                event.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', `#${id}`);
            });

            item.appendChild(link);
            list.appendChild(item);
            linksById.set(id, link);
        });

        let activeId = '';
        const updateActive = () => {
            const markerTop = 150;
            let nextActiveId = headings[0]?.id || '';

            headings.forEach((heading) => {
                const rect = heading.getBoundingClientRect();
                if (rect.top - markerTop <= 0) {
                    nextActiveId = heading.id;
                }
            });

            if (!nextActiveId || nextActiveId === activeId) return;
            activeId = nextActiveId;

            linksById.forEach((link, id) => {
                link.classList.toggle('is-active', id === nextActiveId);
            });
        };

        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
    };

    setupTimelineBookmarks();

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
