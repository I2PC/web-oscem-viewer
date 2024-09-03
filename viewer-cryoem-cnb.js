document.addEventListener('DOMContentLoaded', function() {
    const jsonFilePath = 'data/Processing_json.json'; // Path to your JSON file

    fetch(jsonFilePath) // Initiates a network request to retrieve the JSON file from the specified path
        .then(response => {
            if (!response.ok) {
                throw new Error('Error when loading JSON file');
            }
            return response.json(); // Convert the response to JSON
        })
        .then(json => {
            const container = document.getElementById('json-container');
            container.innerHTML = ''; // Clear any existing content
            displayJsonAsText(json, container, true); // Render the JSON data with top-level sections
        })
        .catch(error => {
            document.getElementById('json-container').textContent = 'Error: ' + error.message;
        });

    // Map for tooltip texts
    const tooltipTexts = {
        'astigmatism': 'Astigmatism was calculated using the defocus ratio method.',
        'images_classes_3d': 'Images show central section.'
    };

    // Function to display JSON data in a text format
    function displayJsonAsText(json, container, isSection = false) {
        if (typeof json === 'object' && json !== null) {
            Object.keys(json).forEach(key => {
                const value = json[key];
                const keyValue = document.createElement('div');
                keyValue.className = 'item';

                if (isSection) {
                    // Create a section title for top-level sections
                    const sectionTitle = document.createElement('div');
                    sectionTitle.className = 'section-title';
                    sectionTitle.textContent = key;
                    container.appendChild(sectionTitle);

                    const nestedContainer = document.createElement('div');
                    nestedContainer.className = 'nested-container';
                    container.appendChild(nestedContainer);

                    // Process the nested objects
                    displayJsonAsText(value, nestedContainer, false);
                } else {
                    const normalizedKey = key.toLowerCase();
                    let hasTooltip = false;

                    if (tooltipTexts[normalizedKey]) {
                        // Create the key-value element with a tooltip
                        keyValue.innerHTML = `<span class="key">${key}:</span> `;

                        // Create tooltip
                        const tooltip = document.createElement('span');
                        tooltip.className = 'tooltip';
                        tooltip.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="none"/>
                                <text x="12" y="16" text-anchor="middle" font-size="14" fill="black">?</text>
                            </svg>
                        `;

                        // Create tooltip text
                        const tooltipText = document.createElement('span');
                        tooltipText.className = 'tooltiptext';
                        tooltipText.textContent = tooltipTexts[normalizedKey];

                        tooltip.appendChild(tooltipText);
                        keyValue.appendChild(tooltip);
                        hasTooltip = true;
                    } else {
                        keyValue.innerHTML = `<span class="key">${key}:</span> `;
                    }

                    if (typeof value === 'string' && value.endsWith('.png')) {
                        // Handle images
                        const imgElement = document.createElement('img');
                        imgElement.src = `data/${value}`;
                        imgElement.alt = key;
                        imgElement.style.maxWidth = '200px';
                        imgElement.style.maxHeight = '200px';

                        imgElement.style.transition = 'transform 0.3s ease, margin-left 0.3s ease'; // Smooth transition for zoom effect
                        imgElement.style.cursor = 'zoom-in'; // Change cursor to indicate zoom-in
                        imgElement.style.transformOrigin = 'center center'; // Start scaling from the center
                        imgElement.style.position = 'relative'; // Ensure the image can be positioned

                        imgElement.onmouseover = () => {
                            imgElement.style.transform = 'scale(3.5)'; // Enlarge the image
                            imgElement.style.zIndex = '1000'; // Ensure it stays above other content
                            imgElement.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)'; // Add shadow for emphasis
                            imgElement.style.marginLeft = '250px'; // Move the image to the right when zoomed in

                            // Temporarily hide or lower z-index of overlapping images
                            const surroundingImages = keyValue.querySelectorAll('img');
                            surroundingImages.forEach((img) => {
                                if (img !== imgElement) {
                                    img.style.visibility = 'hidden'; // Hide other images temporarily
                                }
                            });
                        };

                        imgElement.onmouseout = () => {
                            imgElement.style.transform = 'scale(1)'; // Return to original size
                            imgElement.style.zIndex = 'auto'; // Reset z-index
                            imgElement.style.boxShadow = 'none'; // Remove shadow
                            imgElement.style.marginLeft = '0'; // Reset position to the original place

                            // Restore visibility of all images
                            const surroundingImages = keyValue.querySelectorAll('img');
                            surroundingImages.forEach((img) => {
                                img.style.visibility = 'visible'; // Make other images visible again
                            });
                        };

                        keyValue.appendChild(imgElement);

                    } else if (typeof value === 'object' && !Array.isArray(value)) {
                        // Handle nested objects
                        const nestedContainer = document.createElement('div');
                        nestedContainer.className = 'nested-container';
                        keyValue.appendChild(nestedContainer);
                        displayJsonAsText(value, nestedContainer, false);
                    } else {
                        keyValue.innerHTML += ` ${value}`; // Append value to existing content
                    }

                    container.appendChild(keyValue);
                }
            });
        } else {
            container.textContent = 'The JSON is not an object or is empty.';
        }
    }

});
