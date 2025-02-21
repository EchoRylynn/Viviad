       //------------------- Key Feature Here ----------------------//
        //                                                           //
        //       Please replace this link with new model link        //
        //         to update the categories of applications          //
        //                                                           //
        //-----------------------------------------------------------//

        // The link to your model provided by Teachable Machine export panel
        // No need to replace it if the update is based on the original project model
        const URL = "https://teachablemachine.withgoogle.com/models/Nrieq-bN-/";
        //
        //

        let model, webcam, labelContainer, maxPredictions;
        let videoDeviceId = null;
        let lastClass = null;
        let timeoutId = null;

        // The Information pages of different Applications
        //FC Fast Food Package
        const urlA = "https://canonpp.sharepoint.com/sites/Eureka/SitePages/Folding-Carton---Fast-Food-Package.aspx"; 
        //DTO Coasters
        const urlB = "https://canonpp.sharepoint.com/sites/Eureka/SitePages/Direct-to-Object-Printing(1).aspx";
        // const urlC = "https://canonpp.sharepoint.com/sites/Eureka/SitePages/Direct-to-Object-Printing.aspx"; 
        const originalUrl = window.location.href; 

        // Load the image model and setup the webcam
        async function init() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            // load the model and metadata
            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            // Get available video input devices
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            if (videoDevices.length > 1) {
                // Choose the external camera (or any specific camera)
                videoDeviceId = videoDevices[0].deviceId; // Assuming the second device is the external camera
            } else if (videoDevices.length > 0) {
                // Use the default webcam if no external webcam is found
                videoDeviceId = videoDevices[0].deviceId;
            } 

            // Setup webcam with the selected device
            const flip = true; // whether to flip the webcam
            webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
            await webcam.setup({ deviceId: videoDeviceId }); // specify the deviceId
            await webcam.play();
            window.requestAnimationFrame(loop);

            // Update status
            document.getElementById("status").innerText = "READY TO SCAN";
            document.getElementById("sign").style.display = "block";

            // append elements to the DOM
            document.getElementById("webcam-container").appendChild(webcam.canvas);
            labelContainer = document.getElementById("label-container");
            for (let i = 0; i < maxPredictions; i++) { // and class labels
                labelContainer.appendChild(document.createElement("div"));
            }
        }

        async function loop() {
            webcam.update(); // update the webcam frame
            await predict();
            window.requestAnimationFrame(loop);
        }

        // run the webcam image through the image model
        async function predict() {
            // predict can take in an image, video or canvas html element
            const prediction = await model.predict(webcam.canvas);
            let highestProbability = 0;
            let currentClass = null;
            for (let i = 0; i < maxPredictions; i++) {
                if (prediction[i].probability > highestProbability) {
                    highestProbability = prediction[i].probability;
                    currentClass = prediction[i].className;
                }
                const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                labelContainer.childNodes[i].innerHTML = classPrediction;
            }

            if (currentClass !== lastClass) {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // Background Default Class
                if (currentClass === "Class 1") {
                    // timeoutId = setTimeout(() => {
                    //     playSuccessSound();
                    //     setTimeout(() => {
                    //         window.location.href = originalUrl;
                    //     }, 500); // Adjust the delay to ensure the sound plays before switching
                    // }, 10000);

                    
                } else if (currentClass === "Class 2") {
                    timeoutId = setTimeout(() => {
                        playSuccessSound();
                        setTimeout(() => {
                            window.location.href = urlA;
                        }, 500); // Adjust the delay to ensure the sound plays before switching
                    }, 1000);
                } else if (currentClass === "Class 3") {
                    timeoutId = setTimeout(() => {
                        playSuccessSound();
                        setTimeout(() => {
                            window.location.href = urlB;
                          
                        }, 500); // Adjust the delay to ensure the sound plays before switching
                    }, 1000);
                }  
                
                // else if (currentClass === "Class 4") {
                //     timeoutId = setTimeout(() => {
                //         playSuccessSound();
                //         setTimeout(() => {
                //             window.location.href = urlC;
                          
                //         }, 500); // Adjust the delay to ensure the sound plays before switching
                //     }, 1000);
                // }  else if (currentClass === "Class 5") {
                //     timeoutId = setTimeout(() => {
                //         playSuccessSound();
                //         setTimeout(() => {
                //             window.location.href = urlD;
                          
                //         }, 500); // Adjust the delay to ensure the sound plays before switching
                //     }, 1000);
                // }

                lastClass = currentClass;
            }
        }

        function playSuccessSound() {
            const audio = document.getElementById("success-sound");
            audio.play();
        }
        