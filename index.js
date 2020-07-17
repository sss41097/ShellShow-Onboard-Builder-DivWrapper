// div wrapper
import axios from "axios";
import { createPopper } from "@popperjs/core";
var currentTemplateNumber;
var currentImageInSlideShow;
var currentTemplateIdentifier;
export const dataLoader = async (groupId) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let requestBody = JSON.stringify({
      query: `
        query {
          getAllTemplatesInGroup(groupId: "${groupId}") {
             templates
          }
        }

        `,
    });

    const res = await axios.post(
      "http://localhost:5000/graphql",
      requestBody,
      config
    );
    return res.data.data.getAllTemplatesInGroup.templates;
  } catch (error) {
    console.log(error.response);
  }
  return "success function pass";
};

export const showTemplate = async (document, templates, sliceIndex) => {
  currentTemplateNumber = -1;
  if (templates.length > 0) {
    window.addEventListener("popstate", function (event) {
      if (templates !== [] && currentTemplateNumber !== -1) {
        console.log(templates);
        if (
          document.getElementsByClassName(currentTemplateIdentifier).length > 0
        ) {
          let previousTarget = document.getElementsByClassName(
            currentTemplateIdentifier
          )[0];
          previousTarget.classList.remove("Template-Active-Element");
        }

        if (document.getElementById("Overlay-" + currentTemplateIdentifier)) {
          document
            .getElementById("Overlay-" + currentTemplateIdentifier)
            .remove();
        }
        if (document.getElementById("Template-" + currentTemplateIdentifier)) {
          document
            .getElementById("Template-" + currentTemplateIdentifier)
            .remove();
        }
        currentTemplateNumber = -1;
      }
    });
    nextTemplate(document, templates.slice(0, sliceIndex));
  }
};

export const nextTemplate = async (document, templates) => {
  //remove previous Template from screen
  if (currentTemplateNumber !== -1) {
    if (
      document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      ).length > 0
    ) {
      let previousTarget = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
      previousTarget.classList.remove("Template-Active-Element");
    }
    document
      .getElementById("Template-" + templates[currentTemplateNumber].identifier)
      .remove();
    if (
      document.getElementById(
        "Overlay-" + templates[currentTemplateNumber].identifier
      )
    ) {
      document
        .getElementById(
          "Overlay-" + templates[currentTemplateNumber].identifier
        )
        .remove();
    }
    if (currentTemplateNumber === templates.length - 1) {
      currentTemplateNumber = -1;
      return;
    }
  }

  currentTemplateNumber = currentTemplateNumber + 1;

  if (currentTemplateNumber !== templates.length) {
    if (templates[currentTemplateNumber].toolTip === true) {
      var Target = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
    }

    var newTemplateDiv = document.createElement("div");
    newTemplateDiv.id =
      "Template-" + templates[currentTemplateNumber].identifier;
    currentTemplateIdentifier = templates[currentTemplateNumber].identifier;

    newTemplateDiv.innerHTML = templates[currentTemplateNumber].DOMString;
    newTemplateDiv.style.padding = "-5px";
    // newTemplateDiv.style.boxShadow = "5px 10px 18px grey";
    newTemplateDiv.style.borderRadius = "4%";
    newTemplateDiv.style.zIndex = "2147483647";
    if (templates[currentTemplateNumber].toolTip === true) {
      newTemplateDiv.style.backgroundColor = "white";
      var styles = `
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="top"] > #arrow {
      bottom: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="bottom"] > #arrow {
      top: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="left"] > #arrow {
      right: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="right"] > #arrow {
      left: -4px;
    }
`;

      var styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
      newTemplateDiv.innerHTML += "<div id='arrow' data-popper-arrow></div>";
    }

    document.body.append(newTemplateDiv);

    //overlay div
    var overlayDiv = document.createElement("div");
    overlayDiv.id = "Overlay-" + templates[currentTemplateNumber].identifier;
    overlayDiv.style.position = "fixed";
    overlayDiv.style.display = "block";
    overlayDiv.style.width = "100%";
    overlayDiv.style.height = "100%";
    overlayDiv.style.top = "0";
    overlayDiv.style.left = "0";
    overlayDiv.style.right = "0";
    overlayDiv.style.bottom = "0";
    overlayDiv.style.backgroundColor = "rgba(0,0,0,0.75)";
    overlayDiv.style.zIndex = "2147483646";
    document.body.append(overlayDiv);

    //Template is an overlay
    if (templates[currentTemplateNumber].overLay === true) {
      const Template = document.getElementById(
        "Template-" + templates[currentTemplateNumber].identifier
      );
      Template.style.position = "fixed";
      Template.style.top = "20%";
      Template.style.left = "36.5%";
    }

    //Template is a tooltip
    if (templates[currentTemplateNumber].toolTip === true) {
      const Target = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
      Target.classList.add("Template-Active-Element");
      const Template = document.getElementById(
        "Template-" + templates[currentTemplateNumber].identifier
      );

      createPopper(Target, newTemplateDiv, {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ],
      });
      Target.scrollIntoView({ behavior: "smooth" });
    }

    var button = document.getElementsByClassName("Next-Template-Button");
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          nextTemplate(document, templates);
        };
        if (currentTemplateNumber === templates.length - 1)
          button[i].innerHTML = "Finish";
      }
    }
    var button = document.getElementsByClassName("Previous-Template-Button");
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          previousTemplate(document, templates);
        };
        if (currentTemplateNumber === 0) button[i].disabled = true;
        if (currentTemplateNumber === 0) button[i].style.cursor = "not-allowed";
        if (currentTemplateNumber === 0) button[i].style.pointerEvents = "none";
      }
    }

    // slider functionality
    currentImageInSlideShow = 0;
    const imagesInSlideShow = document.getElementsByClassName(
      "Slideshow-Image-Display"
    );
    console.log(imagesInSlideShow);
    if (imagesInSlideShow.length > 0) {
      for (let i = 0; i < imagesInSlideShow.length; i++) {
        imagesInSlideShow[i].style.display = "none";
      }
      imagesInSlideShow[0].style.display = "block";

      var previousSlideShowImageButton = document.getElementsByClassName(
        "Slideshow-Container-Prev"
      );
      previousSlideShowImageButton[0].onclick = function () {
        previousImageInSlidShow();
      };

      var nextSlideShowImageButton = document.getElementsByClassName(
        "Slideshow-Container-Next"
      );
      nextSlideShowImageButton[0].onclick = function () {
        nextImageInSlideShow();
      };
    }
  }
};

