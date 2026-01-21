/**
 * RESTチャット機能の型定義
 * フェーズ1-2: UIファースト実装用の型定義
 */

/**
 * チャット参加者
 */
export interface ChatParticipant {
  id: string;
  name: string;
  role: 'owner' | 'provider' | 'system';
  avatar?: string;
  company?: string;
  lastReadAt?: string; // ISO 8601形式
}

/**
 * チャットメッセージ
 */
export interface ChatMessage {
  id: string;
  threadId: string;
  content: string;
  sender: ChatParticipant;
  createdAt: string; // ISO 8601形式
  read: boolean;
  attachments?: ChatAttachment[];
}

/**
 * 添付ファイル
 */
export interface ChatAttachment {
  id: string;
  type: 'image' | 'pdf' | 'document';
  name: string;
  url: string;
  size: number; // bytes
  mimeType: string;
}

/**
 * チャットスレッド
 */
export interface ChatThread {
  id: string;
  assetId: number; // 対象物件ID
  subject: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string; // ISO 8601形式
  updatedAt: string; // ISO 8601形式
  status: 'active' | 'archived' | 'closed';
  tags?: string[];
}

/**
 * スレッド一覧のフィルター条件
 */
export interface ThreadFilter {
  status?: 'active' | 'archived' | 'closed';
  assetId?: number;
  unreadOnly?: boolean;
  tags?: string[];
}
