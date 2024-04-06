let mediaRecorder;
let recordedChunks = [];

// Function to initialize media stream and start video preview
function startVideoPreview() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            const videoPreview = document.getElementById('videoPreview');
            videoPreview.srcObject = stream;
            setupMediaRecorder(stream);
        }).catch(error => console.error('getUserMedia error:', error));
}

// Function to set up the media recorder
function setupMediaRecorder(stream) {
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };
    // Directly attach stop recording functionality on stopping the mediaRecorder
    mediaRecorder.onstop = saveRecordedVideo;
}

// Function to start recording
function startRecording() {
    recordedChunks = []; // Reset previously recorded chunks
    mediaRecorder.start();
    console.log('Recording started');
    document.getElementById('startRecordingBtn').style.display = 'none';
    document.getElementById('stopRecordingBtn').style.display = 'inline'; // Show stop button
}

// Function to stop recording
function stopRecording() {
    mediaRecorder.stop();
    console.log('Recording stopped');
    document.getElementById('startRecordingBtn').style.display = 'inline'; // Show start button again for new recordings
    document.getElementById('stopRecordingBtn').style.display = 'none'; // Hide stop button
}

// Function to save/download the recorded video
function saveRecordedVideo() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recorded_video.webm'; // Filename for the saved video
    document.body.appendChild(a); // Append the link to the body
    a.click(); // Programmatically click the link to trigger the download
    document.body.removeChild(a); // Clean up by removing the link
    window.URL.revokeObjectURL(url); // Free up memory by revoking the blob URL
}

// Attach event listeners to buttons
document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('startRecordingBtn').addEventListener('click', startRecording);
    document.getElementById('stopRecordingBtn').addEventListener('click', stopRecording);
    startVideoPreview(); // Initialize video preview on page load
});
