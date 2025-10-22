/**
 * チャット機能型定義（RESTポーリング方式）
 *
 * 1提案 = 1スレッド
 * 添付ファイル・メンション対応
 * WebSocket不使用、RESTポーリング + ETag最適化
 */

// ============================================
// 基本型
// ============================================

/**
 * ユーザーロール
 */
export type UserRole = 'owner' | 'agent';

/**
 * メッセージ送信者情報
 */
export interface MessageSender {
  id: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
}

/**
 * 添付ファイル
 */
export interface Attachment {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'html' | 'other';
  fileSize: number; // bytes
  url: string;
  uploadedAt: string; // ISO8601
}

/**
 * メンション
 */
export interface Mention {
  userId: string;
  userName: string;
  role: UserRole;
}

// ============================================
// スレッド
// ============================================

/**
 * チャットスレッド
 */
export interface Thread {
  id: string;
  /** 関連する提案ID */
  proposalId: string | number;
  /** 関連する資産ID */
  assetId: number;
  /** オーナーID */
  ownerId: string;
  /** エージェントID */
  agentId: string;
  /** スレッド作成日時 */
  createdAt: string; // ISO8601
  /** 最終メッセージ日時 */
  lastMessageAt: string; // ISO8601
  /** 未読数（現在のユーザー視点） */
  unreadCount: number;
  /** スレッドタイトル（提案名など） */
  title?: string;
  /** アーカイブ済みフラグ */
  isArchived?: boolean;
}

/**
 * スレッド一覧のフィルター
 */
export interface ThreadFilter {
  assetId?: number;
  proposalId?: string | number;
  includeArchived?: boolean;
}

// ============================================
// メッセージ
// ============================================

/**
 * チャットメッセージ
 */
export interface Message {
  id: string;
  threadId: string;
  /** 送信者情報 */
  sender: MessageSender;
  /** メッセージ本文 */
  body: string;
  /** 添付ファイル */
  attachments: Attachment[];
  /** メンション */
  mentions: Mention[];
  /** 送信日時 */
  createdAt: string; // ISO8601
  /** 既読フラグ（現在のユーザー視点） */
  isRead: boolean;
  /** 編集済みフラグ */
  isEdited?: boolean;
  /** 最終編集日時 */
  editedAt?: string; // ISO8601
}

/**
 * メッセージ送信リクエスト
 */
export interface SendMessageRequest {
  threadId: string;
  body: string;
  attachmentIds?: string[];
  mentionUserIds?: string[];
}

/**
 * メッセージ差分取得パラメータ
 */
export interface GetMessagesParams {
  threadId: string;
  /** この日時以降のメッセージのみ取得 */
  since?: string; // ISO8601
  /** 最大取得件数 */
  limit?: number;
}

// ============================================
// 既読管理
// ============================================

/**
 * スレッド既読情報
 */
export interface ThreadReadStatus {
  threadId: string;
  userId: string;
  lastReadMessageId: string;
  lastReadAt: string; // ISO8601
}

/**
 * 既読更新リクエスト
 */
export interface MarkAsReadRequest {
  threadId: string;
  messageId: string;
}

// ============================================
// ETag対応
// ============================================

/**
 * ETagレスポンスヘッダー
 */
export interface ETagResponse<T> {
  data: T;
  etag: string;
}

/**
 * 差分取得レスポンス
 */
export interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
  nextCursor?: string;
}

// ============================================
// 通知
// ============================================

/**
 * アプリ内通知（バッジ表示用）
 */
export interface NotificationBadge {
  totalUnread: number;
  threadUnreads: Record<string, number>; // threadId -> unreadCount
}

/**
 * メール通知設定
 */
export interface EmailNotificationSettings {
  enabled: boolean;
  /** 新規メッセージ受信時 */
  onNewMessage: boolean;
  /** メンション時のみ */
  onMentionOnly: boolean;
  /** ダイジェスト送信（日次・週次） */
  digestFrequency?: 'daily' | 'weekly' | 'none';
}

// ============================================
// UIステート
// ============================================

/**
 * チャットUIの状態
 */
export interface ChatUIState {
  /** 選択中のスレッド */
  selectedThreadId: string | null;
  /** スレッド一覧の読み込み状態 */
  threadsLoading: boolean;
  /** メッセージの読み込み状態 */
  messagesLoading: boolean;
  /** 送信中フラグ */
  isSending: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** ポーリング有効フラグ */
  pollingEnabled: boolean;
  /** ポーリング間隔（ミリ秒） */
  pollingInterval: number; // デフォルト 10000-20000
}

/**
 * 入力中のメッセージドラフト
 */
export interface MessageDraft {
  threadId: string;
  body: string;
  attachmentIds: string[];
  mentionUserIds: string[];
  savedAt: string; // ISO8601
}

// ============================================
// API レスポンス型
// ============================================

/**
 * スレッド一覧レスポンス
 */
export interface ThreadsResponse {
  threads: Thread[];
  total: number;
}

/**
 * スレッド作成リクエスト
 */
export interface CreateThreadRequest {
  proposalId: string | number;
  assetId: number;
  initialMessage?: string;
}

/**
 * スレッド作成レスポンス
 */
export interface CreateThreadResponse {
  thread: Thread;
  firstMessage?: Message;
}

/**
 * 添付ファイルアップロードレスポンス
 */
export interface UploadAttachmentResponse {
  attachment: Attachment;
}
