import { Category, LiveStream, MovieStream, SeriesStream, EPGItem } from '../types';

export const DEMO_LIVE_CATEGORIES: Category[] = [
  { category_id: 'sports', category_name: '⚽ กีฬาถ่ายทอดสด (Live Sports)' },
  { category_id: 'news', category_name: '📰 ข่าว & เศรษฐกิจ (News & Finance)' },
  { category_id: 'docs', category_name: '🌍 สารคดี & วิทยาศาสตร์ (Documentaries)' },
  { category_id: 'movies_ch', category_name: '🎬 ช่องภาพยนตร์ 24 ชม. (Movie Channels)' },
  { category_id: 'music', category_name: '🎵 ดนตรี & บันเทิง (Music & Entertainment)' },
];

export const DEMO_LIVE_STREAMS: LiveStream[] = [
  {
    num: 1,
    name: 'Red Bull TV Extreme Sports HD',
    stream_type: 'live',
    stream_id: 101,
    stream_icon: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&auto=format&fit=crop&q=80',
    epg_channel_id: 'redbull_tv',
    category_id: 'sports',
  },
  {
    num: 2,
    name: 'Sports Action Live Stream',
    stream_type: 'live',
    stream_id: 102,
    stream_icon: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&auto=format&fit=crop&q=80',
    epg_channel_id: 'sports_action',
    category_id: 'sports',
  },
  {
    num: 3,
    name: 'NASA TV Live Ultra HD',
    stream_type: 'live',
    stream_id: 103,
    stream_icon: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&auto=format&fit=crop&q=80',
    epg_channel_id: 'nasa_tv',
    category_id: 'docs',
  },
  {
    num: 4,
    name: 'DW News Global English 1080p',
    stream_type: 'live',
    stream_id: 104,
    stream_icon: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=200&auto=format&fit=crop&q=80',
    epg_channel_id: 'dw_news',
    category_id: 'news',
  },
  {
    num: 5,
    name: 'Euronews International HD',
    stream_type: 'live',
    stream_id: 105,
    stream_icon: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&auto=format&fit=crop&q=80',
    epg_channel_id: 'euronews',
    category_id: 'news',
  },
  {
    num: 6,
    name: 'Cinema World Premiere 24H',
    stream_type: 'live',
    stream_id: 106,
    stream_icon: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&auto=format&fit=crop&q=80',
    epg_channel_id: 'cinema_world',
    category_id: 'movies_ch',
  },
  {
    num: 7,
    name: 'National Wildlife & Oceans Live',
    stream_type: 'live',
    stream_id: 107,
    stream_icon: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
    epg_channel_id: 'nature_wild',
    category_id: 'docs',
  },
  {
    num: 8,
    name: 'Beats & Concerts Live HD',
    stream_type: 'live',
    stream_id: 108,
    stream_icon: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&auto=format&fit=crop&q=80',
    epg_channel_id: 'music_live',
    category_id: 'music',
  },
];

// Stream URLs mapped by stream_id for demo mode
export const DEMO_STREAM_URLS: Record<number, string> = {
  101: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
  102: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  103: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
  104: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
  105: 'https://euronews-euronews-world-1-au.samsung.wurl.tv/playlist.m3u8',
  106: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  107: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  108: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
};

