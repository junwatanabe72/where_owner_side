import React, { useState, useMemo } from 'react';
import { MessageCircle, Send, Paperclip, File, Image as ImageIcon, User } from 'lucide-react';
import { mockThreads, getMessagesByThreadId } from '../../../mocks';
import type { ChatThread, ChatMessage } from '../../../types/chat';

interface ChatTabProps {
  assetId: number;
}

const ChatTab: React.FC<ChatTabProps> = ({ assetId }) => {
  // この物件に関するスレッドを取得
  const assetThreads = useMemo(() =>
    mockThreads.filter(thread => thread.assetId === assetId),
    [assetId]
  );

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    assetThreads.length > 0 ? assetThreads[0].id : null
  );

  const selectedThread = useMemo(() =>
    assetThreads.find(t => t.id === selectedThreadId),
    [assetThreads, selectedThreadId]
  );

  const messages = useMemo(() =>
    selectedThreadId ? getMessagesByThreadId(selectedThreadId) : [],
    [selectedThreadId]
  );

  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    // TODO: 実装時にメッセージ送信APIを呼ぶ
    console.log('送信:', messageInput);
    setMessageInput('');
  };

  if (assetThreads.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">チャットはありません</h3>
          <p className="text-gray-600">この物件に関するチャットスレッドはまだありません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-16rem)] bg-white rounded-lg shadow-sm border">
      {/* スレッド一覧 */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">チャットスレッド</h3>
          <p className="text-sm text-gray-600 mt-1">{assetThreads.length}件のスレッド</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {assetThreads.map((thread) => (
            <ThreadListItem
              key={thread.id}
              thread={thread}
              isSelected={selectedThreadId === thread.id}
              onClick={() => setSelectedThreadId(thread.id)}
            />
          ))}
        </div>
      </div>

      {/* メッセージ表示エリア */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            {/* ヘッダー */}
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">{selectedThread.subject}</h3>
              <div className="flex items-center mt-2 space-x-2">
                {selectedThread.participants.slice(0, 3).map((participant, idx) => (
                  <div key={participant.id} className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-1" />
                    <span>{participant.name}</span>
                    {idx < selectedThread.participants.length - 1 && <span className="mx-1">・</span>}
                  </div>
                ))}
              </div>
              {selectedThread.tags && selectedThread.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedThread.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* メッセージリスト */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>

            {/* 入力エリア */}
            <div className="p-4 border-t">
              <div className="flex items-end space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="メッセージを入力..."
                    className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600">スレッドを選択してください</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ThreadListItemProps {
  thread: ChatThread;
  isSelected: boolean;
  onClick: () => void;
}

const ThreadListItem: React.FC<ThreadListItemProps> = ({ thread, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <h4 className="font-medium text-gray-900 text-sm">{thread.subject}</h4>
        {thread.unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {thread.unreadCount}
          </span>
        )}
      </div>
      {thread.lastMessage && (
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {thread.lastMessage.content}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-2">
        {new Date(thread.updatedAt).toLocaleString('ja-JP')}
      </p>
    </button>
  );
};

interface MessageItemProps {
  message: ChatMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isOwner = message.sender.role === 'owner';
  const isSystem = message.sender.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-lg max-w-md text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwner ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xl ${isOwner ? 'order-2' : 'order-1'}`}>
        <div className="flex items-center space-x-2 mb-1">
          {!isOwner && message.sender.avatar && (
            <img src={message.sender.avatar} alt="" className="w-6 h-6 rounded-full" />
          )}
          <span className="text-sm font-medium text-gray-900">{message.sender.name}</span>
          {message.sender.company && (
            <span className="text-xs text-gray-500">（{message.sender.company}）</span>
          )}
        </div>
        <div
          className={`px-4 py-2 rounded-lg ${
            isOwner
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={`flex items-center space-x-2 p-2 rounded ${
                    isOwner ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                >
                  {attachment.type === 'image' ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <File className="w-4 h-4" />
                  )}
                  <span className="text-xs truncate">{attachment.name}</span>
                  <span className="text-xs opacity-75">
                    ({(attachment.size / 1024 / 1024).toFixed(2)}MB)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <p className={`text-xs text-gray-500 mt-1 ${isOwner ? 'text-right' : 'text-left'}`}>
          {new Date(message.createdAt).toLocaleString('ja-JP')}
        </p>
      </div>
    </div>
  );
};

export default ChatTab;
