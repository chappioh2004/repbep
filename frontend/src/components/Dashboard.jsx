import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Send, Sparkles, Code2, Rocket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectsAPI, chatAPI } from '../services/api';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadProjects();
    loadConversations();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data.slice(0, 3));
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const conversations = await chatAPI.getConversations();
      if (conversations.length > 0) {
        const latestConv = conversations[0];
        setConversationId(latestConv.id);
        setMessages(latestConv.messages);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: `m${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatAPI.sendMessage({
        message: input,
        conversationId: conversationId
      });
      
      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      setMessages(prev => [...prev, response.message]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: `m${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar isAuthenticated={true} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Recent Projects */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-emerald-500" />
                  Recent Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects.map((project) => (
                  <Link key={project.id} to="/projects">
                    <div className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer border border-gray-700 hover:border-emerald-500/50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{project.name}</h4>
                        <Badge variant="outline" className={`text-xs ${
                          project.status === 'active' ? 'border-emerald-500 text-emerald-500' : 'border-purple-500 text-purple-500'
                        }`}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tech.slice(0, 3).map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
                <Link to="/projects">
                  <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800">
                    View All Projects
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-800/50">
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Quick Start
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Try asking the AI agent to help you build something!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div>
                  <span>"Build a todo app with authentication"</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div>
                  <span>"Create a landing page for my SaaS"</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div>
                  <span>"Add payment integration with Stripe"</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 border-gray-800 h-[calc(100vh-12rem)]">
              <CardHeader className="border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-emerald-500" />
                      AI Development Agent
                    </CardTitle>
                    <CardDescription>Ask me anything about your project</CardDescription>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[calc(100%-5rem)]">
                {/* Messages */}
                <ScrollArea ref={scrollRef} className="flex-1 p-6">
                  <div className="space-y-6">
                    {messages.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Start a Conversation</h3>
                        <p className="text-gray-400">Ask the AI agent to help you build your next project</p>
                      </div>
                    )}
                    {messages.map((message) => (
                      <div key={message.id} className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        {message.role === 'assistant' && (
                          <Avatar className="w-8 h-8 border-2 border-emerald-500">
                            <AvatarFallback className="bg-emerald-500/10 text-emerald-500">
                              AI
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`rounded-lg px-4 py-3 max-w-[80%] ${
                          message.role === 'user' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-gray-800 text-gray-100'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {message.role === 'user' && (
                          <Avatar className="w-8 h-8 border-2 border-emerald-500">
                            <AvatarImage src={mockUser.avatar} alt={mockUser.displayName} />
                            <AvatarFallback>{mockUser.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <Avatar className="w-8 h-8 border-2 border-emerald-500">
                          <AvatarFallback className="bg-emerald-500/10 text-emerald-500">
                            AI
                          </AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg px-4 py-3 bg-gray-800">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-gray-800">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask AI to build something..."
                      className="bg-gray-800/50 border-gray-700 focus:border-emerald-500"
                    />
                    <Button 
                      onClick={handleSend}
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={!input.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
