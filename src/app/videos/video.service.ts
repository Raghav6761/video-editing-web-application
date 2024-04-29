import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class VideoService {
  private videoPath: string;
  private processedVideoPath: string;
  private videoUpdated = new Subject<any>();
  private socket: any;

  constructor(private http: HttpClient) {
    // this.socket = io('http://localhost:3000')
  }

  startProgressTracking() {
    console.log('progress tracking start');
    // this.socket.on('progress', (progress: any) => {
    //   console.log('Received progress:', progress);
    //   // Update your UI or display progress to the user
    // });
  }

  stopProgressTracking() {
    // this.socket.off('progress');
  }

  getVideoUpdateListener() {
    return this.videoUpdated.asObservable();
  }

  uploadVideo(video: File) {
    console.log('upload video in service called')
    const videoData = new FormData();
    // videoData.append("test", test);
    videoData.append("video", video);
    // console.log('test video', videoData, test, video);
    console.log('test video', videoData, video);
    this.http.post<{ message: string, videoPath: string, processedVideoPath: string }>(
      "http://localhost:3000/api/videos", videoData
    )
      .subscribe(responseData => {
        console.log('response Data', responseData);
        this.videoPath = responseData.videoPath
        this.processedVideoPath = responseData.processedVideoPath
        this.videoUpdated.next([responseData.videoPath, responseData.processedVideoPath]);
      });
  }

  adjustBrightness(videoPath: string, processedVideoPath: string, brightness: string, volume: string) {
    console.log('path and brightness', videoPath, processedVideoPath, brightness);
    // const formData = new FormData();
    // console.log('brightness service function called');
    // formData.append("videoPath", videoPath);
    // formData.append("brightness", brightness);
    // console.log('formData',formData)
    this.http.post<{ message: string, videoPath: string, processedVideoPath: string }>(
      "http://localhost:3000/api/videos/brightness", { "videoPath": videoPath, "brightness": brightness, "volume": volume, "processedVideoPath": processedVideoPath }
    ).subscribe(response => {
      console.log('the response', response);
      this.videoPath = response.videoPath;
      this.processedVideoPath = response.videoPath;
      this.videoUpdated.next([response.videoPath, response.processedVideoPath]);
    })
  }

  adjustVolume(videoPath: string, processedVideoPath: string, volume: string, brightness: string) {
    console.log('path and volume', videoPath, processedVideoPath, volume);
    // const formData = new FormData();
    // console.log('volume service function called');
    // formData.append("videoPath", videoPath);
    // formData.append("volume", volume);
    // console.log('formData',formData)
    this.http.post<{ message: string, videoPath: string, processedVideoPath: string }>(
      "http://localhost:3000/api/videos/volume", { "videoPath": videoPath, "brightness": brightness, "volume": volume, "processedVideoPath": processedVideoPath }
    ).subscribe(response => {
      console.log('the response', response);
      this.videoPath = response.videoPath;
      this.processedVideoPath = response.videoPath;
      this.videoUpdated.next([response.videoPath, response.processedVideoPath]);
    })
  }

  combine(videoPath: string, processedVideoPath: string) {
    console.log('video combine called');
    this.http.post<{ message: string, videoPath: string, processedVideoPath: string }>(
      "http://localhost:3000/api/videos/combine", { "videoPath": videoPath, "processedVideoPath": processedVideoPath }
    )
      .subscribe(response => {
        console.log('the response', response);
        this.videoPath = response.videoPath;
        this.processedVideoPath = response.videoPath;
        this.videoUpdated.next([response.videoPath, response.processedVideoPath]);
      })
  }

}