// Generates dynamic EPG matching current hour
export function getDemoEPG(streamId: number): EPGItem[] {
  const now = new Date();
  const currentHour = now.getHours();
  
  const sampleShows: Record<number, Array<{ title: string; desc: string; durationMins: number }>> = {
    101: [
      { title: 'Extreme Downhill MTB Championship', desc: 'การแข่งขันดาวน์ฮิลล์จักรยานเสือภูเขาระดับโลก ถ่ายทอดสดจากเทือกเขาแอลป์', durationMins: 90 },
      { title: 'X-Games Freestyle Highlights', desc: 'รวมไฮไลท์การแข่งขันสเก็ตบอร์ดและบีเอ็มเอ็กซ์สุดมันส์', durationMins: 60 },
      { title: 'Red Bull Cliff Diving World Series', desc: 'การแข่งขันกระโดดหน้าผาระดับโลก ณ อ่าวซิดนีย์', durationMins: 60 },
    ],
    102: [
      { title: 'Super Sunday Football Live', desc: 'ศึกฟุตบอลลีกแมตช์สำคัญประจำสัปดาห์ วิเคราะห์ก่อนเกมพร้อมไลน์อัพ', durationMins: 120 },
      { title: 'Post-Match Analysis & Highlights', desc: 'วิเคราะห์ผลการแข่งขัน สรุปตารางคะแนน และบทสัมภาษณ์โค้ช', durationMins: 45 },
    ],
    103: [
      { title: 'ISS Live Earth Views & Spacewalk', desc: 'ชมทัศนียภาพโลกสดจากสถานีอวกาศนานาชาติ พร้อมภารกิจซ่อมบำรุงโมดูลอวกาศ', durationMins: 120 },
      { title: 'Artemis Moon Mission Countdown', desc: 'รายงานความคืบหน้าโครงการส่งมนุษย์กลับสู่ดวงจันทร์', durationMins: 60 },
    ],
    104: [
      { title: 'DW News Global Edition', desc: 'สรุปข่าวรอบโลก เจาะลึกสถานการณ์สงครามและเศรษฐกิจระหว่างประเทศ', durationMins: 60 },
      { title: 'Conflict Zone: Hard Talk', desc: 'รายการสนทนาเข้มข้น สัมภาษณ์ผู้นำระดับโลก', durationMins: 30 },
    ],
    105: [
      { title: 'Euronews Direct World', desc: 'ข่าวสด 24 ชั่วโมงจากทั่วยุโรปและทั่วโลก', durationMins: 60 },
      { title: 'Business Weekly Review', desc: 'ความเคลื่อนไหวตลาดหุ้น ตลาดพลังงาน และอัตราแลกเปลี่ยนเงินตรา', durationMins: 30 },
    ],
    106: [
      { title: 'Blockbuster Cinema: Sintel 4K', desc: 'ภาพยนตร์แอนิเมชันแฟนตาซีฟอร์มยักษ์ เรื่องราวการผจญภัยของสาวนักสู้กับมังกร', durationMins: 110 },
      { title: 'Midnight Sci-Fi Thriller', desc: 'ภาพยนตร์ไซไฟระทึกขวัญข้ามมิติเวลา', durationMins: 100 },
    ],
    107: [
      { title: 'Blue Planet: Deep Abyss', desc: 'สำรวจสิ่งมีชีวิตลึกลับใต้ก้นทะเลลึกมหาสมุทรแปซิฟิก', durationMins: 60 },
      { title: 'Serengeti Predator Chronicles', desc: 'ชีวิตสัตว์ป่าและการล่าเหยื่อในทุ่งหญ้าสะวันนา', durationMins: 60 },
    ],
    108: [
      { title: 'Electronic Beats Festival Live', desc: 'เทศกาลดนตรีอิเล็กทรอนิกส์สด เซ็ตจากดีเจชั้นนำระดับโลก', durationMins: 90 },
      { title: 'Acoustic Sessions Sunset', desc: 'ดนตรีอะคูสติกฟังสบายยามเย็น', durationMins: 60 },
    ],
  };

  const shows = sampleShows[streamId] || [
    { title: 'Live Broadcast Program', desc: 'รายการถ่ายทอดสดคุณภาพระดับ Full HD / 4K', durationMins: 60 },
    { title: 'Upcoming Night Feature', desc: 'รายการพิเศษประจำคืนนี้', durationMins: 90 },
  ];

  let currentStart = new Date(now.getTime() - 25 * 60 * 1000); // started 25 min ago
  const formatTime = (d: Date) => d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });

  return shows.map((show, idx) => {
    const start = new Date(currentStart);
    const end = new Date(start.getTime() + show.durationMins * 60 * 1000);
    currentStart = end;

    return {
      id: `epg_${streamId}_${idx}`,
      title: show.title,
      start: `${formatTime(start)}`,
      end: `${formatTime(end)}`,
      description: show.desc,
      start_timestamp: Math.floor(start.getTime() / 1000).toString(),
      stop_timestamp: Math.floor(end.getTime() / 1000).toString(),
    };
  });
}

