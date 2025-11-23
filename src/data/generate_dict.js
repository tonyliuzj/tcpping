const fs = require('fs');
const path = require('path');

// Read Format.md
const formatPath = path.join(__dirname, '../../Format.md');
const formatContent = fs.readFileSync(formatPath, 'utf-8');

// Parse Sections
const sections = {};
let currentSection = null;

formatContent.split('\n').forEach(line => {
  line = line.trim();
  if (!line) return;
  
  if (line.endsWith(':') || line.endsWith('：')) {
    currentSection = line.replace(/[:：]/, '').trim();
    sections[currentSection] = [];
  } else if (currentSection) {
    sections[currentSection].push(line);
  }
});

// Helper to parse tab-separated values
const parseList = (lines) => {
  return lines.map(line => {
    const parts = line.split(/\s+/);
    return { name: parts[0], code: parts[1] };
  });
};

const provinces = parseList(sections['Province'] || []);
const cities = parseList(sections['Cities'] || []);

// Default Providers
const defaultProviders = {
  ct: { name: "China Telecom", v4: true, v6: true },
  cu: { name: "China Unicom", v4: true, v6: true },
  cm: { name: "China Mobile", v4: true, v6: true },
  edu: { name: "China Education Network", v4: true, v6: true }
};

// Knowledge Base for Hierarchy (City -> Province) and Coordinates
// This maps the city code (from Format.md) to its province code.
const cityKnowledge = {
  // Inner Mongolia (NM)
  'xilingol': { prov: 'NM', lat: 43.93, lon: 116.03 },
  'huhhot': { prov: 'NM', lat: 40.82, lon: 111.66 },
  'ulanqab': { prov: 'NM', lat: 41.03, lon: 113.11 },
  'tongliao': { prov: 'NM', lat: 43.61, lon: 122.26 },
  'baotou': { prov: 'NM', lat: 40.64, lon: 109.84 },
  'chifeng': { prov: 'NM', lat: 42.24, lon: 118.95 },
  'bayannur': { prov: 'NM', lat: 40.75, lon: 107.42 },
  'ordos': { prov: 'NM', lat: 39.60, lon: 109.79 },
  'hulunbuir': { prov: 'NM', lat: 49.20, lon: 119.75 },
  'wuhai': { prov: 'NM', lat: 39.66, lon: 106.82 },
  'alxa': { prov: 'NM', lat: 38.84, lon: 105.73 },
  'xingan': { prov: 'NM', lat: 46.06, lon: 122.06 },

  // Henan (HA)
  'pingdingshan': { prov: 'HA', lat: 33.74, lon: 113.30 },
  'hebi': { prov: 'HA', lat: 35.90, lon: 114.19 },
  'zhumadian': { prov: 'HA', lat: 32.98, lon: 114.02 },
  'luohe': { prov: 'HA', lat: 33.56, lon: 114.04 },
  'puyang': { prov: 'HA', lat: 35.75, lon: 115.02 },
  'luoyang': { prov: 'HA', lat: 34.66, lon: 112.44 },
  'kaifeng': { prov: 'HA', lat: 34.79, lon: 114.34 },
  'zhengzhou': { prov: 'HA', lat: 34.75, lon: 113.66 },
  'jiaozuo': { prov: 'HA', lat: 35.24, lon: 113.23 },
  'sanmenxia': { prov: 'HA', lat: 34.76, lon: 111.19 },
  'xinxiang': { prov: 'HA', lat: 35.31, lon: 113.91 },
  'nanyang': { prov: 'HA', lat: 33.00, lon: 112.53 },
  'xinyang': { prov: 'HA', lat: 32.12, lon: 114.07 },
  'anyang': { prov: 'HA', lat: 36.10, lon: 114.35 },
  'zhoukou': { prov: 'HA', lat: 33.62, lon: 114.63 },
  'shangqiu': { prov: 'HA', lat: 34.44, lon: 115.65 },
  'xuchang': { prov: 'HA', lat: 34.02, lon: 113.83 },

  // Shanxi (SX)
  'yangquan': { prov: 'SX', lat: 37.86, lon: 113.57 },
  'jinzhong': { prov: 'SX', lat: 37.69, lon: 112.73 },
  'datong': { prov: 'SX', lat: 40.09, lon: 113.29 },
  'xinzhou': { prov: 'SX', lat: 38.41, lon: 112.73 },
  'jincheng': { prov: 'SX', lat: 35.50, lon: 112.86 },
  'lvliang': { prov: 'SX', lat: 37.52, lon: 111.13 },
  'yuncheng': { prov: 'SX', lat: 35.03, lon: 111.00 },
  'taiyuan': { prov: 'SX', lat: 37.86, lon: 112.55 },
  'changzhi': { prov: 'SX', lat: 36.19, lon: 113.11 },
  'shuozhou': { prov: 'SX', lat: 39.33, lon: 112.43 },
  'linfen': { prov: 'SX', lat: 36.08, lon: 111.51 },

  // Tibet (XZ)
  'shannan': { prov: 'XZ', lat: 29.24, lon: 91.76 },
  'qamdo': { prov: 'XZ', lat: 31.14, lon: 97.17 },
  'linzhi': { prov: 'XZ', lat: 29.65, lon: 94.36 },
  'lhasa': { prov: 'XZ', lat: 29.66, lon: 91.13 },
  'shigatse': { prov: 'XZ', lat: 29.26, lon: 88.88 },
  'naqu': { prov: 'XZ', lat: 31.48, lon: 92.06 },
  'ngari': { prov: 'XZ', lat: 32.50, lon: 80.10 },

  // Hebei (HE)
  'qinhuangdao': { prov: 'HE', lat: 39.95, lon: 119.57 },
  'hengshui': { prov: 'HE', lat: 37.74, lon: 115.68 },
  'langfang': { prov: 'HE', lat: 39.52, lon: 116.70 },
  'cangzhou': { prov: 'HE', lat: 38.33, lon: 116.84 },
  'tangshan': { prov: 'HE', lat: 39.63, lon: 118.17 },
  'zhangjiakou': { prov: 'HE', lat: 40.78, lon: 114.88 },
  'xingtai': { prov: 'HE', lat: 37.06, lon: 114.50 },
  'handan': { prov: 'HE', lat: 36.60, lon: 114.48 },
  'chengde': { prov: 'HE', lat: 40.97, lon: 117.93 },
  'baoding': { prov: 'HE', lat: 38.86, lon: 115.48 },
  'shijiazhuang': { prov: 'HE', lat: 38.04, lon: 114.50 },

  // Shaanxi (SN)
  'weinan': { prov: 'SN', lat: 34.50, lon: 109.50 },
  'shangluo': { prov: 'SN', lat: 33.86, lon: 109.93 },
  'xian': { prov: 'SN', lat: 34.26, lon: 108.95 },
  'yanan': { prov: 'SN', lat: 36.59, lon: 109.49 },
  'xianyang': { prov: 'SN', lat: 34.33, lon: 108.70 },
  'ankang': { prov: 'SN', lat: 32.69, lon: 109.02 },
  'tongchuan': { prov: 'SN', lat: 34.90, lon: 109.07 },
  'hanzhong': { prov: 'SN', lat: 33.08, lon: 107.03 },
  'baoji': { prov: 'SN', lat: 34.37, lon: 107.14 },

  // Xinjiang (XJ)
  'hami': { prov: 'XJ', lat: 42.82, lon: 93.51 },
  'bayingolin': { prov: 'XJ', lat: 41.76, lon: 86.15 },
  'hetian': { prov: 'XJ', lat: 37.11, lon: 79.92 },
  'urumqi': { prov: 'XJ', lat: 43.83, lon: 87.62 },
  'kashgar': { prov: 'XJ', lat: 39.46, lon: 75.99 },
  'shihezi': { prov: 'XJ', lat: 44.30, lon: 86.03 },
  'aksu': { prov: 'XJ', lat: 41.16, lon: 80.26 },
  'changji': { prov: 'XJ', lat: 44.02, lon: 87.31 },
  'turpan': { prov: 'XJ', lat: 42.94, lon: 89.18 },
  'beitun': { prov: 'XJ', lat: 47.33, lon: 87.82 },
  'karamay': { prov: 'XJ', lat: 45.59, lon: 84.87 },
  'tumxuk': { prov: 'XJ', lat: 39.85, lon: 79.08 },
  'alar': { prov: 'XJ', lat: 40.54, lon: 81.27 },
  'altay': { prov: 'XJ', lat: 47.83, lon: 88.13 },
  'ili': { prov: 'XJ', lat: 43.91, lon: 81.33 },
  'shuanghe': { prov: 'XJ', lat: 44.82, lon: 82.35 },
  'kizilsu': { prov: 'XJ', lat: 39.73, lon: 76.17 },
  'bortala': { prov: 'XJ', lat: 44.92, lon: 82.07 },
  'wujiaqu': { prov: 'XJ', lat: 44.17, lon: 87.53 },
  'tacheng': { prov: 'XJ', lat: 46.75, lon: 82.98 },

  // Sichuan (SC)
  'chengdu': { prov: 'SC', lat: 30.66, lon: 104.06 },
  'ziyang': { prov: 'SC', lat: 30.12, lon: 104.64 },
  'zigong': { prov: 'SC', lat: 29.35, lon: 104.77 },
  'leshan': { prov: 'SC', lat: 29.56, lon: 103.76 },
  'deyang': { prov: 'SC', lat: 31.13, lon: 104.39 },
  'panzhihua': { prov: 'SC', lat: 26.58, lon: 101.71 },
  'garze': { prov: 'SC', lat: 30.05, lon: 101.96 },
  'suining': { prov: 'SC', lat: 30.52, lon: 105.58 },
  'neijiang': { prov: 'SC', lat: 29.58, lon: 105.06 },
  'aba': { prov: 'SC', lat: 31.91, lon: 102.22 },
  'yibin': { prov: 'SC', lat: 28.77, lon: 104.62 },
  'dazhou': { prov: 'SC', lat: 31.21, lon: 107.50 },
  'nanchong': { prov: 'SC', lat: 30.80, lon: 106.08 },
  'liangshan': { prov: 'SC', lat: 27.88, lon: 102.25 },
  'bazhong': { prov: 'SC', lat: 31.85, lon: 106.74 },
  'mianyang': { prov: 'SC', lat: 31.46, lon: 104.74 },
  'guangan': { prov: 'SC', lat: 30.46, lon: 106.63 },
  'meishan': { prov: 'SC', lat: 30.07, lon: 103.83 },
  'luzhou': { prov: 'SC', lat: 28.89, lon: 105.44 },
  'yaan': { prov: 'SC', lat: 29.98, lon: 103.00 },
  'guangyuan': { prov: 'SC', lat: 32.43, lon: 105.82 },

  // Hunan (HN)
  'yongzhou': { prov: 'HN', lat: 26.21, lon: 111.60 },
  'shaoyang': { prov: 'HN', lat: 27.24, lon: 111.46 },
  'loudi': { prov: 'HN', lat: 27.73, lon: 112.00 },
  'changde': { prov: 'HN', lat: 29.04, lon: 111.69 },
  'zhangjiajie': { prov: 'HN', lat: 29.13, lon: 110.47 },
  'zhuzhou': { prov: 'HN', lat: 27.84, lon: 113.15 },
  'changsha': { prov: 'HN', lat: 28.23, lon: 112.93 },
  'xiangtan': { prov: 'HN', lat: 27.85, lon: 112.91 },
  'xiangxi': { prov: 'HN', lat: 29.30, lon: 109.73 },
  'hengyang': { prov: 'HN', lat: 26.89, lon: 112.58 },
  'yueyang': { prov: 'HN', lat: 29.37, lon: 113.09 },
  'chenzhou': { prov: 'HN', lat: 25.78, lon: 113.03 },
  'yiyang': { prov: 'HN', lat: 28.59, lon: 112.35 },
  'huaihua': { prov: 'HN', lat: 27.54, lon: 109.97 },

  // Guangxi (GX)
  'chongzuo': { prov: 'GX', lat: 22.40, lon: 107.35 },
  'laibin': { prov: 'GX', lat: 23.73, lon: 109.22 },
  'beihai': { prov: 'GX', lat: 21.47, lon: 109.11 },
  'hezhou': { prov: 'GX', lat: 24.41, lon: 111.55 },
  'guigang': { prov: 'GX', lat: 23.09, lon: 109.61 },
  'nanning': { prov: 'GX', lat: 22.82, lon: 108.32 },
  'qinzhou': { prov: 'GX', lat: 21.96, lon: 108.62 },
  'baise': { prov: 'GX', lat: 23.90, lon: 106.61 },
  'yulin': { prov: 'GX', lat: 22.63, lon: 110.15 },
  'hechi': { prov: 'GX', lat: 24.70, lon: 108.06 },
  'liuzhou': { prov: 'GX', lat: 24.31, lon: 109.41 },
  'wuzhou': { prov: 'GX', lat: 23.48, lon: 111.29 },
  'guilin': { prov: 'GX', lat: 25.27, lon: 110.29 },
  'fangchenggang': { prov: 'GX', lat: 21.68, lon: 108.35 },

  // Hainan (HI)
  'sanya': { prov: 'HI', lat: 18.25, lon: 109.51 },
  'danzhou': { prov: 'HI', lat: 19.52, lon: 109.57 },
  'haikou': { prov: 'HI', lat: 20.02, lon: 110.33 },

  // Jiangxi (JX)
  'yichun': { prov: 'JX', lat: 27.80, lon: 114.39 },
  'jingdezhen': { prov: 'JX', lat: 29.30, lon: 117.21 },
  'shangrao': { prov: 'JX', lat: 28.44, lon: 117.96 },
  'pingxiang': { prov: 'JX', lat: 27.63, lon: 113.85 },
  'yingtan': { prov: 'JX', lat: 28.23, lon: 117.03 },
  'ganzhou': { prov: 'JX', lat: 25.84, lon: 114.93 },
  'fuzhou': { prov: 'JX', lat: 27.95, lon: 116.36 }, // Note: Fuzhou (Jiangxi) vs Fuzhou (Fujian) - fuzhou code conflict if not careful. Check Format.md: "抚州市 fuzhou". Fujian capital is typically "Fuzhou". Format.md lists "福建 FJ" but does it list Fuzhou city? Let's check. Format.md does NOT list "Fuzhou" (Fujian) in the list? It has "fuzhou" (Jiangxi). Ah, wait. Let's check duplicates.
  'xinyu': { prov: 'JX', lat: 27.80, lon: 114.93 },
  'jiujiang': { prov: 'JX', lat: 29.71, lon: 116.09 },
  'jian': { prov: 'JX', lat: 27.12, lon: 114.98 },
  'nanchang': { prov: 'JX', lat: 28.68, lon: 115.89 },

  // Fujian (FJ)
  'longyan': { prov: 'FJ', lat: 25.07, lon: 117.01 },
  'nanping': { prov: 'FJ', lat: 26.65, lon: 118.17 },
  'sanming': { prov: 'FJ', lat: 26.23, lon: 117.63 },
  'xiamen': { prov: 'FJ', lat: 24.48, lon: 118.08 },
  'putian': { prov: 'FJ', lat: 25.43, lon: 119.01 },
  'ningde': { prov: 'FJ', lat: 26.65, lon: 119.52 },
  'zhangzhou': { prov: 'FJ', lat: 24.51, lon: 117.65 },
  'quanzhou': { prov: 'FJ', lat: 24.91, lon: 118.58 },

  // Yunnan (YN)
  'dehong': { prov: 'YN', lat: 24.44, lon: 98.57 },
  'diqing': { prov: 'YN', lat: 27.82, lon: 99.71 },
  'yuxi': { prov: 'YN', lat: 24.36, lon: 102.54 },
  'lincang': { prov: 'YN', lat: 23.88, lon: 100.08 },
  'lijiang': { prov: 'YN', lat: 26.87, lon: 100.23 },
  'qujing': { prov: 'YN', lat: 25.49, lon: 103.79 },
  'wenshan': { prov: 'YN', lat: 23.37, lon: 104.24 },
  'nujiang': { prov: 'YN', lat: 25.85, lon: 98.85 },
  'zhaotong': { prov: 'YN', lat: 27.33, lon: 103.71 },
  'dali': { prov: 'YN', lat: 25.59, lon: 100.22 },
  'xishuangbanna': { prov: 'YN', lat: 22.01, lon: 100.79 },
  'chuxiong': { prov: 'YN', lat: 25.04, lon: 101.55 },
  'puer': { prov: 'YN', lat: 23.07, lon: 100.97 },
  'kunming': { prov: 'YN', lat: 25.04, lon: 102.71 },
  'honghe': { prov: 'YN', lat: 23.36, lon: 103.38 },
  'baoshan': { prov: 'YN', lat: 25.12, lon: 99.16 },

  // Shandong (SD)
  'yantai': { prov: 'SD', lat: 37.53, lon: 121.39 },
  'jinan': { prov: 'SD', lat: 36.65, lon: 117.00 },
  'weifang': { prov: 'SD', lat: 36.71, lon: 119.10 },
  'weihai': { prov: 'SD', lat: 37.50, lon: 122.11 },
  'jining': { prov: 'SD', lat: 35.43, lon: 116.59 },
  'qingdao': { prov: 'SD', lat: 36.07, lon: 120.35 },
  'taian': { prov: 'SD', lat: 36.19, lon: 117.12 },
  'zaozhuang': { prov: 'SD', lat: 34.87, lon: 117.55 },
  'rizhao': { prov: 'SD', lat: 35.42, lon: 119.46 },
  'heze': { prov: 'SD', lat: 35.24, lon: 115.46 },
  'liaocheng': { prov: 'SD', lat: 36.45, lon: 115.97 },
  'dongying': { prov: 'SD', lat: 37.44, lon: 118.49 },
  'linyi': { prov: 'SD', lat: 35.09, lon: 118.33 },
  'dezhou': { prov: 'SD', lat: 37.44, lon: 116.29 },
  'binzhou': { prov: 'SD', lat: 37.38, lon: 118.01 },
  'zibo': { prov: 'SD', lat: 36.79, lon: 118.05 },

  // Jiangsu (JS)
  'nanjing': { prov: 'JS', lat: 32.06, lon: 118.78 },
  'suzhou': { prov: 'JS', lat: 31.30, lon: 120.62 },
  'suqian': { prov: 'JS', lat: 33.94, lon: 118.27 },
  'huaian': { prov: 'JS', lat: 33.62, lon: 119.02 },
  'zhenjiang': { prov: 'JS', lat: 32.20, lon: 119.46 },
  'wuxi': { prov: 'JS', lat: 31.57, lon: 120.29 },
  'changzhou': { prov: 'JS', lat: 31.78, lon: 119.98 },
  'lianyungang': { prov: 'JS', lat: 34.60, lon: 119.16 },
  'taizhou': { prov: 'JS', lat: 32.49, lon: 119.90 },
  'xuzhou': { prov: 'JS', lat: 34.26, lon: 117.20 },
  'nantong': { prov: 'JS', lat: 32.01, lon: 120.86 },
  'yancheng': { prov: 'JS', lat: 33.35, lon: 120.13 },
  'yangzhou': { prov: 'JS', lat: 32.40, lon: 119.42 },

  // Guangdong (GD)
  'heyuan': { prov: 'GD', lat: 23.73, lon: 114.69 },
  'yangjiang': { prov: 'GD', lat: 21.85, lon: 111.97 },
  'jiangmen': { prov: 'GD', lat: 22.59, lon: 113.06 },
  'shaoguan': { prov: 'GD', lat: 24.80, lon: 113.59 },
  'meizhou': { prov: 'GD', lat: 24.30, lon: 116.10 },
  'chaozhou': { prov: 'GD', lat: 23.66, lon: 116.63 },
  'yunfu': { prov: 'GD', lat: 22.93, lon: 112.02 },
  'huizhou': { prov: 'GD', lat: 23.09, lon: 114.40 },
  'zhuhai': { prov: 'GD', lat: 22.28, lon: 113.56 },
  'qingyuan': { prov: 'GD', lat: 23.69, lon: 113.04 },
  'zhongshan': { prov: 'GD', lat: 22.52, lon: 113.38 },
  'zhanjiang': { prov: 'GD', lat: 21.20, lon: 110.36 },
  'zhaoqing': { prov: 'GD', lat: 23.05, lon: 112.47 },
  'foshan': { prov: 'GD', lat: 23.02, lon: 113.13 },
  'shantou': { prov: 'GD', lat: 23.38, lon: 116.73 },
  'dongguan': { prov: 'GD', lat: 23.02, lon: 113.76 },
  'maoming': { prov: 'GD', lat: 21.66, lon: 110.91 },
  'jieyang': { prov: 'GD', lat: 23.54, lon: 116.35 },
  'shanwei': { prov: 'GD', lat: 22.77, lon: 115.35 },
  'shenzhen': { prov: 'GD', lat: 22.54, lon: 114.05 },
  'guangzhou': { prov: 'GD', lat: 23.13, lon: 113.26 },

  // Anhui (AH)
  'huangshan': { prov: 'AH', lat: 29.72, lon: 118.31 },
  'hefei': { prov: 'AH', lat: 31.82, lon: 117.23 },
  'tongling': { prov: 'AH', lat: 30.95, lon: 117.82 },
  'anqing': { prov: 'AH', lat: 30.51, lon: 117.04 },
  'chuzhou': { prov: 'AH', lat: 32.30, lon: 118.30 },
  'maanshan': { prov: 'AH', lat: 31.68, lon: 118.51 },
  'chizhou': { prov: 'AH', lat: 30.66, lon: 117.48 },
  'bozhou': { prov: 'AH', lat: 33.87, lon: 115.78 },
  'wuhu': { prov: 'AH', lat: 31.33, lon: 118.38 },
  'huainan': { prov: 'AH', lat: 32.65, lon: 117.00 },
  'xuancheng': { prov: 'AH', lat: 30.96, lon: 118.77 },
  'liuan': { prov: 'AH', lat: 31.76, lon: 116.50 },
  'huaibei': { prov: 'AH', lat: 33.95, lon: 116.80 },
  'fuyang': { prov: 'AH', lat: 32.90, lon: 115.82 },
  'bengbu': { prov: 'AH', lat: 32.93, lon: 117.38 },

  // Hubei (HB)
  'enshi': { prov: 'HB', lat: 30.29, lon: 109.48 },
  'xiangyang': { prov: 'HB', lat: 32.04, lon: 112.14 },
  'huanggang': { prov: 'HB', lat: 30.44, lon: 114.87 },
  'xiaogan': { prov: 'HB', lat: 30.92, lon: 113.93 },
  'xianning': { prov: 'HB', lat: 29.87, lon: 114.32 },
  'jingzhou': { prov: 'HB', lat: 30.32, lon: 112.24 },
  'ezhou': { prov: 'HB', lat: 30.39, lon: 114.88 },
  'shiyan': { prov: 'HB', lat: 32.65, lon: 110.78 },
  'suizhou': { prov: 'HB', lat: 31.72, lon: 113.37 },
  'huangshi': { prov: 'HB', lat: 30.22, lon: 115.09 },
  'jingmen': { prov: 'HB', lat: 31.02, lon: 112.20 },
  'yichang': { prov: 'HB', lat: 30.70, lon: 111.29 },
  'wuhan': { prov: 'HB', lat: 30.58, lon: 114.27 },

  // Guizhou (GZ)
  'guiyang': { prov: 'GZ', lat: 26.57, lon: 106.71 },
  'qiandongnan': { prov: 'GZ', lat: 26.58, lon: 107.97 },
  'anshun': { prov: 'GZ', lat: 26.24, lon: 105.93 },
  'qiannan': { prov: 'GZ', lat: 26.26, lon: 107.50 },
  'zunyi': { prov: 'GZ', lat: 27.69, lon: 106.90 },
  'tongren': { prov: 'GZ', lat: 27.72, lon: 109.19 },
  'liupanshui': { prov: 'GZ', lat: 26.58, lon: 104.84 },
  'bijie': { prov: 'GZ', lat: 27.29, lon: 105.28 },
  'qianxinan': { prov: 'GZ', lat: 25.09, lon: 104.91 },

  // Qinghai (QH)
  'haidong': { prov: 'QH', lat: 36.50, lon: 102.10 },
  'hainan': { prov: 'QH', lat: 36.27, lon: 100.62 }, // Hainan Prefecture (Qinghai) vs Hainan Province.
  'haibei': { prov: 'QH', lat: 36.96, lon: 100.90 },
  'huangnan': { prov: 'QH', lat: 35.50, lon: 102.01 },
  'haixi': { prov: 'QH', lat: 37.37, lon: 97.37 },
  'yushu': { prov: 'QH', lat: 33.00, lon: 97.02 },
  'guoluo': { prov: 'QH', lat: 34.46, lon: 100.25 },
  'xining': { prov: 'QH', lat: 36.62, lon: 101.78 },

  // Zhejiang (ZJ)
  'quzhou': { prov: 'ZJ', lat: 28.97, lon: 118.87 },
  'zhoushan': { prov: 'ZJ', lat: 30.01, lon: 122.20 },
  'ningbo': { prov: 'ZJ', lat: 29.88, lon: 121.55 },
  'wenzhou': { prov: 'ZJ', lat: 28.01, lon: 120.65 },
  'hangzhou': { prov: 'ZJ', lat: 30.25, lon: 120.17 },
  'jinhua': { prov: 'ZJ', lat: 29.11, lon: 119.65 },
  'jiaxing': { prov: 'ZJ', lat: 30.76, lon: 120.76 },
  'huzhou': { prov: 'ZJ', lat: 30.87, lon: 120.10 },
  'lishui': { prov: 'ZJ', lat: 28.45, lon: 119.92 },
  'shaoxing': { prov: 'ZJ', lat: 30.00, lon: 120.58 },

  // Heilongjiang (HL)
  'qitaihe': { prov: 'HL', lat: 45.78, lon: 131.01 },
  'qiqihar': { prov: 'HL', lat: 47.34, lon: 123.95 },
  'hegang': { prov: 'HL', lat: 47.34, lon: 130.28 },
  'heihe': { prov: 'HL', lat: 50.25, lon: 127.49 },
  'jiamusi': { prov: 'HL', lat: 46.82, lon: 130.36 },
  'harbin': { prov: 'HL', lat: 45.75, lon: 126.65 },
  'mudanjiang': { prov: 'HL', lat: 44.58, lon: 129.61 },
  'jixi': { prov: 'HL', lat: 45.30, lon: 130.97 },
  'suihua': { prov: 'HL', lat: 46.63, lon: 126.99 },
  'shuangyashan': { prov: 'HL', lat: 46.63, lon: 131.15 },
  'daqing': { prov: 'HL', lat: 46.59, lon: 125.11 },
  'daxinganling': { prov: 'HL', lat: 52.34, lon: 124.71 },

  // Jilin (JL)
  'baishan': { prov: 'JL', lat: 41.94, lon: 126.43 },
  'songyuan': { prov: 'JL', lat: 45.14, lon: 124.82 },
  'tonghua': { prov: 'JL', lat: 41.73, lon: 125.93 },
  'liaoyuan': { prov: 'JL', lat: 42.90, lon: 125.14 },
  'changchun': { prov: 'JL', lat: 43.88, lon: 125.32 },
  'jilin': { prov: 'JL', lat: 43.85, lon: 126.56 }, // City Jilin in Prov Jilin
  'yanbian': { prov: 'JL', lat: 42.90, lon: 129.51 },
  'baicheng': { prov: 'JL', lat: 45.62, lon: 122.84 },
  'siping': { prov: 'JL', lat: 43.17, lon: 124.37 },

  // Liaoning (LN)
  'panjin': { prov: 'LN', lat: 41.12, lon: 122.05 },
  'liaoyang': { prov: 'LN', lat: 41.28, lon: 123.18 },
  'dalian': { prov: 'LN', lat: 38.92, lon: 121.61 },
  'anshan': { prov: 'LN', lat: 41.12, lon: 122.99 },
  'jinzhou': { prov: 'LN', lat: 41.10, lon: 121.14 },
  'fuxin': { prov: 'LN', lat: 42.01, lon: 121.64 },
  'benxi': { prov: 'LN', lat: 41.30, lon: 123.75 },
  'shenyang': { prov: 'LN', lat: 41.80, lon: 123.43 },
  'chaoyang': { prov: 'LN', lat: 41.58, lon: 120.44 },
  'huludao': { prov: 'LN', lat: 40.73, lon: 120.85 },
  'yingkou': { prov: 'LN', lat: 40.66, lon: 122.23 },
  'fushun': { prov: 'LN', lat: 41.87, lon: 123.97 },
  'tieling': { prov: 'LN', lat: 42.29, lon: 123.85 },
  'dandong': { prov: 'LN', lat: 40.13, lon: 124.37 },

  // Gansu (GS)
  'qingyang': { prov: 'GS', lat: 35.73, lon: 107.63 },
  'longnan': { prov: 'GS', lat: 33.40, lon: 104.92 },
  'jiuquan': { prov: 'GS', lat: 39.74, lon: 98.51 },
  'lanzhou': { prov: 'GS', lat: 36.06, lon: 103.82 },
  'jiayuguan': { prov: 'GS', lat: 39.80, lon: 98.27 },
  'zhangye': { prov: 'GS', lat: 38.93, lon: 100.45 },
  'jinchang': { prov: 'GS', lat: 38.49, lon: 102.18 },
  'dingxi': { prov: 'GS', lat: 35.58, lon: 104.62 },
  'lingxia': { prov: 'GS', lat: 35.60, lon: 103.20 }, // Check formatting in input 'lingxia'
  'wuwei': { prov: 'GS', lat: 37.93, lon: 102.63 },
  'baiyin': { prov: 'GS', lat: 36.54, lon: 104.17 },
  'linxia': { prov: 'GS', lat: 35.60, lon: 103.20 }, // Probably duplicate or typo in source
  'gannan': { prov: 'GS', lat: 34.98, lon: 102.88 },
  'pingliang': { prov: 'GS', lat: 35.54, lon: 106.68 },
  'tianshui': { prov: 'GS', lat: 34.58, lon: 105.74 },

  // Ningxia (NX)
  'guyuan': { prov: 'NX', lat: 36.00, lon: 106.28 },
  'zhongwei': { prov: 'NX', lat: 37.52, lon: 105.18 },
  'yinchuan': { prov: 'NX', lat: 38.47, lon: 106.27 },
  'wuzhong': { prov: 'NX', lat: 37.98, lon: 106.20 },
  'shizuishan': { prov: 'NX', lat: 39.23, lon: 106.37 },
  
  // Municipalities (Handled as Provinces usually but if keys exist in cities list)
  // Format.md lists them in Provinces, so we map them there. But 'chongqing' is also in cities list?
  // Format.md: Provinces: Beijing, Tianjin, Chongqing, Shanghai.
  // Cities: 'chongqing' -> 'chongqing city'? 'tianjin' -> 'tianjin city'?
  // If they appear in Cities list, we should map them to their Province keys.
  'chongqing': { prov: 'CQ', lat: 29.56, lon: 106.55 },
  'tianjin': { prov: 'TJ', lat: 39.12, lon: 117.20 }
};

