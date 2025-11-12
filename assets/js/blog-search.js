// Blog Search Functionality - Obsidian-style
(function() {
  let searchIndex = null;
  let fuse = null;
  let selectedIndex = -1;
  
  const searchInput = document.getElementById('blog-search');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput) return;

  // Load search index
  async function loadSearchIndex() {
    try {
  const response = await fetch('/index.json');
  const data = await response.json();

  // Filter to blog posts only (match permalink path)
  searchIndex = data.filter(item => item.permalink && item.permalink.includes('/blog/'));
      
      // Initialize Fuse.js with Obsidian-like search
      const options = {
        keys: [
          { name: 'title', weight: 0.7 },
          { name: 'content', weight: 0.2 },
          { name: 'tags', weight: 0.1 }
        ],
        threshold: 0.4,
        includeScore: true,
        minMatchCharLength: 1,
        ignoreLocation: true
      };
      
      fuse = new Fuse(searchIndex, options);
    } catch (error) {
      console.error('Failed to load search index:', error);
    }
  }

  // Perform search
  function performSearch(query) {
    if (!fuse || query.length === 0) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('active');
      selectedIndex = -1;
      return;
    }

    const results = fuse.search(query);
    displayResults(results.slice(0, 8)); // Show top 8 results like Obsidian
  }

  // Display search results
  function displayResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="no-results">No results found</div>';
      searchResults.classList.add('active');
      selectedIndex = -1;
      return;
    }

    const html = results.map((result, index) => {
      const item = result.item;
      const isSelected = index === selectedIndex;
      return `
        <a href="${item.permalink}" class="search-result-item${isSelected ? ' selected' : ''}" data-index="${index}">
          <div class="result-title">${highlightMatch(item.title, searchInput.value)}</div>
          ${item.description ? `<div class="result-description">${truncate(item.description, 80)}</div>` : ''}
        </a>
      `;
    }).join('');

    searchResults.innerHTML = html;
    searchResults.classList.add('active');
  }

  // Highlight matching text
  function highlightMatch(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // Escape regex special characters
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Truncate text
  function truncate(text, length) {
    if (text.length <= length) return text;
    return text.substr(0, length) + '...';
  }

  // Keyboard navigation
  function handleKeyboard(e) {
    const items = searchResults.querySelectorAll('.search-result-item');
    if (items.length === 0) return;

    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        updateSelection(items);
        break;
      case 'ArrowUp':
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelection(items);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          window.location.href = items[selectedIndex].href;
        }
        break;
      case 'Escape':
        searchResults.classList.remove('active');
        selectedIndex = -1;
        break;
    }
  }

  // Update selection visual
  function updateSelection(items) {
    items.forEach((item, index) => {
      if (index === selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  // Event listeners
  searchInput.addEventListener('input', (e) => {
    selectedIndex = -1;
    performSearch(e.target.value);
  });

  searchInput.addEventListener('keydown', handleKeyboard);

  searchInput.addEventListener('focus', () => {
    if (searchInput.value) {
      performSearch(searchInput.value);
    }
  });

  // Close search results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('active');
      selectedIndex = -1;
    }
  });

  // Load index on page load
  loadSearchIndex();
})();
