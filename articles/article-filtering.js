// Article filtering and search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const searchInput = document.getElementById('article-search');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const articleCards = document.querySelectorAll('.article-card');
    const articlesGrid = document.querySelector('.articles-grid');
    const paginationInfo = document.querySelector('.pagination-info');
    
    // Initialize reading progress for articles
    initializeReadingProgress();
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterArticles();
        });
    }
    
    // Category filter functionality
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterArticles();
        });
    }
    
    // Sort functionality
    if (sortFilter && articlesGrid) {
        sortFilter.addEventListener('change', function() {
            sortArticles();
            updatePaginationInfo();
        });
    }
    
    // Combined filter function
    function filterArticles() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value.toLowerCase() : 'all';
        
        articleCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const categories = card.dataset.categories ? card.dataset.categories.toLowerCase() : '';
            
            const matchesSearch = title.includes(searchTerm) || 
                                 description.includes(searchTerm) || 
                                 categories.includes(searchTerm);
            
            const matchesCategory = selectedCategory === 'all' || 
                                   categories.includes(selectedCategory);
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        updatePaginationInfo();
    }
    
    // Sort articles function
    function sortArticles() {
        const sortValue = sortFilter.value;
        const cardsArray = Array.from(articleCards);
        
        switch(sortValue) {
            case 'date-desc':
                cardsArray.sort((a, b) => {
                    const dateA = new Date(a.querySelector('.article-date').textContent.replace(/[^\w\s,-]/g, ''));
                    const dateB = new Date(b.querySelector('.article-date').textContent.replace(/[^\w\s,-]/g, ''));
                    return dateB - dateA;
                });
                break;
            case 'date-asc':
                cardsArray.sort((a, b) => {
                    const dateA = new Date(a.querySelector('.article-date').textContent.replace(/[^\w\s,-]/g, ''));
                    const dateB = new Date(b.querySelector('.article-date').textContent.replace(/[^\w\s,-]/g, ''));
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
    }
    
    // Update pagination info based on visible cards
    function updatePaginationInfo() {
        if (paginationInfo) {
            const visibleCards = document.querySelectorAll('.article-card[style="display: block"], .article-card:not([style*="display"])').length;
            paginationInfo.textContent = `Showing ${visibleCards} article${visibleCards !== 1 ? 's' : ''}`;
        }
    }
    
    // Initialize reading progress for articles
    function initializeReadingProgress() {
        // Check if localStorage is available
        if (typeof(Storage) !== "undefined") {
            articleCards.forEach(card => {
                const articleLink = card.querySelector('.read-more');
                if (articleLink) {
                    const articleUrl = articleLink.getAttribute('href');
                    const progress = localStorage.getItem(`article-progress-${articleUrl}`);
                    
                    if (progress) {
                        // Add progress bar to card
                        if (!card.querySelector('.article-progress')) {
                            const progressBar = document.createElement('div');
                            progressBar.className = 'article-progress';
                            card.appendChild(progressBar);
                        }
                        
                        // Set progress attribute for styling
                        card.setAttribute('data-progress', progress);
                    }
                }
            });
        }
    }
    
    // Add tags to article cards
    articleCards.forEach(card => {
        const categories = card.dataset.categories;
        if (categories) {
            const tags = categories.split(' ');
            const cardFooter = document.createElement('div');
            cardFooter.className = 'article-card-footer';
            
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'article-tags-mini';
            
            tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'article-tag-mini';
                tagElement.textContent = `#${tag}`;
                tagsContainer.appendChild(tagElement);
            });
            
            cardFooter.appendChild(tagsContainer);
            
            // Add "New" badge for recent articles (less than 30 days old)
            const dateText = card.querySelector('.article-date').textContent;
            const articleDate = new Date(dateText.replace(/[^\w\s,-]/g, ''));
            const now = new Date();
            const daysDiff = Math.floor((now - articleDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff < 30) {
                const newBadge = document.createElement('div');
                newBadge.className = 'article-new-badge';
                newBadge.textContent = 'NEW';
                card.appendChild(newBadge);
            }
            
            card.appendChild(cardFooter);
        }
    });
    
    // Track reading progress when clicking on article links
    const articleLinks = document.querySelectorAll('.read-more');
    articleLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const articleUrl = this.getAttribute('href');
            // Set initial progress when starting to read
            if (typeof(Storage) !== "undefined") {
                if (!localStorage.getItem(`article-progress-${articleUrl}`)) {
                    localStorage.setItem(`article-progress-${articleUrl}`, "25");
                }
            }
        });
    });
});
