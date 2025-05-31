const urlBase = 'http://darkpages.io/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let loaded = 0;
//Pagination variables
const Contacts_Per_Page = 10;
let currentPage = 1;
let totalContacts = 0;
let currentSearchResults = [];

let currentEditingContactId = null;

function displayGreeting()
{
    const currentTime = new Date();
    const currentHr = currentTime.getHours();
    let greeting = "";

    if(currentHr >= 5 && currentHr < 12)
    {
        greeting = "Good morning";
    }
    else if(currentHr >= 12 && currentHr < 20)
    {
        greeting = "Good afternoon";
    }
    else if(currentHr >= 20 && currentHr < 24)
    {
        greeting = "Good evening";
    }
    else{
        greeting = "Early morning";
    }

    const greetingElement = document.getElementById("title");
    if(greetingElement)
    {
        greetingElement.textContent = greeting + " " + firstName + " " + lastName;
    }
}

function doLogin()
{
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "Username/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contact.html";
				readCookie();
				renderContacts(1);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function doSignup()
{
	firstName = "";
	lastName = "";

	let first = document.getElementById("firstName").value;
	let last = document.getElementById("lastName").value;
	let login = document.getElementById("userName").value;
	let password = document.getElementById("sign-up-password").value;

	document.getElementById("signupResult").innerHTML = "";

	let tmp = {firstName:first,lastName:last,login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Registration.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("signupResult").innerHTML = "Signup failed";
					return;
				}

				userId = jsonObject.id;
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signupResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
    userId = -1; // Reset userId
    let data = document.cookie;
    let splits = data.split(",");
    for(let i = 0; i < splits.length; i++)
    {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if( tokens[0] == "firstName" )
        {
            firstName = tokens[1];
        }
        else if( tokens[0] == "lastName" )
        {
            lastName = tokens[1];
        }
        else if( tokens[0] == "userId" )
        {
            userId = parseInt( tokens[1].trim() );
        }
    }

    const userNameElement = document.getElementById("userName");
    if (userNameElement && userId >= 1) { // Check if element exists and user is logged in
        userNameElement.innerHTML = " " + firstName + " " + lastName;
    }
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let newFirstName = document.getElementById("addFirst");
	let newLastName = document.getElementById("addLast");
	let newPhone = document.getElementById("addPhone");
	let newEmail = document.getElementById("addEmail");
	let addForm = document.getElementById("addForm");
	document.getElementById("contactAddResult").innerHTML = "";
	if(addForm.checkValidity())
	{
		let tmp = {	firstName:newFirstName.value,
					lastName:newLastName.value,
					phone:newPhone.value,
					email:newEmail.value,
					userId:userId
				};

		let jsonPayload = JSON.stringify( tmp );
	
		let url = urlBase + '/Contacts.' + extension;
		
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					document.getElementById("contactAddResult").innerHTML = "Contact has been added";
					newFirstName.value = "";
					newLastName.value = "";
					newPhone.value = "";
					newEmail.value = "";
					handleValidation(newPhone, false);
					handleValidation(newPhone, false);
					handleValidation(newFirstname, false);
					handleValidation(newLastName, false);

					renderContacts(1);
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactAddResult").innerHTML = err.message;
		}
	}
	else
	{
		document.getElementById("contactAddResult").innerHTML ='Please fix the above errors before submitting.';
	}
}

function renderPaginationControls()
{
	const paginationControlsDiv = document.getElementById("paginationControls");
	paginationControlsDiv.innerHTML = '';

	if (totalContacts <= Contacts_Per_Page && currentSearchResults.length > 0) {
        return;
    }

    const totalPages = Math.ceil(totalContacts / Contacts_Per_Page);

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => renderContacts(currentPage - 1);
    paginationControlsDiv.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-button');
        if (i === currentPage) {
            pageButton.classList.add('active'); // Add a class for styling the active page
        }
        pageButton.onclick = () => renderContacts(i);
        paginationControlsDiv.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => renderContacts(currentPage + 1);
    paginationControlsDiv.appendChild(nextButton);
}

