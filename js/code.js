const urlBase = 'http://darkpages.io/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

//Pagination variables
const Contacts_Per_Page = 8;
let currentPage = 1;
let totalContacts = 0;
let currentSearchResults = [];

let currentEditingContactId = null;

function doLogin()
{
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
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

// New function for signing up
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
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
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
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = " " + firstName + " " + lastName;
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
	let newFirstName = document.getElementById("addFirst").value;
	let newLastName = document.getElementById("addLast").value;
	let newPhone = document.getElementById("addPhone").value;
	let newEmail = document.getElementById("addEmail").value;

	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {firstName:newFirstName,lastName:newLastName,phone:newPhone,email:newEmail,userId:userId};
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

function renderContacts(pageNumber)
{
	currentPage = pageNumber;
	searchContact();
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
	readCookie();
    let srch = document.getElementById("searchInput").value;
    document.getElementById("contactSearchResult").innerHTML = "";

    let tmp = { search: srch, userId: userId, page: currentPage, limit: Contacts_Per_Page };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchUsers.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);

                currentSearchResults = jsonObject.results || []; // Store actual contact objects
                totalContacts = jsonObject.totalCount || 0; // Get total count for pagination

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
                        // Ensure contact is an object and has an ID
                        if (typeof contact === 'object' && contact !== null && contact.ID) {
                            contactListHTML += `
                                <tr>
                                    <td>${contact.FirstName || ''}</td>
                                    <td>${contact.LastName || ''}</td>
                                    <td>${contact.Phone || ''}</td>
                                    <td>${contact.Email || ''}</td>
                                    <td>
                                        <button class="action-button edit-button" onclick="openEditModal(${contact.id})">Edit</button>
                                        <button class="action-button delete-button" onclick="deleteContact(${contact.id})">Delete</button>
                                    </td>
                                </tr>
                            `;
                        } else {
                            // Fallback for unexpected data format (e.g., if results are still strings)
                            console.warn("Expected contact object with ID but received:", contact);
                            contactListHTML += `<tr><td colspan="5">Invalid contact data: ${JSON.stringify(contact)}</td></tr>`;
                        }
                    }
                } else {
                    contactListHTML += `<tr><td colspan="5">No contacts found for your search.</td></tr>`;
                }
                contactListHTML += "</tbody></table>";

                document.getElementById("contactListContainer").innerHTML = contactListHTML;

                renderPaginationControls();

            } else if (this.readyState == 4 && this.status !== 200) {
                document.getElementById("contactSearchResult").innerHTML = "Error: " + xhr.status + " " + xhr.statusText;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

//Pagination controls WONT WORK UNLESS SEARCH FUNCTION IS SUCCESSFUL

document.addEventListener('DOMContentLoaded', () => {
     searchContact(); // Call search on page load
});

// Function to open the edit modal/form and pre-fill it with contact data
function openEditModal(contactId) {
    currentEditingContactId = contactId;
    
    const contactToEdit = currentSearchResults.find(contact => contact.id == contactId); // Use == for loose comparison if IDs might be string/number

    if (contactToEdit) {
        document.getElementById("editFirstName").value = contactToEdit.FirstName || '';
        document.getElementById("editLastName").value = contactToEdit.LastName || '';
        document.getElementById("editPhone").value = contactToEdit.Phone || '';
        document.getElementById("editEmail").value = contactToEdit.Email || '';

        // Show your edit modal/form (assuming it has an ID like 'editContactModal')
        document.getElementById("editContactModal").classList.remove("hidden");
        document.getElementById("editResult").innerHTML = ""; // Clear previous messages
    } else {
        console.error("Contact not found for editing with ID:", contactId);
        document.getElementById("contactSearchResult").innerHTML = "Error: Contact not found for editing.";
    }
}

function editContact() {
    // Get the updated values from the edit form fields
    const updatedFirstName = document.getElementById("editFirstName").value;
    const updatedLastName = document.getElementById("editLastName").value;
    const updatedPhone = document.getElementById("editPhone").value;
    const updatedEmail = document.getElementById("editEmail").value;

    // Ensure we have a contact ID to update
    if (!currentEditingContactId) {
        console.error("No contact ID selected for editing.");
        document.getElementById("editResult").innerHTML = "Error: No contact selected for editing.";
        return;
    }

    // Prepare the payload for the API
    // The API needs the contactId to know which contact to update, and the userId
    const tmp = {
        contactId: currentEditingContactId, // The ID of the contact to update
        firstName: updatedFirstName,
        lastName: updatedLastName,
        phone: updatedPhone,
        email: updatedEmail,
        userId: userId // Your user's ID
    };
    const jsonPayload = JSON.stringify(tmp);

    const url = urlBase + '/Edit.' + extension; // Assuming 'Edit.php'

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
                document.getElementById("editResult").innerHTML = "Error: " + xhr.status + " " + xhr.statusText;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("editResult").innerHTML = err.message;
    }
}

function closeEditModal() {
    document.getElementById("editContactModal").classList.add("hidden");
    document.getElementById("editResult").innerHTML = ""; // Clear any previous messages
    currentEditingContactId = null; // Reset the editing ID
}

function deleteContact(id) {
    if (!confirm("Are you sure you want to delete this contact?")) {
        return; // User cancelled
    }

    const tmp = {
        id: id,
        userId: userId
    };
    const jsonPayload = JSON.stringify(tmp);

    const url = urlBase + '/Delete.' + extension; // Assuming 'Delete.php'

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
                    renderContacts(currentPage);
                }
            } else if (this.readyState === 4) {
                document.getElementById("contactSearchResult").innerHTML = "Error: " + xhr.status + " " + xhr.statusText;
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

