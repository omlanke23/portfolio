(() => {

  // YEAR
  const yearEl = document.getElementById("year");

  if(yearEl){
    yearEl.textContent = new Date().getFullYear();
  }

  // NAVIGATION
  const links = document.querySelectorAll(".nav__link");
  const pages = document.querySelectorAll(".page, .hero");

  function setActive(route){

    pages.forEach(page => {

      if(route === "home"){
        page.classList.toggle(
          "is-active",
          page.id === "home"
        );
      }
      else{
        page.classList.toggle(
          "is-active",
          page.id === route
        );
      }

    });

    links.forEach(link => {

      const active =
        link.dataset.route === route;

      link.classList.toggle(
        "is-active",
        active
      );

    });

  }

  function routeFromHash(){

    const hash =
      location.hash.replace("#","");

    return hash || "home";
  }

  if(!location.hash){
    location.hash = "#home";
  }

  setActive(routeFromHash());

  window.addEventListener(
    "hashchange",
    () => {

      setActive(routeFromHash());

      window.scrollTo({
        top:0,
        behavior:"smooth"
      });

    }
  );

  // DOCUMENT RENDERING

  async function renderDocuments(){

    const grids =
      document.querySelectorAll(".doc-grid");

    try{

      const response =
        await fetch("./uploads/index.json");

      const data =
        await response.json();

      grids.forEach(grid => {

        const folder =
          grid.dataset.folder;

        const items =
          data[folder] || [];

        if(items.length === 0){

          grid.innerHTML =
            `<div class="upload-note">
              No documents uploaded yet.
            </div>`;

          return;
        }

        grid.innerHTML = "";

        items.forEach(file => {

          const ext =
            file.name.split(".").pop().toUpperCase();

          const isPdf =
            ext === "PDF";

          const isImage =
            ["PNG","JPG","JPEG","WEBP"]
            .includes(ext);

          const card =
            document.createElement("div");

          card.className =
            "doc-card";

          card.innerHTML = `

            <div class="doc-name">
              📄 ${file.name}
            </div>

            <div class="doc-meta">
              <span class="badge">${ext}</span>

              <a href="${file.href}"
                 target="_blank">
                 Open
              </a>
            </div>

            <button class="preview-toggle">
              Preview
            </button>

            <div class="doc-preview"
                 style="display:none;">

            </div>

            <div class="doc-notes__title">
              Notes
            </div>

            <textarea
              class="doc-notes__textarea"
              placeholder="Write notes here...">
            </textarea>

          `;

          const previewBtn =
            card.querySelector(".preview-toggle");

          const preview =
            card.querySelector(".doc-preview");

          previewBtn.addEventListener(
            "click",
            () => {

              const opened =
                preview.style.display === "block";

              if(opened){

                preview.style.display =
                  "none";

                previewBtn.textContent =
                  "Preview";
              }
              else{

                preview.style.display =
                  "block";

                previewBtn.textContent =
                  "Hide Preview";

                if(preview.innerHTML === ""){

                  if(isPdf){

                    preview.innerHTML =
                      `<iframe
                         src="${file.href}">
                       </iframe>`;
                  }
                  else if(isImage){

                    preview.innerHTML =
                      `<img
                         src="${file.href}">`;
                  }
                  else{

                    preview.innerHTML =
                      `<p>
                        Preview not available.
                      </p>`;
                  }

                }

              }

            }
          );

          grid.appendChild(card);

        });

      });

    }
    catch(error){

      console.log(error);

    }

  }

  renderDocuments();

})();