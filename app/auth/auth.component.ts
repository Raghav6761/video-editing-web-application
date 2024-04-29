import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatButtonModule,
    FlexLayoutModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit, OnDestroy {
  // fb = inject(FormBuilder);
  // posts = [];
  // private postsSub: Subscription;
  // private unsubscribe$ = new Subject<void>();


  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', Validators.required],
  });

  constructor(public fb: FormBuilder, public authService: AuthService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('oninit is being called');
    this.authService.getPosts();
    // this.postsSub = this.authService.getPostUpdateListener()
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe((posts) => {
    //     this.posts = posts;
    //     console.log('in the component',this.posts)
    //   });
      // .subscribe({
      //   next: value => {
      //     console.log('Observable emitted the next value: ', value);
      //     this.posts = value;
      //     console.log('posts ', this.posts);
      //   },
      //   error: err => console.log('Error emitted in error: ' + err),
      //   complete: () => console.log('observable complete')
      // });
  }

  onSubmit() {
    console.log('onsubmit is used');
    console.log(this.form.valid);
    console.log(this.form.controls.username.value);
    console.log(this.form.controls.password.value);
    this.authService.addPost('title', 'string');
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.postsSub.unsubscribe();
    // this.unsubscribe$.next();
    // this.unsubscribe$.complete();
  }
}
