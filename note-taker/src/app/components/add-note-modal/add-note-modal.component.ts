import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { Note } from '../../models/note.model';  // Assuming you have a Note model
import { FormsModule } from '@angular/forms';
import { PrimaryActionDirective } from '../../directives/primary-action.directive';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-note-modal',
  imports: [FormsModule, PrimaryActionDirective],
  templateUrl: './add-note-modal.component.html',
  styleUrl: './add-note-modal.conmponent.scss',
  standalone: true,
})
export class AddNoteModalComponent implements OnInit, OnDestroy {
  isVisible = false;
  note: Note = { title: '', content: '' };
  isEdit = false;
  destroySubject = new Subject<void>();

  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.noteService.addEditModal.pipe(takeUntil(this.destroySubject)).subscribe((res: Note | null) => {
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
    this.noteService.createNote(this.note).subscribe(() => {
      this.noteService.noteListUpdated.next(true);
      this.closeModal();
    });
  }

  updateNote() {
    this.noteService.createNote(this.note).subscribe(newNote => {
      this.closeModal();
    });
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
