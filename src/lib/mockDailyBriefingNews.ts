export interface DailyBriefingNewsItem {
  id: string;
  headline: string;
  category: string;
  timestamp: Date;
}

export const mockDailyBriefingNews: DailyBriefingNewsItem[] = [
  {
    id: 'news-1',
    headline: 'Intel reports Q3 earnings miss',
    category: 'Exposure Size',
    timestamp: new Date('2025-03-27T10:30:00'),
  },
  {
    id: 'news-2',
    headline: 'Pfizer faces regulatory investigation in US',
    category: 'Exposure Size',
    timestamp: new Date('2025-03-27T09:15:00'),
  },
  {
    id: 'news-3',
    headline: 'Openai and Adobe announce strategic partnership',
    category: 'Exposure Size',
    timestamp: new Date('2025-03-26T16:45:00'),
  },
  {
    id: 'news-4',
    headline: 'New Basel VI requirements finalized',
    category: 'Analyse Impact',
    timestamp: new Date('2025-03-26T14:20:00'),
  },
  {
    id: 'news-5',
    headline: 'US Inflation remain sticky above 5% target',
    category: 'Analyse Impact',
    timestamp: new Date('2025-03-25T11:00:00'),
  },
];
