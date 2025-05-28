const urlBase = 'http://darkpages.io/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

//Pagination variables
const Contacts_Per_Page = 8;
let currentPage = 1;
let totalContacts = 0;
let currnetSearchResults = [];

function doLogin()
{
	userId = 0;
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
	userId = 0;
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
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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
	let newContact = document.getElementById("contactText").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {contact:newContact,userId,userId};
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

	if (totalContacts <= CONTACTS_PER_PAGE && currentSearchResults.length > 0) {
        return;
    }

    const totalPages = Math.ceil(totalContacts / CONTACTS_PER_PAGE);

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

function searchContact()
{
	let srch = document.getElementById("searchInput").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId,page:currentPage,limit:CONTACTS_PER_PAGE};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchUser.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
                totalContacts = jsonObject.totalCount;
                currentSearchResults = jsonObject.results; // Store for potential client-side use

                let contactListHTML = ""; // Use a new variable for HTML to be inserted
                for (let i = 0; i < currentSearchResults.length; i++) {
                    contactListHTML += currentSearchResults[i];
                    if (i < currentSearchResults.length - 1) {
                        contactListHTML += "<br />\r\n";
                    }
                }

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

function deleteContact()
{

}

