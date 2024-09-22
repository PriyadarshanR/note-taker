import { Component, OnInit } from '@angular/core';
import { Note, Priority } from '../../models/note.model';
import { NoteService } from '../../services/note.service';
import { map, Observable, shareReplay, tap } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalDialogComponent } from '../../modal-dialog/modal-dialog.component';
import { UserAction } from '../../models/model';
import { PrimaryActionDirective } from '../../directives/primary-action.directive';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [RouterLink, CommonModule, ModalDialogComponent, PrimaryActionDirective],
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
  availableTags: string[] = []
  showFilterByPointsPopUp = false;
  showFilterByTagPopUp = false;
  selectedFilterByPoint: number[] = [];
  selectedFilterByTag: string[] = [];
  filterBy: string[] = []

  constructor(private noteService: NoteService, private router: Router, private acRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // noteListUpdated is a BehaviorSubject so the getAllNotes API is called even at initialization of the component
    this.noteService.noteListUpdated.subscribe(() => {
      this.modifiedNotes$ = this.notes$ = this.noteService.getAllNotes();

      //Setting the available tags to filter from
      this.notes$.subscribe((notes: Note[]) => {
        //Removing duplicate tags
        this.availableTags = [...new Set([...notes.flatMap((note: Note) => note.category)])];
      })
    });

    this.noteService.searchByTitle.subscribe((searchString: string) => {
      this.modifiedNotes$ = this.notes$.pipe(map((notes: Note[]) => notes.filter((note: Note) =>
        note.title.toLowerCase().includes(searchString.toLowerCase())
      )))
    });

    this.noteService.sortNotesOrderBy.subscribe((sortAction: string) => {
      this.sortActionPerformed = sortAction;
      //Navigation is not performed
      //Only used for adding query param
      this.router.navigate(['/notes'], { queryParams: { isSorted: this.sortActionPerformed } })
      this.performSorting(sortAction);
    });

    const sortAction = this.acRoute.snapshot.queryParamMap.get('isSorted');
    if (sortAction) {
      this.sortActionPerformed = sortAction;
      this.performSorting(sortAction);
    }

    this.noteService.filterNotesBy.subscribe((filterBy: string[]) => {
      this.filterBy = filterBy;
      if (filterBy.length === 0) {
        this.modifiedNotes$ = this.notes$;
        this.selectedFilterByPoint.length = 0;
        this.selectedFilterByTag.length = 0;
        return;
      }
      if (filterBy.includes('filterByPoints')) {
        this.showFilterByPointsPopUp = true;
      }
      if (filterBy.includes('filterByTag')) {
        this.showFilterByTagPopUp = true;
      }
    })

    if (history.state.filterBy.length > 0 && (history.state.selectedFilterByPoint.length > 0 || history.state.selectedFilterByTag.length > 0)) {
      this.filterBy = history.state.filterBy;
      this.selectedFilterByPoint = history.state.selectedFilterByPoint ?? [];
      this.selectedFilterByTag = history.state.selectedFilterByTag ?? [];
      this.applyFilter();
    }
  }

  viewNote(id: number) {
    this.router.navigate(['/note/detail', id], {
      queryParams: {
        isSorted: this.sortActionPerformed
      },
      state: {
        filterBy: this.filterBy,
        selectedFilterByPoint: this.selectedFilterByPoint,
        selectedFilterByTag: this.selectedFilterByTag
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

  addFilterByPoint(event: any) {
    //Note that event.target.value is a string
    const currentValue = +event.target.value;

    if (event.target.checked) this.selectedFilterByPoint.push(currentValue);
    else {
      this.selectedFilterByPoint = this.selectedFilterByPoint.filter((checkedValue: number) => {
        //removing unchecked boxes
        return currentValue !== checkedValue
      })
    }
  }

  addFilterByTag(event: any) {
    const currentValue = event.target.value;

    if (event.target.checked) this.selectedFilterByTag.push(currentValue);
    else {
      this.selectedFilterByTag = this.selectedFilterByTag.filter((checkedValue: string) => {
        //removing unchecked boxes
        return currentValue !== checkedValue
      })
    }
  }

  removeAllFilter() {
    this.showFilterByTagPopUp = false;
    this.showFilterByPointsPopUp = false;
  }

  applyFilter() {
    this.modifiedNotes$ = this.modifiedNotes$.pipe(map((notes: Note[]) => {
      let filteredNotes: Note[] = [];

      if (this.filterBy.includes('filterByPoints')) {
        filteredNotes = notes.filter(note => {
          return this.selectedFilterByPoint.includes(this.priority.indexOf(note.priority));
        })
      }
      if (this.filterBy.includes('filterByTag')) {
        filteredNotes = filteredNotes.length > 0
          ? filteredNotes.filter(note => note.category.some(tag => this.selectedFilterByTag.includes(tag)))
          : notes.filter(note => note.category.some(tag => this.selectedFilterByTag.includes(tag)))
      }
      this.showFilterByTagPopUp = false;
      this.showFilterByPointsPopUp = false;

      return filteredNotes;
    }
    )
    )
  }

}
