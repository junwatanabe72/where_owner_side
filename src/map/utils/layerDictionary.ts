// 高度地区の辞書
export const koudoDictionary = {
  TUP5F1: {
    name: "高度地区種別",
    values: {
      1: "第一種高度地区",
      2: "第二種高度地区",
      3: "第三種高度地区",
      4: "なし",
    } as Record<number, string>,
  },
  TUP5F3: {
    name: "最低限高度",
    unit: "m",
  },
  TUP5F4: {
    name: "最高限高度",
    unit: "m",
  },
  AREA: {
    name: "面積",
    unit: "㎡",
  },
};

// 防火地域の辞書
export const boukaDictionary = {
  TUP5M1: {
    name: "防火地域",
    values: {
      0: "なし",
      1: "防火地域",
      2: "準防火地域",
      3: "防火・準防火地域",
    } as Record<number, string>,
  },
  TUP5M2: {
    name: "22条地域",
    values: {
      0: "なし",
      1: "22条地域",
    } as Record<number, string>,
  },
  TUP6F1: {
    name: "防火地域",
    values: {
      10: "防火地域",
      20: "準防火地域",
    } as Record<number, string>,
  },
  AREA: {
    name: "面積",
    unit: "㎡",
  },
};

// 用途地域の辞書
export const youtoDictionary = {
  youto: {
    name: "用途地域",
    values: {
      0: "用途地域の指定をしない区域",
      1: "第1種低層住居専用地域",
      2: "第2種低層住居専用地域",
      3: "第1種中高層住居専用地域",
      4: "第2種中高層住居専用地域",
      5: "第1種住居地域",
      6: "第2種住居地域",
      7: "準住居地域",
      8: "田園住居地域",
      9: "近隣商業地域",
      10: "商業地域",
      11: "準工業地域",
      12: "工業地域",
      13: "工業専用地域",
    } as Record<number, string>,
  },
  yoseki: {
    name: "容積率",
    unit: "%",
  },
  kenpei: {
    name: "建蔽率",
    unit: "%",
  },
  A01_001: {
    name: "用途地域コード",
  },
  A01_002: {
    name: "区分",
  },
  A01_003: {
    name: "建蔽率",
    unit: "%",
  },
  A01_004: {
    name: "容積率",
    unit: "%",
  },
  A29_005: {
    name: "用途地域",
  },
  A29_006: {
    name: "建蔽率",
    unit: "%",
  },
  A29_007: {
    name: "容積率",
    unit: "%",
  },
  AREA: {
    name: "面積",
    unit: "㎡",
  },
};

// 建物高度の辞書
export const heightDictionary = {
  height: {
    name: "建物高さ",
    unit: "m",
  },
  floors: {
    name: "階数",
    unit: "階",
  },
  type: {
    name: "建物種別",
  },
  AREA: {
    name: "面積",
    unit: "㎡",
  },
};

// プロパティを日本語に変換する関数
export const translateProperty = (
  layerId: string,
  properties: any
): string => {
  let result = "";

  // レイヤーIDから辞書を選択
  let dictionary: any = null;
  if (layerId.includes("koudo")) {
    dictionary = koudoDictionary;
  } else if (layerId.includes("bouka")) {
    dictionary = boukaDictionary;
  } else if (layerId.includes("youto")) {
    dictionary = youtoDictionary;
  } else if (layerId.includes("building") || layerId.includes("height")) {
    dictionary = heightDictionary;
  }

  if (!dictionary) {
    // 辞書がない場合は生データを表示
    return JSON.stringify(properties, null, 2);
  }

  // プロパティを日本語に変換
  for (const [key, value] of Object.entries(properties)) {
    if (dictionary[key]) {
      const dictEntry = dictionary[key];
      let displayValue = value;

      // 値の変換がある場合
      if (dictEntry.values && dictEntry.values[value as number]) {
        displayValue = dictEntry.values[value as number];
      }

      // 単位がある場合
      if (dictEntry.unit && typeof value === "number") {
        displayValue = `${value}${dictEntry.unit}`;
      }

      result += `${dictEntry.name}: ${displayValue}\n`;
    }
  }

  return result || JSON.stringify(properties, null, 2);
};