export const DEMO_VOD_CATEGORIES: Category[] = [
  { category_id: 'vod_scifi', category_name: '🚀 ไซไฟ & แฟนตาซี (Sci-Fi)' },
  { category_id: 'vod_action', category_name: '💥 แอ็คชั่น & ระทึกขวัญ (Action)' },
  { category_id: 'vod_anim', category_name: '🎨 แอนิเมชัน & ครอบครัว (Animation)' },
  { category_id: 'vod_doc', category_name: '🎥 สารคดีรางวัล (Documentary)' },
];

export const DEMO_MOVIES: MovieStream[] = [
  {
    num: 1,
    name: 'Tears of Steel (ไซเบอร์พังก์ ลอนดอน 4K)',
    stream_type: 'movie',
    stream_id: 201,
    stream_icon: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
    rating: '8.7',
    rating_5based: 4.4,
    container_extension: 'mp4',
    category_id: 'vod_scifi',
    year: '2024',
    genre: 'Sci-Fi, Cyberpunk, VFX',
    duration: '1 ชม. 48 นาที',
    plot: 'ในอนาคตอันใกล้กลางกรุงลอนดอน กลุ่มนักรบและนักวิทยาศาสตร์พยายามเปลี่ยนอดีตเพื่อกู้โลกจากหุ่นยนต์ชีวกลไกที่เข้ายึดครอง',
  },
  {
    num: 2,
    name: 'Sintel: มหากาพย์มังกร (4K Mastered)',
    stream_type: 'movie',
    stream_id: 202,
    stream_icon: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    rating: '9.1',
    rating_5based: 4.8,
    container_extension: 'mp4',
    category_id: 'vod_anim',
    year: '2023',
    genre: 'Animation, Adventure, Fantasy',
    duration: '1 ชม. 35 นาที',
    plot: 'การเดินทางฝ่าความหนาวเหน็บและอันตรายของซินเทล เพื่อตามหาลูกมังกรเพื่อนรักที่ถูกพรากไป',
  },
  {
    num: 3,
    name: 'Big Buck Bunny: สงครามกระต่ายยักษ์',
    stream_type: 'movie',
    stream_id: 203,
    stream_icon: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=400&auto=format&fit=crop&q=80',
    rating: '8.4',
    rating_5based: 4.2,
    container_extension: 'mp4',
    category_id: 'vod_anim',
    year: '2022',
    genre: 'Animation, Comedy',
    duration: '1 ชม. 20 นาที',
    plot: 'เรื่องราวของกระต่ายยักษ์ใจดีที่ตัดสินใจสั่งสอนแก๊งกระรอกและกิ้งก่าจอมเกเรในป่าใหญ่',
  },
  {
    num: 4,
    name: 'Cosmos Odyssey: มหายานอวกาศ',
    stream_type: 'movie',
    stream_id: 204,
    stream_icon: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&auto=format&fit=crop&q=80',
    rating: '8.9',
    rating_5based: 4.5,
    container_extension: 'mp4',
    category_id: 'vod_scifi',
    year: '2024',
    genre: 'Sci-Fi, Space Exploration',
    duration: '2 ชม. 12 นาที',
    plot: 'ยานสำรวจไร้คนขับค้นพบสัญญาณวิทยุโบราณจากขอบกาแล็กซี นำพาลูกเรือชุดแรกเดินทางข้ามรูหนอน',
  },
  {
    num: 5,
    name: 'Tokyo Neon Drift: ซิ่งสายฟ้า',
    stream_type: 'movie',
    stream_id: 205,
    stream_icon: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    rating: '8.1',
    rating_5based: 4.0,
    container_extension: 'mp4',
    category_id: 'vod_action',
    year: '2023',
    genre: 'Action, Racing, Thriller',
    duration: '1 ชม. 55 นาที',
    plot: 'การประลองความเร็วบนทางด่วนชูโตะใจกลางโตเกียวท่ามกลางแสงนีออนและความแค้นของสองตระกูลนักซิ่ง',
  },
  {
    num: 6,
    name: 'Deep Blue Horizon: สัตว์ใต้สมุทร',
    stream_type: 'movie',
    stream_id: 206,
    stream_icon: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=400&auto=format&fit=crop&q=80',
    rating: '9.3',
    rating_5based: 4.9,
    container_extension: 'mp4',
    category_id: 'vod_doc',
    year: '2024',
    genre: 'Documentary, Nature 4K',
    duration: '1 ชม. 45 นาที',
    plot: 'ภาพยนตร์สารคดี 4K บันทึกภาพชีวิตของสิ่งมีชีวิตเรืองแสงและความลับของร่องลึกมาเรียนา',
  },
];

