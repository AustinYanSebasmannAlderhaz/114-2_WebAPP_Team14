/**
 * elements.js
 * JavaScript for the Elements page (src/elements.html).
 */

document.addEventListener('DOMContentLoaded', () => {
    const orbitTrack = document.querySelector('[data-orbit-track]');
    const panels = Array.from(document.querySelectorAll('.source-panel[data-source-panel]'));
    const sourceLane = orbitTrack ? orbitTrack.querySelector('[data-source-lane]') : null;

    if (!orbitTrack || !sourceLane || panels.length === 0) return;

    const clonedLane = sourceLane.cloneNode(true);
    clonedLane.classList.add('is-clone');
    clonedLane.setAttribute('aria-hidden', 'true');
    clonedLane.querySelectorAll('.source-badge').forEach((badge) => {
        badge.tabIndex = -1;
    });
    orbitTrack.appendChild(clonedLane);

    const badges = Array.from(orbitTrack.querySelectorAll('.source-badge[data-source]'));
    if (badges.length === 0) return;

    const activateSource = (sourceKey) => {
        badges.forEach((badge) => {
            badge.classList.toggle('is-active', badge.dataset.source === sourceKey);
        });

        panels.forEach((panel) => {
            panel.classList.toggle('is-active', panel.dataset.sourcePanel === sourceKey);
        });
    };

    const pauseOrbit = () => {
        orbitTrack.classList.add('is-paused');
    };

    const resumeOrbit = () => {
        orbitTrack.classList.remove('is-paused');
    };

    const initialSource = badges.find((badge) => badge.classList.contains('is-active'))?.dataset.source
        || badges[0].dataset.source;
    if (initialSource) {
        activateSource(initialSource);
    }

    badges.forEach((badge) => {
        const sourceKey = badge.dataset.source;
        if (!sourceKey) return;

        badge.addEventListener('mouseenter', () => {
            pauseOrbit();
            activateSource(sourceKey);
        });

        badge.addEventListener('focus', () => {
            pauseOrbit();
            activateSource(sourceKey);
        });

        badge.addEventListener('click', () => {
            activateSource(sourceKey);
        });
    });

    orbitTrack.addEventListener('mouseleave', resumeOrbit);

    orbitTrack.addEventListener('focusout', (event) => {
        if (!orbitTrack.contains(event.relatedTarget)) {
            resumeOrbit();
        }
    });
});
