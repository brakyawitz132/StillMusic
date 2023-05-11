import React, { useState } from 'react';
import * as mm from '@magenta/music';
// import * as Tone from 'tone'
// const fs = require('fs');
const { NoteSequence, MusicRNN, sequences, sequenceProtoToMidi } = mm;
// const { Midi } = require('@magenta/music');
const { quantizeNoteSequence } = sequences;


function Converter() {
  const [pitchData, setPitchData] = useState([]);
  const [tempo, setTempo] = useState(120);
  const [newNoteSequence, setNewNoteSequence] = useState(null)
  const [imageURL, setImageURL] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [midiBlob, setMidiBlob] = useState(null);
  const [songName, setSongName] = useState('')

  const handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const img = new Image();
      img.src = URL.createObjectURL(event.target.files[0]);
      console.log(img)
      const fileReader = new FileReader()
      img.onload = function() {
        const canvas = document.createElement('canvas');
        
        if (img.width < 400 || img.height < 400) {
          canvas.width = img.width / 5;
          canvas.height = img.height / 5;
        }
        else if (400 < img.width < 750 || 7400 < img.height < 750) {
          canvas.width = img.width / 10;
          canvas.height = img.height / 10;
        }
        else if (750 < img.width < 1000 || 750 < img.height < 1000) {
          canvas.width = img.width / 30;
          canvas.height = img.height / 30;
        }
        else if (img.width > 1000 || img.height > 1000) {
          canvas.width = img.width / 50;
          canvas.height = img.height / 50;
        }
      
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

          // Clamp pitch values to the valid range of 0-127
          const clampedMidiValue = Math.max(0, Math.min(127, midiValue));

          // Check extreme MIDI values
          if (clampedMidiValue === 127 || clampedMidiValue === 0) {
            continue; // Skip extreme midi values
          }

          // Add the pitch value to the pitch data array
          pitchData.push(clampedMidiValue);
        }
        // Set the image URL state variable to display the uploaded image
        setImageURL(img.src);

        // Set the pitch data state
        setPitchData(pitchData);
        console.log(pitchData)
      }
      fileReader.onload = (e) => {
        const binaryData = e.target.result
        const imgBlob = new Blob([binaryData], { type: 'image/png'})
        setImageBlob(imgBlob)
        // console.log(imageBlob)
      }
      fileReader.readAsArrayBuffer(event.target.files[0])
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
    const audioBlob = new Blob([midi], { type: 'audio/midi' });
    // setMidiBlob(audioBlob)
    // console.log(midiBlob)
    const url = URL.createObjectURL(audioBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${songName}.mid`;
    link.click();

    const formData = new FormData();
    formData.append('songName', songName);
    formData.append('midi', audioBlob, songName + '.mid');
    formData.append('image', imageBlob, songName + '.png');
    console.log(formData, audioBlob, imageBlob)

    fetch('http://localhost:5555/songs', {
      method: 'POST',
      body: formData
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      //   }
      })
      .then(r => r.json())
      .then(data => console.log(data))
  }
  
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  

  return (
    <div className='container flex flex-col items-center justify-center'>
      <input type="file" className='image-upload' onChange={handleImageChange} />
      {imageURL && <img src={imageURL} alt="Test Subject" />}
      {pitchData.length > 0 && (
        <>
          <div className="px-2 py-1 border rounded">
            <label htmlFor="songName">Name: </label>
            <input type='text' value={songName} onChange={(e) => setSongName(e.target.value)} className="border border-black shadow-lg rounded-lg px-4"></input>
            <label htmlFor="tempo">Tempo: </label>
            <input type="number" id="tempo" value={tempo} onChange={handleTempoChange} className="border border-black shadow-lg rounded-lg px-4"/>
          </div>
          <button onClick={createNoteSequenceFromMidi} className="border border-black shadow-lg rounded-lg px-4">Generate Note Sequence</button>
          <button onClick={generateComposition} className="border border-black shadow-lg rounded-lg px-4">Generate Composition</button>
        </>
      )}
    </div>
  );
};

export default Converter;

