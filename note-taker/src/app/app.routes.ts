import { Routes } from '@angular/router';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NoteDetailComponent } from './components/note-detail/note-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: 'notes', pathMatch: 'full' },
    { path: 'notes', component: NotesListComponent },
    { path: 'note/detail/:id', component: NoteDetailComponent },
    { path: 'new-note', component: NoteDetailComponent },
    { path: '**', redirectTo: 'notes' },
];
