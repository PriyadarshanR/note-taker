import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Note, Priority } from '../../models/note.model';
import { NoteService } from '../../services/note.service';
import { map, Observable, tap } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  modifiedNotes$ !: Observable<Note[]>;
  noteIdClickedOn !: number;
  confirmDeleteModalVisible = false;
  sortActionPerformed = 'false';
  priority = Priority;

  constructor(private noteService: NoteService, private router: Router, private acRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // noteListUpdated is a BehaviorSubject so the getAllNotes is called even at initialization of the component
    this.noteService.noteListUpdated.subscribe(() => {
      this.modifiedNotes$ = this.notes$ = this.noteService.getAllNotes();
    });

    this.noteService.searchByTitle.subscribe((searchString: string) => {
      this.modifiedNotes$ = this.notes$.pipe(map((notes: Note[]) => notes.filter((note: Note) =>
        note.title.toLowerCase().includes(searchString.toLowerCase())
      )))
    });

    this.noteService.sortNotesOrderBy.subscribe((sortAction: string) => {
      this.sortActionPerformed = sortAction;
      this.router.navigate(['/notes'], { queryParams: { isSorted: this.sortActionPerformed } })
      this.performSorting(sortAction);
    });

    const sortAction = this.acRoute.snapshot.queryParamMap.get('isSorted');
    if (sortAction) {
      this.performSorting(sortAction);
    }
  }

  viewNote(id: number) {
    this.router.navigate(['/note/detail', id], {
      queryParams: {
        isSorted: this.sortActionPerformed
      }
    });
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

  private performSorting(sortAction: string) {
    switch (sortAction) {
      case 'desc':
        this.modifiedNotes$ = this.modifiedNotes$.pipe(
          map((notes: Note[]) => notes.sort((a: Note, b: Note) => Priority.indexOf(b.priority) - Priority.indexOf(a.priority)
          )
          )
        );
        break;
      case 'asc':
        this.modifiedNotes$ = this.modifiedNotes$.pipe(
          map((notes: Note[]) => notes.sort((a: Note, b: Note) => Priority.indexOf(a.priority) - Priority.indexOf(b.priority)
          )
          )
        );
        break;
      case 'false':
        this.modifiedNotes$ = this.notes$;
        break;
    }
  }

}
