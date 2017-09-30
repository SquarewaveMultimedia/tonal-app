import tonal from "tonal";
const ac = new AudioContext();
let piano = null;

const loadPiano = Soundfont => {
  console.log("Loading...");
  if (Soundfont === undefined) {
    console.log("Load piano retry");
    setTimeout(() => loadPiano(window.Soundfont), 1000);
  } else {
    Soundfont.instrument(ac, "acoustic_grand_piano").then(inst => {
      console.log("Piano loaded!");
      piano = inst;
    });
  }
};

loadPiano(window.Soundfont);

const centered = tonic => {
  const pc = tonal.note.pc(tonic);
  const oct = pc[0] === "A" || pc[0] === "B" ? 3 : 4;
  return pc + oct;
};

const buildScale = (tonic, intervals) => {
  const scale = intervals.map(tonal.distance.transpose(centered(tonic)));
  const rev = scale.slice().reverse();
  scale.push(tonal.distance.transpose(scale[0], "P8"));
  return scale.concat(rev);
};

const buildChord = (tonic, intervals) => {
  return intervals.map(tonal.distance.transpose(centered(tonic)));
};

export default (tonic, intervals, type) => {
  if (!piano) return;
  const notes =
    type === "scale"
      ? buildScale(tonic, intervals)
      : buildChord(tonic, intervals);
  const events = notes.map((note, i) => ({
    time: type === "chord" ? 0 : i * 0.5,
    note
  }));

  piano.stop(ac.currentTime);
  piano.schedule(ac.currentTime, events);
};