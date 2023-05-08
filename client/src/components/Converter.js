import React, { useState } from 'react';
import * as mm from '@magenta/music';
import * as Tone from 'tone'
// const fs = require('fs');
const { NoteSequence, MusicRNN, sequences, sequenceProtoToMidi } = mm;
const { Midi } = require('@magenta/music');
const { quantizeNoteSequence } = sequences;


function Converter() {
  const [pitchData, setPitchData] = useState([]);
  // const [audioUrl, setAudioUrl] = useState('');
  const [tempo, setTempo] = useState(120);
  const [newNoteSequence, setNewNoteSequence] = useState(null)

  const pitchClasses = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

  function midiToPitch(midiPitch) {
    const pitchClass = midiPitch % 12;
    const octave = Math.floor(midiPitch / 12) - 1;
    return pitchClasses[pitchClass] + octave.toString();
  }

  const handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = new Image();
      img.src = URL.createObjectURL(event.target.files[0]);
      console.log(img)
      img.onload = function() {
        const canvas = document.createElement('canvas');
        
        canvas.width = img.width / 5;
        canvas.height = img.height / 5;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, img.width, img.height).data;

        const pitchData = [];
        const pitchRange = 128; // MIDI pitch range (0-127)

        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];

          // console.log('r: ',r,'g: ',g,'b: ',b)

          // Check if pixel is white
          if (r > 240 && g > 240 && b > 240) {
            continue; // Skip white pixel
          }
          // Check if pixel is black
          if (r === 0 && g === 0 && b === 0) {
            continue; // Skip white pixel
          }

          // Convert RGB color values to MIDI pitch values using chromatic mapping
          const midiValue = Math.round(
              12 * Math.log2(((r / 255) + (g / 255) + (b / 255)) / 3 * pitchRange) + 60
          );
          // console.log(midiValue)

          // Clamp pitch values to the valid range of 0-127
          const clampedMidiValue = Math.max(0, Math.min(127, midiValue));
          // console.log(clampedMidiValue);

          // Check if pitch is within the valid range of 0-127
          // if (clampedPitch < 0 || clampedPitch > 127) {
          //   console.error(`Invalid pitch value: ${clampedPitch}`);
          //   continue;
          // }

          // Convert MIDI value to pitch value
          // const pitch = midiToPitch(clampedMidiValue)

          // Check extreme MIDI values
          if (clampedMidiValue === 127 || clampedMidiValue === 0) {
            continue; // Skip extreme midi values
          }

          // Add the pitch value to the pitch data array
          pitchData.push(clampedMidiValue);
        }

        // Set the pitch data state
        setPitchData(pitchData);
        console.log(pitchData)
      }
    }
  };

  const handleTempoChange = (event) => {
    setTempo(parseInt(event.target.value));
  };
  
  // Convert an array of MIDI pitch values to a Magenta NoteSequence
  async function createNoteSequenceFromMidi() {
    const noteSequence = new NoteSequence();

    // Set the time and tempo for the note sequence
    noteSequence.tempos.push({ qpm: tempo });
    let time = 0;

    // Create a note for each MIDI pitch value
    for (const pitch of pitchData) {
      const note = NoteSequence.Note.create({
        pitch,
        startTime: time,
        endTime: time + 0.5, // Set a default duration of 0.5 beats
        velocity: 80, // Set a default velocity of 80
      });
      noteSequence.notes.push(note);
      time += 0.5; // Move the time forward by 0.5 beats for the next note
    }

    // Set the total time of the note sequence based on the last note
    const lastNote = noteSequence.notes[noteSequence.notes.length - 1];
    noteSequence.totalTime = lastNote.endTime;

    console.log(noteSequence)
    setNewNoteSequence(noteSequence);
    console.log('newNoteSequence:', newNoteSequence)
  }

  // Assuming that `noteSequence` is the NoteSequence object that you want to use for generation
  async function generateComposition() {
    console.log(newNoteSequence);
  
    // Load the pre-trained model checkpoint
    const model = new MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
  
    // Make a copy of the original note sequence
    const inputSequence = clone(newNoteSequence);
  
    // Quantize the input sequence to 4 steps per quarter note
    const quantizedSequence = quantizeNoteSequence(clone(inputSequence), 4);
  
    // Copy the pitch values from the original sequence to the quantized sequence
    for (let i = 0; i < quantizedSequence.notes.length; i++) {
      quantizedSequence.notes[i].pitch = inputSequence.notes[i].pitch;
    }
  
    console.log(quantizedSequence);
  
    // Generate a new sequence based on the input sequence
    const generatedSequence = await model.continueSequence(quantizedSequence, quantizedSequence.totalQuantizedSteps /* Number of bars to generate */, 0.2);
    console.log(generatedSequence);

    // Convert the generated sequence to a MIDI file
    generatedSequence.notes.forEach(n => n.velocity = 100)
    const midi = sequenceProtoToMidi(generatedSequence);
    console.log(midi)
    const blob = new Blob([midi], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated_sequence.mid';
    link.click();
  }

  
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  return (
    <div className='container'>
      <input type="file" className='image-upload' onChange={handleImageChange} />
      {pitchData.length > 0 && (
        <>
          <label htmlFor="tempo">Tempo:</label>
          <input type="number" id="tempo" value={tempo} onChange={handleTempoChange} />
          <button onClick={createNoteSequenceFromMidi}>Start Audio Playback</button>
          <button onClick={generateComposition}>Generate Note Sequence</button>
          <audio controls>
            <source src="composition.mp3" type="audio/mp3"></source>
          </audio>
        </>
      )}
    </div>
  );
};

export default Converter;

