import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Phone, Video, MoreHorizontal, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  itemTitle: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

export default function MessagingCenter() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations: Conversation[] = [
    {
      id: '1',
      participantName: 'Sarah K.',
      participantRole: 'recipient',
      itemTitle: 'Winter Jacket',
      lastMessage: 'When would be good for pickup?',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 2,
      messages: [
        {
          id: '1',
          senderId: 'sarah',
          senderName: 'Sarah K.',
          senderRole: 'recipient',
          content: 'Hi! I\'m interested in the winter jacket you posted.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '2',
          senderId: 'me',
          senderName: 'You',
          senderRole: 'donor',
          content: 'Great! It\'s still available. It\'s a size Medium and in excellent condition.',
          timestamp: new Date(Date.now() - 90 * 60 * 1000),
          isRead: true
        },
        {
          id: '3',
          senderId: 'sarah',
          senderName: 'Sarah K.',
          senderRole: 'recipient',
          content: 'Perfect! When would be good for pickup?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false
        }
      ]
    },
    {
      id: '2',
      participantName: 'Mike R.',
      participantRole: 'ngo',
      itemTitle: 'Children Books',
      lastMessage: 'Thank you so much for the donation!',
      lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unreadCount: 0,
      messages: [
        {
          id: '1',
          senderId: 'mike',
          senderName: 'Mike R.',
          senderRole: 'ngo',
          content: 'Hello! Our NGO would love to receive the children books for our literacy program.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '2',
          senderId: 'me',
          senderName: 'You',
          senderRole: 'donor',
          content: 'That sounds wonderful! I have about 20 books suitable for ages 5-10.',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          isRead: true
        },
        {
          id: '3',
          senderId: 'mike',
          senderName: 'Mike R.',
          senderRole: 'ngo',
          content: 'Thank you so much for the donation!',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          isRead: true
        }
      ]
    }
  ];

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'donor':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'recipient':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'ngo':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In a real app, this would send the message via API
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="h-[600px] border rounded-lg flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Messages</h3>
          </div>
        </div>
        
        <ScrollArea className="h-full">
          <div className="divide-y">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-blue-50 dark:bg-blue-950 border-r-2 border-blue-500' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {conversation.participantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">
                        {conversation.participantName}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge size="sm" className={`${getRoleColor(conversation.participantRole)} text-xs`}>
                        {conversation.participantRole}
                      </Badge>
                      <span className="text-xs text-gray-500 truncate">
                        Re: {conversation.itemTitle}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {selectedConv.participantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{selectedConv.participantName}</p>
                    <div className="flex items-center space-x-2">
                      <Badge size="sm" className={`${getRoleColor(selectedConv.participantRole)} text-xs`}>
                        {selectedConv.participantRole}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        About: {selectedConv.itemTitle}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConv.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === 'me'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}