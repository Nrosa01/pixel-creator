export function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;

        document.body.appendChild(script);

        script.addEventListener('load', () => resolve(script));
        script.addEventListener('error', () => reject(script));
    });
}

export async function loadFile(fileTypes) {
    // Creates a new input element, sets its type to file, and simulates a click on it
    let input = document.createElement('input');

    input.type = 'file';
    input.accept = fileTypes;
    input.click();

    return new Promise((resolve, reject) => {
        // When the user selects a file, the change event is triggered
        input.onchange = () => {
            // Get the selected file
            let file = input.files[0];
            // Create a new file reader
            let reader = new FileReader();
            // When the reader loads, resolve the promise with the result
            reader.onload = () => {
                // The fileloaded is a json file, so parse it into an object
                let fileLoaded = reader.result;
                // Delete the input element
                input.remove();
                resolve(fileLoaded);
            }
            // When the reader errors, reject the promise with the error
            reader.onerror = reject;
            // Read the file as a text file
            reader.readAsText(file);
        };
    });
}

export function saveToFile(fileName, data) {
    // It creates a <a> element and clicks it, then removes it
    let file = new Blob([data], { type: 'application/json' });
    let a = document.createElement("a"),
        url = URL.createObjectURL(file);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
        , 0);
}