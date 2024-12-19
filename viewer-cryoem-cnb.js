document.addEventListener('DOMContentLoaded', function() {
    const yamlFilePath = 'data/Processing_metadata.yaml'; // Path to your YAML file

    fetch(yamlFilePath) // Initiates a network request to retrieve the YAML file
        .then(response => {
            if (!response.ok) {
                throw new Error('Error when loading YAML file');
            }
            return response.text(); // Read the response as text (YAML format)
        })
        .then(yamlText => {
            const json = jsyaml.load(yamlText); // Convert YAML to JSON
            const container = document.getElementById('json-container');
            container.innerHTML = ''; // Clear any existing content
            displayYamlAsText(json, container, true); // Render the YAML data with top-level sections
        })
        .catch(error => {
            document.getElementById('json-container').textContent = 'Error: ' + error.message;
        });

    // Map for tooltip texts
    const tooltipTexts = {
        'astigmatism': 'Astigmatism was calculated using the defocus ratio method.',
        'images_classes_3d': 'Images show central section.',
        'defocus_mic_examples': 'Micrographs are shown in increasing order of defocus',
        'particles_mic_examples': 'Micrographs are shown in decreasing order of particle number'
    };


    // Function to display YAML data as text format
    function displayYamlAsText(yaml, container, isSection = false) {
        if (typeof yaml === 'object' && yaml !== null) {
            Object.keys(yaml).forEach(key => {
                const value = yaml[key];
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
                    displayYamlAsText(value, nestedContainer, false);
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

                    if (Array.isArray(value) && key.toLowerCase() === 'particles_per_class') {
                        // Handle 'particles_per_class' as a comma-separated list
                        keyValue.innerHTML += `<span class="value">${value.join(', ')}</span>`;

                    } else if (typeof value === 'string' && value.endsWith('.jpg')) {
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
                        displayYamlAsText(value, nestedContainer, false);

                    } else if (value && typeof value === 'object' && Array.isArray(value)) {
                        // Handle arrays inside YAML
                        const arrayContainer = document.createElement('div');
                        arrayContainer.className = 'array-container';

                        if (key === 'descriptors' ) {
                            value.forEach((item, index) => {
                                const arrayItem = document.createElement('div');
                                arrayItem.className = 'array-item';
                                arrayItem.textContent = `descriptor ${index + 1}: `;
                                arrayItem.style.paddingLeft = '20px';
                                arrayContainer.appendChild(arrayItem);

                                const innerContainer = document.createElement('div');
                                innerContainer.style.paddingLeft = '40px';
                                displayYamlAsText(item, innerContainer, false);
                                arrayContainer.appendChild(innerContainer);
                            });
                        } else if (key === 'volumes') {
                            value.forEach((volume, index) => {
                                const arrayItem = document.createElement('div');
                                arrayItem.className = 'array-item';
                                arrayItem.textContent = `volume ${index + 1}:`;
                                arrayItem.style.paddingLeft = '20px';
                                arrayContainer.appendChild(arrayItem);

                                const volumeContentContainer = document.createElement('div');
                                volumeContentContainer.style.paddingLeft = '40px';
                                displayYamlAsText(volume, volumeContentContainer, false);
                                arrayContainer.appendChild(volumeContentContainer);
                            });
                        } else {
                            value.forEach((item, index) => {
                                const arrayItem = document.createElement('div');
                                arrayItem.className = 'array-item';
                                arrayItem.textContent = `Item ${index + 1}: `;
                                arrayItem.style.paddingLeft = '20px';
                                arrayContainer.appendChild(arrayItem);

                                const innerContainer = document.createElement('div');
                                innerContainer.style.paddingLeft = '40px';
                                displayYamlAsText(item, innerContainer, false);
                                arrayContainer.appendChild(innerContainer);
                            });
                        }

                        keyValue.appendChild(arrayContainer);
                    } else {
                        keyValue.innerHTML += ` ${value}`;
                    }

                    container.appendChild(keyValue);
                }
            });
        } else {
            container.textContent = 'The YAML is not an object or is empty.';
        }
    }

});

