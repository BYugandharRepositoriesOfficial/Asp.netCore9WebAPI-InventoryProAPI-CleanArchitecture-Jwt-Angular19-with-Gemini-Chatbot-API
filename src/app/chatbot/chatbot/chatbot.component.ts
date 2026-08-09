
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ChatService } from '../../services/chat.service.service';
import { MarkdownModule } from 'ngx-markdown';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { Chart, registerables } from 'chart.js';
import { Constructor } from '@angular/cdk/table';

@Component({
  selector: 'app-chatbot',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTabsModule,
      CommonModule,
  FormsModule,
  MarkdownModule,

  MatCardModule,
  MatIconModule,
  MatTableModule,
  MatTabsModule,

  MatFormFieldModule,
  MatInputModule,
  MatButtonModule
  ],

  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit{
  

chatMessage: string = '';

isTyping: boolean = false;

constructor ( private chatService: ChatService,){}



  messages: { sender: 'user' | 'bot'; text: string }[] = [
  {
    sender: 'bot',
    text: '👋 Hello! I am your AI Assistant. How can I help you today?'
  }
];

ngOnInit(): void {}

// =================================
  // SEND CHAT MESSAGE
  // =================================

  sendMessage(): void {

    const message = this.chatMessage.trim();

    if (!message || this.isTyping) {
      return;
    }

    // Add user message
    this.messages.push({
      sender: 'user',
      text: message
    });

    // Clear textbox
    this.chatMessage = '';

    // Show typing animation
    this.isTyping = true;

    // Scroll to bottom
    this.scrollToBottom();

    // Call ASP.NET Core API
    this.chatService.sendMessage(message).subscribe({

      next: (response) => {

        this.isTyping = false;

        // Add Gemini response
        this.messages.push({
          sender: 'bot',
          text: response.reply
        });

        this.scrollToBottom();
      },

      error: (error) => {

        this.isTyping = false;

        console.error('Chat API Error:', error);

        this.messages.push({
          sender: 'bot',
          text: 'Sorry, I could not connect to the AI Assistant.'
        });

        this.scrollToBottom();
      }

    });
  }

  // =================================
  // CLEAR CHAT
  // =================================

  clearChat(): void {

    this.messages = [
      {
        sender: 'bot',
        text: '👋 Hello! I am your AI Assistant. How can I help you today?'
      }
    ];

    this.chatMessage = '';
    this.isTyping = false;
  }

  // =================================
  // AUTO SCROLL
  // =================================

  scrollToBottom(): void {

    setTimeout(() => {

      const element = document.querySelector('.chat-body');

      if (element) {
        element.scrollTop = element.scrollHeight;
      }

    });

  }
}
