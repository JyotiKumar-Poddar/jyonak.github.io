// Article navigation system
document.addEventListener('DOMContentLoaded', function() {
    // Previous/Next article navigation
    const prevArticleLink = document.querySelector('.article-nav-link:nth-child(2)');
    const nextArticleLink = document.querySelector('.article-nav-link:nth-child(1)');
    
    // Breadcrumb navigation
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
    
    // Table of contents navigation
    const tocLinks = document.querySelectorAll('.toc-link');
    
    // Add smooth scrolling to TOC links
    if (tocLinks.length > 0) {
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
                    
                    // Highlight active TOC link
                    tocLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
    
    // Highlight current section in TOC while scrolling
    function highlightTOC() {
        const sections = document.querySelectorAll('.article-body h2, .article-body h3');
        
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
    
    // Back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Article history navigation (browser back/forward)
    window.addEventListener('popstate', function() {
        // If hash exists, scroll to the element
        if (location.hash) {
            const targetElement = document.querySelector(location.hash);
            if (targetElement) {
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    });
    
    // Add keyboard navigation for articles
    document.addEventListener('keydown', function(e) {
        // Left arrow key for previous article
        if (e.key === 'ArrowLeft' && prevArticleLink) {
            prevArticleLink.click();
        }
        
        // Right arrow key for next article
        if (e.key === 'ArrowRight' && nextArticleLink) {
            nextArticleLink.click();
        }
        
        // Home key for top of article
        if (e.key === 'Home' && articleBody) {
            window.scrollTo({
                top: articleBody.offsetTop - 100,
                behavior: 'smooth'
            });
        }
        
        // End key for bottom of article
        if (e.key === 'End' && articleBody) {
            window.scrollTo({
                top: articleBody.offsetTop + articleBody.offsetHeight - window.innerHeight,
                behavior: 'smooth'
            });
        }
    });
});