export const previousTemplate = async (document, templates) => {
  //remove previous Template from screen
  if (currentTemplateNumber !== -1) {
    if (
      document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      ).length > 0
    ) {
      let previousTarget = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
      previousTarget.classList.remove("Template-Active-Element");
    }
    document
      .getElementById("Template-" + templates[currentTemplateNumber].identifier)
      .remove();
    if (
      document.getElementById(
        "Overlay-" + templates[currentTemplateNumber].identifier
      )
    ) {
      document
        .getElementById(
          "Overlay-" + templates[currentTemplateNumber].identifier
        )
        .remove();
    }
  }

  currentTemplateNumber = currentTemplateNumber - 1;

  if (currentTemplateNumber !== -1) {
    if (templates[currentTemplateNumber].toolTip === true) {
      var Target = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
    }

    var newTemplateDiv = document.createElement("div");
    newTemplateDiv.id =
      "Template-" + templates[currentTemplateNumber].identifier;
    currentTemplateIdentifier =
      "Template-" + templates[currentTemplateNumber].identifier;

    newTemplateDiv.innerHTML = templates[currentTemplateNumber].DOMString;
    newTemplateDiv.style.padding = "-5px";
    //newTemplateDiv.style.boxShadow = "5px 10px 18px grey";
    newTemplateDiv.style.borderRadius = "4%";
    newTemplateDiv.style.zIndex = "2147483647";
    if (templates[currentTemplateNumber].toolTip === true) {
      newTemplateDiv.style.backgroundColor = "white";
      var styles = `
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="top"] > #arrow {
      bottom: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="bottom"] > #arrow {
      top: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="left"] > #arrow {
      right: -4px;
    }
    
    #Template-${templates[currentTemplateNumber].identifier}[data-popper-placement^="right"] > #arrow {
      left: -4px;
    }
`;

      var styleSheet = document.createElement("style");
      styleSheet.type = "text/css";
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
      newTemplateDiv.innerHTML += "<div id='arrow' data-popper-arrow></div>";
    }

    document.body.append(newTemplateDiv);

    //overlay div
    var overlayDiv = document.createElement("div");
    overlayDiv.id = "Overlay-" + templates[currentTemplateNumber].identifier;
    overlayDiv.style.position = "fixed";
    overlayDiv.style.display = "block";
    overlayDiv.style.width = "100%";
    overlayDiv.style.height = "100%";
    overlayDiv.style.top = "0";
    overlayDiv.style.left = "0";
    overlayDiv.style.right = "0";
    overlayDiv.style.bottom = "0";
    overlayDiv.style.backgroundColor = "rgba(0,0,0,0.75)";
    overlayDiv.style.zIndex = "2147483646";
    document.body.append(overlayDiv);

    //it is an overlay
    if (templates[currentTemplateNumber].overLay === true) {
      const Template = document.getElementById(
        "Template-" + templates[currentTemplateNumber].identifier
      );
      Template.style.position = "fixed";
      Template.style.top = "20%";
      Template.style.left = "36.5%";
    }

    //it is an tooltip
    if (templates[currentTemplateNumber].toolTip === true) {
      const Target = document.getElementsByClassName(
        templates[currentTemplateNumber].identifier
      )[0];
      Target.classList.add("Template-Active-Element");

      const Template = document.getElementById(
        "Template-" + templates[currentTemplateNumber].identifier
      );
      createPopper(Target, newTemplateDiv, {
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
        ],
      });
      Target.scrollIntoView({ behavior: "smooth" });
    }

    var button = document.getElementsByClassName("Next-Template-Button");
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          nextTemplate(document, templates);
        };
        if (currentTemplateNumber === templates.length - 1)
          button[i].innerHTML = "Finish";
      }
    }
    var button = document.getElementsByClassName("Previous-Template-Button");
    if (button.length > 0) {
      for (let i = 0; i < button.length; i++) {
        button[i].onclick = function () {
          previousTemplate(document, templates);
        };
        if (currentTemplateNumber === 0) button[i].disabled = true;
        if (currentTemplateNumber === 0) button[i].style.cursor = "not-allowed";
        if (currentTemplateNumber === 0) button[i].style.pointerEvents = "none";
      }
    }

    // slider functionality
    currentImageInSlideShow = 0;
    const imagesInSlideShow = document.getElementsByClassName(
      "Slideshow-Image-Display"
    );
    console.log(imagesInSlideShow);
    if (imagesInSlideShow.length > 0) {
      for (let i = 0; i < imagesInSlideShow.length; i++) {
        imagesInSlideShow[i].style.display = "none";
      }
      imagesInSlideShow[0].style.display = "block";

      var previousSlideShowImageButton = document.getElementsByClassName(
        "Slideshow-Container-Prev"
      );
      previousSlideShowImageButton[0].onclick = function () {
        previousImageInSlidShow();
      };

      var nextSlideShowImageButton = document.getElementsByClassName(
        "Slideshow-Container-Next"
      );
      nextSlideShowImageButton[0].onclick = function () {
        nextImageInSlideShow();
      };
    }
  }
};

const nextImageInSlideShow = () => {
  const imagesInSlideShow = document.getElementsByClassName(
    "Slideshow-Image-Display"
  );
  currentImageInSlideShow++;
  if (currentImageInSlideShow >= imagesInSlideShow.length)
    currentImageInSlideShow = 0;

  for (let i = 0; i < imagesInSlideShow.length; i++) {
    imagesInSlideShow[i].style.display = "none";
  }
  imagesInSlideShow[currentImageInSlideShow].style.display = "block";
};

const previousImageInSlidShow = () => {
  const imagesInSlideShow = document.getElementsByClassName(
    "Slideshow-Image-Display"
  );
  currentImageInSlideShow--;
  if (currentImageInSlideShow < 0)
    currentImageInSlideShow = imagesInSlideShow.length - 1;

  for (let i = 0; i < imagesInSlideShow.length; i++) {
    imagesInSlideShow[i].style.display = "none";
  }
  imagesInSlideShow[currentImageInSlideShow].style.display = "block";
};
