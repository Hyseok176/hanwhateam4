import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Crosshair, MapPin, Newspaper, Map as MapIcon,
  Thermometer, Droplets, Mountain, ShieldAlert, AlertTriangle,
  Compass, ShieldCheck, FileText, Shield, Satellite
} from 'lucide-react';

const GOOGLE_TILE_LAYERS = {
  terrain: {
    id: 'terrain',
    label: '구글 지형도',
    className: 'tile-layer-terrain',
    url: 'https://{s}.google.com/vt/lyrs=p&hl=ko&gl=KR&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20
  },
  roadmap: {
    id: 'roadmap',
    label: '구글 일반',
    className: 'tile-layer-roadmap',
    url: 'https://{s}.google.com/vt/lyrs=m&hl=ko&gl=KR&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20
  },
  satellite: {
    id: 'satellite',
    label: '구글 위성',
    className: 'tile-layer-satellite',
    url: 'https://{s}.google.com/vt/lyrs=y&hl=ko&gl=KR&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20
  }
};

// 분쟁지 좌표 추출 순수 헬퍼 함수
const getConflictCoordinates = (c) => {
  if (!c) return [25.0, 35.0];
  if (c.locations && c.locations.length > 0 && typeof c.locations[0].lat === 'number' && typeof c.locations[0].lon === 'number') {
    return [c.locations[0].lat, c.locations[0].lon];
  }
  if (c.regionKo === '동유럽') return [50.45, 30.52];
  if (c.regionKo === '중동') return [31.76, 35.21];
  if (c.regionKo === '동아시아') return [24.0, 121.0];
  if (c.regionKo === '아프리카') return [15.5, 32.5];
  if (c.regionKo === '남미') return [4.7, -74.0];
  return [25.0, 35.0];
};

