// Simple Graph View for Blog Posts
(function() {
  const graphLink = document.getElementById('show-graph');
  if (!graphLink) return;

  graphLink.addEventListener('click', (e) => {
    e.preventDefault();
    showGraphModal();
  });

  function showGraphModal() {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'graph-modal';
    modal.innerHTML = `
      <div class="graph-modal-content">
        <div class="graph-header">
          <h2>📊 Knowledge Graph</h2>
          <button class="close-graph">&times;</button>
        </div>
        <div id="graph-container" class="graph-container">
          <p class="graph-info">Loading graph...</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close button
    modal.querySelector('.close-graph').addEventListener('click', () => {
      modal.remove();
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Load graph data
    loadGraphData();
  }

  async function loadGraphData() {
    try {
      const response = await fetch('/index.json');
      const data = await response.json();
      const blogPosts = data.filter(item => item.section === 'blog');

      renderSimpleGraph(blogPosts);
    } catch (error) {
      document.getElementById('graph-container').innerHTML = 
        '<p class="graph-error">Failed to load graph data</p>';
    }
  }

  function renderSimpleGraph(posts) {
    const container = document.getElementById('graph-container');
    
    // Create a simple list view of connections
    let html = '<div class="graph-list">';
    
    posts.forEach(post => {
      const connections = posts.filter(p => {
        if (p.permalink === post.permalink) return false;
        return p.content && p.content.includes(post.title);
      });

      html += `
        <div class="graph-node">
          <div class="node-title">
            <a href="${post.permalink}">${post.title}</a>
          </div>
          ${connections.length > 0 ? `
            <div class="node-connections">
              <span class="connection-label">Connected to:</span>
              ${connections.map(c => `
                <a href="${c.permalink}" class="connection-link">${c.title}</a>
              `).join(', ')}
            </div>
          ` : '<div class="node-isolated">No connections</div>'}
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;
  }
})();
