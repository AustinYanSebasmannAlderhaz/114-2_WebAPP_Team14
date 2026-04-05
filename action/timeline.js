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
