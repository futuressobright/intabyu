function displayWeatherMessage() {
    alert("The weather is always fabulous!");
}

let mediaRecorder;
let recordedBlobs;

document.getElementById('startRecordingBtn').addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            document.getElementById('videoPreview').srcObject = stream;
            recordedBlobs = [];
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorder.ondataavailable = event => {
                if (event.data && event.data.size > 0) {
                    recordedBlobs.push(event.data);
                }
            };
            mediaRecorder.start();
            document.getElementById('startRecordingBtn').style.display = 'none';
            document.getElementById('stopRecordingBtn').style.display = 'inline';
        })
        .catch(console.error);
});


document.getElementById('stopRecordingBtn').addEventListener('click', () => {
    mediaRecorder.stop();
    mediaRecorder.onstop = async () => {
        const videoBlob = new Blob(recordedBlobs, {type: 'video/webm'});
        const formData = new FormData();
        formData.append('video', videoBlob, 'filename.webm'); // 'video' matches the name expected by FastAPI

        try {
            const response = await fetch('/upload_video', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            console.log('Upload successful:', result);
        } catch (error) {
            console.error('Upload error:', error);
        }
    };
});

