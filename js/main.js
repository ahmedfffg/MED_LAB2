document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            this.classList.toggle('open');
        });

        document.querySelectorAll('.mobile-nav a').forEach(link => {
            link.addEventListener('click', function() {
                mobileNav.classList.remove('active');
                menuToggle.classList.remove('open');
            });
        });

        document.addEventListener('click', function(event) {
            const isClickInsideNav = mobileNav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (mobileNav.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
                mobileNav.classList.remove('active');
                menuToggle.classList.remove('open');
            }
        });

        mobileNav.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }

    document.querySelectorAll('a, button, .clickable').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });

        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });

        element.addEventListener('mouseenter', function() {
            if (window.matchMedia("(hover: hover)").matches) {
                this.style.transform = 'scale(1.05)';
            }
        });

        element.addEventListener('mouseleave', function() {
            if (window.matchMedia("(hover: hover)").matches) {
                this.style.transform = 'scale(1)';
            }
        });
    });

    function checkWhatsApp() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]');

        whatsappLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (!isMobile) {
                    e.preventDefault();
                    window.open(this.href, '_blank');
                }
            });
        });
    }

    checkWhatsApp();

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            showAlert('تم إرسال طلبك بنجاح، سنتصل بك قريباً', 'success');
            this.reset();
        });
    });

    function showAlert(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;

        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.padding = '15px 25px';
        alertDiv.style.borderRadius = '4px';
        alertDiv.style.color = '#fff';
        alertDiv.style.zIndex = '9999';
        alertDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        alertDiv.style.animation = 'slideIn 0.3s ease-out';

        if (type === 'success') {
            alertDiv.style.backgroundColor = '#388e3c';
        } else if (type === 'error') {
            alertDiv.style.backgroundColor = '#d32f2f';
        } else {
            alertDiv.style.backgroundColor = '#1976d2';
        }

        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        }, 5000);
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    const dateInputs = document.querySelectorAll('input[type="date"]');
    if (dateInputs.length > 0) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const minDate = `${yyyy}-${mm}-${dd}`;

        dateInputs.forEach(input => {
            input.min = minDate;
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            input.value = tomorrowStr;
        });
    }

    function setupMobileUX() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                if (window.innerWidth <= 768) {
                    document.body.style.zoom = '1.0';
                }
            });
        });
    }

    setupMobileUX();

    function loadDoctors() {
        const doctorsSliders = document.querySelectorAll('.doctors-slider');

        if (doctorsSliders.length > 0) {
            const doctorsData = [
                {
                    id: 1,
                    name: "د. أحمد محمد",
                    specialty: "استشاري أمراض القلب",
                    qualification: "زميل الكلية الملكية لأطباء القلب - لندن",
                    image: "images/doctor1.jpg"
                },
                {
                    id: 2,
                    name: "د. سارة محمود",
                    specialty: "استشاري تجميل الأسنان",
                    qualification: "دكتوراه في طب الأسنان التجميلي - جامعة عين شمس",
                    image: "images/doctor2.jpg"
                },
                {
                    id: 3,
                    name: "د. هناء السيد",
                    specialty: "استشاري نساء وتوليد",
                    qualification: "دكتوراه في جراحات المناظير النسائية - جامعة القاهرة",
                    image: "images/doctor3.jpg"
                }
            ];

            doctorsSliders.forEach(slider => {
                const specialty = slider.getAttribute('data-specialty') || 'all';
                const filteredDoctors = specialty === 'all'
                    ? doctorsData
                    : doctorsData.filter(doctor => doctor.specialty.includes(specialty));

                filteredDoctors.forEach(doctor => {
                    const doctorCard = document.createElement('div');
                    doctorCard.className = 'doctor-card';
                    doctorCard.innerHTML = `
                        <img src="${doctor.image}" alt="${doctor.name}">
                        <div>
                            <h3>${doctor.name}</h3>
                            <p>${doctor.specialty}</p>
                            <p>${doctor.qualification}</p>
                            <div class="doctor-actions">
                                <a href="appointment.html?doctor=${doctor.id}" class="btn btn-sm">
                                    <i class="fas fa-calendar-check"></i> حجز موعد
                                </a>
                            </div>
                        </div>
                    `;
                    slider.appendChild(doctorCard);
                });
            });
        }
    }

    loadDoctors();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.mobile-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    function checkLoginStatus() {
        const loginLinks = document.querySelectorAll('a[href="login.html"]');
        const logoutLinks = document.querySelectorAll('a[href="logout.html"]');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (isLoggedIn) {
            loginLinks.forEach(link => {
                link.innerHTML = '<i class="fas fa-user"></i> الحساب';
                link.href = 'account.html';
            });
            logoutLinks.forEach(link => {
                link.style.display = 'block';
            });
        } else {
            logoutLinks.forEach(link => {
                link.style.display = 'none';
            });
        }
    }

    checkLoginStatus();

    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            images.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            images.forEach(img => {
                img.src = img.getAttribute('data-src');
            });
        }
    }

    lazyLoadImages();
});
