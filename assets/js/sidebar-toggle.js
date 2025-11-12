// Sidebar folder toggle functionality
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Handle folder header clicks
    const folderHeaders = document.querySelectorAll('.folder-header, .subfolder-header');
    
    folderHeaders.forEach(header => {
      header.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const parentItem = this.parentElement;
        parentItem.classList.toggle('open');
      });
    });
  });
})();
