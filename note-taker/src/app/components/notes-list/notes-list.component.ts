import { Component, OnInit } from '@angular/core';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';
import { map, Observable, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalDialogComponent } from '../../modal-dialog/modal-dialog.component';
import { UserAction } from '../../models/model';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [RouterLink, CommonModule, ModalDialogComponent],
  templateUrl: `./notes-list.component.html`,
  styleUrl: './notes-list.component.scss',
})
export class NotesListComponent implements OnInit {
  notes$ !: Observable<Note[]>;
  filteredNotes$ !: Observable<Note[]>;
  noteIdClickedOn !: number;
  confirmDeleteModalVisible = false;

  constructor(private noteService: NoteService, private router: Router) { }

  ngOnInit(): void {
    // noteListUpdated is a BehaviorSubject so this getAllNotes is initiated even at initialization of the component
    this.noteService.noteListUpdated.subscribe(() => {
      this.filteredNotes$ = this.notes$ = this.noteService.getAllNotes();
    })

    this.noteService.searchByTitle.subscribe((searchString: String) => {
      this.filteredNotes$ = this.notes$.pipe(map((notes: Note[]) => notes.filter((note: Note) =>
        note.title.toLowerCase().includes(searchString.toLowerCase())
      )))
    })
  }

  viewNote(id: number) {
    this.router.navigate(['/note/detail', id]);
  }

  onCloseIconClick(event: Event, noteId: number = 0) {
    event.stopPropagation();
    this.noteIdClickedOn = noteId;
    this.confirmDeleteModalVisible = true;
  }

  onUserAction(event: UserAction) {
    if (event == UserAction.Primary) {
      this.noteService.deleteNote(this.noteIdClickedOn).subscribe(() => {
        this.noteService.noteListUpdated.next(true);
        this.confirmDeleteModalVisible = false;
      });
    } else {
      this.confirmDeleteModalVisible = false;
    }
  }

}
