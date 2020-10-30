const constraints: MediaStreamConstraints = { audio: true }

export const useAudio = async () => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  const mediaRecorder = new MediaRecorder(stream)

  mediaRecorder.start()
  const chunks: Blob[] = []
  mediaRecorder.ondataavailable = e => {
    chunks.push(e.data)
  }
  navigator.mediaDevices
    .enumerateDevices()
    .then(devices => console.log(devices))
  // setInterval(() => {
  //   console.log(chunks)
  // }, 2000)

  return mediaRecorder
}
