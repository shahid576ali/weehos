// Arrays to keep track of dynamically loaded CSS and JS files
let loadedCSSFiles = [];
let loadedJSFiles = [];

function loadPage(page) {
  localStorage.setItem('lastPage', page);

  // Remove previously loaded CSS and JS files
  removeLoadedCSS();
  removeLoadedJS();

  fetch(`layouts/header.html`)
    .then(response => response.text())
    .then(header => {
      document.getElementById('header').innerHTML = header;
      setupSidebarToggle();
      setActiveLink(page);
    })
    .catch(error => console.error("Error loading header:", error));

  fetch(`${page}.html`)
    .then(response => response.text())
    .then(content => {
      document.getElementById('content').innerHTML = content;

      // Load resources based on the current page
      switch (page) {
        case 'home':
          loadScript('js/home.js');
          loadScript('js/layouts.js');
          loadScript('js/cardslide.js');
          loadCSS('style/home.css');
          break;
        case 'about':
          loadCSS('style/about.css');
          loadScript('js/about.js');
          loadScript('https://unpkg.com/scrollreveal');
          break;
        case 'contactus':
          loadCSS('style/contactus.css');
          break;
        case 'program':
          loadCSS('style/program.css');
          loadScript('js/program.js');
          break;
        case 'artist':
          loadScript('js/artist.js');
          loadCSS('style/artist.css');
          break;
        case 'blog':
          loadCSS('style/blog.css');
          break;

        case 'createyourevent':
          loadCSS('style/createyourevent.css');
          loadScript('js/priview.js');
          loadScript(
            'https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js',
            () => {
              document.querySelectorAll('textarea').forEach((textarea) => {
                ClassicEditor.create(textarea).catch((error) => {
                  console.error(error);
                });
              });
              document
                .getElementById('wr_form')
                .addEventListener('submit', (event) => {
                  editors.forEach((editor, index) => {
                    document.querySelectorAll('textarea')[index].value =
                      editor.getData();
                  });
                });
            }
          );
          loadScript('js/texteditor.js');
          break;
        case 'coverimage':
          loadCSS('style/coverimage.css');
          loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js'
          );
          loadScript('js/coverimage.js');
          break;
        case 'addperformer':
          loadCSS('style/addperformer.css');
          loadScript('https://code.jquery.com/jquery-3.6.0.min.js');
          loadScript('js/addperformer.js');
          break;
        case 'artistprofile':
          loadCSS('style/artistprofile.css');
          loadScript('js/artistprofile.js');
          break;
        case 'eventdetails':
          loadCSS('style/eventdetails.css');
          loadScript('js/eventdetails.js');
          break;
        case 'adminprofile':
          loadCSS('style/adminprofile.css');
          loadScript('js/adminprofile.js');
          break;
        case 'alluserspage':
          loadCSS('style/alluserspage.css');
          loadScript('js/alluserspage.js');
          break;
        case 'review':
          loadCSS('style/review.css');
          loadScript('js/review.js');
          break;
        default:
          break;
      }
    })
    .catch(error => console.error("Error loading content:", error));

  fetch(`layouts/footer.html`)
    .then(response => response.text())
    .then(footer => {
      document.getElementById('footer').innerHTML = footer;
    })
    .catch(error => console.error("Error loading footer:", error));
}

// Function to remove previously loaded CSS files
function removeLoadedCSS() {
  loadedCSSFiles.forEach(filename => {
    const link = document.querySelector(`link[href="${filename}"]`);
    if (link) link.remove();
  });
  loadedCSSFiles = [];
}

// Function to remove previously loaded JS files
function removeLoadedJS() {
  loadedJSFiles.forEach(src => {
    const script = document.querySelector(`script[src="${src}"]`);
    if (script) script.remove();
  });
  loadedJSFiles = [];
}

// Sidebar toggle functionality
function setupSidebarToggle() {
  document.addEventListener('click', function (event) {
    if (event.target.closest('.open-menu')) {
      document.querySelector('.sidebar').classList.add('active');
    }
    if (event.target.closest('.close-btn')) {
      document.querySelector('.sidebar').classList.remove('active');
    }
  });
}

// Set active link
function setActiveLink(page) {
  const navLinks = document.querySelectorAll('.navitem a');
  navLinks.forEach(link => link.classList.remove('active'));

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').replace('.html', '');
    if (linkPage === page) {
      link.classList.add('active');
    }
  });
}

// Function to load a CSS file
function loadCSS(filename) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = filename;
  document.head.appendChild(link);
  loadedCSSFiles.push(filename); // Track loaded CSS file
}

// Function to load a JS file with optional callback
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = () => {
    console.log(`${src} loaded successfully`);
    if (callback) callback();
  };
  script.onerror = () => console.error(`Error loading script: ${src}`);
  document.head.appendChild(script);
  loadedJSFiles.push(src); // Track loaded JS file
}

window.onload = () => {
  const lastPage = localStorage.getItem('lastPage') || 'home';
  loadPage(lastPage);
};
