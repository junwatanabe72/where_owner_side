/**
 * RESTチャット機能のモックデータ
 * フェーズ1-2: UIファースト実装用
 */

import { ChatThread, ChatMessage, ChatParticipant } from '../types/chat';

/**
 * モック参加者データ
 */
export const mockParticipants: ChatParticipant[] = [
  {
    id: 'owner-001',
    name: '山田太郎',
    role: 'owner',
    company: '山田不動産',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'provider-001',
    name: '佐藤花子',
    role: 'provider',
    company: '渋谷アセットデベロップメント',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 'provider-002',
    name: '鈴木一郎',
    role: 'provider',
    company: '三井不動産',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'provider-003',
    name: '田中美咲',
    role: 'provider',
    company: '野村不動産',
    avatar: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: 'system-001',
    name: 'WHERE システム',
    role: 'system',
  },
];

/**
 * モックメッセージデータ
 */
export const mockMessages: ChatMessage[] = [
  {
    id: 'msg-001',
    threadId: 'thread-001',
    content: 'マンション用地の直接買取について、提案書を送付させていただきました。ご確認いただけますでしょうか。',
    sender: mockParticipants[1], // 佐藤花子（渋谷アセット）
    createdAt: '2025-10-20T09:30:00+09:00',
    read: true,
  },
  {
    id: 'msg-002',
    threadId: 'thread-001',
    content: '提案書を拝見しました。建築計画についてもう少し詳しくお聞きしたいのですが、追加資料をいただくことは可能でしょうか。',
    sender: mockParticipants[0], // 山田太郎（オーナー）
    createdAt: '2025-10-20T14:15:00+09:00',
    read: true,
  },
  {
    id: 'msg-003',
    threadId: 'thread-001',
    content: 'かしこまりました。建築計画の詳細資料をご用意いたします。明日中にお送りできるかと思います。',
    sender: mockParticipants[1], // 佐藤花子
    createdAt: '2025-10-20T15:00:00+09:00',
    read: true,
  },
  {
    id: 'msg-004',
    threadId: 'thread-001',
    content: 'お待たせいたしました。建築計画の詳細資料を添付いたしました。ご確認ください。',
    sender: mockParticipants[1], // 佐藤花子
    createdAt: '2025-10-21T10:00:00+09:00',
    read: false,
    attachments: [
      {
        id: 'att-001',
        type: 'pdf',
        name: '建築計画詳細_渋谷区宇田川町31-2.pdf',
        url: '/mock-files/construction-plan.pdf',
        size: 2457600, // 2.4MB
        mimeType: 'application/pdf',
      },
    ],
  },
  {
    id: 'msg-005',
    threadId: 'thread-002',
    content: 'リーシング＆バリューアップのご提案について、初回のお打ち合わせのお時間をいただけないでしょうか。',
    sender: mockParticipants[2], // 鈴木一郎（三井不動産）
    createdAt: '2025-10-19T11:00:00+09:00',
    read: true,
  },
  {
    id: 'msg-006',
    threadId: 'thread-002',
    content: '来週でしたら、10月28日（月）の14時以降でしたらお時間取れます。',
    sender: mockParticipants[0], // 山田太郎
    createdAt: '2025-10-19T16:30:00+09:00',
    read: true,
  },
  {
    id: 'msg-007',
    threadId: 'thread-002',
    content: 'ありがとうございます。それでは10月28日（月）14:00でお願いいたします。オンラインでよろしいでしょうか。',
    sender: mockParticipants[2], // 鈴木一郎
    createdAt: '2025-10-19T17:00:00+09:00',
    read: true,
  },
  {
    id: 'msg-008',
    threadId: 'thread-003',
    content: '事業用定期借地権の設定について、税務面での留意点を教えていただけますか。',
    sender: mockParticipants[0], // 山田太郎
    createdAt: '2025-10-18T10:30:00+09:00',
    read: true,
  },
  {
    id: 'msg-009',
    threadId: 'thread-003',
    content: '税務面については、主に以下の点にご注意いただく必要があります。\n1. 一時金の取扱い\n2. 地代収入の課税\n3. 相続税評価への影響\n\n詳細については税理士を交えてご説明させていただきたいと思います。',
    sender: mockParticipants[3], // 田中美咲（野村不動産）
    createdAt: '2025-10-18T14:00:00+09:00',
    read: true,
  },
  {
    id: 'msg-010',
    threadId: 'thread-004',
    content: '新しい提案書が届きました。「世田谷区太子堂4-1-1 リーシング提案」',
    sender: mockParticipants[4], // システム
    createdAt: '2025-10-22T09:00:00+09:00',
    read: false,
  },
];

/**
 * モックスレッドデータ
 */
export const mockThreads: ChatThread[] = [
  {
    id: 'thread-001',
    assetId: 1,
    subject: 'マンション用地 直接買取について',
    participants: [mockParticipants[0], mockParticipants[1]],
    lastMessage: mockMessages[3], // msg-004
    unreadCount: 1,
    createdAt: '2025-10-20T09:30:00+09:00',
    updatedAt: '2025-10-21T10:00:00+09:00',
    status: 'active',
    tags: ['買取', 'マンション用地', '渋谷区'],
  },
  {
    id: 'thread-002',
    assetId: 2,
    subject: 'リーシング＆バリューアップ提案',
    participants: [mockParticipants[0], mockParticipants[2]],
    lastMessage: mockMessages[6], // msg-007
    unreadCount: 0,
    createdAt: '2025-10-19T11:00:00+09:00',
    updatedAt: '2025-10-19T17:00:00+09:00',
    status: 'active',
    tags: ['リーシング', 'バリューアップ'],
  },
  {
    id: 'thread-003',
    assetId: 3,
    subject: '事業用定期借地権設定の件',
    participants: [mockParticipants[0], mockParticipants[3]],
    lastMessage: mockMessages[8], // msg-009
    unreadCount: 0,
    createdAt: '2025-10-18T10:30:00+09:00',
    updatedAt: '2025-10-18T14:00:00+09:00',
    status: 'active',
    tags: ['定期借地', '税務'],
  },
  {
    id: 'thread-004',
    assetId: 2,
    subject: 'システム通知',
    participants: [mockParticipants[0], mockParticipants[4]],
    lastMessage: mockMessages[9], // msg-010
    unreadCount: 1,
    createdAt: '2025-10-22T09:00:00+09:00',
    updatedAt: '2025-10-22T09:00:00+09:00',
    status: 'active',
    tags: ['システム', '通知'],
  },
];

/**
 * スレッドIDからメッセージ一覧を取得
 */
export const getMessagesByThreadId = (threadId: string): ChatMessage[] => {
  return mockMessages.filter(msg => msg.threadId === threadId);
};

/**
 * 未読メッセージ数の合計を取得
 */
export const getTotalUnreadCount = (): number => {
  return mockThreads.reduce((sum, thread) => sum + thread.unreadCount, 0);
};

/**
 * アクティブなスレッド数を取得
 */
export const getActiveThreadCount = (): number => {
  return mockThreads.filter(thread => thread.status === 'active').length;
};
