import { Component, EventEmitter, Output } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.model';  // Assuming you have a Note model
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-note-modal',
  imports: [FormsModule],
  templateUrl: './add-note-modal.component.html',
  styleUrl: './add-note-modal.conmponent.scss',
  standalone: true,
})
export class AddNoteModalComponent {
  isVisible = false;
  note: Note = { title: '', content: '' };
  isEdit = false;

  @Output() noteAdded = new EventEmitter<void>();

  constructor(private noteService: NoteService) {
    this.noteService.addEditModal.subscribe((res: Note | null) => {
      if (res) {
        this.note = res;
        this.isEdit = true;
      }
      else {
        this.isEdit = false;
        this.note = { title: '', content: '' };
      }
      this.openModal();
    })
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  saveNote() {
    this.noteService.createNote(this.note).subscribe(newNote => {
      this.noteAdded.emit();
      this.closeModal();
    });
  }

  updateNote() {
    this.noteService.createNote(this.note).subscribe(newNote => {
      this.closeModal();
    });
  }
}