export const DEMO_MOVIE_URLS: Record<number, string> = {
  201: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
  202: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
  203: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  204: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
  205: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
  206: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
};

export const DEMO_SERIES_CATEGORIES: Category[] = [
  { category_id: 'series_trending', category_name: '🔥 ซีรีส์ยอดนิยม (Trending)' },
  { category_id: 'series_drama', category_name: '🎭 ดราม่า & สืบสวน (Drama & Crime)' },
  { category_id: 'series_scifi', category_name: '⚡ แฟนตาซี & ผจญภัย (Fantasy)' },
];

export const DEMO_SERIES: SeriesStream[] = [
  {
    num: 1,
    name: 'Cyber Protocols: หน่วยสืบล่าโลกเสมือน',
    series_id: 301,
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
    plot: 'ในโลกอนาคตที่จิตสำนึกมนุษย์เชื่อมต่อกับระบบเครือข่ายกลาง หน่วยสืบสวนพิเศษต้องตามล่าแฮกเกอร์ที่สามารถควบคุมความทรงจำผู้คน',
    cast: 'Kenji Sato, Elena Vance, Marcus Thorne',
    genre: 'Cyberpunk, Sci-Fi, Mystery',
    rating: '9.2',
    category_id: 'series_trending',
    releaseDate: '2024',
  },
  {
    num: 2,
    name: 'Kingdom of Winds: ปฐมบทแห่งสายลม',
    series_id: 302,
    cover: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&auto=format&fit=crop&q=80',
    plot: 'สงครามแย่งชิงบัลลังก์ระหว่าง 4 แคว้นโบราณที่แต่ละฝ่ายครอบครองศาสตร์เวทมนตร์ธาตุทั้งสี่',
    cast: 'Liam Cunningham, Anya Sharma, David Wu',
    genre: 'Fantasy, Adventure, Drama',
    rating: '8.8',
    category_id: 'series_scifi',
    releaseDate: '2023',
  },
  {
    num: 3,
    name: 'The Night Detective: สืบคดีเงาจันทร์',
    series_id: 303,
    cover: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&auto=format&fit=crop&q=80',
    plot: 'นักสืบเอกชนผู้มีอดีตดำมืดถูกดึงเข้าไปพัวพันกับการหายตัวไปของมหาเศรษฐีในคืนจันทรุปราคา',
    cast: 'Thomas Harris, Claire Moreau',
    genre: 'Crime, Noir, Thriller',
    rating: '8.5',
    category_id: 'series_drama',
    releaseDate: '2024',
  },
];

