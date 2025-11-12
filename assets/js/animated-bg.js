// Animated Background with Vertical Lines and Mouse Hole Effect
(function() {
    'use strict';

    // Only run on home page with profile mode
    const profileElement = document.querySelector('.profile');
    if (!profileElement) return;

    // Create canvas container
    const bgContainer = document.createElement('div');
    bgContainer.className = 'animated-bg';
    
    const canvas = document.createElement('canvas');
    canvas.id = 'bg-canvas';
    bgContainer.appendChild(canvas);
    
    profileElement.insertBefore(bgContainer, profileElement.firstChild);
    
    const ctx = canvas.getContext('2d', { alpha: true });
    
    // Configuration
    const config = {
        lineCount: 30,
        fontSize: 16,
        lineSpacing: 40,
        speed: 0.15,
        holeRadius: 150,
        holeIntensity: 1.2,
        vertexStrength: 30,
        fontSizeMin: 12,
        fontSizeMax: 30,
        charSpacingMin: 180,
        charSpacingMax: 280,
        // Extended ASCII characters - includes symbols, letters, numbers
        asciiChars: [
            '^', '.', '*', '|', '·', ':', '˙', '•', '°', '`', "'", ',',
            '!', '@', '#', '$', '%', '&', '(', ')', '-', '_', '=', '+',
            '[', ']', '{', '}', ';', '/', '\\', '?', '<', '>', '~',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
            'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        ]
    };
    
    let lines = [];
    let mouseX = -1000;
    let mouseY = -1000;
    let isDarkMode = false;
    
    // Resize canvas to match container
    function resizeCanvas() {
        const rect = profileElement.getBoundingClientRect();
        
        // Safety check: don't set invalid dimensions
        if (rect.width > 0 && rect.height > 0) {
            canvas.width = rect.width;
            canvas.height = rect.height;
            initLines();
        }
    }
    
    // Check current theme
    function checkTheme() {
        const theme = document.documentElement.getAttribute('data-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        isDarkMode = theme === 'dark' || (theme === 'auto' && prefersDark);
    }
    
    // Initialize lines
    function initLines() {
        lines = [];
        const lineCount = Math.ceil(canvas.width / config.lineSpacing) + 2;
        
        for (let i = 0; i < lineCount; i++) {
            lines.push({
                x: i * config.lineSpacing - config.lineSpacing,
                offset: Math.random() * canvas.height,
                opacity: 0.2 + Math.random() * 0.3,
                charSpacing: config.charSpacingMin + Math.random() * (config.charSpacingMax - config.charSpacingMin),
                characters: [], // Store individual characters for each position
                sizes: [] // Store individual sizes for each character
            });
        }
    }
    
    // Get character at a specific index, generating it if needed
    function getCharAtIndex(line, index) {
        if (!line.characters[index]) {
            line.characters[index] = config.asciiChars[Math.floor(Math.random() * config.asciiChars.length)];
            line.sizes[index] = config.fontSizeMin + Math.random() * (config.fontSizeMax - config.fontSizeMin);
            // Assign a random color from the gradient palette (static per character)
            line.colors = line.colors || [];
            line.colors[index] = getRandomGradientColor(isDarkMode);
        }
        return {
            char: line.characters[index],
            size: line.sizes[index],
            color: line.colors[index]
        };
    }
    
    // Get a random color between primary and secondary from the light theme color palette
    function getRandomGradientColor(isDark) {
        // Use light theme colors for both dark and light modes
        // Light theme primary: orange-to-red gradient
        const primaryColors = [
            { r: 255, g: 174, b: 3 },   // #ffae03ff (orange web)
            { r: 230, g: 127, b: 13 },  // #e67f0dff (fulvous)
            { r: 254, g: 78, b: 0 }     // #fe4e00ff (aerospace orange)
        ];
        // Light theme secondary: rose/pink
        const secondaryColor = { r: 255, g: 15, b: 128 }; // #ff0f80ff (rose)
        
        // Pick a random primary color
        const primaryColor = primaryColors[Math.floor(Math.random() * primaryColors.length)];
        
        // Blend between primary and secondary randomly (0-1)
        const blend = Math.random();
        
        return {
            r: Math.round(primaryColor.r + (secondaryColor.r - primaryColor.r) * blend),
            g: Math.round(primaryColor.g + (secondaryColor.g - primaryColor.g) * blend),
            b: Math.round(primaryColor.b + (secondaryColor.b - primaryColor.b) * blend)
        };
    }
    function getLineOpacity(x, y, baseOpacity) {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.holeRadius) {
            // Create dark hole effect - reduce opacity based on distance
            const factor = distance / config.holeRadius;
            const reduction = (1 - factor) * config.holeIntensity;
            return Math.max(0, baseOpacity * (1 - reduction));
        }
        
        return baseOpacity;
    }
    
    // Calculate vertex displacement for position
    function getVertexDisplacement(x, y) {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.holeRadius && distance > 0) {
            // Push characters away from cursor (vertex effect)
            const factor = 1 - (distance / config.holeRadius);
            const strength = factor * config.vertexStrength;
            const angle = Math.atan2(dy, dx);
            
            return {
                x: Math.cos(angle) * strength,
                y: Math.sin(angle) * strength
            };
        }
        
        return { x: 0, y: 0 };
    }
    
    // Draw animated lines with ASCII characters
    function drawLines() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Safety check: ensure lines exist
        if (!lines || lines.length === 0) {
            return;
        }
        
        lines.forEach(line => {
            // Validate line object
            if (!line || !line.hasOwnProperty('offset')) {
                return;
            }
            
            // Update position - all lines move at same speed
            if (isDarkMode) {
                // Dark mode: characters move down
                line.offset += config.speed;
                if (line.offset > canvas.height + line.charSpacing * 10) {
                    line.offset = -line.charSpacing * 10;
                    // Clear characters when resetting
                    line.characters = [];
                    line.sizes = [];
                    line.colors = [];
                }
            } else {
                // Light mode: characters move up
                line.offset -= config.speed;
                if (line.offset < -line.charSpacing * 10) {
                    line.offset = canvas.height + line.charSpacing * 10;
                    // Clear characters when resetting
                    line.characters = [];
                    line.sizes = [];
                    line.colors = [];
                }
            }
            
            // Draw multiple characters along the vertical line
            const numChars = Math.ceil(canvas.height / line.charSpacing) + 2;
            
            for (let i = 0; i < numChars; i++) {
                const baseY = (line.offset + i * line.charSpacing) % (canvas.height + line.charSpacing);
                
                if (baseY > -line.charSpacing && baseY < canvas.height + line.charSpacing) {
                    // Get the character and size for this position
                    const charData = getCharAtIndex(line, i);
                    
                    // Set font with random size
                    ctx.font = `${charData.size}px monospace`;
                    
                    // Apply vertex displacement
                    const displacement = getVertexDisplacement(line.x, baseY);
                    const finalX = line.x + displacement.x;
                    const finalY = baseY + displacement.y;
                    
                    // Apply hole effect for opacity
                    const charOpacity = getLineOpacity(line.x, baseY, line.opacity);
                    
                    if (charOpacity > 0.01) {
                        // Use the character's assigned color from the gradient palette
                        const color = charData.color;
                        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${charOpacity})`;
                        ctx.fillText(charData.char, finalX, finalY);
                    }
                }
            }
        });
    }
    
    // Animation loop
    function animate() {
        checkTheme();
        drawLines();
        requestAnimationFrame(animate);
    }
    
    // Track mouse position
    profileElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    // Reset mouse position when leaving
    profileElement.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Handle theme changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-theme') {
                checkTheme();
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
    
    // Initialize
    resizeCanvas();
    checkTheme();
    animate();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });
})();
