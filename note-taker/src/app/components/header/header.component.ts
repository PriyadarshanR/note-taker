import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AddNoteModalComponent } from '../add-note-modal/add-note-modal.component';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AddNoteModalComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() showBackButton = false;
  showFilterOptions = false;
  selectedFilterOptions: string[] = [];
  navigationState: NavigationExtras | undefined;


  constructor(private router: Router, private noteService: NoteService) { }

  ngOnInit(): void { }

  openModal() {
    this.noteService.addEditModal.next(null);
  }

  goBack() {
    // sending state to hold the state of the application after applying filter
    this.router.navigate(['/notes'], { queryParamsHandling: 'preserve', state: history.state });
  }

  searchTitle(searchString: string) {
    this.noteService.searchByTitle.next(searchString)
  }

  sortByDescPriority() {
    this.noteService.sortNotesOrderBy.next('desc');
  }

  sortByAscPriority() {
    this.noteService.sortNotesOrderBy.next('asc');
  }

  removeSort() {
    this.noteService.sortNotesOrderBy.next('false');
  }

  addFilter() {
    // this.showFilterOptions = !this.showFilterOptions;
    this.showFilterOptions = true;
  }

  removeFilter() {
    this.showFilterOptions = false;
    //Better way to empty arrays
    this.selectedFilterOptions.length = 0;
    this.noteService.filterNotesBy.next(this.selectedFilterOptions);
  }

  changeFilterOptions(event: any) {
    event.target.checked && this.selectedFilterOptions.push(event.target.value);
    if (!event.target.checked) {
      this.selectedFilterOptions = this.selectedFilterOptions.filter((fOption: string) => {
        //removing unchecked boxes
        return event.target.value !== fOption
      })
    }
  }

  applyFilter() {
    this.noteService.filterNotesBy.next(this.selectedFilterOptions);
    this.showFilterOptions = false;
  }
}