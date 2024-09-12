package com.note_taker.web.controller;

import com.note_taker.web.entity.Note;
import com.note_taker.web.service.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notes")
@RequiredArgsConstructor // Lombok annotation for constructor injection
public class NoteController {

    private final NoteService noteService;

    // Get all notes
    @GetMapping("/getAll")
    public ResponseEntity<List<Note>> getAllNotes() {
        List<Note> notes = noteService.getAllNotes();
        return ResponseEntity.ok(notes); // Responds with HTTP 200 and the list of notes
    }

    // Get note by ID
    @GetMapping
    public ResponseEntity<Note> getNoteById(@RequestParam Long id) {
        Note note = noteService.getNoteById(id);
        return ResponseEntity.ok(note); // Responds with HTTP 200 and the note
    }

    // Create a new note
    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        Note createdNote = noteService.createNote(note);
        return ResponseEntity.ok(createdNote); // Responds with HTTP 200 and the created note
    }

    // Update an existing note
    @PutMapping
    public ResponseEntity<Note> updateNote(@RequestParam Long id, @RequestBody Note note) {
        Note updatedNote = noteService.updateNote(id, note);
        return ResponseEntity.ok(updatedNote); // Responds with HTTP 200 and the updated note
    }

    // Delete a note by ID
    @DeleteMapping
    public ResponseEntity<Void> deleteNote(@RequestParam Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build(); // Responds with HTTP 204 No Content after deletion
    }
}
