document.addEventListener('DOMContentLoaded', () => {
    // Welcome Screen & Music Autoplay
    const welcomeScreen = document.getElementById('welcome-screen');
    const openInvitationBtn = document.getElementById('open-invitation-btn');
    const backgroundMusic = document.getElementById('background-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = musicToggle.querySelector('.icon i');

    // Add your actual background music file path here
    // For example: backgroundMusic.src = 'assets/audio/beautiful-wedding-music.mp3';
    // Ensure you have an audio file named 'your-background-music.mp3' in the same directory or adjust the path.
    backgroundMusic.src = 'music.mp3'; // IMPORTANT: Replace with your audio file path

    let isMusicPlaying = false; // Track music state

    // Function to handle music play/pause
    const toggleMusic = () => {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicIcon.classList.remove('fa-music');
            musicIcon.classList.add('fa-volume-mute'); // Mute icon
        } else {
            backgroundMusic.play().catch(e => {
                console.error("Autoplay prevented:", e);
                alert("Browser Anda mungkin memblokir autoplay audio. Silakan putar manual.");
            });
            musicIcon.classList.remove('fa-volume-mute');
            musicIcon.classList.add('fa-music'); // Musical note icon
        }
        isMusicPlaying = !isMusicPlaying;
    };

    openInvitationBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        // Play music after user interaction (crucial for modern browser policies)
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            musicIcon.classList.remove('fa-volume-mute');
            musicIcon.classList.add('fa-music');
        }).catch(e => {
            console.error("Autoplay prevented after click:", e);
            // Optionally, show a message to the user that music couldn't play automatically
        });
    });

    musicToggle.addEventListener('click', toggleMusic);


    // Smooth Scrolling for Navigation
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Remove active class from all and add to clicked one
            document.querySelectorAll('nav ul li a').forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Set initial active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Countdown Timer
    const countdownElement = document.getElementById('countdown');
    // Set your wedding date and time (Year, Month (0-11), Day, Hour, Minute, Second)
    // Example: December 25, 2026 10:00:00 WIB (GMT+7)
    // Adjust the time to match WIB (UTC+7) if your server isn't in WIB.
    // For 09:00 WIB, set it to 02:00:00Z for UTC (since WIB is UTC+7)
    // The date for the example is set to February 14, 2026 09:00:00 WIB
    const eventDate = new Date('February 14, 2026 09:00:00 GMT+0700').getTime(); 

    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventDate - now;

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (countdownElement) {
            countdownElement.innerHTML = `
                <div><span>${days < 10 ? '0' + days : days}</span><p>Hari</p></div>
                <div><span>${hours < 10 ? '0' + hours : hours}</span><p>Jam</p></div>
                <div><span>${minutes < 10 ? '0' + minutes : minutes}</span><p>Menit</p></div>
                <div><span>${seconds < 10 ? '0' + seconds : seconds}</span><p>Detik</p></div>
            `;
        }


        if (distance < 0) {
            clearInterval(updateCountdown);
            if (countdownElement) {
                countdownElement.innerHTML = "<h2>Acara Telah Dimulai!</h2>";
            }
        }
    }, 1000);

    // Leaflet Map Initialization
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Replace with your actual latitude and longitude of the wedding venue
        const latitude = -6.2088; // Example: Monas, Jakarta (replace with your venue's lat)
        const longitude = 106.8456; // Example: Monas, Jakarta (replace with your venue's long)

        const myMap = L.map('map').setView([latitude, longitude], 15); // 15 is zoom level

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(myMap);

        L.marker([latitude, longitude]).addTo(myMap)
            .bindPopup('<b>Lokasi Pernikahan Kami</b><br>Silakan hadir tepat waktu.')
            .openPopup(); // Opens the popup automatically
    }

    // RSVP Form Submission (Frontend only for now)
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpMessage = document.getElementById('rsvpMessage');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nama = document.getElementById('nama').value;
            const kehadiran = document.getElementById('kehadiran').value;
            const jumlahTamu = document.getElementById('jumlah-tamu').value;
            const pesanTambahan = document.getElementById('pesan-tambahan').value;

            // --- START BACKEND INTEGRATION EXAMPLE ---
            // In a real application, you would send this data to a backend server.
            // Example using Fetch API:
            /*
            try {
                const response = await fetch('/api/rsvp', { // Your backend API endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nama, kehadiran, jumlahTamu, pesanTambahan })
                });

                if (response.ok) {
                    const result = await response.json();
                    rsvpMessage.className = 'message success';
                    rsvpMessage.textContent = result.message || 'Terima kasih, konfirmasi Anda telah kami terima!';
                    rsvpForm.reset();
                } else {
                    const errorData = await response.json();
                    rsvpMessage.className = 'message error';
                    rsvpMessage.textContent = errorData.message || 'Terjadi kesalahan saat mengirim konfirmasi.';
                }
            } catch (error) {
                console.error('Error submitting RSVP:', error);
                rsvpMessage.className = 'message error';
                rsvpMessage.textContent = 'Terjadi kesalahan jaringan atau server. Mohon coba lagi nanti.';
            }
            */
            // --- END BACKEND INTEGRATION EXAMPLE ---

            // For now, we'll simulate a successful submission for frontend demo.
            console.log("RSVP Data:", { nama, kehadiran, jumlahTamu, pesanTambahan });
            rsvpMessage.className = 'message success';
            rsvpMessage.textContent = 'Terima kasih, konfirmasi Anda telah kami terima!';
            rsvpForm.reset(); // Clear the form
            setTimeout(() => {
                rsvpMessage.textContent = '';
                rsvpMessage.className = 'message';
            }, 5000); // Clear message after 5 seconds
        });
    }

    // Greeting Form Submission (Frontend only for now, with dummy data)
    const greetingForm = document.getElementById('greetingForm');
    const greetingMessage = document.getElementById('greetingMessage');
    const greetingsList = document.getElementById('greetings-list');

    // Function to load and display greetings
    const loadGreetings = async () => {
        // --- START BACKEND INTEGRATION EXAMPLE ---
        /*
        try {
            const response = await fetch('/api/greetings'); // Your backend API endpoint to get greetings
            if (response.ok) {
                const greetings = await response.json();
                greetingsList.innerHTML = ''; // Clear existing greetings
                greetings.forEach(greeting => {
                    const greetingItem = document.createElement('div');
                    greetingItem.classList.add('greeting-item');
                    greetingItem.innerHTML = `<strong>${greeting.name}:</strong><p>${greeting.message}</p>`;
                    greetingsList.prepend(greetingItem); // Add new greetings at the top
                });
            } else {
                console.error('Failed to load greetings from backend.');
            }
        } catch (error) {
            console.error('Error fetching greetings:', error);
        }
        */
        // --- END BACKEND INTEGRATION EXAMPLE ---

        // Dummy greetings for frontend demonstration
        const dummyGreetings = [
            { name: "Budi Santoso", message: "Selamat menempuh hidup baru! Semoga samawa." },
            { name: "Dewi Purnama", message: "Happy wedding! Langgeng sampai kakek nenek." },
            { name: "Agus Wijaya", message: "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Amin!" },
            { name: "Siti Rahayu", message: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khoir." }
        ];

        greetingsList.innerHTML = ''; // Clear existing greetings
        // Sort dummy greetings by adding a dummy timestamp if needed for realistic ordering
        dummyGreetings.reverse().forEach(greeting => { // Reverse to show latest first
            const greetingItem = document.createElement('div');
            greetingItem.classList.add('greeting-item');
            greetingItem.innerHTML = `<strong>${greeting.name}:</strong><p>${greeting.message}</p>`;
            greetingsList.prepend(greetingItem); // Add new greetings at the top
        });
    };

    if (greetingForm) {
        greetingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nama = document.getElementById('nama-ucapan').value;
            const pesan = document.getElementById('pesan-ucapan').value;

            // --- START BACKEND INTEGRATION EXAMPLE ---
            /*
            try {
                const response = await fetch('/api/greetings', { // Your backend API endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: nama, message: pesan })
                });

                if (response.ok) {
                    const result = await response.json();
                    greetingMessage.className = 'message success';
                    greetingMessage.textContent = result.message || 'Terima kasih atas ucapan dan doa Anda!';
                    greetingForm.reset();
                    loadGreetings(); // Reload greetings from backend to show the new one
                } else {
                    const errorData = await response.json();
                    greetingMessage.className = 'message error';
                    greetingMessage.textContent = errorData.message || 'Terjadi kesalahan saat mengirim ucapan.';
                }
            } catch (error) {
                console.error('Error submitting greeting:', error);
                greetingMessage.className = 'message error';
                greetingMessage.textContent = 'Terjadi kesalahan jaringan atau server. Mohon coba lagi nanti.';
            }
            */
            // --- END BACKEND INTEGRATION EXAMPLE ---

            // For now, simulate adding the new greeting for frontend demo
            console.log("Greeting Data:", { nama, pesan });
            greetingMessage.className = 'message success';
            greetingMessage.textContent = 'Terima kasih atas ucapan dan doa Anda!';
            greetingForm.reset();
            setTimeout(() => {
                greetingMessage.textContent = '';
                greetingMessage.className = 'message';
            }, 5000);

            // Directly add the new greeting to the list (for demo purposes)
            const newGreetingItem = document.createElement('div');
            newGreetingItem.classList.add('greeting-item');
            newGreetingItem.innerHTML = `<strong>${nama}:</strong><p>${pesan}</p>`;
            greetingsList.prepend(newGreetingItem); // Add new greeting instantly at the top
        });

        loadGreetings(); // Load initial greetings on page load
    }

    // Copy Bank Account Number
    document.querySelectorAll('.copy-rek').forEach(button => {
        button.addEventListener('click', (e) => {
            const accountNumber = e.target.dataset.account;
            navigator.clipboard.writeText(accountNumber)
                .then(() => {
                    const originalText = e.target.innerHTML; // Get full HTML including icon
                    e.target.innerHTML = '<i class="fas fa-check"></i> Disalin!'; // Change to check icon
                    setTimeout(() => {
                        e.target.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Gagal menyalin nomor rekening. Silakan salin manual: ' + accountNumber);
                });
        });
    });
});