function searchContact() {
    if(window.location.href != 'http://darkpages.io/contact.html')
    {
        return;
    }
	if(loaded === 0)
	{
		readCookie();
		loaded = 1;
	}

    let srch = document.getElementById("searchInput").value;
    document.getElementById("contactSearchResult").innerHTML = ""; // Clear any previous status messages

    let tmp = { search: srch, userId: userId, page: currentPage, limit: Contacts_Per_Page };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchUsers.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                currentSearchResults = jsonObject.results || [];
                totalContacts = jsonObject.totalResults || 0; // Get totalResults from PHP
                currentPage = jsonObject.page || 1; // Update currentPage from PHP's response for consistency

                let contactListHTML = `
                    <table class="contact-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                if (currentSearchResults.length > 0) {
                    for (let i = 0; i < currentSearchResults.length; i++) {
                        const contact = currentSearchResults[i];

                        if (typeof contact === 'object' && contact !== null && contact.ID) {
                            contactListHTML += `
                                <tr>
                                    <td>${contact.FirstName || ''}</td>
                                    <td>${contact.LastName || ''}</td>
                                    <td>${contact.Phone || ''}</td>
                                    <td>${contact.Email || ''}</td>
                                    <td>
                                        <button class="action-button edit-button" onclick="openEditModal(${contact.ID})">Edit</button>
                                        <button class="action-button delete-button" onclick="deleteContact(${contact.ID})">Delete</button>
                                    </td>
                                </tr>
                            `;
                        } else {
                            console.warn("Expected contact object with ID (PascalCase) but received:", contact);
                            contactListHTML += `<tr><td colspan="5">Invalid contact data: ${JSON.stringify(contact)}</td></tr>`;
                        }
                    }
                } else {
                    contactListHTML += `<tr><td colspan="5">No contacts found for your search.</td></tr>`;
                }
                contactListHTML += "</tbody></table>";

                document.getElementById("contactListContainer").innerHTML = contactListHTML;

                renderPaginationControls(); // Call this to update buttons based on new totalContacts

            } else if (this.readyState == 4 && this.status !== 200) {
                const jsonObject = JSON.parse(xhr.responseText); // Even error responses have the new structure
                document.getElementById("contactListContainer").innerHTML = `<table><tbody><tr><td colspan="5">Error loading contacts: ${jsonObject.error || 'Unknown Error'}</td></tr></tbody></table>`;
                document.getElementById("contactSearchResult").innerHTML = "Error: " + (jsonObject.error || 'Unknown Error');
                document.getElementById("paginationControls").innerHTML = ''; // Clear pagination on error
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
        document.getElementById("contactListContainer").innerHTML = `<table><tbody><tr><td colspan="5">Error: ${err.message}</td></tr></tbody></table>`;
        document.getElementById("paginationControls").innerHTML = ''; // Clear pagination on error
    }
}

document.addEventListener('DOMContentLoaded', () => {
    readCookie();

    const currentPageUrl = window.location.href;
    const isContactPage = currentPageUrl.includes('contact.html');
    const isIndexPage = currentPageUrl.includes('index.html') || !currentPageUrl.includes('.html'); // Covers root/index.html

    if (isContactPage && userId < 1) { // userId < 1 means not logged in
        window.location.href = "index.html";
        return; // Stop further execution on this page
    }
    else if (isIndexPage && userId >= 1) {
        window.location.href = "contact.html";
        return; // Stop further execution on this page
    }

    if (isContactPage && userId >= 1) {
        displayGreeting();
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                currentPage = 1;
                searchContact(); // Trigger search on every input change
            });
        }
        searchContact();
    }
});

function renderPaginationControls() {
    const paginationControlsDiv = document.getElementById("paginationControls");
    paginationControlsDiv.innerHTML = ''; // Clear previous buttons

    if (totalContacts <= Contacts_Per_Page && totalContacts > 0) {
        return;
    }
    if (totalContacts === 0) {
        return;
    }

    const totalPages = Math.ceil(totalContacts / Contacts_Per_Page);

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => renderContacts(currentPage - 1);
    paginationControlsDiv.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-button');
        if (i === currentPage) {
            pageButton.classList.add('active'); // Add a class for styling the active page
        }
        pageButton.onclick = () => renderContacts(i);
        paginationControlsDiv.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => renderContacts(currentPage + 1);
    paginationControlsDiv.appendChild(nextButton);
}

function renderContacts(pageNumber) {
    currentPage = pageNumber;
    searchContact(); // Re-run search with the new page number
}

function openEditModal(contactId) {
    currentEditingContactId = contactId;

    const contactToEdit = currentSearchResults.find(contact => contact.ID == contactId);

    if (contactToEdit) {
        document.getElementById("editFirstName").value = contactToEdit.FirstName || '';
        document.getElementById("editLastName").value = contactToEdit.LastName || '';
        document.getElementById("editPhone").value = contactToEdit.Phone || '';
        document.getElementById("editEmail").value = contactToEdit.Email || '';

        document.getElementById("editContactModal").classList.remove("hidden");
        document.getElementById("editResult").innerHTML = ""; // Clear previous messages
    } else {
        console.error("Contact not found for editing with ID:", contactId);
        document.getElementById("contactSearchResult").innerHTML = "Error: Contact not found for editing.";
    }
}

function editContact() {
    const updatedFirstName = document.getElementById("editFirstName").value;
    const updatedLastName = document.getElementById("editLastName").value;
    const updatedPhone = document.getElementById("editPhone").value;
    const updatedEmail = document.getElementById("editEmail").value;
	const editForm = document.getElementById("editForm");
    if (!currentEditingContactId) {
        console.error("No contact ID selected for editing.");
        document.getElementById("editResult").innerHTML = "Error: No contact selected for editing.";
        return;
    }
	if(editForm.checkValidity())
	{
		const tmp = {
			id: currentEditingContactId, // PHP expects 'id' (camelCase)
			firstName: updatedFirstName, 
			lastName: updatedLastName,   
			phone: updatedPhone,         
			email: updatedEmail,         
			userId: userId               
		};
		const jsonPayload = JSON.stringify(tmp);
	
		const url = urlBase + '/Edit.' + extension;
	
		const xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
		try {
			xhr.onreadystatechange = function() {
				if (this.readyState === 4 && this.status === 200) {
					const jsonObject = JSON.parse(xhr.responseText);
					if (jsonObject.error) {
						document.getElementById("editResult").innerHTML = "Error: " + jsonObject.error;
					} else {
						document.getElementById("editResult").innerHTML = "Contact updated successfully!";
						document.getElementById("editContactModal").classList.add("hidden");
						renderContacts(currentPage); // Re-render the current page of contacts
						currentEditingContactId = null; // Clear the editing ID
					}
				} else if (this.readyState === 4) {
					console.error("Edit contact failed. Status:", xhr.status, xhr.statusText, "Response:", xhr.responseText);
					document.getElementById("editResult").innerHTML = "Error: " + xhr.status + " " + xhr.statusText + " - Check console for details.";
				}
			};
			xhr.send(jsonPayload);
		} catch (err) {
			document.getElementById("editResult").innerHTML = err.message;
		}
	}
	else
	{
		document.getElementById("editResult").value = "Please fix the above errors before submitting.";
	}
}

function closeEditModal() {
    document.getElementById("editContactModal").classList.add("hidden");
    document.getElementById("editResult").innerHTML = ""; // Clear any previous messages
    currentEditingContactId = null; // Reset the editing ID
}

function deleteContact(contactId) {
    if (!confirm("Are you sure you want to delete this contact?")) {
        return; // User cancelled
    }

    const tmp = {
        id: contactId, // PHP expects 'id' (camelCase)
        userId: userId // PHP expects 'userId' (camelCase)
    };
    const jsonPayload = JSON.stringify(tmp);

    const url = urlBase + '/Delete.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    document.getElementById("contactSearchResult").innerHTML = "Error deleting contact: " + jsonObject.error;
                } else {
                    document.getElementById("contactSearchResult").innerHTML = "Contact deleted successfully!";
                    renderContacts(currentPage); // Re-render the current page of contacts
                }
            } else if (this.readyState === 4) {
                console.error("Delete contact failed. Status:", xhr.status, xhr.statusText, "Response:", xhr.responseText);
                document.getElementById("contactSearchResult").innerHTML = "Error: " + xhr.status + " " + xhr.statusText + " - Check console for details.";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function showForm(formId) {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const toggleLogin = document.getElementById("toggle__login");
    const toggleSignup = document.getElementById("toggle__signup");

    if (formId === 'login') {
        loginForm.classList.remove("hidden");
        signupForm.classList.add("hidden");
        toggleLogin.classList.add("active");
        toggleSignup.classList.remove("active");
    } else if (formId === 'signup') {
        signupForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
        toggleSignup.classList.add("active");
        toggleLogin.classList.remove("active");
    }
}