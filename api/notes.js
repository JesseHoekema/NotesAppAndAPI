import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./notes.txt');

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Lees de inhoud van het bestand en stuur het terug als JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ message: 'Error reading file' });
      }
      const notes = data ? data.split('\n').filter(Boolean) : []; // Splitsen op nieuwe regels
      res.status(200).json(notes);
    });
  } else if (req.method === 'POST') {
    const { note } = req.body;
    if (note) {
      // Voeg de notitie toe aan het tekstbestand
      fs.appendFile(filePath, note + '\n', (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          return res.status(500).json({ message: 'Error writing to file' });
        }
        res.status(201).json({ message: 'Note added', note });
      });
    } else {
      res.status(400).json({ message: 'Note content missing' });
    }
  } else if (req.method === 'PUT') {
    const { oldNote, newNote } = req.body;
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).json({ message: 'Error reading file' });
      }
      const notes = data.split('\n').filter(Boolean);
      const updatedNotes = notes.map(note => (note === oldNote ? newNote : note));
      fs.writeFile(filePath, updatedNotes.join('\n') + '\n', (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          return res.status(500).json({ message: 'Error writing to file' });
        }
        res.status(200).json({ message: 'Note updated', note: newNote });
      });
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
