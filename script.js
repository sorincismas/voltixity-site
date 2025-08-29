document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitButton.disabled = true;
        submitButton.textContent = 'Se trimite...';
        formStatus.textContent = '';
        formStatus.style.color = '';

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                formStatus.textContent = 'Mesajul tău a fost trimis! Voi reveni în cel mai scurt timp.';
                formStatus.style.color = '#48BB78'; // Green
                contactForm.reset();
            } else {
                throw new Error(result.error || 'A apărut o eroare.');
            }
        } catch (error) {
            formStatus.textContent = `Eroare: ${error.message}`;
            formStatus.style.color = '#F56565'; // Red
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Trimite Mesajul';
        }
    });
});