// HTMLフォーマットで返す関数（改善版）
export const translatePropertyToHTML = (
  layerId: string,
  properties: any
): string => {
  // スタイルを定義
  const containerStyle = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    max-width: 320px;
  `;
  
  const headerStyle = `
    margin: 0 0 12px 0;
    padding: 8px 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 15px;
    font-weight: 600;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  
  const contentStyle = `
    padding: 0 4px;
  `;
  
  const rowStyle = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 8px;
    margin: 4px 0;
    background: #f8f9fa;
    border-radius: 4px;
    border-left: 3px solid #667eea;
  `;
  
  const labelStyle = `
    font-weight: 500;
    color: #495057;
    font-size: 13px;
  `;
  
  const valueStyle = `
    font-weight: 600;
    color: #212529;
    font-size: 14px;
  `;

  // アイコンを取得
  const getIcon = () => {
    if (layerId.includes("koudo")) return "📐";
    if (layerId.includes("bouka")) return "🔥";
    if (layerId.includes("youto")) return "🏘️";
    if (layerId.includes("building") || layerId.includes("height")) return "🏢";
    return "📍";
  };

  let result = `<div style="${containerStyle}">`;
  result += `<div style="${headerStyle}">${getIcon()} ${getLayerTitle(layerId)}</div>`;
  result += `<div style="${contentStyle}">`;

  // レイヤーIDから辞書を選択
  if (layerId.includes("koudo")) {
    result += formatKoudoPropertiesStyled(properties, rowStyle, labelStyle, valueStyle);
  } else if (layerId.includes("bouka")) {
    result += formatBoukaPropertiesStyled(properties, rowStyle, labelStyle, valueStyle);
  } else if (layerId.includes("youto")) {
    result += formatYoutoPropertiesStyled(properties, rowStyle, labelStyle, valueStyle);
  } else if (layerId.includes("building") || layerId.includes("height")) {
    result += formatHeightPropertiesStyled(properties, rowStyle, labelStyle, valueStyle);
  } else {
    // その他のレイヤーの場合、主要なプロパティのみ表示
    result += formatGenericProperties(properties, rowStyle, labelStyle, valueStyle);
  }

  result += `</div></div>`;
  return result;
};

// レイヤータイトルを取得
const getLayerTitle = (layerId: string): string => {
  if (layerId.includes("koudo")) return "高度地区";
  if (layerId.includes("bouka")) return "防火指定";
  if (layerId.includes("youto")) return "用途地域";
  if (layerId.includes("building") || layerId.includes("height")) return "建物高度";
  return layerId;
};

// 高度地区のプロパティをフォーマット
const formatKoudoProperties = (properties: any): string => {
  let result = "";
  if (properties.TUP5F1 !== undefined) {
    const koudoType = (koudoDictionary.TUP5F1.values as any)[properties.TUP5F1] || `タイプ${properties.TUP5F1}`;
    result += `<div><strong>種別:</strong> ${koudoType}</div>`;
  }
  if (properties.TUP5F3 !== undefined && properties.TUP5F3 > 0) {
    result += `<div><strong>最低限高度:</strong> ${properties.TUP5F3}m</div>`;
  }
  if (properties.TUP5F4 !== undefined && properties.TUP5F4 > 0) {
    result += `<div><strong>最高限高度:</strong> ${properties.TUP5F4}m</div>`;
  }
  if (properties.AREA !== undefined) {
    result += `<div><strong>面積:</strong> ${properties.AREA.toFixed(2)}㎡</div>`;
  }
  return result;
};

// 防火地域のプロパティをフォーマット
const formatBoukaProperties = (properties: any): string => {
  let result = "";
  if (properties.TUP5M1 !== undefined) {
    const boukaType = (boukaDictionary.TUP5M1.values as any)[properties.TUP5M1] || `タイプ${properties.TUP5M1}`;
    result += `<div><strong>防火地域:</strong> ${boukaType}</div>`;
  }
  if (properties.TUP5M2 !== undefined) {
    const type22 = (boukaDictionary.TUP5M2.values as any)[properties.TUP5M2] || `タイプ${properties.TUP5M2}`;
    result += `<div><strong>22条地域:</strong> ${type22}</div>`;
  }
  if (properties.AREA !== undefined) {
    result += `<div><strong>面積:</strong> ${properties.AREA.toFixed(2)}㎡</div>`;
  }
  return result;
};

// 用途地域のプロパティをフォーマット
const formatYoutoProperties = (properties: any): string => {
  let result = "";
  if (properties.youto !== undefined) {
    const youtoType = (youtoDictionary.youto.values as any)[properties.youto] || `タイプ${properties.youto}`;
    result += `<div><strong>用途地域:</strong> ${youtoType}</div>`;
  }
  if (properties.A01_001 !== undefined) {
    const youtoType = (youtoDictionary.youto.values as any)[properties.A01_001] || `タイプ${properties.A01_001}`;
    result += `<div><strong>用途地域:</strong> ${youtoType}</div>`;
  }
  if (properties.yoseki !== undefined) {
    result += `<div><strong>容積率:</strong> ${properties.yoseki}%</div>`;
  }
  if (properties.A01_004 !== undefined) {
    result += `<div><strong>容積率:</strong> ${properties.A01_004}%</div>`;
  }
  if (properties.kenpei !== undefined) {
    result += `<div><strong>建蔽率:</strong> ${properties.kenpei}%</div>`;
  }
  if (properties.A01_003 !== undefined) {
    result += `<div><strong>建蔽率:</strong> ${properties.A01_003}%</div>`;
  }
  if (properties.AREA !== undefined) {
    result += `<div><strong>面積:</strong> ${properties.AREA.toFixed(2)}㎡</div>`;
  }
  return result;
};

// 建物高度のプロパティをフォーマット
const formatHeightProperties = (properties: any): string => {
  let result = "";
  if (properties.height !== undefined) {
    result += `<div><strong>建物高さ:</strong> ${properties.height}m</div>`;
  }
  if (properties.floors !== undefined) {
    result += `<div><strong>階数:</strong> ${properties.floors}階</div>`;
  }
  if (properties.type !== undefined) {
    result += `<div><strong>建物種別:</strong> ${properties.type}</div>`;
  }
  if (properties.AREA !== undefined) {
    result += `<div><strong>面積:</strong> ${properties.AREA.toFixed(2)}㎡</div>`;
  }
  return result;
};

// スタイル付きフォーマット関数
const formatKoudoPropertiesStyled = (properties: any, rowStyle: string, labelStyle: string, valueStyle: string): string => {
  let result = "";
  if (properties.TUP5F1 !== undefined) {
    const koudoType = (koudoDictionary.TUP5F1.values as any)[properties.TUP5F1] || `タイプ${properties.TUP5F1}`;
    result += `<div style="${rowStyle}"><span style="${labelStyle}">種別</span><span style="${valueStyle}">${koudoType}</span></div>`;
  }
  if (properties.TUP5F3 !== undefined && properties.TUP5F3 > 0) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">最低限高度</span><span style="${valueStyle}">${properties.TUP5F3}m</span></div>`;
  }
  if (properties.TUP5F4 !== undefined && properties.TUP5F4 > 0) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">最高限高度</span><span style="${valueStyle}">${properties.TUP5F4}m</span></div>`;
  }
  if (properties.AREA !== undefined) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">面積</span><span style="${valueStyle}">${properties.AREA.toFixed(0).toLocaleString()}㎡</span></div>`;
  }
  return result;
};

