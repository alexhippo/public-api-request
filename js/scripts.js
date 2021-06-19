/* Treehouse FSJS Techdegree
 * Project 5 - Public API Requests
 * Awesome Startup Employee Directory
 */

/**
 * Fetch 12 random users from the Random User Generator API
 */
// @todo: Catch unforseen errors
function fetchData(url) {
  return fetch(url)
    .then(res => res.json())
    .catch(error => console.log('Looks like there was a problem', error));
};

fetch('https://randomuser.me/api/?results=12&nat=us')
  .then(response => response.json())
  .then(data => {
    generateEmployeeGallery(data);
    generateEmployeeModal(data);
  });

/**
* Search container
*/
const searchContainer = document.querySelector('.search-container');
searchContainer.insertAdjacentHTML('beforeend', `
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`);

/**
* Gallery
*/
const gallery = document.getElementById('gallery');
function generateEmployeeGallery(data) {
  console.log(data);
  data.results.map((employee) => {
    gallery.insertAdjacentHTML('beforeend', `
      <div class="card">
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
}

/**
 * Modal
 */
//@todo: Split cell number into proper formatting
function generateEmployeeModal(data) {
  data.results.map((employee) => {
    document.querySelector('body').insertAdjacentHTML('beforeend', `
      <div class="modal-container">
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
  
          // IMPORTANT: Below is only for exceeds tasks 
          <div class="modal-btn-container">
              <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
              <button type="button" id="modal-next" class="modal-next btn">Next</button>
          </div>
      </div>
    `);
  })
}

