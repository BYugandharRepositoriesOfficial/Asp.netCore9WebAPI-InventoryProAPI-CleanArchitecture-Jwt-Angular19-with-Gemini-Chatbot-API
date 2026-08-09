import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'https://localhost:7284/api/Chat';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatResponse> {

    const request: ChatRequest = {
      message: message
    };

    return this.http.post<ChatResponse>(
      this.apiUrl,
      request
    );
  }
}


