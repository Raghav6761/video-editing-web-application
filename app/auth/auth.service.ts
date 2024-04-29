import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private posts: any = [{title: 'test 1', content: 'test 1 content ....'}];
  private postsUpdated = new Subject<any>();
  
  constructor(private http: HttpClient) {}

  getPosts(){
    console.log('something');
    this.http.get<any>('http://localhost:3000/api/posts').subscribe((postData)=>{
      console.log('something in subscribe getPosts ', this.posts);
      console.log(postData);
      this.posts =postData.posts;
      this.postsUpdated.next([...this.posts]);
      return [...this.posts];
    });
  }

  // Using this function you can call subscribe to the updation in posts
  // private postsSub: Subscription
  // this.posts = this.postsService.getPosts()
  // this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[])=>{ this.posts = posts});
  getPostUpdateListener(){
    // console.log('post update called');
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string){
    // const post: any = {title: title, content: content};
    const post: any = {title: 'title', content: 'content'};
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
    .subscribe(responseData=>{
      console.log(responseData.message);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
