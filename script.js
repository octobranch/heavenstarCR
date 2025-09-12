// Modal Variables
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const closeModalBtn = document.querySelector('.close');

// Modal Spec Elements
const modalSpeed = document.getElementById('modal-speed');
const modalAcceleration = document.getElementById('modal-acceleration');
const modalEngine = document.getElementById('modal-engine');
const modalTransmission = document.getElementById('modal-transmission');
const modalFuel = document.getElementById('modal-fuel');
const modalFeatures = document.getElementById('modal-features');

// Booking Form Modal Variables
const bookingFormModal = document.getElementById('booking-form-modal');
const closeBookingBtn = document.querySelector('.close-booking');
const selectedCarName = document.getElementById('selected-car-name');
const selectedCarImg = document.getElementById('selected-car-img');
const selectedCarPrice = document.getElementById('selected-car-price');

// Booking Summary Elements
const summaryPickup = document.getElementById('summary-pickup');
const summaryReturn = document.getElementById('summary-return');
const summaryDays = document.getElementById('summary-days');
const summaryRate = document.getElementById('summary-rate');
const summaryTotal = document.getElementById('summary-total');

// Confirmation Modal Variables
const confirmationModal = document.getElementById('confirmation-modal');
const closeConfirmationBtn = document.querySelector('.close-confirmation');
const bookingReference = document.getElementById('booking-reference');

// Filter Elements
const filterButtons = document.querySelectorAll('.filter-btn');

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Current vehicle selection and rate
let currentVehicle = {
    name: '',
    price: 0,
    img: '',
    specs: {}
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeVehicleFilters();
    initializeHeaderScroll();
    initializeFormValidations();
    
    // Add loading animation to vehicles
    const vehicleCards = document.querySelectorAll('.vehicle-card');
    vehicleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('loading');
    });
    
    // Remove loading animation after page load
    setTimeout(() => {
        vehicleCards.forEach(card => {
            card.classList.remove('loading');
        });
    }, 1000);
});

// Initialize all event listeners
function initializeEventListeners() {
    // Add event listeners for vehicle cards
    document.querySelectorAll('.vehicle-card').forEach(card => {
        const btn = card.querySelector('.vehicle-button');
        btn.addEventListener('click', () => {
            openVehicleModal(card);
        });
        
        // Add quick view functionality
        const quickViewBtn = card.querySelector('.quick-view-btn');
        if (quickViewBtn) {
            quickViewBtn.addEventListener('click', () => {
                openVehicleModal(card);
            });
        }
    });

    // Close the vehicle details modal
    closeModalBtn.addEventListener('click', closeModal);

    // Close when clicking outside of modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
        if (e.target === bookingFormModal) {
            closeBookingModal();
        }
        if (e.target === confirmationModal) {
            closeConfirmationModal();
        }
    });

    // Close booking form modal
    closeBookingBtn.addEventListener('click', closeBookingModal);

    // Close confirmation modal
    closeConfirmationBtn.addEventListener('click', closeConfirmationModal);
    
    // Hamburger menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // Add animation on scroll
    initializeScrollAnimations();
    
    // Handle Netlify form submission
    const bookingForm = document.querySelector('form[name="booking"]');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmission);
    }
}

// Handle form submission for Netlify Forms
function handleFormSubmission(e) {
    e.preventDefault();
    
    // Get customer information
    const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerLicense = document.getElementById('customer-license').value;
    
    // Validate customer information
    if (!customerName || !customerEmail || !customerPhone || !customerLicense) {
        showNotification('Please fill in all personal information fields', 'error');
        return;
    }
    
    // Simple validation for email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Generate booking reference
    const reference = generateBookingReference();
    bookingReference.textContent = reference;
    
    // Close the booking form modal
    bookingFormModal.style.display = 'none';
    
    // Display confirmation modal
    confirmationModal.style.display = 'flex';
    
    // Reset forms after successful submission
    setTimeout(() => {
        resetForms();
    }, 2000);
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .vehicle-card, .testimonial');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize vehicle filters
function initializeVehicleFilters() {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get filter category
            const category = button.getAttribute('data-category');
            
            // Filter vehicles
            filterVehicles(category);
        });
    });
}

// Filter vehicles based on category
function filterVehicles(category) {
    const vehicles = document.querySelectorAll('.vehicle-card');
    
    vehicles.forEach(vehicle => {
        if (category === 'all') {
            vehicle.style.display = 'block';
            setTimeout(() => {
                vehicle.style.opacity = '1';
                vehicle.style.transform = 'translateY(0)';
            }, 50);
        } else {
            const vehicleCategory = vehicle.getAttribute('data-category');
            if (vehicleCategory === category) {
                vehicle.style.display = 'block';
                setTimeout(() => {
                    vehicle.style.opacity = '1';
                    vehicle.style.transform = 'translateY(0)';
                }, 50);
            } else {
                vehicle.style.opacity = '0';
                vehicle.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    vehicle.style.display = 'none';
                }, 300);
            }
        }
    });
}

// Initialize header scroll behavior
function initializeHeaderScroll() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scroll down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll up
            header.style.transform = 'translateY(0)';
        }
        
        // Add shadow when scrolled
        if (scrollTop > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Initialize form validations
function initializeFormValidations() {
    // Form validation logic can be added here
}

// Toggle mobile menu
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
}

