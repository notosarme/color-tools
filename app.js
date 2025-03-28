import ColorThief from "./node_modules/colorthief/dist/color-thief.mjs";

const colorThief = new ColorThief();

const imgForm = {
  form: document.getElementById("form"),
  imgDiv: document.getElementById("imgDiv"),

  init: () => { 
    form.reset(); 
    document.getElementById("submitBtn").addEventListener("click", (ev) => {
      ev.preventDefault();
      imgForm.fileSubmit();
    })
  },

  fileSubmit: () => {
    let uploadImage = form.firstElementChild.files[0];

    // Validate if a file was uploaded
    if (!uploadImage) {
      console.error("No file selected");
      return;
    }

    // Check if the uploaded file is an image
    if (uploadImage.type.substr(0, 5) !== "image") {
      console.error("Only images allowed");
      return;
    }

    let img = document.createElement("img");
    colorFunction.getBase64(uploadImage)
    .then((data) => {
      img.src = data;
      imgDiv.appendChild(img);
      
      if (img.complete) {
        const colors = colorThief.getPalette(img, 5); // Get 5 main colors
        colorFunction.displayColors(colors);
      } else {
        img.addEventListener('load', function() {
          const colors = colorThief.getPalette(img, 5); // Get 5 main colors
          colorFunction.displayColors(colors);
        });
      }
    });
  }
}

const colorFunction = {
  displayColors: (colors) => {
    const colorsDiv = document.getElementById('colors');
    colorsDiv.innerHTML = ''; // Clear previous colors
    colors.forEach(color => {
      const hexColor = colorFunction.rgbToHex(color[0], color[1], color[2]);
      const div = document.createElement('div');
      div.className = 'color-box';
      div.style.backgroundColor = hexColor;
      div.title = hexColor;
      colorsDiv.appendChild(div);
    });
  },
  getBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  },
  rgbToHex: (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  }
}


document.addEventListener("DOMContentLoaded", () => {
  imgForm.init();
});
