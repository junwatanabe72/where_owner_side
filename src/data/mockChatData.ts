/**
 * チャット機能のモックデータ
 */

import type { Thread, Message, MessageSender } from '../types';

// モックユーザー
export const mockOwner: MessageSender = {
  id: 'owner-001',
  role: 'owner',
  name: '山田太郎',
  avatarUrl: undefined,
};

export const mockAgent: MessageSender = {
  id: 'agent-001',
  role: 'agent',
  name: '鈴木エージェント',
  avatarUrl: undefined,
};

// モックスレッド
export const mockThreads: Thread[] = [
  {
    id: 'thread-001',
    proposalId: 'proposal-001',
    assetId: 1,
    ownerId: 'owner-001',
    agentId: 'agent-001',
    createdAt: '2025-10-15T10:00:00Z',
    lastMessageAt: '2025-10-20T15:30:00Z',
    unreadCount: 2,
    title: '等価交換提案に関する相談',
    isArchived: false,
  },
  {
    id: 'thread-002',
    proposalId: 'proposal-002',
    assetId: 1,
    ownerId: 'owner-001',
    agentId: 'agent-001',
    createdAt: '2025-10-10T14:00:00Z',
    lastMessageAt: '2025-10-18T11:20:00Z',
    unreadCount: 0,
    title: '定期借地権の条件について',
    isArchived: false,
  },
];

// モックメッセージ
export const mockMessages: Record<string, Message[]> = {
  'thread-001': [
    {
      id: 'msg-001',
      threadId: 'thread-001',
      sender: mockAgent,
      body: 'こんにちは。等価交換プランのご提案をさせていただきます。\n\n現在の土地価値を活かして、新築マンションの一部を取得できるプランです。',
      attachments: [
        {
          id: 'att-001',
          fileName: '等価交換提案書.pdf',
          fileType: 'pdf',
          fileSize: 2048576,
          url: '#',
          uploadedAt: '2025-10-15T10:00:00Z',
        },
      ],
      mentions: [],
      createdAt: '2025-10-15T10:00:00Z',
      isRead: true,
    },
    {
      id: 'msg-002',
      threadId: 'thread-001',
      sender: mockOwner,
      body: '提案書を拝見しました。\n\nいくつか質問があります：\n1. 工期はどのくらいですか？\n2. オーナー取得住戸の面積はどう決まりますか？',
      attachments: [],
      mentions: [
        {
          userId: 'agent-001',
          userName: '鈴木エージェント',
          role: 'agent',
        },
      ],
      createdAt: '2025-10-16T14:30:00Z',
      isRead: true,
    },
    {
      id: 'msg-003',
      threadId: 'thread-001',
      sender: mockAgent,
      body: 'ご質問ありがとうございます。\n\n1. 工期は約24ヶ月を想定しています。\n2. 取得住戸面積は、土地評価額と売却単価から算出されます。詳細は添付の資料をご覧ください。',
      attachments: [
        {
          id: 'att-002',
          fileName: '等価交換_詳細資料.pdf',
          fileType: 'pdf',
          fileSize: 1536000,
          url: '#',
          uploadedAt: '2025-10-17T09:15:00Z',
        },
      ],
      mentions: [],
      createdAt: '2025-10-17T09:15:00Z',
      isRead: true,
    },
    {
      id: 'msg-004',
      threadId: 'thread-001',
      sender: mockOwner,
      body: 'ありがとうございます。\n\nもう少し具体的なシミュレーションを見たいのですが、可能でしょうか？',
      attachments: [],
      mentions: [],
      createdAt: '2025-10-18T16:00:00Z',
      isRead: true,
    },
    {
      id: 'msg-005',
      threadId: 'thread-001',
      sender: mockAgent,
      body: 'もちろんです！評価シミュレータータブで、複数のシナリオを比較検討していただけます。\n\n等価交換、定期借地権、一括借上の3パターンをご確認ください。',
      attachments: [],
      mentions: [],
      createdAt: '2025-10-20T15:30:00Z',
      isRead: false,
    },
  ],
  'thread-002': [
    {
      id: 'msg-101',
      threadId: 'thread-002',
      sender: mockAgent,
      body: '定期借地権マンションのプランをご提案します。\n\n50年間の地代収入で安定した収益を得られるプランです。',
      attachments: [],
      mentions: [],
      createdAt: '2025-10-10T14:00:00Z',
      isRead: true,
    },
    {
      id: 'msg-102',
      threadId: 'thread-002',
      sender: mockOwner,
      body: '地代の利回りはどのくらいを想定していますか？',
      attachments: [],
      mentions: [],
      createdAt: '2025-10-12T10:30:00Z',
      isRead: true,
    },
    {
      id: 'msg-103',
      threadId: 'thread-002',
      sender: mockAgent,
      body: '土地評価額の3%程度を想定しています。\n\nエスカレーション条項も設定可能です。',
      attachments: [],
      mentions: [],
      createdAt: '2025-10-13T15:45:00Z',
      isRead: true,
    },
  ],
};
