/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
 * Awesome Startup Employee Directory
 */

/**
* Search container
*/
const searchContainer = document.querySelector('.search-container');
searchContainer.insertAdjacentHTML('beforeend', `
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit" aria-label="Search for employees">
    </form>
`);
const searchBar = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-submit');

/**
 * Fetch data from a specified API endpoint
 * @param {String} url - the API endpoint to fetch
 * @returns API response
 */
// @todo: Catch unforseen errors
function fetchData(url) {
  return fetch(url)
    .then(res => res.json())
    .catch(error => console.log('Looks like there was a problem', error));
};

fetchData('https://randomuser.me/api/?results=12&nat=us')
  .then(data => {
    generateEmployeeGallery(data.results);
    generateEmployeeModal(data.results);

    searchButton.addEventListener('click', () => {
      searchEmployees(searchBar.value, data.results).then((data) => {
        showSearchResults(data)
      })
    });
  })
  .then(() => {
    Array.from(document.getElementsByClassName('card')).forEach((card) => {
      card.addEventListener('click', (event) => {
        document.querySelector(`div.modal-container#${event.currentTarget.id}`).style.display = 'block';
      });
    });

    // @todo: Close when clicking outside of the modal too
    Array.from(document.getElementsByClassName('modal-close-btn')).forEach((closeButton) => {
      closeButton.addEventListener('click', (event) => {
        event.currentTarget.parentElement.parentElement.style.display = 'none';
      })
    });
  })



/**
* Search for employees based off the searchInput and return the search results
* @param  {String} searchInput - the user's search term
* @param  {Array} employees - employee data e.g. `data.results`
*/
async function searchEmployees(searchInput, employees) {
  let searchResults = employees.filter((employee) => {
    return employee.name.first.toLowerCase().includes(searchInput.toLowerCase()) || employee.name.last.toLowerCase().includes(searchInput.toLowerCase());
  })
  return searchResults;
};

/**
* Display and paginate the results returned by `searchEmployees()`
* If there are no search results, a "No results found" style message will be displayed
* If there is no searchInput (e.g. search was cleared by the user), the full employee list will be displayed by default
 * @param {Array} searchResults 
 */
function showSearchResults(searchResults) {
  if (searchBar.value) {
    // Hide all employees from the gallery first
    Array.from(gallery.children).forEach((employee) => employee.style.display = 'none');
    if (searchResults.length > 0) {
      searchResults.forEach((employee) => document.querySelector(`.card#employee-${employee.login.uuid}`).style.display = '');
    } else {
      gallery.insertAdjacentHTML('beforeend', `
        <div>
          <h3>Sorry, we couldn't find a employee with that name. Please check your spelling or try a different name.</h3>
        </div>
        `
      )
    }
  } else {
    Array.from(gallery.children).forEach((employee) => employee.style.display = '');
  }
};

/**
* Gallery
*/
const gallery = document.getElementById('gallery');
function generateEmployeeGallery(data) {
  data.map((employee) => {
    gallery.insertAdjacentHTML('beforeend', `
      <div class="card" id="employee-${employee.login.uuid}">
          <div class="card-img-container">
              <img class="card-img" src="${employee.picture.medium}" alt="Profile Picture of ${employee.name.first} ${employee.name.last}">
          </div>
          <div class="card-info-container">
              <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
              <p class="card-text">${employee.email}</p>
              <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
          </div>
      </div>
      `);
  });
};

/**
 * Modal
 */
function generateEmployeeModal(data) {
  data.map((employee, index) => {
    document.querySelector('body').insertAdjacentHTML('beforeend', `
      <div class="modal-container" id="employee-${employee.login.uuid}">
          <div class="modal">
              <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
              <div class="modal-info-container">
                  <img class="modal-img" src="${employee.picture.large}" alt="Profile Picture of ${employee.name.first} ${employee.name.last}">
                  <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                  <p class="modal-text">${employee.email}</p>
                  <p class="modal-text cap">${employee.location.city}</p>
                  <hr>
                  <p class="modal-text">${employee.cell}</p>
                  <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
                  <p class="modal-text">Birthday: ${new Date(employee.dob.date).toLocaleDateString('en-US')}</p>
              </div>
          </div>
          <div class="modal-btn-container">
              <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
              <button type="button" id="modal-next" class="modal-next btn">Next</button>
          </div>
      </div>
    `);
  });
};