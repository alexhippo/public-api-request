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
const numberOfEmployees = 12;

/**
 * Fetch data from a specified API endpoint
 * @param {String} url - the API endpoint to fetch
 * @returns API response
 */
function fetchData(url) {
  return fetch(url)
    .then(res => res.json())
    .catch(error => {
      gallery.insertAdjacentHTML('beforeend', `
      <div id="error">
        <h3>Sorry, something went wrong. Please refresh or try again later.</h3>
        <h4>Error: ${error}</h4>
      </div>
      `
      )
    });
};

fetchData(`https://randomuser.me/api/?results=${numberOfEmployees}&nat=us`)
  .then(data => {
    generateEmployeeGallery(data.results);
    generateEmployeeModal(data.results);

    searchButton.addEventListener('click', (event) => {
      event.preventDefault();
      searchEmployees(searchBar.value, data.results).then((data) => {
        showSearchResults(data);
      })
    });
  })
  .then(() => {
    Array.from(document.getElementsByClassName('card')).forEach((card) => {
      card.addEventListener('click', (event) => {
        const clickedIndex = event.currentTarget.dataset.index;
        displayEmployeeModal(clickedIndex);

        Array.from(document.getElementsByClassName('modal-next')).forEach((nextBtn) => {
          nextBtn.addEventListener('click', (event) => {
            // Get the current index from the modal
            let currentIndex = parseInt(event.currentTarget.parentElement.parentElement.dataset.index);
            displayEmployeeModal(returnNextDataIndex(currentIndex));
          });
        });

        Array.from(document.getElementsByClassName('modal-prev')).forEach((prevBtn) => {
          prevBtn.addEventListener('click', (event) => {
            let currentIndex = parseInt(event.currentTarget.parentElement.parentElement.dataset.index);
            displayEmployeeModal(returnPreviousDataIndex(currentIndex));
          });
        });
      });
    });

    Array.from(document.getElementsByClassName('modal-close-btn')).forEach((closeButton) => {
      closeButton.addEventListener('click', (event) => {
        event.currentTarget.parentElement.parentElement.style.display = 'none';
      })
    });
  });

/**
 * Display the next employee's modal
 * @param {Integer} index - data-index of the employee's modal
 */
function displayEmployeeModal(index) {
  // Clear any other existing modals first
  Array.from(document.querySelectorAll(`div.modal-container`)).forEach((modal) => {
    modal.style.display = 'none';
  })
  document.querySelector(`div.modal-container[data-index="${index}"`).style.display = 'block';
}

/**
 * Return the next visible employee modal index number
 * @param {Integer} currentIndex - currentIndex of the Employee Card
 * @returns {Integer} nextIndex - index number of the next visible Employee Card
 */
function returnNextDataIndex(currentIndex) {
  const startIndex = 0;
  const endIndex = numberOfEmployees - 1;
  let nextIndex = startIndex;
  let nextIndexCard = document.querySelector(`div.card[data-index="${nextIndex}"]`);

  if ((currentIndex === endIndex) && (nextIndexCard.classList.contains('visible'))) {
    return nextIndex;
  } else {
    nextIndex = currentIndex + 1;
    nextIndexCard = document.querySelector(`div.card[data-index="${nextIndex}"]`);
    while (nextIndex <= endIndex) {
      if (nextIndexCard.classList.contains('visible')) {
        return nextIndex;
      } else {
        if (nextIndex === endIndex) {
          nextIndex = startIndex;
          nextIndexCard = document.querySelector(`div.card[data-index="${nextIndex}"]`);
        } else {
          nextIndex = nextIndex + 1;
          nextIndexCard = document.querySelector(`div.card[data-index="${nextIndex}"]`);
        }
      }
    }
  }
  return currentIndex;
}

/**
 * Return the previous visible employee modal index number
 * @param {Integer} currentIndex - currentIndex of the Employee Card 
 * @returns {Integer} prevIndex - index number of the previous visible Employee Card
 */
function returnPreviousDataIndex(currentIndex) {
  const startIndex = 0;
  const endIndex = numberOfEmployees - 1;
  let prevIndex = endIndex;
  let prevIndexCard = document.querySelector(`div.card[data-index="${prevIndex}"]`);

  if ((currentIndex === startIndex) && (prevIndexCard.classList.contains('visible'))) {
    return prevIndex;
  } else {
    prevIndex = currentIndex - 1;
    prevIndexCard = document.querySelector(`div.card[data-index="${prevIndex}"]`);
    while (prevIndex >= startIndex) {
      if (prevIndexCard.classList.contains('visible')) {
        return prevIndex;
      } else {
        if (prevIndex <= startIndex) {
          prevIndex = endIndex;
          prevIndexCard = document.querySelector(`div.card[data-index="${prevIndex}"]`);
        } else {
          prevIndex = prevIndex - 1;
          prevIndexCard = document.querySelector(`div.card[data-index="${prevIndex}"]`);
        }
      }
    }
  }
  return currentIndex;
}

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
    Array.from(gallery.children).forEach((card) => {
      card.classList.remove('visible');
      card.classList.add('hidden');
    });
    if (searchResults.length > 0) {
      searchResults.forEach((employee) => {
        const card = document.querySelector(`.card#employee-${employee.login.uuid}`)
        card.classList.remove('hidden');
        card.classList.add('visible');
      });
    } else {
      gallery.insertAdjacentHTML('beforeend', `
        <div id="no-search-results">
          <h3>Sorry, we couldn't find a employee with that name. Please check your spelling or try a different name.</h3>
        </div>
        `
      )
    }
  } else {
    Array.from(gallery.children).forEach((card) => {
      card.classList.remove('hidden');
      card.classList.add('visible');
    });
    if (document.getElementById('no-search-results')) {
      document.getElementById('no-search-results').style.display = 'none';
    }
  }
};

const gallery = document.getElementById('gallery');

/**
 * Create cards for each employee and add them to the employee gallery
 * @param {Array} data - employee data which we build the cards from
 */
function generateEmployeeGallery(data) {
  data.map((employee, index) => {
    gallery.insertAdjacentHTML('beforeend', `
      <div class="card visible" id="employee-${employee.login.uuid}" data-index="${index}">
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
 * Reformat cell number into desired format
 * @param {String} cellNumber - cell number to format
 * @returns {String} cellNumber
 */
function normaliseCellNumber(cellNumber) {
  if (!/^\(\d{3}\)\s\d{3}-\d{4}$/.test(cellNumber)) {
    const regex = /^\D*(\d{3})\D*(\d{3})\D*(\d{4})\D*$/
    return cellNumber.replace(regex, '($1) $2-$3');
  }
  return cellNumber;
}

/**
 * Create a modal for each employee
 * @param {Array} data - employee data which we build the modals from
 */
function generateEmployeeModal(data) {
  data.map((employee, index) => {
    document.querySelector('body').insertAdjacentHTML('beforeend', `
      <div class="modal-container" id="employee-${employee.login.uuid}" data-index="${index}">
          <div class="modal">
              <button type="button" id="modal-close-btn" class="modal-close-btn" aria-label="Close this employee modal"><strong>X</strong></button>
              <div class="modal-info-container">
                  <img class="modal-img" src="${employee.picture.large}" alt="Profile Picture of ${employee.name.first} ${employee.name.last}">
                  <h3 id="name" class="modal-name cap">${employee.name.first} ${employee.name.last}</h3>
                  <p class="modal-text">${employee.email}</p>
                  <p class="modal-text cap">${employee.location.city}</p>
                  <hr>
                  <p class="modal-text">${normaliseCellNumber(employee.cell)}</p>
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