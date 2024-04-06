let mediaRecorder
let recordedBlobs


async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById('videoPreview').srcObject = stream;
    recordedBlobs = [];

    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });  // Use the globally defined variable

    mediaRecorder.ondataavailable = event => {
      if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
      }
    };

    // Move UI updates outside of the ondataavailable event handler
    document.getElementById('startRecordingBtn').style.display = 'none';
    document.getElementById('stopRecordingBtn').style.display = 'inline';
    document.getElementById('stopRecordingBtn').disabled = false;

    mediaRecorder.start();
  } catch (error) {
    console.error('Error starting recording:', error);
  }
}

async function stopRecording() {
  try {
    console.log("Stopping recording...");
    mediaRecorder.stop();  // Use the globally defined variable
    await handleRecordingStopped();
  } catch (error) {
    console.error('Error stopping recording:', error);
  }
}

async function handleRecordingStopped() {
  try {
    // Stop media stream tracks (stops camera and microphone)
    document.getElementById('videoPreview').srcObject.getTracks().forEach(track => track.stop());

    // Create the video blob from recorded data chunks
    const videoBlob = new Blob(recordedBlobs, { type: 'video/webm' });

    // Upload the video blob to the server (assuming uploadVideo handles the upload)
    await uploadVideo(videoBlob);

    // UI updates after successful upload (or potential errors)
    document.getElementById('startRecordingBtn').style.display = 'inline';
    document.getElementById('stopRecordingBtn').style.display = 'none';
  } catch (error) {
    console.error('Error handling recording stopped:', error);
    // Handle potential errors here (e.g., upload failure)
  }
}

async function uploadVideo(videoBlob) {
    const formData = new FormData();
    formData.append('video', videoBlob, 'filename.webm');

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
}

document.getElementById('startRecordingBtn').addEventListener('click', startRecording);
document.getElementById('stopRecordingBtn').addEventListener('click', stopRecording);