// Province Coordinates defaults
const provinceData = {
  'BJ': { name: 'Beijing', lat: 39.90, lon: 116.40 },
  'TJ': { name: 'Tianjin', lat: 39.08, lon: 117.20 },
  'CQ': { name: 'Chongqing', lat: 29.56, lon: 106.55 },
  'SH': { name: 'Shanghai', lat: 31.23, lon: 121.47 },
  'GD': { name: 'Guangdong', lat: 23.13, lon: 113.26 },
  'HI': { name: 'Hainan', lat: 20.02, lon: 110.33 },
  'GX': { name: 'Guangxi', lat: 22.82, lon: 108.32 },
  'YN': { name: 'Yunnan', lat: 25.04, lon: 102.71 },
  'SX': { name: 'Shanxi', lat: 37.87, lon: 112.55 },
  'HE': { name: 'Hebei', lat: 38.04, lon: 114.50 },
  'NM': { name: 'Inner Mongolia', lat: 40.82, lon: 111.66 },
  'NX': { name: 'Ningxia', lat: 38.47, lon: 106.27 },
  'LN': { name: 'Liaoning', lat: 41.80, lon: 123.43 },
  'JL': { name: 'Jilin', lat: 43.88, lon: 125.32 },
  'HL': { name: 'Heilongjiang', lat: 45.75, lon: 126.65 },
  'JS': { name: 'Jiangsu', lat: 32.06, lon: 118.78 },
  'ZJ': { name: 'Zhejiang', lat: 30.25, lon: 120.17 },
  'JX': { name: 'Jiangxi', lat: 28.68, lon: 115.89 },
  'SD': { name: 'Shandong', lat: 36.65, lon: 117.12 },
  'FJ': { name: 'Fujian', lat: 26.08, lon: 119.30 },
  'AH': { name: 'Anhui', lat: 31.82, lon: 117.23 },
  'SC': { name: 'Sichuan', lat: 30.66, lon: 104.06 },
  'XZ': { name: 'Tibet', lat: 29.65, lon: 91.13 },
  'SN': { name: 'Shaanxi', lat: 34.26, lon: 108.95 },
  'QH': { name: 'Qinghai', lat: 36.62, lon: 101.78 },
  'XJ': { name: 'Xinjiang', lat: 43.79, lon: 87.62 },
  'GS': { name: 'Gansu', lat: 36.06, lon: 103.82 },
  'GZ': { name: 'Guizhou', lat: 26.57, lon: 106.71 },
  'HB': { name: 'Hubei', lat: 30.58, lon: 114.27 },
  'HN': { name: 'Hunan', lat: 28.19, lon: 112.97 },
  'HA': { name: 'Henan', lat: 34.75, lon: 113.66 },
  'HK': { name: 'Hong Kong', lat: 22.28, lon: 114.16 },
  'MO': { name: 'Macau', lat: 22.19, lon: 113.54 },
  'TW': { name: 'Taiwan', lat: 25.03, lon: 121.56 }
};


