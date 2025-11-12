// Sidebar folder toggle functionality
(function() {
  // Handle folder toggling
  function initFolderToggle() {
    const folderHeaders = document.querySelectorAll('.folder-header, .subfolder-header');
    
    folderHeaders.forEach(header => {
      header.addEventListener('click', function(e) {
        e.stopPropagation();
        const parentItem = this.parentElement;
        parentItem.classList.toggle('open');
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFolderToggle);
  } else {
    initFolderToggle();
  }
})();
