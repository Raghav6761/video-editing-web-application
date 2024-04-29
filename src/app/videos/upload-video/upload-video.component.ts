import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';

import { mimeType } from './mime-type.validator';
import { VideoService } from '../video.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    ReactiveFormsModule,
  ],
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.css'
})
export class UploadVideoComponent implements OnInit, OnDestroy {
  filePreview: string;
  videoPath: string;
  processedVideoPath: string;
  convertFile: boolean = false;  // this element specifies whether you need to download the file we receive or not
  brightnessValue: number = 0;
  volumeValue: number = 1;

  fileForm = this.fb.group({
    // videoFile: [null as File | null, {validators: [Validators.required], asyncValidators:[mimeType]}]
    videoFile: [null as File | null, { validators: [Validators.required] }],
    brightness: [0],
    volume: [0]
    // test: [null]
  });
  private fileSub: Subscription;
  isLoading = false;

  ngOnInit() {
    // this.videoService.startProgressTracking();
    this.fileSub = this.videoService.getVideoUpdateListener().subscribe(filePaths => {
      console.log('filepath goes here', filePaths);
      this.filePreview = filePaths[1];
      this.videoPath = filePaths[0];
      this.processedVideoPath = filePaths[1];
      console.log('filepath preview goes here', this.filePreview, this.videoPath, this.processedVideoPath);
      this.isLoading = false;
      if (this.convertFile) {
        this.downloadFile(filePaths[0]); // Start download after concatenation //videoPath is taken as that is where we have it all
        this.convertFile = false; // Reset flag
      }
    });
  }

  constructor(public fb: FormBuilder, public videoService: VideoService) {
    this.filePreview = '';
  }

  onVideoPicked(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let file: File | null = null;
    // try {
    //   file = element.files[0];
    //   // const file = (event.currentTarget as HTMLInputElement).files; //take [0] from it because it will be an array and we are needing only the first elements
    //   this.fileForm.patchValue({videoFile: file});
    //   this.fileForm.get('videoFile')?.updateValueAndValidity();
    // } catch (error) {
    //   console.log('error goes here: ',error)
    // }

    if (element.files && element.files.length > 0) {
      file = element.files[0];
      // const file = (event.currentTarget as HTMLInputElement).files; //take [0] from it because it will be an array and we are needing only the first elements
      // this.fileForm.patchValue({ test: 'test input' });
      this.fileForm.patchValue({ videoFile: file });
      this.fileForm.get('videoFile')?.updateValueAndValidity();
      console.log('file : ', file);
      console.log('fileform : ', this.fileForm);
      // this.videoService.uploadVideo(this.fileForm.value.videoFile);
      this.uploadVideo();
      this.isLoading = true;
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result as string;
        this.processedVideoPath = reader.result as string;
      };
      reader.readAsDataURL(file)
      // this.videoService.uploadVideo();
    } else {
      console.log('no file uploaded')
    }
  }

  uploadVideo() {
    console.log('upload vide function running')
    if (this.fileForm.invalid) {
      console.log('form invalid');
      return;
    }
    this.videoService.uploadVideo(this.fileForm.value.videoFile);
  }

  brightness() {
    // console.log('change called');
    const brightness = this.fileForm.get('brightness').value;
    console.log('brightness asked : ', this.fileForm.get('brightness').value);
    this.onBrightnessChange(brightness);
    // this.videoService.startProgressTracking();
  }

  volume() {
    // console.log('change called');
    const volume = this.fileForm.get('volume').value;
    console.log('volume asked : ', this.fileForm.get('volume').value);
    this.onVolumeChange(volume);
  }

  onBrightnessChange(brightness: number) {
    this.isLoading = true;
    brightness = brightness / 10; //ranging from -10 to 10
    this.brightnessValue = brightness
    console.log('brightness change function called', brightness.toString())
    this.videoService.adjustBrightness(this.videoPath, this.processedVideoPath, brightness.toString(), this.volumeValue.toString());
  }

  onVolumeChange(volume: number) {
    this.isLoading = true;
    volume = volume / 50; //ranging from 0 to 100
    this.volumeValue = volume
    console.log('volume change function called', volume.toString())
    this.videoService.adjustVolume(this.videoPath, this.processedVideoPath, volume.toString(), this.brightnessValue.toString());
  }

  onFileConversion() {
    this.isLoading = true;
    if (this.fileForm.invalid) {
      console.log('form invalid');
      return;
    }
    // window.alert('form submitted');
    this.videoService.combine(this.videoPath, this.processedVideoPath);
    console.log(this.fileForm.value);
    this.convertFile = true;
    this.fileForm.reset();
  }

  downloadFile(url: string) {
    const link = document.createElement('a');
    link.href = url;
    // link.download = 'concatenated_video.mp4';
    let downloadLinkArr = url.split('/');
    link.download = downloadLinkArr[downloadLinkArr.length - 1];
    link.target = "_blank"
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  ngOnDestroy(): void {
    // this.videoService.stopProgressTracking();
  }
}