export default function RiskMap({ conflicts = [], selectedConflict, onSelectConflict, focusConflict, onFocusConsumed }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const subLocationsLayerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const isFilterActionRef = useRef(false);
  const filterTimeoutRef = useRef(null);
  const isInitialLoadRef = useRef(true);
  const [filterIntensity, setFilterIntensity] = useState('ALL');
  const [mapStyle, setMapStyle] = useState('terrain');

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      const map = L.map(mapRef.current, {
        center: [25.0, 35.0],
        zoom: 3,
        minZoom: 2,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const initLayer = GOOGLE_TILE_LAYERS.terrain;
      tileLayerRef.current = L.tileLayer(initLayer.url, {
        subdomains: initLayer.subdomains,
        className: initLayer.className,
        maxZoom: initLayer.maxZoom
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      subLocationsLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } catch (err) {
      console.error('지도 초기화 실패:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 맵 스타일 전환 핸들러
  const handleStyleChange = (styleKey) => {
    if (styleKey === mapStyle || !mapInstanceRef.current) return;
    setMapStyle(styleKey);
    try {
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const targetLayer = GOOGLE_TILE_LAYERS[styleKey];
      if (!targetLayer) return;

      tileLayerRef.current = L.tileLayer(targetLayer.url, {
        subdomains: targetLayer.subdomains,
        className: targetLayer.className,
        maxZoom: targetLayer.maxZoom
      }).addTo(mapInstanceRef.current);

      if (typeof tileLayerRef.current.bringToBack === 'function') {
        tileLayerRef.current.bringToBack();
      }
    } catch (e) {
      console.warn('스타일 레이어 전환 실패:', e);
    }
  };

  // 마커 렌더링 (순수 마커 표시만 수행, 부모 상태를 변경하지 않아 무한 루프 방지)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !conflicts || !conflicts.length) return;

    markersLayerRef.current.clearLayers();

    const filtered = filterIntensity === 'ALL'
      ? conflicts
      : conflicts.filter(c => {
          if (filterIntensity === 'Low') {
            return c.intensity === 'Low' || c.intensity === 'Elevated';
          }
          return c.intensity === filterIntensity;
        });

    filtered.forEach(conflict => {
      const [lat, lon] = getConflictCoordinates(conflict);
      const isHigh = conflict.intensity === 'High';
      const isMed = conflict.intensity === 'Medium';
      const colorHex = isHigh ? '#EF4444' : isMed ? '#F59E0B' : '#10B981';
      const size = isHigh ? 28 : isMed ? 22 : 18;

      const customIcon = L.divIcon({
        className: 'tactical-marker-wrap',
        html: `
          <div style="width: ${size}px; height: ${size}px; cursor: pointer; border-radius: 50%; background: ${colorHex}; border: 2px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: ${size > 22 ? '11px' : '9px'}; font-weight: 800; font-family: sans-serif;">
            ${conflict.griScore || ''}
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker([lat, lon], { icon: customIcon });

      marker.bindTooltip(`
        <div style="font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; font-size: 12px; font-weight: 700; padding: 4px 8px; background: #FFFFFF; color: #191F28; border: 1.5px solid ${colorHex}; border-radius: 8px; box-shadow: 0 4px 14px rgba(0,0,0,0.12);">
          <strong style="color: ${colorHex};">[GRI ${conflict.griScore}]</strong> ${conflict.titleKo}
        </div>
      `, { direction: 'top', offset: [0, -size / 2] });

      marker.on('click', () => {
        isFilterActionRef.current = false;
        try {
          mapInstanceRef.current.flyTo([lat, lon], 6, { duration: 1.2 });
        } catch (e) {}
        if (onSelectConflict) onSelectConflict(conflict);
        renderSubLocations(conflict);
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [conflicts, filterIntensity]);

  // 필터 버튼 클릭 핸들러: 선택된 위험도의 '모든' 분쟁 지점이 화면에 한눈에 보이도록 맞춤 확대 (fitBounds)
  const handleFilterClick = (newIntensity) => {
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    // 필터 클릭 시에는 개별 지점으로 flyTo되는 부수효과를 일시 차단하여 모든 지점 조망 유지
    isFilterActionRef.current = true;
    setFilterIntensity(newIntensity);

    const map = mapInstanceRef.current;
    if (!map) return;

    const filtered = newIntensity === 'ALL'
      ? conflicts
      : conflicts.filter(c => {
          if (newIntensity === 'Low') return c.intensity === 'Low' || c.intensity === 'Elevated';
          return c.intensity === newIntensity;
        });

    if (!filtered || filtered.length === 0) return;

    try {
      const coordsList = filtered.map(c => getConflictCoordinates(c)).filter(Boolean);

      if (coordsList.length > 0) {
        if (newIntensity === 'High') {
          // 고위험: 16곳 중 81%(13곳)가 밀집된 유라시아-중동-아프리카-남아시아 핵심 분쟁 벨트로 시원하게 줌인 확대 (줌 3.8~4.0)
          const mainCluster = coordsList.filter(pt => pt[1] > -20);
          const bounds = L.latLngBounds(mainCluster.length > 0 ? mainCluster : coordsList);
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [30, 30], maxZoom: 4.2, animate: true, duration: 1.0 });
          }
        } else if (newIntensity === 'Medium') {
          // 중위험: 11곳 중 91%(10곳)가 밀집된 중동-지중해-아프리카-중앙아시아 벨트로 정밀 줌인 확대 (줌 4.3~4.6)
          const mainCluster = coordsList.filter(pt => pt[1] > -20);
          const bounds = L.latLngBounds(mainCluster.length > 0 ? mainCluster : coordsList);
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [30, 30], maxZoom: 4.6, animate: true, duration: 1.0 });
          }
        } else if (newIntensity === 'Low') {
          // 저위험: 대만 해협 및 남중국해 동아시아 해역 줌인 조망 (줌 5.5)
          const bounds = L.latLngBounds(coordsList);
          if (bounds.isValid()) {
            map.fitBounds(bounds.pad(0.2), { padding: [50, 50], maxZoom: 5.5, animate: true, duration: 1.0 });
          }
        } else {
          // 전체: 전 세계 29개 분쟁 전체 조망 (줌 2.8)
          map.flyTo([22.0, 30.0], 2.8, { duration: 1.0 });
        }
      }

      // 우측 전술 보고서 패널을 위해 해당 위험도의 첫 번째 항목 설정 (지도는 fitBounds 유지)
      if (onSelectConflict && filtered.length > 0) {
        onSelectConflict(filtered[0]);
        renderSubLocations(filtered[0]);
      }
    } catch (err) {
      console.warn('필터 지도 전체 조망 피팅 예외 방어:', err);
    } finally {
      // 1.5초 후 필터 조망 플래그를 해제하여 추후 마커 직접 클릭 시 정상 줌인 지원
      filterTimeoutRef.current = setTimeout(() => {
        isFilterActionRef.current = false;
      }, 1500);
    }
  };

  // 선택된 분쟁이 변경될 때 하위 거점 렌더링
  const renderSubLocations = (conflict) => {
    if (!subLocationsLayerRef.current) return;
    subLocationsLayerRef.current.clearLayers();
    if (!conflict || !conflict.locations || conflict.locations.length <= 1) return;

    conflict.locations.forEach(loc => {
      if (!loc.lat || !loc.lon) return;

      const subIcon = L.divIcon({
        className: 'sub-loc-marker',
        html: `<div style="width: 10px; height: 10px; border-radius: 50%; background: #0284C7; border: 2px solid #FFFFFF; box-shadow: 0 1px 5px rgba(0,0,0,0.5);"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      });

      const subMarker = L.marker([loc.lat, loc.lon], { icon: subIcon });
      subMarker.bindPopup(`
        <div style="font-family: 'Malgun Gothic', '맑은 고딕', sans-serif; font-size: 12px; color: #191F28; max-width: 220px; padding: 2px;">
          <strong style="color: #191F28; font-size: 13px;">[거점] ${loc.name}</strong>
          <p style="margin: 4px 0 0; font-size: 11px; color: #4E5968; line-height: 1.4;">${loc.description || '주요 거점'}</p>
          ${loc.control ? `<p style="margin: 4px 0 0; font-size: 11px; color: #D97706; font-weight: 700;"><strong>통제:</strong> ${loc.control}</p>` : ''}
        </div>
      `);

      subLocationsLayerRef.current.addLayer(subMarker);
    });
  };

  // 1. 소요 무기 매칭 매트릭스 등 외부에서 '지도에서 분석'을 눌러 특정 분쟁 지역으로 네비게이션된 경우
  useEffect(() => {
    if (!focusConflict) return;

    // 매트릭스에서 명시적으로 넘어왔으므로 초기 로딩 건너뛰기 플래그 무조건 해제
    isInitialLoadRef.current = false;
    isFilterActionRef.current = false;

    renderSubLocations(focusConflict);

    const zoomToFocus = () => {
      const map = mapInstanceRef.current;
      if (!map) return;
      try {
        const coords = getConflictCoordinates(focusConflict);
        if (coords && coords[0] && coords[1]) {
          map.invalidateSize();
          map.flyTo(coords, 5.8, { duration: 1.2 });
        }
      } catch (err) {
        console.warn('focusConflict 줌인 처리 오류 방어:', err);
      }
      if (onFocusConsumed) onFocusConsumed();
    };

    // DOM 및 타일 준비를 위해 약간의 딜레이 후 확대 실행
    const timer = setTimeout(zoomToFocus, 120);
    return () => clearTimeout(timer);
  }, [focusConflict]);

  // 2. 선택된 분쟁이 지도 내부 클릭 또는 기타 변경되었을 때 처리
  useEffect(() => {
    if (!selectedConflict) return;
    renderSubLocations(selectedConflict);

    // 페이지 첫 로딩 시 (focusConflict가 없는 경우)에는 전체 분쟁 조망(글로벌 뷰)을 유지
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      return;
    }

    // 필터 버튼 클릭에 의한 전체 조망 모드일 때는 개별 지점 flyTo를 건너뜀
    if (isFilterActionRef.current) return;

    // 사용자가 마커를 직접 클릭했거나 분쟁을 선택한 경우 해당 지점으로 줌인
    try {
      const map = mapInstanceRef.current;
      if (map && typeof map.flyTo === 'function') {
        const coords = getConflictCoordinates(selectedConflict);
        if (coords && coords[0] && coords[1]) {
          map.flyTo(coords, 5.8, { duration: 1.2 });
        }
      }
    } catch (e) {
      console.warn('selectedConflict 지도 동기화 안전 스킵:', e);
    }
  }, [selectedConflict?.slug || selectedConflict?.id || selectedConflict?.titleKo]);

  const c = selectedConflict;
  const isHigh = c?.intensity === 'High';
  const isMed = c?.intensity === 'Medium';
  const badgeClass = isHigh ? 'badge-high' : isMed ? 'badge-med' : 'badge-low';
  const scoreColor = isHigh ? 'var(--alert-red)' : isMed ? 'var(--alert-amber)' : 'var(--radar-cyan)';

  const highCount = conflicts.filter(c => c.intensity === 'High').length;
  const medCount = conflicts.filter(c => c.intensity === 'Medium').length;
  const lowCount = conflicts.filter(c => c.intensity === 'Low' || c.intensity === 'Elevated').length;

  return (
    <div className="view-panel map-view-panel">
      <div className="map-layout">
        <div className="map-wrapper">
          <div ref={mapRef} className="tactical-map-container"></div>

          {/* Overlay Controls */}
          <div className="map-controls-overlay">
            {/* Map Style Switcher */}
            <div className="map-style-switcher">
              <span className="overlay-label">지도 테마:</span>
              <button
                type="button"
                className={`style-btn ${mapStyle === 'terrain' ? 'active' : ''}`}
                onClick={() => handleStyleChange('terrain')}
                title="구글 지형도 (등고선 및 산악 음영 강조 • 한국어 지명)"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <Mountain size={12} /> 구글 지형도
              </button>
              <button
                type="button"
                className={`style-btn ${mapStyle === 'roadmap' ? 'active' : ''}`}
                onClick={() => handleStyleChange('roadmap')}
                title="구글 일반 지도 (선명한 도로 및 행정 구역 • 한국어 지명)"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <MapIcon size={12} /> 구글 일반
              </button>
              <button
                type="button"
                className={`style-btn ${mapStyle === 'satellite' ? 'active' : ''}`}
                onClick={() => handleStyleChange('satellite')}
                title="구글 위성 지도 (실제 고해상도 위성 사진 및 주요 도로 • 한국어 지명)"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <Satellite size={12} /> 구글 위성
              </button>
            </div>

            <div className="map-filter-group">
              <span className="overlay-label">위험도:</span>
              <button
                className={`filter-chip ${filterIntensity === 'ALL' ? 'active' : ''}`}
                onClick={() => handleFilterClick('ALL')}
              >
                전체 ({conflicts.length})
              </button>
              <button
                className={`filter-chip chip-high ${filterIntensity === 'High' ? 'active' : ''}`}
                onClick={() => handleFilterClick('High')}
              >
                고위험 (High) ({highCount})
              </button>
              <button
                className={`filter-chip chip-med ${filterIntensity === 'Medium' ? 'active' : ''}`}
                onClick={() => handleFilterClick('Medium')}
              >
                중위험 (Med) ({medCount})
              </button>
              <button
                className={`filter-chip chip-low ${filterIntensity === 'Low' ? 'active' : ''}`}
                onClick={() => handleFilterClick('Low')}
              >
                저위험 (Low) ({lowCount})
              </button>
            </div>

            <div className="map-legend">
              <span className="overlay-label">표시 범례:</span>
              <span className="legend-item" title="GRI 지수 표시 및 긴급 대응 전구">
                <span className="legend-marker-badge marker-high">GRI</span> 고위험(High)
              </span>
              <span className="legend-item" title="GRI 지수 표시 및 국지 충돌 전구">
                <span className="legend-marker-badge marker-med">GRI</span> 중위험(Medium)
              </span>
              <span className="legend-item" title="GRI 지수 표시 및 잠재 긴장 전구">
                <span className="legend-marker-badge marker-low">GRI</span> 저위험(Low)
              </span>
              <span className="legend-item" title="분쟁지 선택 시 표시되는 세부 전선/기지 거점">
                <span className="legend-subloc-dot"></span> 전선 거점
              </span>
            </div>
          </div>
        </div>

        {/* Side Dossier Panel */}
        <aside className="map-side-dossier">
          <div className="dossier-header">
            <div className="dossier-badge">
              {c ? `${c.regionKo} • ${c.intensity} THREAT` : 'TACTICAL DOSSIER'}
            </div>
            <h2 className="dossier-title">{c ? c.titleKo : '분쟁 지역을 선택하세요'}</h2>
            <div className="dossier-sub">
              {c ? `${c.titleEn} (${c.type})` : '지도 상의 마커를 클릭하면 상세 분석이 표시됩니다.'}
            </div>
          </div>

          <div className="dossier-body">
            {!c ? (
              <div className="empty-dossier">
                <MapIcon className="empty-icon" size={48} />
                <p>
                  좌측 지도에서 감시 대상 분쟁 마커를 클릭하시면 <strong>지정학 리스크 지수(GRI)</strong>, <strong>한화 방산 소요 무기 매칭</strong> 및 <strong>연관 최신 방산 뉴스</strong>를 실시간으로 확인하실 수 있습니다.
                </p>
              </div>
            ) : (
              <>
                {/* Score Card */}
                <div className="dossier-score-card">
                  <div>
                    <div className="dossier-section-title" style={{ marginBottom: '0.2rem' }}>
                      지정학적 리스크 지수 (GRI)
                    </div>
                    <div className="score-num-wrap">
                      <span className="score-big" style={{ color: scoreColor }}>{c.griScore}</span>
                      <span className="score-denom">/ 100</span>
                    </div>
                  </div>
                  <div className={`score-badge ${badgeClass}`}>{c.intensity} 위기</div>
                </div>

                {/* 1. Operational Environment Profile (Terrain & Meteorological Gauges) */}
                {c.terrainInfo && (
                  <div className="dossier-env-section">
                    <div className="dossier-section-title">
                      <Mountain size={14} className="text-orange" /> 전장 지형 및 작전 기상 제원
                    </div>
                    
                    <div className="env-profile-box">
                      <div className="env-terrain-header">
                        <div className="env-terrain-type">
                          <span className="env-type-badge">{c.terrainInfo.terrainType}</span>
                          <span className="env-country-name">{c.terrainInfo.country}</span>
                        </div>
                        <p className="env-terrain-desc">{c.terrainInfo.terrainDescription}</p>
                      </div>

                      {/* Sensor Meters Grid */}
                      <div className="env-gauges-grid">
                        {/* Temp Gauge */}
                        <div className="env-gauge-card">
                          <div className="gauge-label">
                            <Thermometer size={13} className="text-orange" /> 연간 기온 범위
                          </div>
                          <div className="gauge-val">
                            <span className="temp-min">{c.terrainInfo.tempRange?.min}°C</span>
                            <span className="temp-sep">~</span>
                            <span className="temp-max">{c.terrainInfo.tempRange?.max}°C</span>
                          </div>
                          <div className="gauge-bar-wrap">
                            <div className="gauge-bar-fill temp-bar" style={{
                              width: `${Math.min(Math.max(((c.terrainInfo.tempRange?.max || 30) + 30) / 80 * 100, 20), 100)}%`
                            }}></div>
                          </div>
                          <div className="gauge-sub">{c.terrainInfo.tempRange?.desc}</div>
                        </div>

                        {/* Humidity Gauge */}
                        <div className="env-gauge-card">
                          <div className="gauge-label">
                            <Droplets size={13} className="text-cyan" /> 상대 습도 제원
                          </div>
                          <div className="gauge-val">
                            <span className="hum-avg">평균 {c.terrainInfo.humidity?.avg}%</span>
                            <span className="hum-sep">/</span>
                            <span className="hum-max">최대 {c.terrainInfo.humidity?.max}%</span>
                          </div>
                          <div className="gauge-bar-wrap">
                            <div className="gauge-bar-fill hum-bar" style={{
                              width: `${c.terrainInfo.humidity?.max || 70}%`
                            }}></div>
                          </div>
                          <div className="gauge-sub">{c.terrainInfo.humidity?.desc}</div>
                        </div>
                      </div>

                      {/* Special Hazards Chips */}
                      {c.terrainInfo.specialHazards && c.terrainInfo.specialHazards.length > 0 && (
                        <div className="env-hazards-block">
                          <div className="hazards-title">
                            <AlertTriangle size={12} className="text-amber" /> 전장 특수 환경 위험 요인
                          </div>
                          <div className="hazards-list">
                            {c.terrainInfo.specialHazards.map((h, i) => (
                              <span key={i} className="hazard-chip">
                                <span className="hazard-dot">•</span> {h}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Strategic Summary */}
                <div>
                  <div className="dossier-section-title">
                    <FileText size={14} className="text-orange" /> 미래전략실 전략 브리핑
                  </div>
                  <div style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    background: 'var(--bg-surface-elevated)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)'
                  }}>
                    {c.strategicSummary}
                  </div>
                </div>

                {/* 3. Matched Hanwha Weapons with Environmental & Operational Advisory */}
                <div>
                  <div className="dossier-section-title">
                    <Crosshair size={14} className="text-orange" /> 한화 방산 소요 무기 및 환경 호환성 평가 ({c.matchedWeapons?.length || 0}종)
                  </div>
                  {c.matchedWeapons && c.matchedWeapons.length > 0 ? (
                    c.matchedWeapons.map(w => {
                      const env = w.environmentalAssessment || {};
                      const isEnvWarn = env.overallStatus === 'Warning';
                      const isEnvCaution = env.overallStatus === 'Caution';
                      const envBadgeClass = isEnvWarn ? 'env-badge-warn' : (isEnvCaution ? 'env-badge-caution' : 'env-badge-optimal');
                      const envBadgeLabel = isEnvWarn ? '환경 위험 경고' : (isEnvCaution ? '운용 조건 주의' : '작전 환경 적합');

                      return (
                        <div className="weapon-match-card" key={w.weaponId}>
                          <div className="wm-header">
                            <div>
                              <div className="wm-name">{w.nameKo}</div>
                              <div className="wm-company">{w.company} • {w.category}</div>
                            </div>
                            <div className="wm-score-wrap">
                              <span className={`wm-env-badge ${envBadgeClass}`}>
                                {envBadgeLabel}
                              </span>
                              <div className="wm-score">매칭 적합도 {w.matchScore}%</div>
                            </div>
                          </div>
                          <p className="wm-desc">{w.description}</p>
                          
                          {/* Military Operational Specs Grid */}
                          {w.operatingSpecs && (
                            <div className="wm-mil-specs-box" style={{
                              background: 'var(--bg-surface-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-md)',
                              padding: '0.75rem 0.85rem',
                              margin: '0.65rem 0'
                            }}>
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '0.5rem',
                                marginBottom: '0.4rem'
                              }}>
                                <div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Thermometer size={12} className="text-orange" /> 운용 보증 기온
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--brand-orange)', fontWeight: 800 }}>
                                    {w.operatingSpecs.tempRange}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Droplets size={12} className="text-cyan" /> 상대 습도 한계
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--radar-cyan)', fontWeight: 800 }}>
                                    최대 {w.operatingSpecs.maxHumidity || 95}% RH (초극고습 내구성)
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Shield size={12} className="text-orange" /> 군용 표준 규격
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                    {w.operatingSpecs.standard?.split('/')[0] || 'MIL-STD-810H'}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Compass size={12} className="text-cyan" /> 적합 전장 환경
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                    {w.operatingSpecs.primaryEnvironments ? w.operatingSpecs.primaryEnvironments.join(', ') : '전천후 전장 환경'}
                                  </div>
                                </div>
                              </div>

                              {w.operatingSpecs.protection && (
                                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', marginTop: '0.35rem', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                                  ■ <strong style={{ color: 'var(--text-primary)' }}>장갑 방호 및 화생방:</strong> {w.operatingSpecs.protection}
                                </div>
                              )}

                              {w.operatingSpecs.fieldConstraints && (
                                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', marginTop: '0.35rem', fontSize: '0.74rem', color: 'var(--alert-amber)' }}>
                                  ■ <strong style={{ color: '#D97706' }}>전장 운용상 제약 및 주의사항:</strong> {w.operatingSpecs.fieldConstraints}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Environmental Assessment Box */}
                          {env && (
                            <div className="wm-env-eval-box">
                              <div className="wm-env-row">
                                <span className="env-metric">
                                  <Thermometer size={12} className="text-orange" /> {env.tempDesc || '온도 적합'}
                                </span>
                                <span className="env-metric">
                                  <Droplets size={12} className="text-cyan" /> {env.humidityDesc || '습도 적합'}
                                </span>
                                <span className="env-metric">
                                  지형 적합: <strong style={{ color: 'var(--text-primary)' }}>{env.terrainScore || 85}점</strong>
                                </span>
                              </div>

                              {/* Field Advisories */}
                              {env.fieldAdvisories && env.fieldAdvisories.length > 0 && (
                                <div className="wm-advisory-block">
                                  <div className="wm-advisory-title">
                                    <ShieldAlert size={13} className="text-amber" /> 전장 맞춤 야전 운용 가이드 및 정비 수칙
                                  </div>
                                  <ul className="wm-advisory-list">
                                    {env.fieldAdvisories.map((adv, idx) => (
                                      <li key={idx}>{adv}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Recommended Countermeasure Upgrade */}
                              {env.countermeasurePackage && (
                                <div className="wm-countermeasure">
                                  <span className="cm-lbl">■ 환경 극복 패키지:</span>
                                  <span className="cm-val">{env.countermeasurePackage}</span>
                                </div>
                              )}
                            </div>
                          )}

                          <ul className="wm-reasons">
                            {w.reasons.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>매칭된 전용 소요 무기 데이터가 없습니다.</p>
                  )}
                </div>

                {/* Frontline Locations */}
                <div>
                  <div className="dossier-section-title">
                    <MapPin size={14} className="text-cyan" /> 핵심 전선 및 감시 거점
                  </div>
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    {c.locations && c.locations.length > 0 ? (
                      c.locations.map((l, i) => (
                        <div key={i} style={{ fontSize: '0.8rem', padding: '0.45rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
                          <strong style={{ color: 'var(--radar-cyan)' }}>• {l.name}</strong>
                          <span style={{ color: 'var(--text-secondary)' }}> - {l.description || '주요 거점'}</span>
                          {l.control && <div style={{ color: 'var(--alert-amber)', fontSize: '0.74rem', marginTop: '2px', fontWeight: 600 }}>통제: {l.control}</div>}
                        </div>
                      ))
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>등록된 세부 전선 좌표가 없습니다.</p>
                    )}
                  </div>
                </div>

                {/* Related Daily Defense News */}
                <div>
                  <div className="dossier-section-title">
                    <Newspaper size={14} className="text-cyan" /> 연관 데일리방산 뉴스 ({c.matchedNewsCount || 0}건)
                  </div>
                  {c.matchedNews && c.matchedNews.length > 0 ? (
                    c.matchedNews.map(n => (
                      <a 
                        href={n.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        referrerPolicy="no-referrer"
                        className="dossier-news-item" 
                        key={n.id}
                        style={{ textDecoration: 'none', display: 'block', cursor: 'pointer', transition: 'background 0.2s ease' }}
                      >
                        <div className="dn-title" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {n.title}
                        </div>
                        <div className="dn-meta" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
                          <span>{n.author || '데일리방산'}</span>
                          <span>{n.pubDate}</span>
                        </div>
                      </a>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>해당 지역 관련 최근 뉴스가 없습니다.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
