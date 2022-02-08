var metronome = new Metronome()
var tempo = document.getElementById("tempo")
tempo.textContent = metronome.tempo

var playPauseIcon = document.getElementById("play-pause-icon")

var playButton = document.getElementById("play-button")
playButton.addEventListener("click", function () {
  metronome.startStop()

  if (metronome.isRunning) {
    playPauseIcon.className = "pause"
  } else {
    playPauseIcon.className = "play"
  }
})

const maelzel = [
  40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108,
  112, 116, 120, 126, 132, 138, 144, 152, 160, 168, 176, 184, 192, 200, 208,
]

const nextMaelzel = currentTempo => {
  for (let i = 0; i <= maelzel.length; i++) {
    if (currentTempo < maelzel[i]) return maelzel[i]
  }
  return 208
}

const prevMaelzel = currentTempo => {
  for (let i = maelzel.length - 1; i >= 0; i--) {
    if (currentTempo > maelzel[i]) return maelzel[i]
  }
  return 40
}

var tempoChangeButtons = document.getElementsByClassName("tempo-change")
for (var i = 0; i < tempoChangeButtons.length; i++) {
  tempoChangeButtons[i].addEventListener("click", function () {
    metronome.tempo += parseInt(this.dataset.change)
    tempo.textContent = metronome.tempo
  })
}

const nextMaelzelBtn = document.querySelector('#next-maelzel')
nextMaelzelBtn.onclick = () => {
  metronome.tempo = nextMaelzel(metronome.tempo)
  tempo.textContent = metronome.tempo
}

const prevMaelzelBtn = document.querySelector('#prev-maelzel')
prevMaelzelBtn.onclick = () => {
  metronome.tempo = prevMaelzel(metronome.tempo)
  tempo.textContent = metronome.tempo
}