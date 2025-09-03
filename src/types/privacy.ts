export type PrivacyLevel = '最小公開' | '限定公開' | 'フル公開';

export interface PrivacySettings {
  level: PrivacyLevel;
  allowedLayers: {
    youto: boolean;
    admin: boolean;
    koudo: boolean;
    bouka: boolean;
    height: boolean;
    boundary: boolean;
    diff: boolean;
    night: boolean;
    potential: boolean;
  };
}