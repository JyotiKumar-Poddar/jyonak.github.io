// JavaScript for Articles functionality

document.addEventListener('DOMContentLoaded', function() {
    // Article search functionality
    const searchInput = document.getElementById('article-search');
    const articleCards = document.querySelectorAll('.article-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            articleCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const categories = card.dataset.categories ? card.dataset.categories.toLowerCase() : '';
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || categories.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            updatePaginationInfo();
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
