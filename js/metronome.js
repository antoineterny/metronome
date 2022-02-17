class Metronome {
  constructor(tempo = 88) {
    this.audioContext = null
    this.notesInQueue = [] // notes that have been put into the web audio and may or may not have been played yet {note, time}
    this.displayedTempo = tempo
    this.subdivisions = 1
    this.currentSubdiv = 0
    this.lookahead = 25 // How frequently to call scheduling function (in milliseconds)
    this.scheduleAheadTime = 0.1 // How far ahead to schedule audio (sec)
    this.nextNoteTime = 0.0 // when the next note is due
    this.isRunning = false
    this.intervalID = null
    this.buffers = {}
    this.soundName = "clave"
  }

  nextNote() {
    this.actualTempo = this.displayedTempo * this.subdivisions
    // Advance current note and time by a subdivision
    const secondsPerBeat = 60.0 / this.actualTempo // Notice this picks up the CURRENT tempo value to calculate beat length.
    this.nextNoteTime += secondsPerBeat // Add beat length to last beat time

    this.currentSubdiv++ // Advance the subdiv number, wrap to zero
    if (this.currentSubdiv == this.subdivisions) {
      this.currentSubdiv = 0
    }
  }

  scheduleNote(subdivNumber, time) {
    // push the note on the queue, even if we're not playing.
    this.notesInQueue.push({ note: subdivNumber, time: time })

    // create an oscillator
    // const osc = this.audioContext.createOscillator()
    // const envelope = this.audioContext.createGain()
    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    source.buffer = this.buffers.clave

    const vol = subdivNumber % this.subdivisions == 0 ? 1 : 0.1
    source.connect(gainNode)
    gainNode.gain.value = vol
    gainNode.connect(this.audioContext.destination)
    
    source.start(time)
    source.stop(time + 0.3)
  }

  scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentSubdiv, this.nextNoteTime)
      this.nextNote()
    }
  }

  start() {
    if (this.isRunning) return

    if (this.audioContext == null) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.loadSound(this.soundName, this.audioContext, this.buffers)
    }

    this.isRunning = true

    this.currentSubdiv = 0
    this.nextNoteTime = this.audioContext.currentTime + 0.05

    this.intervalID = setInterval(() => this.scheduler(), this.lookahead)
  }

  stop() {
    this.isRunning = false

    clearInterval(this.intervalID)
  }

  startStop() {
    if (this.isRunning) {
      this.stop()
    } else {
      this.start()
    }
  }

  loadSound(fileName, context, buffers) {
    fetch(`./snd/${fileName}.mp3`)
      .then(data => data.arrayBuffer())
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
      .then(decodedAudio => {
        buffers[fileName] = decodedAudio
      })
  }
}