const formatBoukaPropertiesStyled = (properties: any, rowStyle: string, labelStyle: string, valueStyle: string): string => {
  let result = "";
  if (properties.TUP5M1 !== undefined) {
    const boukaType = (boukaDictionary.TUP5M1.values as any)[properties.TUP5M1] || `タイプ${properties.TUP5M1}`;
    result += `<div style="${rowStyle}"><span style="${labelStyle}">防火地域</span><span style="${valueStyle}">${boukaType}</span></div>`;
  }
  if (properties.TUP5M2 !== undefined && properties.TUP5M2 !== 0) {
    const type22 = (boukaDictionary.TUP5M2.values as any)[properties.TUP5M2] || `タイプ${properties.TUP5M2}`;
    result += `<div style="${rowStyle}"><span style="${labelStyle}">22条地域</span><span style="${valueStyle}">${type22}</span></div>`;
  }
  if (properties.AREA !== undefined) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">面積</span><span style="${valueStyle}">${properties.AREA.toFixed(0).toLocaleString()}㎡</span></div>`;
  }
  return result;
};

const formatYoutoPropertiesStyled = (properties: any, rowStyle: string, labelStyle: string, valueStyle: string): string => {
  let result = "";
  if (properties.youto !== undefined) {
    const youtoType = (youtoDictionary.youto.values as any)[properties.youto] || `タイプ${properties.youto}`;
    result += `<div style="${rowStyle}"><span style="${labelStyle}">用途地域</span><span style="${valueStyle}">${youtoType}</span></div>`;
  } else if (properties.A01_001 !== undefined) {
    const youtoType = (youtoDictionary.youto.values as any)[properties.A01_001] || `タイプ${properties.A01_001}`;
    result += `<div style="${rowStyle}"><span style="${labelStyle}">用途地域</span><span style="${valueStyle}">${youtoType}</span></div>`;
  }
  
  if (properties.yoseki !== undefined) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">容積率</span><span style="${valueStyle}">${properties.yoseki}%</span></div>`;
  } else if (properties.A01_004 !== undefined) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">容積率</span><span style="${valueStyle}">${properties.A01_004}%</span></div>`;
  }
  
  if (properties.kenpei !== undefined) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">建蔽率</span><span style="${valueStyle}">${properties.kenpei}%</span></div>`;
  } else if (properties.A01_003 !== undefined) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">建蔽率</span><span style="${valueStyle}">${properties.A01_003}%</span></div>`;
  }
  
  if (properties.AREA !== undefined) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">面積</span><span style="${valueStyle}">${properties.AREA.toFixed(0).toLocaleString()}㎡</span></div>`;
  }
  return result;
};

