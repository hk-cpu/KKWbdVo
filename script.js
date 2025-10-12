import { animate, inView } from 'https://esm.run/framer-motion';

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    

    const header = document.getElementById('main-header');
    const scrollThreshold = 50; 

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check


    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

    elementsToAnimate.forEach(element => {
        const delay = parseFloat(element.style.getPropertyValue('--animation-delay')) || 0;
        
        inView(element, () => {
            animate(
                element,
                { 
                    opacity: 1, 
                    y: 0 
                },
                { 
                    duration: 0.8, 
                    delay: delay / 1000,
                    ease: [0.22, 1, 0.36, 1] // Quintic Out
                }
            );
            return () => { // Optional: animation on exit view
                 animate(
                    element,
                    { opacity: 0, y: 30 },
                    { duration: 0.4 }
                );
            };
        }, { margin: "-10% 0px -10% 0px" });
    });
});
