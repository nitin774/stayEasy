(function(){
        var menu = document.querySelector('.menu-user');
        var trigger = document.querySelector('.menu-trigger');
        var dropdown = document.querySelector('.user-dropdown');
        if(!menu || !trigger || !dropdown) return;

        function toggleDropdown(e){
          dropdown.classList.toggle('show');
          e.stopPropagation();
        }

        function closeDropdown(){
          dropdown.classList.remove('show');
        }

        trigger.addEventListener('click', toggleDropdown);
        document.addEventListener('click', function(e){
          if(!menu.contains(e.target)) closeDropdown();
        });
        document.addEventListener('keydown', function(e){
          if(e.key === 'Escape') closeDropdown();
        });
      })();

      // Search input functionality
      (function(){
        var searchBtn = document.querySelector('.search-btn');
        var searchInput = document.querySelector('.search-input');
        var searchCloseBtn = document.querySelector('.search-close-btn');
        var segments = document.querySelector('.segments');

        function openSearch(){
          segments.style.display = 'none';
          searchInput.classList.add('show');
          searchCloseBtn.classList.add('show');
          searchBtn.classList.add('hidden');
          searchInput.focus();
        }

        function closeSearch(){
          segments.style.display = 'flex';
          searchInput.classList.remove('show');
          searchCloseBtn.classList.remove('show');
          searchBtn.classList.remove('hidden');
          searchInput.value = '';
        }

        searchBtn.addEventListener('click', openSearch);
        searchCloseBtn.addEventListener('click', closeSearch);

        // Close on ESC key
        document.addEventListener('keydown', function(e){
          if(e.key === 'Escape' && searchInput.classList.contains('show')) closeSearch();
        });
      })();

// GST toggle functionality moved to script.js for better integration with search results