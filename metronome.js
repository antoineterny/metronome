class Metronome {
  constructor(tempo = 88) {
    this.audioContext = null
    this.notesInQueue = [] // notes that have been put into the web audio and may or may not have been played yet {note, time}
    this.currentQuarterNote = 0
    this.tempo = tempo
    this.lookahead = 25 // How frequently to call scheduling function (in milliseconds)
    this.scheduleAheadTime = 0.1 // How far ahead to schedule audio (sec)
    this.nextNoteTime = 0.0 // when the next note is due
    this.isRunning = false
    this.intervalID = null
    this.buffers = {}
  }

  nextNote() {
    // Advance current note and time by a quarter note (crotchet if you're posh)
    var secondsPerBeat = 60.0 / this.tempo // Notice this picks up the CURRENT tempo value to calculate beat length.
    this.nextNoteTime += secondsPerBeat // Add beat length to last beat time

    this.currentQuarterNote++ // Advance the beat number, wrap to zero
    if (this.currentQuarterNote == 4) {
      this.currentQuarterNote = 0
    }
  }

  scheduleNote(beatNumber, time) {
    // push the note on the queue, even if we're not playing.
    this.notesInQueue.push({ note: beatNumber, time: time })

    // create an oscillator
    // const osc = this.audioContext.createOscillator()
    // const envelope = this.audioContext.createGain()
    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()
    source.buffer = this.buffers.clave

    // // osc.frequency.value = (beatNumber % 4 == 0) ? 1000 : 800;
    // osc.frequency.value = 800
    // envelope.gain.value = 1
    // envelope.gain.exponentialRampToValueAtTime(1, time + 0.001)
    // envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02)

    // osc.connect(envelope)
    // envelope.connect(this.audioContext.destination)

    const vol = beatNumber % 4 == 0 ? 1 : .25
    source.connect(gainNode)
    gainNode.gain.value = vol
    gainNode.connect(this.audioContext.destination)

    // osc.start(time)
    // osc.stop(time + 0.03)
    
    source.start(time)
    source.stop(time + 0.3)
  }

  scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentQuarterNote, this.nextNoteTime)
      this.nextNote()
    }
  }

  start() {
    if (this.isRunning) return

    if (this.audioContext == null) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.loadSound("clave", this.audioContext, this.buffers)
    }

    this.isRunning = true

    this.currentQuarterNote = 0
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
    fetch(`./${fileName}.mp3`)
      .then(data => data.arrayBuffer())
      .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
      .then(decodedAudio => {
        buffers[fileName] = decodedAudio
      })
  }
}
