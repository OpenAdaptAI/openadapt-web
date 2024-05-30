export async function submitToNetlify(formName, formData) {
    try {
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                Accept: 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: new URLSearchParams(formData).toString(),
        })

        if (response.ok) {
            // Trigger Google Analytics event upon successful form submission
            if (window.gtag) {
                window.gtag('event', 'submit_form', {
                    event_category: 'Form',
                    event_label: formName,
                    value: 1,
                })
            }
            return true // Indicate success
        } else {
            console.error('Form submission failed:', response.statusText)
            return false // Indicate failure
        }
    } catch (error) {
        console.error('An error occurred during form submission:', error)
        return false // Indicate failure
    }
}
