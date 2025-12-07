document.addEventListener('DOMContentLoaded', () => {

    // Loader
    // Loader
    const loader = document.getElementById('loader');
    const counter = document.querySelector('.loader-counter');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1; // Random increment
        if (progress > 100) progress = 100;

        if (counter) counter.textContent = progress;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }, 200);
        }
    }, 30);

    // Asset Configuration
    const assets = {
        kings: [
            "Aayo purbeli.jpg",
            "Dhamika  reveal.jpg",
            "Fuller.jpg",
            "Guess Ranjane.jpg",
            "Lange Fury.jpg",
            "Match day Nep vs Qatar.jpg",
            "Player Reveal.jpg",
            "Super 6 Nep UAE.jpg",
            "Suspense.jpg",
            "faf arriving.jpg",
            "hongkong Nep vs Afghan.jpg",
            "kings never quit.jpg",
            "match Day Mani Wi.jpg",
            "merchant Blinders.jpg",
            "trohpy.jpg",
            "tuf of war.jpg"
        ],
        yaks: [
            "Guess.jpg",
            "Mark Watt 2.jpg",
            "Match Day against Kings.jpg",
            "Max.jpg",
            "Priyank Panchal.jpg",
            "Talent Hunt Winner.jpg",
            "Zadran.jpg",
            "champions.jpg",
            "match day against KAG.jpg",
            "match day vs sudur paschim.jpg",
            "we rise we win.jpg"
        ],
        logos: [
            "3x3 nepal.png",
            "Biratngar Kings.png",
            "KY_final logo.png",
            "Nepal Basketball Association LOGO.jpg"
        ]
    };

    const kingsGrid = document.getElementById('gallery-kings');
    const yaksGrid = document.getElementById('gallery-yaks');

    // Helper to Create Gallery Items
    function createGalleryItem(filename, folder) {
        // Encode URI component to handle spaces in filenames
        const safeFilename = encodeURIComponent(filename);
        const folderPath = folder === 'kings' ? 'Biratnagar Kings' : 'Karnali Yaks';
        const src = `assets/${folderPath}/${safeFilename}`;

        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<img src="${src}" alt="${filename}" loading="lazy" onerror="this.onerror=null; this.parentElement.style.display='none';">`;
        return div;
    }

    // Populate Kings
    if (kingsGrid) {
        assets.kings.forEach(file => {
            kingsGrid.appendChild(createGalleryItem(file, 'kings'));
        });
    }

    // Populate Yaks
    if (yaksGrid) {
        assets.yaks.forEach(file => {
            yaksGrid.appendChild(createGalleryItem(file, 'yaks'));
        });
    }

    // Populate Logos (with 4 duplicates for seamless infinite scroll)
    function populateLogos(container) {
        if (!container) return;
        assets.logos.forEach(file => {
            const safeFilename = encodeURIComponent(file);
            const src = `assets/Worked Companies Logos/${safeFilename}`;

            const img = document.createElement('img');
            img.src = src;
            img.alt = file;
            img.className = 'client-logo';
            img.title = file.replace(/\.(png|jpg|jpeg)/i, '');
            container.appendChild(img);
        });
    }

    // Populate all 4 logo grids
    populateLogos(document.getElementById('client-logos-1'));
    populateLogos(document.getElementById('client-logos-2'));
    populateLogos(document.getElementById('client-logos-3'));
    populateLogos(document.getElementById('client-logos-4'));

    console.log("Galleries populated.");
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('section, .gallery-item').forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'; // Smooth ease
    observer.observe(section);
});
