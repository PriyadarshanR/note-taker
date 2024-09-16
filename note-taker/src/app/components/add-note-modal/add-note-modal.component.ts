import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NoteService } from '../../services/note.service';
import { Note, Priority } from '../../models/note.model';  // Assuming you have a Note model
import { FormsModule } from '@angular/forms';
import { PrimaryActionDirective } from '../../directives/primary-action.directive';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-note-modal',
  imports: [FormsModule, PrimaryActionDirective, CommonModule],
  templateUrl: './add-note-modal.component.html',
  styleUrl: './add-note-modal.conmponent.scss',
  standalone: true,
})
export class AddNoteModalComponent implements OnInit, OnDestroy {
  isVisible = false;
  note !: Note;
  isEdit = false;
  destroySubject = new Subject<void>();
  priority = Priority;
  showInputCategory = false;
  newCategory: string = '';


  constructor(private noteService: NoteService) { }

  ngOnInit() {
    this.noteService.addEditModal.pipe(takeUntil(this.destroySubject)).subscribe((res: Note | null) => {
      if (res) {
        this.note = res;
        this.isEdit = true;
      }
      else {
        this.isEdit = false;
        this.note = { id: 0, title: '', content: '', priority: 'LOW', category: [] };
      }
      this.openModal();
    })
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
    this.showInputCategory = false;
  }

  saveNote() {
    this.noteService.createNote(this.note).subscribe(() => {
      this.noteService.noteListUpdated.next(true);
      this.closeModal();
    });
  }

  updateNote() {
    this.noteService.updateNote(this.note.id, this.note).subscribe(() => {
      this.closeModal();
    });
  }

  toggleCategory() {
    this.showInputCategory = !this.showInputCategory;
  }

  addCategory() {
    if (this.newCategory && !this.note.category.includes(this.newCategory)) {
      this.note.category.push(this.newCategory);
      this.newCategory = '';
    }
  }

  deleteValue(index: number) {
    this.note.category.splice(index, 1);
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