export const DEMO_SERIES_EPISODES: Record<number, any> = {
  301: {
    seasons: [
      { name: 'ซีซั่น 1 (Season 1)', season_number: 1, episode_count: 3 }
    ],
    episodes: {
      "1": [
        {
          id: 30101,
          season: 1,
          episode_num: 1,
          title: 'EP.1 - สัญญาณรบกวน (Ghost in the Signal)',
          container_extension: 'mp4',
          streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
          info: {
            plot: 'การโจมตีทางไซเบอร์ครั้งแรกที่ทำให้ระบบโครงข่ายประสาทเทียมของประชากรครึ่งเมืองดับวูบ',
            duration: '48 นาที',
            movie_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
          }
        },
        {
          id: 30102,
          season: 1,
          episode_num: 2,
          title: 'EP.2 - รหัสลับใต้ดิน (Sub-level Zero)',
          container_extension: 'mp4',
          streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
          info: {
            plot: 'ทีมสืบสวนลงสู่เขาวงกตใต้ดินชั้นลึกเพื่อตามหารังของกลุ่มกบฏไซไฟ',
            duration: '52 นาที',
            movie_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
          }
        },
        {
          id: 30103,
          season: 1,
          episode_num: 3,
          title: 'EP.3 - จุดบรรจบความทรงจำ (Memory Convergence)',
          container_extension: 'mp4',
          streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          info: {
            plot: 'บทสรุปการเผชิญหน้าระหว่างสายลับกับ AI ตัวแม่ที่วิวัฒนาการเกินการควบคุม',
            duration: '55 นาที',
            movie_image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
          }
        },
      ]
    }
  },
  302: {
    seasons: [
      { name: 'ซีซั่น 1 (Season 1)', season_number: 1, episode_count: 2 }
    ],
    episodes: {
      "1": [
        {
          id: 30201,
          season: 1,
          episode_num: 1,
          title: 'EP.1 - เปลวไฟแห่งพายุ (The Fire Tempest)',
          container_extension: 'mp4',
          streamUrl: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
          info: {
            plot: 'การล่มสลายของปราการแห่งสายลมและการหลบหนีของทายาทคนสุดท้าย',
            duration: '50 นาที',
            movie_image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&auto=format&fit=crop&q=80',
          }
        },
        {
          id: 30202,
          season: 1,
          episode_num: 2,
          title: 'EP.2 - หุบเขากลืนตะวัน (Valley of the Eclipse)',
          container_extension: 'mp4',
          streamUrl: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
          info: {
            plot: 'การรวมตัวของกองทัพพันธมิตรเพื่อเตรียมตั้งรับการบุกยามราตรี',
            duration: '53 นาที',
            movie_image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&auto=format&fit=crop&q=80',
          }
        },
      ]
    }
  },
  303: {
    seasons: [
      { name: 'ซีซั่น 1 (Season 1)', season_number: 1, episode_count: 2 }
    ],
    episodes: {
      "1": [
        {
          id: 30301,
          season: 1,
          episode_num: 1,
          title: 'EP.1 - เหยื่อรายที่เจ็ด (Victim Number Seven)',
          container_extension: 'mp4',
          streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
          info: {
            plot: 'หลักฐานชิ้นใหม่ที่นำไปสู่คฤหาสน์ร้างริมชายฝั่งทะเลสาบ',
            duration: '45 นาที',
            movie_image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&auto=format&fit=crop&q=80',
          }
        },
        {
          id: 30302,
          season: 1,
          episode_num: 2,
          title: 'EP.2 - ภาพลวงตา (Smoke and Mirrors)',
          container_extension: 'mp4',
          streamUrl: 'https://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master.m3u8',
          info: {
            plot: 'การแกะรอยโทรศัพท์ลึกลับที่โทรเข้ามาจากเบอร์ที่ปิดบริการไปแล้ว 10 ปี',
            duration: '47 นาที',
            movie_image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&auto=format&fit=crop&q=80',
          }
        },
      ]
    }
  }
};
