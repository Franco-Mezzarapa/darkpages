if(window.location.href != 'http://darkpages.io/contact.html')
{
    document.addEventListener('DOMContentLoaded', () => {
        const addEmailInput = document.getElementById('addEmail');
        const editEmailInput = document.getElementById('editEmail');
        const addFirstInput = document.getElementById('addFirst');
        const editFirstInput = document.getElementById('editFirstName');
        const addLastInput = document.getElementById('addLast');
        const editLastInput = document.getElementById('editLastName');
        const addPhoneInput = document.getElementById('addPhone');
        const editPhoneInput = document.getElementById('editPhone');
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phonePattern = /^\d{3}-?\d{3}-?\d{4}$/;
    
        function handleValidation(inputElement, isValid) 
        {
            if(isValid) 
            {
            inputElement.classList.remove('invalid');
            inputElement.classList.add('valid');
            } else 
            {
            inputElement.classList.remove('valid');
            inputElement.classList.add('invalid');
            }
        }
    
        addEmailInput.addEventListener('input', () => {
    
            handleValidation(addEmailInput, emailPattern.test(addEmailInput.value));
        });
    
    
        editEmailInput.addEventListener('input', () => {
    
            handleValidation(editEmailInput, emailPattern.test(editEmailInput.value));
        });
        addPhoneInput.addEventListener('input', () => {
    
            handleValidation(addPhoneInput, phonePattern.test(addPhoneInput.value));
        });
    
    
        editPhoneInput.addEventListener('input', () => {
    
            handleValidation(editPhoneInput, phonePattern.test(editPhoneInput.value));
        });
    
        function handleAnyInput(inputElement) {
            inputElement.addEventListener('input', () => {
            if(inputElement.value.length > 0) {
                handleValidation(inputElement, true);
            } else {
                handleValidation(inputElement, false);
            }
            });
        }
    
        handleAnyInput(addFirstInput);
        handleAnyInput(editFirstInput);
        handleAnyInput(addLastInput);
        handleAnyInput(editLastInput);
    });
}

function showForm(formType)
{
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginToggle = document.querySelector('#toggle__login');
    const signupToggle = document.querySelector('#toggle__signup');

    if(formType === 'login'){
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        loginToggle.classList.add('active');
        signupToggle.classList.remove('active');
    }
    else if(formType === 'signup'){
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        loginToggle.classList.remove('active');
        signupToggle.classList.add('active');
    }
}



//Initialzing the forms, making sure login is active by default
if(window.location.href == 'http://127.0.0.1:5501/' || window.location.href == 'http://127.0.0.1:5501/index.html')
{
    document.addEventListener('DOMContentLoaded', (event) => 
    {
        showForm('login');
    });
}