const formatHeightPropertiesStyled = (properties: any, rowStyle: string, labelStyle: string, valueStyle: string): string => {
  let result = "";
  if (properties.height !== undefined) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">建物高さ</span><span style="${valueStyle}">${properties.height}m</span></div>`;
  }
  if (properties.floors !== undefined) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">階数</span><span style="${valueStyle}">${properties.floors}階</span></div>`;
  }
  if (properties.type !== undefined) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">建物種別</span><span style="${valueStyle}">${properties.type}</span></div>`;
  }
  if (properties.AREA !== undefined) {
    result += `<div style="${rowStyle}"><span style="${labelStyle}">面積</span><span style="${valueStyle}">${properties.AREA.toFixed(0).toLocaleString()}㎡</span></div>`;
  }
  return result;
};

const formatGenericProperties = (properties: any, rowStyle: string, labelStyle: string, valueStyle: string): string => {
  let result = "";
  const importantKeys = ['name', 'type', 'category', 'AREA', 'height', 'floors'];
  
  for (const [key, value] of Object.entries(properties)) {
    if (importantKeys.includes(key) && value !== undefined && value !== null) {
      const label = key === 'AREA' ? '面積' : key;
      const displayValue = key === 'AREA' ? `${(value as number).toFixed(0).toLocaleString()}㎡` : String(value);
      result += `<div style="${rowStyle}"><span style="${labelStyle}">${label}</span><span style="${valueStyle}">${displayValue}</span></div>`;
    }
  }
  
  if (!result) {
    // 重要なプロパティがない場合は、最初の3つを表示
    let count = 0;
    for (const [key, value] of Object.entries(properties)) {
      if (count >= 3) break;
      if (value !== undefined && value !== null) {
        result += `<div style="${rowStyle}"><span style="${labelStyle}">${key}</span><span style="${valueStyle}">${String(value)}</span></div>`;
        count++;
      }
    }
  }
  
  return result;
};

