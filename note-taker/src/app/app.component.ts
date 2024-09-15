import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet, Routes } from '@angular/router';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NoteDetailComponent } from './components/note-detail/note-detail.component';
import { filter } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { AddNoteModalComponent } from './components/add-note-modal/add-note-modal.component';
import { Note } from './models/note.model';
import { NoteService } from './services/note.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NotesListComponent, NoteDetailComponent, HeaderComponent, AddNoteModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'note-taker';
  showBackButton = false;
  // @ViewChild('AddNoteModalComponent') modalRef !: AddNoteModalComponent

  constructor(private router: Router, private noteService: NoteService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        // console.log(event.url)
        if (event.url.includes('note/detail'))
          this.showBackButton = true
        else this.showBackButton = false
      });
  }

  searchTitle(searchString: string) {
    this.noteService.searchByTitle.next(searchString)
  }
}
