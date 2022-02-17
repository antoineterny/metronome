var metronome = new Metronome()
var tempoInput = document.getElementById("tempo-input")
tempoInput.value = metronome.displayedTempo

const maelzelDiv = document.querySelector("#maelzel")
const uniteDiv = document.querySelector("#unite")

const selectorCheckbox = document.querySelector("#selector-checkbox")
selectorCheckbox.onclick = () => {
  maelzelDiv.classList.toggle("active")
  uniteDiv.classList.toggle("active")
}
maelzelDiv.onclick = () => {
  maelzelDiv.classList.add("active")
  uniteDiv.classList.remove("active")
  selectorCheckbox.checked = false
}
uniteDiv.onclick = () => {
  uniteDiv.classList.add("active")
  maelzelDiv.classList.remove("active")
  selectorCheckbox.checked = true
}

const startStopMetronome = function () {
  metronome.startStop()
  document.querySelector("#play").classList.toggle("invisible")
  document.querySelector("#stop").classList.toggle("invisible")
}
document.querySelectorAll(".play-stop-buttons button").forEach(btn => {
  btn.addEventListener("click", startStopMetronome)
})
document.addEventListener("keypress", e => {
  if (e.code === "Enter" || e.code === "Space" || e.code === "NumpadEnter") startStopMetronome()
})

tempoInput.onchange = () => {
  if (tempoInput.value > 250) tempoInput.value = 250
  metronome.displayedTempo = tempoInput.value
}

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

const plus = document.querySelector("#plus")
plus.onclick = () => {
  metronome.displayedTempo = selectorCheckbox.checked
    ? metronome.displayedTempo + 1
    : nextMaelzel(metronome.displayedTempo)
  tempoInput.value = metronome.displayedTempo
}

const moins = document.querySelector("#moins")
moins.onclick = () => {
  metronome.displayedTempo = selectorCheckbox.checked
    ? metronome.displayedTempo - 1
    : prevMaelzel(metronome.displayedTempo)
  tempoInput.value = metronome.displayedTempo
}

const selectSubdiv = int => {
  metronome.subdivisions = int
  const subdivBtns = document.querySelectorAll(".subdiv")
  subdivBtns.forEach((sub, i) => {
    if (i < int) sub.classList.add("active")
    else sub.classList.remove("active")
  })
}

const taps = []
function tapTempo() {
  document.querySelector(".tap-zone").classList.add("tapped")
  setTimeout(() => {
    document.querySelector(".tap-zone").classList.remove("tapped")
  }, 10)
  taps.push(Date.now())
  if (taps[taps.length - 1] - taps[taps.length - 2] > 2000) taps.splice(0, taps.length - 1)
  console.log("taps", taps)
  if (taps.length <= 2) {
    diff = taps[1] - taps[0]
  } else if (taps.length === 3) {
    diff = (taps[2] - taps[1] + (taps[1] - taps[0])) / 2
  } else {
    diff =
      (taps[taps.length - 1] -
        taps[taps.length - 2] +
        (taps[taps.length - 2] - taps[taps.length - 3]) +
        (taps[taps.length - 3] - taps[taps.length - 4])) /
      3
  }

  const bpm = Math.round(60000 / diff)
  if (bpm > 30) {
    metronome.displayedTempo = tempoInput.value = bpm
  }
}
