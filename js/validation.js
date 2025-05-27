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

function showContact(formType)
{
    const addForm = document.getElementById('addForm');
    const searchForm = document.getElementById('searchForm');
    const editForm = document.getElementById('editForm');
    const deleteForm = document.getElementById('deleteForm');
    const addToggle = document.querySelector('#toggle__add');
    const searchToggle = document.querySelector('#toggle__search');
    const editToggle = document.querySelector('#toggle__edit');
    const deleteToggle = document.querySelector('#toggle__delete');

    if(formType === 'add'){
        addForm.classList.remove('hidden');
        searchForm.classList.add('hidden');
        editForm.classList.add('hidden');
        deleteForm.classList.add('hidden');
        addToggle.classList.add('active');
        searchToggle.classList.remove('active');
        editToggle.classList.remove('active');
        deleteToggle.classList.remove('active');
    }
    else if(formType === 'search'){
        addForm.classList.add('hidden');
        searchForm.classList.remove('hidden');
        editForm.classList.add('hidden');
        deleteForm.classList.add('hidden');
        addToggle.classList.remove('active');
        searchToggle.classList.add('active');
        editToggle.classList.remove('active');
        deleteToggle.classList.remove('active');
    }
    else if(formType === 'edit'){
        addForm.classList.add('hidden');
        searchForm.classList.remove('hidden');
        editForm.classList.remove('hidden');
        deleteForm.classList.add('hidden');
        addToggle.classList.remove('active');
        searchToggle.classList.remove('active');
        editToggle.classList.add('active');
        deleteToggle.classList.remove('active');
    }
    else if(formType === 'delete'){
        addForm.classList.add('hidden');
        searchForm.classList.remove('hidden');
        editForm.classList.add('hidden');
        deleteForm.classList.remove('hidden');
        addToggle.classList.remove('active');
        searchToggle.classList.remove('active');
        editToggle.classList.remove('active');
        deleteToggle.classList.add('active');
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
if(window.location.href == 'http://127.0.0.1:5501/' || window.location.href == 'http://127.0.0.1:5501/index.html')
    {
        document.addEventListener('DOMContentLoaded', (event) => {
            showForm('login');
        });
    }
    
    else if(window.location.href == 'http://127.0.0.1:5501/contact.html')
        {
            document.addEventListener('DOMContentLoaded', (event) => {
                showContact('add');
            });
    }