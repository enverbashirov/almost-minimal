document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.cv-wrapper');
  if (!wrapper) return;

  // Track locked sections in a Map for easy lookup
  const lockedSections = new Map();

  // Collect all h2 headings
  const headings = Array.from(wrapper.querySelectorAll('h2'));
  
  headings.forEach((h2, index) => {
    // Get the next element sibling (skip text nodes)
    let body = h2.nextElementSibling;
    
    // If it's not a section body, create one
    if (!body || !body.classList.contains('cv-section-body')) {
      const newBody = document.createElement('div');
      newBody.className = 'cv-section-body collapsed';
      
      // Collect all siblings until the next h2
      let current = h2.nextSibling;
      const toMove = [];
      while (current) {
        if (current.nodeType === 1 && current.tagName.toLowerCase() === 'h2') {
          break;
        }
        toMove.push(current);
        current = current.nextSibling;
      }
      
      toMove.forEach(node => newBody.appendChild(node));
      h2.parentNode.insertBefore(newBody, h2.nextSibling);
      body = newBody;
    }

    // Initialize state
    const sectionId = `cv-section-${index}`;
    h2.id = sectionId;
    body.dataset.sectionId = sectionId;
    lockedSections.set(sectionId, false); // Start unlocked
    
    // Set initial dot state to collapsed
    h2.setAttribute('data-cv-state', 'collapsed');
    h2.classList.add('cv-collapsible-header');
    h2.setAttribute('role', 'button');
    h2.setAttribute('tabindex', '0');
    h2.setAttribute('aria-expanded', 'false');

    // Mouse enter: temporarily show content (only if not locked)
    h2.addEventListener('mouseenter', () => {
      const isLocked = lockedSections.get(sectionId);
      if (!isLocked) {
        body.classList.add('hover-open');
        body.classList.remove('collapsed');
        h2.setAttribute('data-cv-state', 'hover-open');
      }
    });

    // Mouse leave: hide content (only if not locked)
    h2.addEventListener('mouseleave', () => {
      const isLocked = lockedSections.get(sectionId);
      if (!isLocked) {
        body.classList.remove('hover-open');
        body.classList.add('collapsed');
        h2.setAttribute('data-cv-state', 'collapsed');
      }
    });

    // Click: toggle locked state
    h2.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      
      const isCurrentlyLocked = lockedSections.get(sectionId);
      
      if (isCurrentlyLocked) {
        // Currently locked -> unlock and collapse
        lockedSections.set(sectionId, false);
        body.classList.remove('locked-open');
        body.classList.remove('hover-open');
        body.classList.add('collapsed');
        h2.setAttribute('data-cv-state', 'collapsed');
        h2.setAttribute('aria-expanded', 'false');
      } else {
        // Currently unlocked -> lock open
        lockedSections.set(sectionId, true);
        body.classList.add('locked-open');
        body.classList.remove('hover-open');
        body.classList.remove('collapsed');
        h2.setAttribute('data-cv-state', 'locked-open');
        h2.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support
    h2.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        h2.click();
      }
    });
  });
});