// Open vehicle modal with details
function openVehicleModal(card) {
    const imgSrc = card.querySelector('img').src;
    const title = card.querySelector('.vehicle-title').textContent;
    const desc = card.querySelector('p').textContent;
    const price = card.getAttribute('data-price');
    let specs = {};
    
    // Get vehicle specifications from data attribute
    if (card.getAttribute('data-specs')) {
        try {
            specs = JSON.parse(card.getAttribute('data-specs'));
        } catch (e) {
            console.error('Error parsing vehicle specs:', e);
            specs = {};
        }
    }
    
    // Store current vehicle details
    currentVehicle.name = title;
    currentVehicle.price = price;
    currentVehicle.img = imgSrc;
    currentVehicle.specs = specs;

    // Update modal content
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalPrice.textContent = `$${price}/day`;
    
    // Update specifications
    if (specs) {
        modalSpeed.textContent = specs.speed || 'N/A';
        modalAcceleration.textContent = specs.acceleration || 'N/A';
        modalEngine.textContent = specs.engine || 'N/A';
        modalTransmission.textContent = specs.transmission || 'N/A';
        modalFuel.textContent = specs.fuelEconomy || 'N/A';
        modalFeatures.textContent = specs.features || 'N/A';
    }
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close the vehicle details modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close booking form modal
function closeBookingModal() {
    bookingFormModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close confirmation modal
function closeConfirmationModal() {
    confirmationModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Function to close confirmation and reset the form
function closeConfirmation() {
    confirmationModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetForms();
}

// Function to generate a random booking reference
function generateBookingReference() {
    const prefix = 'HS'; // Heaven Star Car Rental
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix + '-';
    
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
}

// Function to reset all forms
function resetForms() {
    // Reset booking form
    document.getElementById('pickup-location').value = '';
    document.getElementById('return-location').value = '';
    document.getElementById('start-date').value = '';
    document.getElementById('end-date').value = '';
    
    // Reset customer information
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-email').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-license').value = '';
    document.getElementById('customer-hotel').value = ''; 
    document.getElementById('customer-flight').value = '';  
    document.getElementById('customer-country').value = '';
    
    // Reset current vehicle
    currentVehicle = {
        name: '',
        price: 0,
        img: '',
        specs: {}
    };
}

// Function to show booking form directly from search button
function showBookingForm() {
    // Check if dates are selected
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const pickupLocation = document.getElementById('pickup-location').value;
    const returnLocation = document.getElementById('return-location').value;
    
    // Validate inputs
    if (!startDate || !endDate) {
        showNotification('Please select both start and end dates', 'error');
        return;
    }
    
    if (!pickupLocation || !returnLocation) {
        showNotification('Please enter both pickup and return locations', 'error');
        return;
    }
    
    // If no vehicle is selected yet, show the cars section
    if (!currentVehicle.name) {
        document.getElementById('cars').scrollIntoView({behavior: 'smooth'});
        showNotification('Please select a vehicle first by clicking "View Details" on one of our vehicles', 'info');
        return;
    }
    
    // Otherwise open the booking form
    openBookingForm();
}

// Function to open booking form modal
function openBookingForm() {
    // Close the vehicle detail modal if it's open
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    }
    
    // Get dates
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    const pickupLocation = document.getElementById('pickup-location').value;
    const returnLocation = document.getElementById('return-location').value;
    
    // Calculate number of days
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Validate dates
    if (daysDiff <= 0) {
        showNotification('Please ensure your return date is after your pickup date', 'error');
        return;
    }
    
    // Set car details in the booking form
    selectedCarName.textContent = currentVehicle.name;
    selectedCarImg.src = currentVehicle.img;
    selectedCarPrice.textContent = `$${currentVehicle.price}/day`;
    
    // Set booking summary
    const startDateFormatted = startDate.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    });
    
    const endDateFormatted = endDate.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
    });
    
    summaryPickup.textContent = `${pickupLocation} (${startDateFormatted})`;
    summaryReturn.textContent = `${returnLocation} (${endDateFormatted})`;
    summaryDays.textContent = `${daysDiff} day${daysDiff > 1 ? 's' : ''}`;
    summaryRate.textContent = `$${currentVehicle.price}/day`;
    
    // Remove commas from price and convert to number before multiplying
    const priceAsNumber = parseFloat(currentVehicle.price.replace(/,/g, ''));
    // Calculate total and format with commas for thousands
    const total = priceAsNumber * daysDiff;
    summaryTotal.textContent = `$${total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    
    // Show booking form modal
    bookingFormModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 18px 25px;
                border-radius: 10px;
                color: white;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                z-index: 10000;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                animation: slideIn 0.4s ease;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .notification.error { 
                background: rgba(255, 71, 87, 0.9);
            }
            .notification.success { 
                background: rgba(46, 213, 115, 0.9);
            }
            .notification.info { 
                background: rgba(30, 144, 255, 0.9);
            }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 22px;
                cursor: pointer;
                margin-left: 20px;
                opacity: 0.8;
                transition: all 0.3s ease;
            }
            .notification button:hover {
                opacity: 1;
            }
            @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}
