import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UploadVideoComponent } from './upload-video/upload-video.component';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [
    RouterOutlet,
    UploadVideoComponent
  ],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css'
})
export class VideosComponent {

}
