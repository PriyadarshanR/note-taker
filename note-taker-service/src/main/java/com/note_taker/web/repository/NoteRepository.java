package com.note_taker.web.repository;

import com.note_taker.web.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    // Custom query methods can be defined here
    List<Note> findAllByOrderByIdAsc();
}