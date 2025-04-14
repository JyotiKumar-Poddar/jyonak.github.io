// JavaScript for Articles functionality

document.addEventListener('DOMContentLoaded', function() {
    // Article search functionality
    const searchInput = document.getElementById('article-search');
    const articleCards = document.querySelectorAll('.article-card');
    const searchSuggestions = document.createElement('div');
    searchSuggestions.className = 'search-suggestions';
    searchInput.parentNode.appendChild(searchSuggestions);
    
    // Fuzzy search function
    function fuzzySearch(text, searchTerm) {
        const textLower = text.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        // Exact match
        if (textLower.includes(searchLower)) return true;
        
        // Word boundary match
        const words = textLower.split(/\s+/);
        return words.some(word => word.includes(searchLower));
        
        // Fuzzy match (for future enhancement)
        // const searchChars = searchLower.split('');
        // let textIndex = 0;
        // for (let char of searchChars) {
        //     textIndex = textLower.indexOf(char, textIndex);
        //     if (textIndex === -1) return false;
        //     textIndex++;
        // }
        // return true;
    }
    
    // Highlight matching text
    function highlightText(element, searchTerm) {
        if (!searchTerm) return;
        
        const text = element.innerHTML;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        element.innerHTML = text.replace(regex, '<mark>$1</mark>');
    }
    
    // Generate search suggestions
    function generateSuggestions(searchTerm) {
        if (!searchTerm) {
            searchSuggestions.style.display = 'none';
            return;
        }
        
        const suggestions = new Set();
        articleCards.forEach(card => {
            const title = card.querySelector('h3').textContent;
            const description = card.querySelector('p').textContent;
            const categories = card.dataset.categories ? card.dataset.categories.split(' ') : [];
            const date = card.querySelector('.article-date').textContent;
            
            // Add matching words as suggestions
            [title, description, ...categories, date].forEach(text => {
                const words = text.toLowerCase().split(/\s+/);
                words.forEach(word => {
                    if (word.includes(searchTerm.toLowerCase())) {
                        suggestions.add(word);
                    }
                });
            });
        });
        
        if (suggestions.size > 0) {
            searchSuggestions.innerHTML = Array.from(suggestions)
                .map(suggestion => `<div class="suggestion">${suggestion}</div>`)
                .join('');
            searchSuggestions.style.display = 'block';
        } else {
            searchSuggestions.style.display = 'none';
        }
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            
            articleCards.forEach(card => {
                const title = card.querySelector('h3');
                const description = card.querySelector('p');
                const categories = card.dataset.categories ? card.dataset.categories.toLowerCase() : '';
                const date = card.querySelector('.article-date').textContent;
                
                // Reset highlights
                title.innerHTML = title.textContent;
                description.innerHTML = description.textContent;
                
                // Search in all fields
                const matches = 
                    fuzzySearch(title.textContent, searchTerm) ||
                    fuzzySearch(description.textContent, searchTerm) ||
                    fuzzySearch(categories, searchTerm) ||
                    fuzzySearch(date, searchTerm);
                
                if (matches) {
                    card.style.display = 'block';
                    // Highlight matches
                    highlightText(title, searchTerm);
                    highlightText(description, searchTerm);
                } else {
                    card.style.display = 'none';
                }
            });
            
            generateSuggestions(searchTerm);
            updatePaginationInfo();
        });
        
        // Handle suggestion clicks
        searchSuggestions.addEventListener('click', function(e) {
            if (e.target.classList.contains('suggestion')) {
                searchInput.value = e.target.textContent;
                searchInput.dispatchEvent(new Event('input'));
            }
        });
        
        // Close suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.style.display = 'none';
            }
        });
    }
    
    // Category filter functionality
    const categoryFilter = document.getElementById('category-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const selectedCategory = this.value.toLowerCase();
            
            if (selectedCategory === 'all') {
                articleCards.forEach(card => {
                    card.style.display = 'block';
                });
            } else {
                articleCards.forEach(card => {
                    const categories = card.dataset.categories ? card.dataset.categories.toLowerCase() : '';
                    
                    if (categories.includes(selectedCategory)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
            
            updatePaginationInfo();
        });
    }
    
    // Sort functionality
    const sortFilter = document.getElementById('sort-filter');
    const articlesGrid = document.querySelector('.articles-grid');
    
    if (sortFilter && articlesGrid) {
        sortFilter.addEventListener('change', function() {
            const sortValue = this.value;
            const cardsArray = Array.from(articleCards);
            
            switch(sortValue) {
                case 'date-desc':
                    cardsArray.sort((a, b) => {
                        const dateA = new Date(a.querySelector('.article-date').textContent.replace('📅 ', ''));
                        const dateB = new Date(b.querySelector('.article-date').textContent.replace('📅 ', ''));
                        return dateB - dateA;
                    });
                    break;
                case 'date-asc':
                    cardsArray.sort((a, b) => {
                        const dateA = new Date(a.querySelector('.article-date').textContent.replace('📅 ', ''));
                        const dateB = new Date(b.querySelector('.article-date').textContent.replace('📅 ', ''));
                        return dateA - dateB;
                    });
                    break;
                case 'read-time':
                    cardsArray.sort((a, b) => {
                        const timeA = parseInt(a.querySelector('.article-read-time').textContent.match(/\d+/)[0]);
                        const timeB = parseInt(b.querySelector('.article-read-time').textContent.match(/\d+/)[0]);
                        return timeA - timeB;
                    });
                    break;
            }
            
            // Remove all cards
            articleCards.forEach(card => {
                card.remove();
            });
            
            // Append sorted cards
            cardsArray.forEach(card => {
                articlesGrid.appendChild(card);
            });
        });
    }
    
    // Update pagination info based on visible cards
    function updatePaginationInfo() {
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            const visibleCards = document.querySelectorAll('.article-card[style="display: block"], .article-card:not([style*="display"])').length;
            paginationInfo.textContent = `Showing ${visibleCards} article${visibleCards !== 1 ? 's' : ''}`;
        }
    }
    
    // Table of Contents smooth scrolling
    const tocLinks = document.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Highlight current section in TOC
    function highlightTOC() {
        const sections = document.querySelectorAll('.article-body h2, .article-body h3');
        const tocLinks = document.querySelectorAll('.toc-link');
        
        if (sections.length === 0 || tocLinks.length === 0) return;
        
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSectionId = '#' + section.id;
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
            }
        });
    }
    
    // Add scroll event listener for TOC highlighting
    if (document.querySelector('.article-toc')) {
        window.addEventListener('scroll', highlightTOC);
        // Initialize on page load
        highlightTOC();
    }
    
    // Copy code snippet functionality
    const copyButtons = document.querySelectorAll('.code-snippet-action');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const snippet = this.closest('.code-snippet');
            const codeLines = snippet.querySelectorAll('.line-content');
            let codeToCopy = '';
            
            codeLines.forEach(line => {
                codeToCopy += line.textContent + '\n';
            });
            
            navigator.clipboard.writeText(codeToCopy).then(() => {
                // Show copied notification
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.color = 'var(--comment-color)';
                
                setTimeout(() => {
                    this.innerHTML = originalIcon;
                    this.style.color = '';
                }, 2000);
            });
        });
    });
    
    // Reading progress indicator
    const progressIndicator = document.querySelector('.reading-progress');
    const articleBody = document.querySelector('.article-body');
    
    if (progressIndicator && articleBody) {
        window.addEventListener('scroll', function() {
            const articleStart = articleBody.offsetTop;
            const articleHeight = articleBody.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollPosition = window.scrollY;
            
            // Calculate reading progress
            let progress = 0;
            if (scrollPosition > articleStart) {
                const readableHeight = articleHeight - windowHeight;
                progress = ((scrollPosition - articleStart) / readableHeight) * 100;
                progress = Math.min(Math.max(progress, 0), 100);
            }
            
            progressIndicator.style.width = `${progress}%`;
        });
    }
});
