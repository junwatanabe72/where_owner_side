# Mapbox Map Implementation Design Document

## Overview
This document outlines the implementation of a Mapbox-based map feature in the mockapp-run project, based on specifications from the searchLandYK project.

## Architecture

### Core Components

#### 1. Main Map Component (`src/map/Map.tsx`)
- **Purpose**: Primary map container and controller
- **Features**:
  - Mapbox GL integration with Japanese language support
  - 3D pitch toggle functionality (0° to 60°)
  - Dynamic center positioning (Tokyo/Osaka stations)
  - Map configuration and style management

#### 2. Property Markers (`src/map/marker/`)
- **PropertiesMarker Component**: Manages all property markers on the map
  - Color-coded markers based on property yields (利回り)
  - Circle layer visualization for property areas
  - Click handlers for marker interactions
  
- **ClickableMarker Component**: Individual marker implementation
  - Custom marker colors (purple to red based on yield)
  - Click event handling
  - Popup integration

#### 3. Map Layer Controls (`src/components/features/map/MapView.tsx` / `src/components/features/assetDetail/AssetDetailMap.tsx`)
- **Purpose**: Toggle visibility of Mapbox custom layers exposed to the user
- **Currently supported layer toggles** (2025-10-01 時点):
  - 用途地域 (Land use zones)
  - 防火地域 (Fire prevention zones)
  - 高度地区 (Height districts)
  - 建物高さ (Building height visualization)
- **Planned layers (UI 非表示)**:
  - 夜間光 / 産業候補ポイント / 筆界 / 行政区画 などはスタイル実装待ちのため UI から除去済み。対応時に `map/constants.ts` とレイヤートグルを再拡張する。

#### 4. Layer Click Handler (`src/map/layerClickHandler/`)
- **Purpose**: Handle interactions with map layers
- **Functionality**: Process clicks on different map layers

#### 5. UI Components
- **ColorSlider**: Visual legend for yield and building height
- **MapToggleElement**: Container for map control elements
- **Popup**: Property information display dialog

## Data Flow

### Property Data Structure
```typescript
interface LandProperty {
  nearStation: Array<{
    min: number;
    geometry: {
      lat: number;
      lng: number;
    };
  }>;
  wood: {
    originalRaito: number; // Yield percentage * 100
  };
  // Additional property fields
}
```

### Marker Color Coding
- Purple: < 7.0% yield
- Blue: 7.0% - 7.5%
- Green: 7.5% - 8.0%
- Yellow: 8.0% - 8.5%
- Orange: 8.5% - 9.0%
- Red: ≥ 9.0%

## Dependencies
- **mapbox-gl**: v3.1.0 - Core Mapbox library
- **@mapbox/mapbox-gl-language**: Japanese language support
- **@turf/turf**: Geospatial calculations (circle generation)
- **@mui/material**: UI components
- **@mui/icons-material**: Icons for controls

## Configuration

### Environment Variables
- `NEXT_PUBLIC_MAPBOXPASSWORD`: Mapbox access token (required)

### Map Constants
- Default locations:
  - Tokyo Station: [139.7673068, 35.6809591]
  - Osaka Station: [135.495951, 34.702485]
- Default zoom level: 12
- Animation duration: 2000ms

### Style Configuration
```javascript
{
  lightPreset: "day",
  showPointOfInterestLabels: true,
  showPlaceLabels: true,
  showRoadLabels: false,
  showTransitLabels: true
}
```

## Implementation Plan

### Phase 1: Setup
1. Install required dependencies
2. Configure environment variables
3. Set up basic project structure

### Phase 2: Core Components
1. Implement main Map component
2. Create marker system
3. Add layer toggle functionality

### Phase 3: UI Components
1. Implement color sliders
2. Add popup dialogs
3. Create control buttons

### Phase 4: Integration
1. Connect all components
2. Configure data flow
3. Add event handlers

### Phase 5: Testing
1. Verify map rendering
2. Test marker interactions
3. Validate layer toggles
4. Check responsive behavior

## File Structure
```
src/
├── map/
│   ├── index.tsx                    # Main map component
│   ├── constants.ts                 # Map configuration
│   ├── MapLayerToggleButton/
│   │   └── index.tsx
│   ├── layerClickHandler/
│   │   └── index.tsx
│   └── marker/
│       ├── index.tsx                # PropertiesMarker
│       └── ClickableMarker.tsx
├── components/
│   ├── atoms/
│   │   ├── ColorSlider.tsx
│   │   ├── CustomButton.tsx
│   │   └── Popup.tsx
│   └── molecules/
│       └── MapToggleElement.tsx
└── utils/
    └── constant.ts                  # Layer definitions
```

## Notes
- The implementation will maintain compatibility with React 18
- TypeScript will be used throughout
- Tailwind CSS will be used for styling where applicable
- MUI components will be integrated for consistent UI
