package com.note_taker.web.service;

import com.note_taker.web.entity.Note;
import com.note_taker.web.exceptions.ResourceNotFoundException;
import com.note_taker.web.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository; // 'final' ensures Lombok generates a constructor

    public List<Note> getAllNotes() {
        log.info("Fetching all notes");
        return noteRepository.findAllByOrderByIdAsc();
    }

    public Note getNoteById(Long id) {
        log.info("Fetching note with ID: {}", id);
        return noteRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Note not found with id " + id));
    }

    public Note createNote(Note note) {
        log.info("Creating a new note with title: {}", note.getTitle());
        return noteRepository.save(note);
    }

    public Note updateNote(Long id, Note note) {
        log.info("Updating note with ID: {}", id);
        Note existingNote = noteRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Note not found with id " + id));

        existingNote.setTitle(note.getTitle());
        existingNote.setContent(note.getContent());
        existingNote.setPriority(note.getPriority());
        existingNote.setCategory(note.getCategory());

        return noteRepository.save(existingNote);
    }

    public void deleteNote(Long id) {
        log.info("Deleting note with ID: {}", id);
        Note note = noteRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Note not found with id " + id));
        noteRepository.delete(note);
    }
}
