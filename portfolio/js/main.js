// Main JavaScript file for JyotiKumar Poddar's portfolio website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add active class to navigation links based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Add scroll event listener for active nav highlighting
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initialize active nav link on page load
    updateActiveNavLink();

    // Typewriter effect for hero text
    function typeWriter(element, text, speed, delay = 0) {
        let i = 0;
        setTimeout(() => {
            const typing = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                    // Add blinking cursor class after typing is complete
                    element.classList.add('typing-done');
                }
            }, speed);
        }, delay);
    }

    const heroTitle = document.querySelector('.typewriter');
    const heroSubtitle = document.querySelector('.typing-text');
    
    if (heroTitle && heroSubtitle) {
        // Clear the text content first
        const titleText = heroTitle.textContent;
        const subtitleText = heroSubtitle.textContent;
        
        heroTitle.textContent = '';
        heroSubtitle.textContent = '';
        
        // Start typewriter effect
        typeWriter(heroTitle, titleText, 100);
        typeWriter(heroSubtitle, subtitleText, 50, titleText.length * 100 + 500);
    }

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const barPosition = bar.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (barPosition < screenPosition) {
                const width = bar.getAttribute('style').match(/width: (\d+)%/)[1];
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 100);
            }
        });
    }
    
    // Add scroll event listener for skill bar animations
    window.addEventListener('scroll', animateSkillBars);
    
    // Initialize skill bar animations on page load
    setTimeout(animateSkillBars, 500);

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

    // Terminal cursor blinking effect
    const terminalPrompt = document.querySelector('.terminal-line:last-child .terminal-command');
    if (terminalPrompt) {
        setInterval(() => {
            terminalPrompt.classList.toggle('blink');
        }, 500);
    }

    // Add animation to project cards and article cards on scroll
    const projectCards = document.querySelectorAll('.project-card');
    const articleCards = document.querySelectorAll('.article-card');
    
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    function animateOnScroll() {
        projectCards.forEach((card, index) => {
            if (isInViewport(card)) {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            }
        });
        
        articleCards.forEach((card, index) => {
            if (isInViewport(card)) {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            }
        });
    }
    
    // Add scroll event listener for animations
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialize animations on page load
    setTimeout(animateOnScroll, 300);

    // Add interactive terminal functionality
    const terminalElement = document.querySelector('.terminal');
    if (terminalElement) {
        terminalElement.addEventListener('click', function() {
            const lastCommand = this.querySelector('.terminal-line:last-child .terminal-command');
            if (lastCommand && lastCommand.textContent === '_') {
                lastCommand.textContent = '';
                lastCommand.setAttribute('contenteditable', 'true');
                lastCommand.focus();
            }
        });

        // Handle terminal commands
        const terminalContent = document.querySelector('.terminal-content');
        if (terminalContent) {
            terminalContent.addEventListener('keydown', function(e) {
                const activeCommand = document.querySelector('.terminal-command[contenteditable="true"]');
                if (activeCommand && e.key === 'Enter') {
                    e.preventDefault();
                    const command = activeCommand.textContent.trim();
                    activeCommand.setAttribute('contenteditable', 'false');
                    
                    // Process command
                    let output = '';
                    switch(command.toLowerCase()) {
                        case 'help':
                            output = 'Available commands: help, about, skills, projects, contact, clear';
                            break;
                        case 'about':
                            output = 'JyotiKumar Poddar - Backend Developer & Software Engineer';
                            break;
                        case 'skills':
                            output = 'Java, Go, JavaScript, Python, Spring Boot, React, Redux, Redis';
                            break;
                        case 'projects':
                            output = 'Check out my projects section for code samples and demos!';
                            break;
                        case 'contact':
                            output = 'Email: contact@example.com | GitHub: JyotiKumar-Poddar';
                            break;
                        case 'clear':
                            // Clear terminal except for the first three lines
                            const firstLines = Array.from(terminalContent.querySelectorAll('.terminal-line')).slice(0, 3);
                            terminalContent.innerHTML = '';
                            firstLines.forEach(line => terminalContent.appendChild(line));
                            break;
                        default:
                            if (command === '') {
                                output = '';
                            } else {
                                output = `Command not found: ${command}. Type 'help' for available commands.`;
                            }
                    }
                    
                    // Add output if any
                    if (output && command !== 'clear') {
                        const outputLine = document.createElement('div');
                        outputLine.className = 'terminal-line';
                        outputLine.innerHTML = `<span class="terminal-output">${output}</span>`;
                        terminalContent.appendChild(outputLine);
                    }
                    
                    // Add new command line
                    const newCommandLine = document.createElement('div');
                    newCommandLine.className = 'terminal-line';
                    newCommandLine.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-command">_</span>`;
                    terminalContent.appendChild(newCommandLine);
                    
                    // Scroll to bottom
                    terminalContent.scrollTop = terminalContent.scrollHeight;
                }
            });
        }
    }
});
