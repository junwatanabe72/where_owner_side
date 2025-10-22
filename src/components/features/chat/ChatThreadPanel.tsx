/**
 * チャットスレッドパネルコンポーネント
 *
 * 提案詳細画面の右側に表示されるチャットスレッド
 * RESTポーリング方式、モックデータで先行実装
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, AtSign, X, File, Image as ImageIcon, FileText } from 'lucide-react';
import type { Thread, Message, MessageSender } from '../../../types';

interface ChatThreadPanelProps {
  thread: Thread;
  messages: Message[];
  currentUser: MessageSender;
  onSendMessage: (body: string, attachmentIds?: string[]) => void;
  onClose?: () => void;
}

const ChatThreadPanel: React.FC<ChatThreadPanelProps> = ({
  thread,
  messages,
  currentUser,
  onSendMessage,
  onClose,
}) => {
  const [messageBody, setMessageBody] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageBody.trim()) {
      onSendMessage(messageBody, attachments);
      setMessageBody('');
      setAttachments([]);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-lg">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900">{thread.title || '提案チャット'}</h3>
          <p className="text-xs text-gray-500">提案ID: {thread.proposalId}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">まだメッセージがありません</p>
            <p className="text-xs mt-1">最初のメッセージを送信してください</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender.id === currentUser.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                  {/* 送信者名とタイムスタンプ */}
                  <div className="flex items-center space-x-2 mb-1 px-1">
                    <span className="text-xs font-medium text-gray-700">
                      {message.sender.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {message.isEdited && (
                      <span className="text-xs text-gray-400">(編集済み)</span>
                    )}
                  </div>

                  {/* メッセージ本文 */}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                  </div>

                  {/* 添付ファイル */}
                  {message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm border ${
                            isOwnMessage
                              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          } transition`}
                        >
                          {getFileIcon(attachment.fileType)}
                          <span className="truncate">{attachment.fileName}</span>
                          <span className="text-xs text-gray-500">
                            ({(attachment.fileSize / 1024).toFixed(0)}KB)
                          </span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* メンション */}
                  {message.mentions.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {message.mentions.map((mention) => (
                        <span
                          key={mention.userId}
                          className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          <AtSign className="w-3 h-3" />
                          <span>{mention.userName}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 入力エリア */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* 添付ファイルプレビュー（モック） */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachments.map((id, index) => (
                <div
                  key={id}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded text-xs"
                >
                  <File className="w-3 h-3" />
                  <span>ファイル {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => setAttachments(prev => prev.filter(a => a !== id))}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 入力欄とボタン */}
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="メッセージを入力..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            <div className="flex flex-col space-y-1">
              {/* 添付ボタン（モック） */}
              <button
                type="button"
                onClick={() => {
                  // モック: ランダムIDで添付ファイルを追加
                  setAttachments(prev => [...prev, `file_${Date.now()}`]);
                }}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="ファイルを添付"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={!messageBody.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                title="送信 (Cmd+Enter)"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Cmd/Ctrl + Enter で送信
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChatThreadPanel;
