document.addEventListener('DOMContentLoaded', () => {
    const explosionContainer = document.getElementById('explosion-container');
    const flowerStarsContainer = document.getElementById('flower-stars-container');
    const namesContainer = document.getElementById('names-container');
    const petalRainContainer = document.getElementById('petal-rain-container');

    const sunflowers = [];
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isRevealed = false;

    const explosionSound = new Audio('explosion.mp3');
    const bgMusic = new Audio('romantic-music.mp3');
    bgMusic.loop = true;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isRevealed) {
            namesContainer.style.opacity = '1';
            explosionSound.play().catch(() => {});
            bgMusic.play().catch(() => {});
            isRevealed = true;
            startTypingEffect();
        }
    });

    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        if (!isRevealed) {
            namesContainer.style.opacity = '1';
            explosionSound.play().catch(() => {});
            bgMusic.play().catch(() => {});
            isRevealed = true;
            startTypingEffect();
        }
    }, { passive: false });

    const numberOfExplosionParticles = 80;
    const explosionDistanceFactor = 200;
    const numberOfFlowerStars = 60;

    function startExplosion() {
        for (let i = 0; i < numberOfExplosionParticles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('explosion-particle');
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * explosionDistanceFactor + 50;
            const endX = distance * Math.cos(angle);
            const endY = distance * Math.sin(angle);

            particle.style.setProperty('--x', `${endX}px`);
            particle.style.setProperty('--y', `${endY}px`);
            particle.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;

            explosionContainer.appendChild(particle);
            setTimeout(() => { particle.style.animationPlayState = 'running'; }, i * 5);
        }
        setTimeout(() => {
            explosionContainer.innerHTML = '';
            startFlowerStars();
        }, 1200);
    }

    // Función para lluvia de pétalos
    function createPetalRain() {
        const petal = document.createElement('div');
        petal.classList.add('falling-petal');

        petal.style.left = `${Math.random() * 100}vw`;
        petal.style.width = `${Math.random() * 20 + 10}px`;
        petal.style.transform = `rotate(${Math.random() * 360}deg)`;
        petal.style.animationDuration = `${Math.random() * 8 + 10}s`;

        petalRainContainer.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 18000);
    }

    const petalRainInterval = setInterval(createPetalRain, 300);
    setTimeout(() => clearInterval(petalRainInterval), 120000);

    function createFlowerStar() {
        const flowerStar = document.createElement('div');
        flowerStar.classList.add('flower-star');

        const center = document.createElement('div');
        center.classList.add('flower-star-center');
        flowerStar.appendChild(center);

        const petalsGroup = document.createElement('div');
        petalsGroup.classList.add('flower-petals-group');
        flowerStar.appendChild(petalsGroup);

        const numberOfPetals = 12;
        for (let j = 0; j < numberOfPetals; j++) {
            const petal = document.createElement('div');
            petal.classList.add('flower-star-petal');
            const rotation = (360 / numberOfPetals) * j;
            petal.style.setProperty('--rotation', `${rotation}deg`);
            petalsGroup.appendChild(petal);
        }

        flowerStar.x = Math.random() * window.innerWidth;
        flowerStar.y = Math.random() * window.innerHeight;
        flowerStar.restX = flowerStar.x;
        flowerStar.restY = flowerStar.y;
        flowerStar.speed = Math.random() * 0.05 + 0.01;
        flowerStar.rotationSpeed = Math.random() * 1 - 0.5;
        flowerStar.currentRotation = 0;

        return flowerStar;
    }

    function startFlowerStars() {
        for (let i = 0; i < numberOfFlowerStars; i++) {
            const flowerStar = createFlowerStar();
            flowerStarsContainer.appendChild(flowerStar);
            sunflowers.push(flowerStar);
            flowerStar.style.transform = `translate(${flowerStar.x}px, ${flowerStar.y}px)`;
            setTimeout(() => { flowerStar.style.opacity = '1'; }, 1000 + i * 20);
        }
        animateSunflowers();
        sparkleEffect();
    }

    function animateSunflowers() {
        sunflowers.forEach((sunflower) => {
            const dx = mouseX - sunflower.x;
            const dy = mouseY - sunflower.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            let targetX, targetY;

            if (distance < 200) {
                targetX = mouseX;
                targetY = mouseY;
                sunflower.currentRotation += sunflower.rotationSpeed * 2;
            } else {
                targetX = sunflower.restX;
                targetY = sunflower.restY;
                sunflower.currentRotation += sunflower.rotationSpeed;
            }

            sunflower.x += (targetX - sunflower.x) * sunflower.speed;
            sunflower.y += (targetY - sunflower.y) * sunflower.speed;

            sunflower.style.transform = `translate(${sunflower.x}px, ${sunflower.y}px) rotate(${sunflower.currentRotation}deg)`;
        });

        requestAnimationFrame(animateSunflowers);
    }

    // Efecto chispeo
    function sparkleEffect() {
        setInterval(() => {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'absolute';
            sparkle.style.width = '6px';
            sparkle.style.height = '6px';
            sparkle.style.background = 'gold';
            sparkle.style.borderRadius = '50%';
            sparkle.style.left = `${Math.random() * window.innerWidth}px`;
            sparkle.style.top = `${Math.random() * window.innerHeight}px`;
            sparkle.style.opacity = '1';
            sparkle.style.boxShadow = '0 0 10px gold';

            document.body.appendChild(sparkle);

            setTimeout(() => {
                sparkle.style.transition = 'opacity 1s ease-out';
                sparkle.style.opacity = '0';
            }, 300);

            setTimeout(() => sparkle.remove(), 1300);
        }, 500);
    }

    // Efecto escritura en nombres
    function startTypingEffect() {
        const names = namesContainer.querySelectorAll('.name, .heart');
        let delay = 0;
        names.forEach((el) => {
            const text = el.textContent;
            el.textContent = '';
            [...text].forEach((char, i) => {
                setTimeout(() => {
                    el.textContent += char;
                }, delay + i * 100);
            });
            delay += text.length * 100 + 500;
        });
    }

    startExplosion();
});
