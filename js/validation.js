/* the following script makes it so the UI moves from Login form to Sign up form.
we can move the script later if we want but for now it'll
be here*/
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

function validSignUp()
{
    let form = document.getElementById('form');
    let firstname = document.getElementById('firstName');
    let lastname = document.getElementById('lastName');
    let username = document.getElementById('userName');
    let password = document.getElementById('sign-up-password');

    form.addEventListener('submit', (e) => 
        {
            //e.preventDefault()

            let firsterror, lasterror, usererror, passerror = false;

            if(firstname == '' || firstname == null)
            {
                firsterror = true;

            }
        })
}

//Initialzing the forms, making sure login is active by default
document.addEventListener('DOMContentLoaded', (event) => {
    showForm('login');
});