// 複数のレイヤー情報を統合して表示する関数
export const combineLayerProperties = (features: any[]): string => {
  // スタイル定義
  const containerStyle = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    max-width: 420px;
  `;
  
  const headerStyle = `
    margin: 0 0 12px 0;
    padding: 10px 14px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-size: 16px;
    font-weight: 600;
    border-radius: 6px;
    text-align: center;
  `;
  
  const sectionStyle = `
    margin: 8px 0;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 4px solid #667eea;
  `;
  
  const rowStyle = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
  `;
  
  const labelStyle = `
    font-weight: 500;
    color: #495057;
    font-size: 13px;
  `;
  
  const valueStyle = `
    font-weight: 600;
    color: #212529;
    font-size: 14px;
  `;

  // 各レイヤーから必要な情報を抽出
  let youtoInfo: any = null;
  let boukaInfo: any = null;
  let koudoInfo: any = null;
  let buildingInfo: any = null;
  
  for (const feature of features) {
    const layerId = feature.layer.id;
    const props = feature.properties;
    
    if (layerId.includes("youto") && !youtoInfo) {
      youtoInfo = props;
    } else if (layerId.includes("bouka") && !boukaInfo) {
      boukaInfo = props;
    } else if (layerId.includes("koudo") && !koudoInfo) {
      koudoInfo = props;
    } else if ((layerId.includes("building") || layerId.includes("height")) && !buildingInfo) {
      buildingInfo = props;
    }
  }

  // HTMLを組み立て
  let result = `<div style="${containerStyle}">`;
  // result += `<div style="${headerStyle}">🏢 物件詳細情報</div>`;
  
  // 基本情報セクション
  // result += `<div style="${sectionStyle}">`;
  // result += `<div style="font-weight: 600; color: #4b5563; font-size: 12px; margin-bottom: 6px;">基本情報</div>`;
  
  // モック所在地
  // const addresses = ["東京都千代田区丸の内1-9-1", "東京都港区六本木6-10-1", "東京都渋谷区道玄坂2-1-1"];
  // const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
  // result += `<div style="${rowStyle}"><span style="${labelStyle}">所在地</span><span style="${valueStyle}">${randomAddress}</span></div>`;
  
  // // モック交通
  // // const stations = ["東京駅徒歩5分", "六本木駅徒歩3分", "渋谷駅徒歩7分"];
  // const randomStation = stations[Math.floor(Math.random() * stations.length)];
  // result += `<div style="${rowStyle}"><span style="${labelStyle}">交通</span><span style="${valueStyle}">${randomStation}</span></div>`;
  
  // // モック土地面積
  // const landArea = Math.floor(Math.random() * 300 + 100);
  // result += `<div style="${rowStyle}"><span style="${labelStyle}">土地面積</span><span style="${valueStyle}">${landArea}㎡</span></div>`;
  
  // // モック建物面積
  // const buildingArea = Math.floor(landArea * 0.6 + Math.random() * 50);
  // result += `<div style="${rowStyle}"><span style="${labelStyle}">建物面積</span><span style="${valueStyle}">${buildingArea}㎡</span></div>`;
  
  // // モック築年月
  // const year = 2000 + Math.floor(Math.random() * 24);
  // result += `<div style="${rowStyle}"><span style="${labelStyle}">築年月</span><span style="${valueStyle}">${year}年${Math.floor(Math.random() * 12 + 1)}月</span></div>`;
  
  // // モック構造
  // const structures = ["鉄骨造3階建", "RC造5階建", "木造2階建", "SRC造8階建"];
  // const randomStructure = structures[Math.floor(Math.random() * structures.length)];
  // result += `<div style="${rowStyle}"><span style="${labelStyle}">構造</span><span style="${valueStyle}">${randomStructure}</span></div>`;
  
  // result += `</div>`;
  
  // 用途地域情報
  if (youtoInfo) {
    result += `<div style="${sectionStyle}">`;
    result += `<div style="font-weight: 600; color: #4b5563; font-size: 12px; margin-bottom: 6px;">都市計画</div>`;
    
    // 用途地域
    if (youtoInfo.A29_005 !== undefined) {
      result += `<div style="${rowStyle}"><span style="${labelStyle}">用途地域</span><span style="${valueStyle}">${youtoInfo.A29_005}</span></div>`;
    } else if (youtoInfo.youto !== undefined) {
      const youtoType = (youtoDictionary.youto.values as any)[youtoInfo.youto] || `準工業地域`;
      result += `<div style="${rowStyle}"><span style="${labelStyle}">用途地域</span><span style="${valueStyle}">${youtoType}</span></div>`;
    } else if (youtoInfo.A01_001 !== undefined) {
      const youtoType = (youtoDictionary.youto.values as any)[youtoInfo.A01_001] || `準工業地域`;
      result += `<div style="${rowStyle}"><span style="${labelStyle}">用途地域</span><span style="${valueStyle}">${youtoType}</span></div>`;
    }
    
    // 容積率
    if (youtoInfo.A29_007 !== undefined) {
      result += `<div style="${rowStyle}"><span style="${labelStyle}">容積率</span><span style="${valueStyle}">${youtoInfo.A29_007}%</span></div>`;
    } else if (youtoInfo.yoseki !== undefined) {
      result += `<div style="${rowStyle}"><span style="${labelStyle}">容積率</span><span style="${valueStyle}">${youtoInfo.yoseki}%</span></div>`;
    } else if (youtoInfo.A01_004 !== undefined) {
      result += `<div style="${rowStyle}"><span style="${labelStyle}">容積率</span><span style="${valueStyle}">${youtoInfo.A01_004}%</span></div>`;
    }
    
    // 建蔽率
    if (youtoInfo.A29_006 !== undefined) {
      result += `<div style="${rowStyle}"><span style="${labelStyle}">建蔽率</span><span style="${valueStyle}">${youtoInfo.A29_006}%</span></div>`;
    } else if (youtoInfo.kenpei !== undefined) {
      result += `<div style="${rowStyle}"><span style="${labelStyle}">建蔽率</span><span style="${valueStyle}">${youtoInfo.kenpei}%</span></div>`;
    } else if (youtoInfo.A01_003 !== undefined) {
      result += `<div style="${rowStyle}"><span style="${labelStyle}">建蔽率</span><span style="${valueStyle}">${youtoInfo.A01_003}%</span></div>`;
    }
    
    // 地目
    result += `<div style="${rowStyle}"><span style="${labelStyle}">地目</span><span style="${valueStyle}">宅地</span></div>`;
    
    // 都市計画
    result += `<div style="${rowStyle}"><span style="${labelStyle}">都市計画</span><span style="${valueStyle}">市街化区域</span></div>`;
    
    result += `</div>`;
  }
  
  // 規制情報
  if (boukaInfo || koudoInfo) {
    result += `<div style="${sectionStyle}">`;
    result += `<div style="font-weight: 600; color: #4b5563; font-size: 12px; margin-bottom: 6px;">規制情報</div>`;
    
    // 防火地域
    if (boukaInfo) {
      if (boukaInfo.TUP6F1 !== undefined) {
        const boukaType = boukaInfo.TUP6F1 === 10 ? "防火地域" : "準防火地域";
        result += `<div style="${rowStyle}"><span style="${labelStyle}">防火規制</span><span style="${valueStyle}">${boukaType}</span></div>`;
      } else if (boukaInfo.TUP5M1 !== undefined) {
        const boukaType = (boukaDictionary.TUP5M1.values as any)[boukaInfo.TUP5M1] || `準防火地域`;
        result += `<div style="${rowStyle}"><span style="${labelStyle}">防火規制</span><span style="${valueStyle}">${boukaType}</span></div>`;
      }
      
      if (boukaInfo.TUP5M2 !== undefined && boukaInfo.TUP5M2 !== 0) {
        const type22 = (boukaDictionary.TUP5M2.values as any)[boukaInfo.TUP5M2] || `22条地域`;
        result += `<div style="${rowStyle}"><span style="${labelStyle}">22条地域</span><span style="${valueStyle}">${type22}</span></div>`;
      }
    }
    
    // 高度地区
    if (koudoInfo) {
      if (koudoInfo.TUP5F1 !== undefined) {
        const koudoType = (koudoDictionary.TUP5F1.values as any)[koudoInfo.TUP5F1] || `第二種高度地区`;
        result += `<div style="${rowStyle}"><span style="${labelStyle}">高度地区</span><span style="${valueStyle}">${koudoType}</span></div>`;
      }
      
      if (koudoInfo.TUP5F3 !== undefined && koudoInfo.TUP5F3 > 0) {
        result += `<div style="${rowStyle}"><span style="${labelStyle}">最低限高度</span><span style="${valueStyle}">${koudoInfo.TUP5F3}m</span></div>`;
      }
      
      if (koudoInfo.TUP5F4 !== undefined && koudoInfo.TUP5F4 > 0) {
        result += `<div style="${rowStyle}"><span style="${labelStyle}">最高限高度</span><span style="${valueStyle}">${koudoInfo.TUP5F4}m</span></div>`;
      }
    }
    
    result += `</div>`;
  }
  
  // 設備・その他情報
  result += `<div style="${sectionStyle}">`;
  result += `<div style="font-weight: 600; color: #4b5563; font-size: 12px; margin-bottom: 6px;">設備・その他</div>`;
  
  // 土地権利
  result += `<div style="${rowStyle}"><span style="${labelStyle}">土地権利</span><span style="${valueStyle}">所有権</span></div>`;
  
  // 接道
  const directions = ["北側4m公道", "南側6m公道", "東側5m私道", "西側4.5m公道"];
  const randomDirection = directions[Math.floor(Math.random() * directions.length)];
  result += `<div style="${rowStyle}"><span style="${labelStyle}">接道</span><span style="${valueStyle}">${randomDirection}</span></div>`;
  
  // 設備
  result += `<div style="${rowStyle}"><span style="${labelStyle}">設備</span><span style="${valueStyle}">公営上下水・都市ガス</span></div>`;
  
  // 現状
  const statuses = ["空室", "賃貸中", "更地", "駐車場"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  result += `<div style="${rowStyle}"><span style="${labelStyle}">現状</span><span style="${valueStyle}">${randomStatus}</span></div>`;
  
  result += `</div>`;
  
  // 建物情報があれば追加
  if (buildingInfo) {
    result += `<div style="${sectionStyle}">`;
    result += `<div style="font-weight: 600; color: #4b5563; font-size: 12px; margin-bottom: 6px;">建物詳細</div>`;
    
    if (buildingInfo.height !== undefined) {
      result += `<div style="${rowStyle}"><span style="${labelStyle}">建物高さ</span><span style="${valueStyle}">${buildingInfo.height}m</span></div>`;
    }
    
    if (buildingInfo.floors !== undefined) {
      result += `<div style="${rowStyle}"><span style="${labelStyle}">階数</span><span style="${valueStyle}">${buildingInfo.floors}階</span></div>`;
    }
    
    // 間取り（モック）
    const layouts = ["3LDK", "4LDK", "2LDK+S", "ワンルーム×8戸", "事務所"];
    const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
    result += `<div style="${rowStyle}"><span style="${labelStyle}">間取り</span><span style="${valueStyle}">${randomLayout}</span></div>`;
    
    result += `</div>`;
  }
  
  // 情報が何もない場合のフォールバック
  if (!youtoInfo && !boukaInfo && !koudoInfo && !buildingInfo && features.length > 0) {
    // 最初のfeatureの情報を表示
    const feature = features[0];
    result += translatePropertyToHTML(feature.layer.id, feature.properties);
  }
  
  result += `</div>`;
  return result;
};