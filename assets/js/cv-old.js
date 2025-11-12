document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.cv-wrapper');
  if (!wrapper) return;

  // Collect h2 headings inside CV wrapper
  const headings = Array.from(wrapper.querySelectorAll('h2'));
  headings.forEach(h2 => {
    // Initialize state tracking for dot indicator
    h2.setAttribute('data-cv-state', 'collapsed');

    // If the next sibling is already a cv-section-body, skip
    let sib = h2.nextSibling;
    // Ensure we get element siblings (skip text nodes)
    while (sib && sib.nodeType !== 1) sib = sib.nextSibling;

    if (sib && sib.classList && sib.classList.contains('cv-section-body')) {
      // already wrapped
    } else {
      // Create a body wrapper for all nodes until the next h2
      const body = document.createElement('div');
      body.className = 'cv-section-body collapsed';

      const toMove = [];
      let current = sib;
      while (current && !(current.tagName && current.tagName.toLowerCase() === 'h2')) {
        toMove.push(current);
        current = current.nextSibling;
      }
      toMove.forEach(node => body.appendChild(node));
      h2.parentNode.insertBefore(body, current || null);
    }

    // Make headings togglable
    h2.classList.add('cv-collapsible-header');
    h2.setAttribute('role', 'button');
    h2.setAttribute('tabindex', '0');

    const bodyEl = h2.nextElementSibling;
    if (!bodyEl || !bodyEl.classList.contains('cv-section-body')) return;

    // Hover: temporary expand (only if not permanently locked)
    h2.addEventListener('mouseenter', () => {
      if (!bodyEl.classList.contains('locked-open')) {
        bodyEl.classList.add('hover-open');
        h2.setAttribute('data-cv-state', 'hover-open');
      } else {
        // Already locked, keep locked state
        h2.setAttribute('data-cv-state', 'locked-open');
      }
    });
    h2.addEventListener('mouseleave', () => {
      if (!bodyEl.classList.contains('locked-open')) {
        bodyEl.classList.remove('hover-open');
        h2.setAttribute('data-cv-state', 'collapsed');
      }
      // If locked, stay locked, don't change state
    });

    // Click: toggle permanent expand on/off (single function)
    const toggle = (e) => {
      e.stopPropagation(); // Prevent event bubbling
      e.preventDefault(); // Prevent any default browser behavior
      const isLocked = bodyEl.classList.contains('locked-open');
      
      console.log(`Toggling ${h2.id || h2.textContent}: isLocked=${isLocked}`);
      
      if (isLocked) {
        // Remove permanent lock - collapse the section
        bodyEl.classList.remove('locked-open');
        bodyEl.classList.remove('hover-open');
        h2.setAttribute('data-cv-state', 'collapsed');
        h2.setAttribute('aria-expanded', 'false');
        console.log(`Released lock for ${h2.id || h2.textContent}`);
      } else {
        // Add permanent lock - expand and lock it
        bodyEl.classList.add('locked-open');
        // Don't add hover-open; locked-open CSS handles visibility
        h2.setAttribute('data-cv-state', 'locked-open');
        h2.setAttribute('aria-expanded', 'true');
        console.log(`Locked open ${h2.id || h2.textContent}`);
      }
    };
    h2.addEventListener('click', toggle, true); // Use capture phase to catch click first
    h2.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(e);
      }
    });
  });
});
