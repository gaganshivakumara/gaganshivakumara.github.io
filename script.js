/**
 * Gagan Shiva Kumara Portfolio
 * Features: Terminal Landing Page, Snake Game, Custom Cursor, Animations, Sound Effects, Particles
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ===== PARTICLE BACKGROUND SYSTEM =====
    const particleCanvas = document.getElementById('particle-canvas');
    let particles = [];
    let particleAnimationId;
    
    function initParticles() {
        if (!particleCanvas) return;
        
        const ctx = particleCanvas.getContext('2d');
        
        function resizeCanvas() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = Math.random() > 0.5 ? '#0061ff' : '#60efff';
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Wrap around screen
                if (this.x < 0) this.x = particleCanvas.width;
                if (this.x > particleCanvas.width) this.x = 0;
                if (this.y < 0) this.y = particleCanvas.height;
                if (this.y > particleCanvas.height) this.y = 0;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
        
        // Create particles
        const particleCount = Math.min(100, Math.floor((window.innerWidth * window.innerHeight) / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Draw connections between nearby particles
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = '#0061ff';
                        ctx.globalAlpha = 0.1 * (1 - distance / 150);
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
        }
        
        // Animation loop
        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            drawConnections();
            
            particleAnimationId = requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
    }
    
    // ===== SOUND SYSTEM =====
    let audioContext = null;
    let soundEnabled = true;
    
    // Sound toggle button
    const soundToggle = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundToggle.classList.toggle('muted', !soundEnabled);
            soundIcon.className = soundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        });
    }
    
    // Initialize Audio Context on first user interaction
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioContext;
    }
    
    // Sound generator functions
    const SoundFX = {
        // Terminal typing sound
        type: () => {
            if (!soundEnabled) return;
            const ctx = initAudio();
            if (!ctx) return;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
            gain.gain.setValueAtTime(0.03, ctx.currentTime);
            gain.gain.exponentialDecayTo = gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.05);
        },
        
        // Terminal command enter sound
        command: () => {
            if (!soundEnabled) return;
            const ctx = initAudio();
            if (!ctx) return;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.15);
        },
        
        // Snake eat food sound
        eat: () => {
            if (!soundEnabled) return;
            const ctx = initAudio();
            if (!ctx) return;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        },
        
        // Snake collision/death sound
        collision: () => {
            if (!soundEnabled) return;
            const ctx = initAudio();
            if (!ctx) return;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.4);
        },
        
        // Game win sound
        win: () => {
            if (!soundEnabled) return;
            const ctx = initAudio();
            if (!ctx) return;
            
            const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
                gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
                
                osc.start(ctx.currentTime + i * 0.15);
                osc.stop(ctx.currentTime + i * 0.15 + 0.3);
            });
        },
        
        // UI hover sound
        hover: () => {
            if (!soundEnabled) return;
            const ctx = initAudio();
            if (!ctx) return;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, ctx.currentTime);
            gain.gain.setValueAtTime(0.02, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.05);
        },
        
        // UI click sound
        click: () => {
            if (!soundEnabled) return;
            const ctx = initAudio();
            if (!ctx) return;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.1);
        },
        
        // Website enter transition sound
        transition: () => {
            if (!soundEnabled) return;
            const ctx = initAudio();
            if (!ctx) return;
            
            const osc = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc2.type = 'sine';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
            osc2.frequency.setValueAtTime(300, ctx.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            
            osc.start(ctx.currentTime);
            osc2.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.6);
            osc2.stop(ctx.currentTime + 0.6);
        },
        
        // Snake move sound (subtle)
        move: () => {
            if (!soundEnabled) return;
            const ctx = initAudio();
            if (!ctx) return;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            gain.gain.setValueAtTime(0.01, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.02);
        }
    };
    
    // ===== CUSTOM CURSOR =====
    const cursor = document.querySelector('.custom-cursor');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    if (cursor && cursorTrail) {
        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });
        
        // Smooth trail animation
        function animateTrail() {
            trailX += (mouseX - trailX) * 0.15;
            trailY += (mouseY - trailY) * 0.15;
            cursorTrail.style.left = trailX + 'px';
            cursorTrail.style.top = trailY + 'px';
            requestAnimationFrame(animateTrail);
        }
        animateTrail();
        
        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .clickable, .nav-link, .btn, .social-icon');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                SoundFX.hover();
            });
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
            el.addEventListener('click', () => SoundFX.click());
        });
    }
    
    // ===== TERMINAL LANDING PAGE =====
    const terminalOverlay = document.getElementById('terminal-overlay');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const mainContent = document.getElementById('main-content');
    const snakeGameContainer = document.getElementById('snake-game-container');
    
    // ASCII Art for GSK
    const asciiArt = `
 ██████╗ ███████╗██╗  ██╗
██╔════╝ ██╔════╝██║ ██╔╝
██║  ███╗███████╗█████╔╝ 
██║   ██║╚════██║██╔═██╗ 
╚██████╔╝███████║██║  ██╗
 ╚═════╝ ╚══════╝╚═╝  ╚═╝`;
    
    // Terminal command history
    let commandHistory = [];
    let historyIndex = -1;
    
    // Available commands
    const commands = {
        help: () => `
<span class="highlight">Available Commands:</span>
  <span class="command">help</span>      - Show this help message
  <span class="command">about</span>     - Learn about Gagan
  <span class="command">skills</span>    - View technical skills
  <span class="command">contact</span>   - Get contact information
  <span class="command">play</span>      - Start the Snake Game
  <span class="command">start</span>     - Enter the portfolio website
  <span class="command">clear</span>     - Clear the terminal
  <span class="command">ls</span>        - List available sections
  <span class="command">cat</span>       - Read a file (try: cat about.txt)
`,
        about: () => `
<span class="highlight">About Gagan Shiva Kumara:</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━
Emerging Software Engineer & Technology Leader
Founder of Hackabyte | Lead Facilitator @ Steamoji
Economics & Data Science @ Bellevue College

Passionate about AI, software engineering, and building
impactful solutions at the intersection of tech and innovation.
`,
        skills: () => `
<span class="highlight">Technical Skills:</span>
━━━━━━━━━━━━━━━━━━━━
▸ Python, C++, JavaScript
▸ AI & Data Science
▸ Web Development
▸ Robotics & Arduino
▸ CAD & 3D Printing
▸ UI/UX Design (Figma)
`,
        contact: () => `
<span class="highlight">Contact Information:</span>
━━━━━━━━━━━━━━━━━━━━━━
📧 Email: rhsgaganshivakumara@gmail.com
🔗 LinkedIn: linkedin.com/in/gaganshivakumara
💻 GitHub: github.com/CriptifyLit
`,
        ls: () => `
<span class="command">about.txt</span>    <span class="command">skills.txt</span>    <span class="command">projects/</span>
<span class="command">contact.txt</span>  <span class="command">education/</span>    <span class="command">awards/</span>
`,
        clear: () => {
            terminalOutput.innerHTML = '';
            return '';
        },
        play: () => {
            setTimeout(() => {
                document.querySelector('.terminal-container').style.display = 'none';
                snakeGameContainer.classList.remove('hidden');
                initSnakeGame();
            }, 500);
            return '<span class="highlight">Starting Snake Game...</span>\nReach 5 points to enter the website!';
        },
        start: () => {
            setTimeout(() => enterWebsite(), 1000);
            return '<span class="highlight">Launching portfolio...</span>';
        }
    };
    
    // Handle cat command
    function handleCat(args) {
        const files = {
            'about.txt': commands.about(),
            'skills.txt': commands.skills(),
            'contact.txt': commands.contact()
        };
        if (args.length === 0) return '<span class="response">Usage: cat &lt;filename&gt;</span>';
        const filename = args[0];
        return files[filename] || `<span class="response">cat: ${filename}: No such file</span>`;
    }
    
    // Typewriter effect
    function typeWriter(element, text, speed = 30, callback) {
        let i = 0;
        element.innerHTML = '';
        function type() {
            if (i < text.length) {
                if (text.substr(i, 1) === '<') {
                    // Handle HTML tags
                    const closeTag = text.indexOf('>', i);
                    element.innerHTML += text.substring(i, closeTag + 1);
                    i = closeTag + 1;
                } else {
                    element.innerHTML += text.charAt(i);
                    i++;
                }
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }
    
    // Initial terminal welcome message
    function showWelcome() {
        const welcomeText = `<span class="ascii-art">${asciiArt}</span>

<span class="highlight">Welcome to Gagan Shiva Kumara's Portfolio Terminal</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type <span class="command">'help'</span> to see available commands
Type <span class="command">'play'</span> to start the Snake Game
Type <span class="command">'start'</span> to enter the website directly

`;
        typeWriter(terminalOutput, welcomeText, 5, () => {
            terminalInput.focus();
        });
    }
    
    // Process terminal command
    function processCommand(input) {
        const [cmd, ...args] = input.toLowerCase().trim().split(' ');
        
        if (cmd === '') return '';
        
        commandHistory.push(input);
        historyIndex = commandHistory.length;
        
        if (cmd === 'cat') return handleCat(args);
        if (commands[cmd]) return commands[cmd]();
        
        return `<span class="response">Command not found: ${cmd}. Type 'help' for available commands.</span>`;
    }
    
    // Handle terminal input
    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                SoundFX.command();
                const input = terminalInput.value;
                const output = processCommand(input);
                
                // Add command to output
                terminalOutput.innerHTML += `\n<span class="command">visitor@gsk:~$</span> ${input}\n${output}`;
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
                terminalInput.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            } else if (e.key.length === 1) {
                // Play typing sound for character keys
                SoundFX.type();
            }
        });
        
        showWelcome();
    }
    
    // ===== SNAKE GAME =====
    function initSnakeGame() {
        const canvas = document.getElementById('snake-canvas');
        const ctx = canvas.getContext('2d');
        const scoreDisplay = document.getElementById('snake-score');
        
        const gridSize = 20;
        const tileCount = canvas.width / gridSize;
        
        let snake = [{ x: 10, y: 10 }];
        let food = { x: 15, y: 15 };
        let dx = 0, dy = 0;
        let score = 0;
        const targetScore = 5;
        let gameLoop;
        let gameSpeed = 150;
        
        // Color cycling
        let colorHue = 200;
        
        function drawGame() {
            // Clear canvas
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid (subtle)
            ctx.strokeStyle = 'rgba(96, 239, 255, 0.1)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i <= tileCount; i++) {
                ctx.beginPath();
                ctx.moveTo(i * gridSize, 0);
                ctx.lineTo(i * gridSize, canvas.height);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i * gridSize);
                ctx.lineTo(canvas.width, i * gridSize);
                ctx.stroke();
            }
            
            // Update color hue for cycling effect
            colorHue = (colorHue + 0.5) % 360;
            const snakeColor = `hsl(${colorHue}, 100%, 60%)`;
            
            // Draw snake with glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = snakeColor;
            snake.forEach((segment, index) => {
                const alpha = 1 - (index / snake.length) * 0.5;
                ctx.fillStyle = index === 0 ? '#60efff' : `rgba(0, 97, 255, ${alpha})`;
                ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
            });
            
            // Draw food with pulsing glow
            ctx.shadowColor = '#ff6b6b';
            ctx.shadowBlur = 20 + Math.sin(Date.now() / 200) * 5;
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        function moveSnake() {
            if (dx === 0 && dy === 0) return;
            
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            
            // Wall collision - wrap around
            if (head.x < 0) head.x = tileCount - 1;
            if (head.x >= tileCount) head.x = 0;
            if (head.y < 0) head.y = tileCount - 1;
            if (head.y >= tileCount) head.y = 0;
            
            // Self collision
            if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                SoundFX.collision();
                resetGame();
                return;
            }
            
            snake.unshift(head);
            
            // Check food collision
            if (head.x === food.x && head.y === food.y) {
                SoundFX.eat();
                score++;
                scoreDisplay.textContent = `Score: ${score} / ${targetScore}`;
                
                if (score >= targetScore) {
                    SoundFX.win();
                    clearInterval(gameLoop);
                    setTimeout(() => enterWebsite(), 1000);
                    return;
                }
                
                // New food position
                do {
                    food = {
                        x: Math.floor(Math.random() * tileCount),
                        y: Math.floor(Math.random() * tileCount)
                    };
                } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
                
                // Speed up slightly
                clearInterval(gameLoop);
                gameSpeed = Math.max(80, gameSpeed - 5);
                gameLoop = setInterval(gameUpdate, gameSpeed);
            } else {
                snake.pop();
            }
        }
        
        function resetGame() {
            snake = [{ x: 10, y: 10 }];
            dx = 0;
            dy = 0;
            score = 0;
            scoreDisplay.textContent = `Score: ${score} / ${targetScore}`;
            gameSpeed = 150;
            clearInterval(gameLoop);
            gameLoop = setInterval(gameUpdate, gameSpeed);
        }
        
        function gameUpdate() {
            moveSnake();
            drawGame();
        }
        
        // Controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp': case 'w': case 'W':
                    if (dy !== 1) { dx = 0; dy = -1; SoundFX.move(); }
                    e.preventDefault();
                    break;
                case 'ArrowDown': case 's': case 'S':
                    if (dy !== -1) { dx = 0; dy = 1; SoundFX.move(); }
                    e.preventDefault();
                    break;
                case 'ArrowLeft': case 'a': case 'A':
                    if (dx !== 1) { dx = -1; dy = 0; SoundFX.move(); }
                    e.preventDefault();
                    break;
                case 'ArrowRight': case 'd': case 'D':
                    if (dx !== -1) { dx = 1; dy = 0; SoundFX.move(); }
                    e.preventDefault();
                    break;
            }
        });
        
        // Start game
        gameLoop = setInterval(gameUpdate, gameSpeed);
        drawGame();
    }
    
    // ===== ENTER WEBSITE =====
    function enterWebsite() {
        SoundFX.transition();
        terminalOverlay.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        // Initialize particle background
        initParticles();
        
        // Re-initialize cursor hover effects for main content
        setTimeout(() => {
            const interactiveElements = document.querySelectorAll('a, button, input, textarea, .clickable, .nav-link, .btn, .social-icon');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('hover');
                    SoundFX.hover();
                });
                el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
                el.addEventListener('click', () => SoundFX.click());
            });
            
            // Trigger initial scroll animations
            const fadeElements = document.querySelectorAll('.fade-on-scroll, .slide-left, .slide-right, .scale-up');
            fadeElements.forEach(el => observer.observe(el));
        }, 100);
    }
    
    // ===== MAIN WEBSITE FUNCTIONALITY =====
    
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Animation (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-on-scroll');
    fadeElements.forEach(el => observer.observe(el));

    // Navbar Background Change on Scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(13, 13, 13, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            } else {
                navbar.style.background = 'rgba(13, 13, 13, 0.8)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // ===== CONTACT FORM HANDLING =====
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.className = 'form-status loading';
            formStatus.textContent = 'Sending your message...';
            
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    SoundFX.win();
                    formStatus.className = 'form-status success';
                    formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Something went wrong');
                }
            } catch (error) {
                SoundFX.collision();
                formStatus.className = 'form-status error';
                formStatus.textContent = '✗ Failed to send message. Please try again or email directly.';
                console.error('Form submission error:', error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                
                // Hide status after 5 seconds
                setTimeout(() => {
                    formStatus.className = 'form-status';
                    formStatus.textContent = '';
                }, 5000);
            }
        });
    }

    // ===== SEATTLE TIME & WEATHER WIDGET =====
    function updateSeattleTime() {
        const timeEl = document.getElementById('seattle-time');
        if (!timeEl) return;
        
        const options = {
            timeZone: 'America/Los_Angeles',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        
        const seattleTime = new Date().toLocaleTimeString('en-US', options);
        timeEl.textContent = seattleTime;
    }
    
    // Update time every second
    updateSeattleTime();
    setInterval(updateSeattleTime, 1000);
    
    // Fetch Seattle weather (using wttr.in - free, no API key needed)
    async function fetchSeattleWeather() {
        const weatherEl = document.getElementById('seattle-weather');
        if (!weatherEl) return;
        
        try {
            const response = await fetch('https://wttr.in/Seattle?format=%t');
            if (response.ok) {
                let temp = await response.text();
                // Convert to Fahrenheit display
                temp = temp.trim();
                weatherEl.textContent = temp;
            }
        } catch (error) {
            // Fallback to estimated Seattle weather
            weatherEl.textContent = '48°F';
        }
    }
    
    // Fetch weather on load and every 10 minutes
    fetchSeattleWeather();
    setInterval(fetchSeattleWeather, 600000);
});