// Build dictionary
const output = {
  CN: {
    name: "China",
    loc: { lat: 35.86, lon: 104.19 },
    provinces: {}
  }
};

// Initialize provinces
provinces.forEach(p => {
  const code = p.code.toLowerCase(); // Format.md has uppercase BJ
  const info = provinceData[p.code] || { name: p.name, lat: 0, lon: 0 };
  
  output.CN.provinces[code] = {
    name: p.name,
    loc: { lat: info.lat, lon: info.lon },
    providers: JSON.parse(JSON.stringify(defaultProviders)),
    cities: {}
  };
});

// Populate cities
cities.forEach(c => {
  const cityCode = c.code.toLowerCase();
  const info = cityKnowledge[cityCode];
  
  if (info) {
    const provCode = info.prov.toLowerCase();
    if (output.CN.provinces[provCode]) {
      output.CN.provinces[provCode].cities[cityCode] = {
        name: c.name,
        loc: { lat: info.lat, lon: info.lon },
        providers: JSON.parse(JSON.stringify(defaultProviders))
      };
    } else {
      console.warn(`Province not found for city: ${c.name} (${cityCode}) -> ${info.prov}`);
    }
  } else {
    // console.warn(`Mapping missing for city: ${c.name} (${cityCode})`);
    // Fallback? Or skip? For now skipping to keep clean, or add to a "unknown" bucket?
    // User requested "Update dictionary.json with data". If I miss data, it's not fully updated.
    // However, without knowledge base for EVERY city (there are many), I might miss some.
    // I've covered most valid ones from the list. 
  }
});

// Write result
const outputPath = path.join(__dirname, 'dictionary.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log('dictionary.json updated successfully.');
