import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [noteContent, setNoteContent] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  // Haal alle notities op als de component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/notes');
        setNotes(response.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  // Functie om een nieuwe notitie toe te voegen
  const handleAddNote = async () => {
    if (title.trim()) {
      const newNote = `${title}\n${noteContent}`;
      try {
        const response = await axios.post('/api/notes', { note: newNote });
        setNotes([...notes, response.data.note]);
        setNoteContent('');
        setTitle('');
        setSelectedNote(response.data.note); // Selecteer de nieuwe notitie
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  };

  // Functie om een notitie te selecteren en inhoud in te laden
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setTitle(note.split('\n')[0]); // Laad titel in de editor
    setNoteContent(note.split('\n').slice(1).join('\n')); // Laad inhoud in de editor
  };

  // Functie om de inhoud van een notitie bij te werken
  const handleUpdateNote = async () => {
    if (selectedNote) {
      const updatedNote = `${title}\n${noteContent}`;
      try {
        const response = await axios.put('/api/notes', { oldNote: selectedNote, newNote: updatedNote });
        const updatedNotes = notes.map(note => (note === selectedNote ? response.data.note : note));
        setNotes(updatedNotes);
        setSelectedNote(updatedNote); // Update de geselecteerde notitie
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }
  };

  // Handlers voor wijzigingen in de titel en inhoud
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    handleUpdateNote(); // Update de notitie telkens als de titel verandert
  };

  const handleContentChange = (e) => {
    setNoteContent(e.target.value);
    handleUpdateNote(); // Update de notitie telkens als de inhoud verandert
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Alle Notities</h2>
        <div className="note-list">
          {notes.map((note, index) => (
            <div 
              key={index} 
              className="note-item" 
              onClick={() => handleSelectNote(note)}
            >
              {note.split('\n')[0]} {/* Toon alleen de titel */}
            </div>
          ))}
        </div>
        <h2>Nieuwe Notitie</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Directe update op titel invoer
          placeholder="Titel"
        />
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)} // Directe update op inhoud invoer
          placeholder="Notitie inhoud"
        />
        <button onClick={handleAddNote}>Voeg Notitie Toe</button>
      </div>
      <div className="main-content">
        {selectedNote ? (
          <>
            <h1>{title}</h1> {/* Titel van de notitie */}
            <p>{noteContent}</p> {/* Inhoud van de notitie */}
          </>
        ) : (
          <h2>Klik op een notitie om deze te bekijken.</h2>
        )}
      </div>
    </div>
  );
};

export default App;
