
// Your PAT (Personal Access Token) can be found in the Account's Security section
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope

// Change these to whatever model and image URL you want to use


export function construirRaw(imageData){
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": imageData
                }
            }
        ]
    });
    return raw
}

export function construirRequestOptions(raw){
    const PAT = 'ebc567fbda5c47208855678b371e1cdf';
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    return requestOptions
}

export async function peticionClarifai(requestOptions){
    const MODEL_ID = 'general-image-detection';
    const MODEL_VERSION_ID = '1580bb1932594c93b7e2e04456af7c6f';
    try {
        let peticion = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        let result = await peticion.json()
        const regions = result.outputs[0].data.regions;

        regions.forEach(region => {
            // Accessing and rounding the bounding box values
            const boundingBox = region.region_info.bounding_box;
            const topRow = boundingBox.top_row.toFixed(3);
            const leftCol = boundingBox.left_col.toFixed(3);
            const bottomRow = boundingBox.bottom_row.toFixed(3);
            const rightCol = boundingBox.right_col.toFixed(3);

            region.data.concepts.forEach(concept => {
                // Accessing and rounding the concept value
                const name = concept.name;
                const value = concept.value.toFixed(4);

                console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
                
            });
        });
    } catch (error) {
        console.log(error)
    }
}
