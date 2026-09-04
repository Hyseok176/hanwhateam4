import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Lightbulb, Crosshair, MapPin, Newspaper, Map as MapIcon,
  Thermometer, Droplets, Mountain, ShieldAlert, AlertTriangle,
  Maximize2, X, Compass, ShieldCheck, CheckCircle2
} from 'lucide-react';

const GOOGLE_TILE_LAYERS = {
  terrain: {
    id: 'terrain',
    label: '구글 지형도',
    url: 'https://{s}.google.com/vt/lyrs=p&hl=ko&gl=KR&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  },
  roadmap: {
    id: 'roadmap',
    label: '구글 일반 지도',
    url: 'https://{s}.google.com/vt/lyrs=m&hl=ko&gl=KR&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  },
  satellite: {
    id: 'satellite',
    label: '구글 위성 하이브리드',
    url: 'https://{s}.google.com/vt/lyrs=y&hl=ko&gl=KR&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }
};

export default function RiskMap({ conflicts, selectedConflict, onSelectConflict }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const subLocationsLayerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const [filterIntensity, setFilterIntensity] = useState('ALL');
  const [mapStyle, setMapStyle] = useState('terrain');
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [25.0, 35.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    tileLayerRef.current = L.tileLayer(GOOGLE_TILE_LAYERS.terrain.url, {
      subdomains: GOOGLE_TILE_LAYERS.terrain.subdomains,
      maxZoom: 20
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    subLocationsLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 맵 스타일 전환 핸들러
  const handleStyleChange = (styleKey) => {
    if (styleKey === mapStyle || !mapInstanceRef.current) return;
    setMapStyle(styleKey);
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const targetLayer = GOOGLE_TILE_LAYERS[styleKey];
    tileLayerRef.current = L.tileLayer(targetLayer.url, {
      subdomains: targetLayer.subdomains,
      maxZoom: 20
    }).addTo(mapInstanceRef.current);
  };

  // 마커 렌더링
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !conflicts.length) return;

    markersLayerRef.current.clearLayers();
    subLocationsLayerRef.current.clearLayers();

    const filtered = filterIntensity === 'ALL'
      ? conflicts
      : conflicts.filter(c => {
          if (filterIntensity === 'Low') {
            return c.intensity === 'Low' || c.intensity === 'Elevated';
          }
          return c.intensity === filterIntensity;
        });

    const markerCoords = [];

    filtered.forEach(conflict => {
      let lat = 20, lon = 0;
      if (conflict.locations && conflict.locations.length > 0) {
        lat = conflict.locations[0].lat;
        lon = conflict.locations[0].lon;
      } else {
        if (conflict.regionKo === '동유럽') { lat = 50.45; lon = 30.52; }
        else if (conflict.regionKo === '중동') { lat = 31.76; lon = 35.21; }
        else if (conflict.regionKo === '동아시아') { lat = 24.0; lon = 121.0; }
        else if (conflict.regionKo === '아프리카') { lat = 15.5; lon = 32.5; }
        else if (conflict.regionKo === '남미') { lat = 4.7; lon = -74.0; }
      }

      markerCoords.push([lat, lon]);

      const isHigh = conflict.intensity === 'High';
      const isMed = conflict.intensity === 'Medium';
      const colorHex = isHigh ? '#EF4444' : isMed ? '#F59E0B' : '#10B981';
      const size = isHigh ? 28 : isMed ? 22 : 18;

      const customIcon = L.divIcon({
        className: 'tactical-marker-wrap',
        html: `
          <div style="position: relative; width: ${size}px; height: ${size}px; cursor: pointer;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${colorHex}; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 8px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: ${size > 22 ? '11px' : '9px'}; font-weight: 800; font-family: sans-serif;">
              ${conflict.griScore || ''}
            </div>
            ${isHigh || isMed ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px solid ${colorHex}; animation: map-pulse-${isHigh ? 'high' : 'med'} 2s infinite ease-out;"></div>` : ''}
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
        mapInstanceRef.current.flyTo([lat, lon], 6, { duration: 1.2 });
        onSelectConflict(conflict);
        renderSubLocations(conflict);
      });

      markersLayerRef.current.addLayer(marker);
    });

    // 필터 선택 시 해당 지역으로 지도 자동 이동
    if (filtered.length > 0 && mapInstanceRef.current) {
      if (filterIntensity === 'Low') {
        // 저위험 분쟁지 (대만 해협, 남중국해) 중심부로 이동
        mapInstanceRef.current.flyTo([19.5, 118.0], 5, { duration: 1.2 });
        if (!selectedConflict || (selectedConflict.intensity !== 'Low' && selectedConflict.intensity !== 'Elevated')) {
          onSelectConflict(filtered[0]);
          renderSubLocations(filtered[0]);
        }
      } else if (filterIntensity === 'ALL') {
        mapInstanceRef.current.flyTo([25.0, 35.0], 3, { duration: 1.0 });
      }
    }
  }, [conflicts, filterIntensity]);

  // 선택된 분쟁이 변경될 때 하위 거점 렌더링
  const renderSubLocations = (conflict) => {
    if (!subLocationsLayerRef.current || !conflict.locations || conflict.locations.length <= 1) return;
    subLocationsLayerRef.current.clearLayers();

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
          <strong style="color: #191F28; font-size: 13px;">📍 ${loc.name}</strong>
          <p style="margin: 4px 0 0; font-size: 11px; color: #4E5968; line-height: 1.4;">${loc.description || '주요 거점'}</p>
          ${loc.control ? `<p style="margin: 4px 0 0; font-size: 11px; color: #D97706; font-weight: 700;"><strong>통제:</strong> ${loc.control}</p>` : ''}
        </div>
      `);

      subLocationsLayerRef.current.addLayer(subMarker);
    });
  };

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
            {/* Google Map Style Switcher */}
            <div className="map-style-switcher">
              <span className="overlay-label">지도 테마:</span>
              <button
                type="button"
                className={`style-btn ${mapStyle === 'terrain' ? 'active' : ''}`}
                onClick={() => handleStyleChange('terrain')}
                title="구글 지형도 (등고선 및 자연 지형)"
              >
                ⛰️ 구글 지형도
              </button>
              <button
                type="button"
                className={`style-btn ${mapStyle === 'roadmap' ? 'active' : ''}`}
                onClick={() => handleStyleChange('roadmap')}
                title="구글 일반 지도 (선명한 도로 및 지명)"
              >
                🗺️ 구글 일반
              </button>
              <button
                type="button"
                className={`style-btn ${mapStyle === 'satellite' ? 'active' : ''}`}
                onClick={() => handleStyleChange('satellite')}
                title="구글 위성 지도 (실제 위성 사진 및 도로 라벨)"
              >
                🛰️ 구글 위성
              </button>
            </div>

            <div className="map-filter-group">
              <span className="overlay-label">위험도:</span>
              <button
                className={`filter-chip ${filterIntensity === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilterIntensity('ALL')}
              >
                전체 ({conflicts.length})
              </button>
              <button
                className={`filter-chip chip-high ${filterIntensity === 'High' ? 'active' : ''}`}
                onClick={() => setFilterIntensity('High')}
              >
                고위험 (High) ({highCount})
              </button>
              <button
                className={`filter-chip chip-med ${filterIntensity === 'Medium' ? 'active' : ''}`}
                onClick={() => setFilterIntensity('Medium')}
              >
                중위험 (Med) ({medCount})
              </button>
              <button
                className={`filter-chip chip-low ${filterIntensity === 'Low' ? 'active' : ''}`}
                onClick={() => setFilterIntensity('Low')}
              >
                저위험 (Low) ({lowCount})
              </button>
            </div>

            <div className="map-legend">
              <span className="legend-item"><span className="legend-dot dot-high"></span> 고위험(High)</span>
              <span className="legend-item"><span className="legend-dot dot-med"></span> 중위험(Medium)</span>
              <span className="legend-item"><span className="legend-dot dot-low"></span> 저위험(Low)</span>
              <span className="legend-item"><span className="legend-dot dot-front"></span> 전선 거점</span>
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

                {/* 1. Country Real Terrain Reconnaissance Photo */}
                {c.terrainInfo?.terrainPhoto && (
                  <div className="terrain-recon-card" onClick={() => setIsPhotoZoomed(true)}>
                    <div className="recon-img-wrap">
                      <img
                        src={c.terrainInfo.terrainPhoto.url}
                        alt={c.terrainInfo.terrainPhoto.caption}
                        className="recon-img"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/9/92/Granite-steppe_lands_of_Buh-3.jpg';
                        }}
                      />
                      <div className="recon-overlay-header">
                        <span className="recon-badge">
                          <Compass size={11} /> FIELD TERRAIN INTELLIGENCE
                        </span>
                        <button className="recon-zoom-btn" title="사진 확대">
                          <Maximize2 size={12} />
                        </button>
                      </div>
                      <div className="recon-overlay-footer">
                        <div className="recon-caption">{c.terrainInfo.terrainPhoto.caption}</div>
                        <div className="recon-loc">📍 {c.terrainInfo.terrainPhoto.location || c.regionKo}</div>
                      </div>
                    </div>
                    <div className="recon-tags">
                      {c.terrainInfo.terrainPhoto.tags?.map((tag, idx) => (
                        <span key={idx} className="recon-tag-chip">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Operational Environment Profile (Terrain & Meteorological Gauges) */}
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

                {/* 3. Strategic Summary */}
                <div>
                  <div className="dossier-section-title">
                    <Lightbulb size={14} className="text-orange" /> 미래전략실 전략 요약
                  </div>
                  <p style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                    background: 'var(--bg-surface-elevated)',
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid var(--brand-orange)'
                  }}>
                    {c.strategicSummary}
                  </p>
                </div>

                {/* 4. Matched Hanwha Weapons with Environmental & Operational Advisory */}
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
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600 }}>
                                    🌡️ 무기 보증 기온 (온도 제원)
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--brand-orange)', fontWeight: 800 }}>
                                    {w.operatingSpecs.tempRange}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600 }}>
                                    💧 무기 보증 습도 (습도 제원)
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--radar-cyan)', fontWeight: 800 }}>
                                    최대 {w.operatingSpecs.maxHumidity || 95}% RH (초극고습 내구성)
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600 }}>
                                    🛡️ 전장 군용 규격 / 방호
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                    {w.operatingSpecs.standard?.split('/')[0] || 'MIL-STD-810H'}
                                  </div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600 }}>
                                    🌲 주요 적합 전장 환경
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                    {w.operatingSpecs.primaryEnvironments ? w.operatingSpecs.primaryEnvironments.join(', ') : '전천후 전장 환경'}
                                  </div>
                                </div>
                              </div>

                              {w.operatingSpecs.protection && (
                                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', marginTop: '0.35rem', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                                  🔰 <strong style={{ color: 'var(--text-primary)' }}>장갑 방호 및 화생방:</strong> {w.operatingSpecs.protection}
                                </div>
                              )}

                              {w.operatingSpecs.fieldConstraints && (
                                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', marginTop: '0.35rem', fontSize: '0.74rem', color: 'var(--alert-amber)' }}>
                                  ⚠️ <strong style={{ color: '#D97706' }}>전장 운용상 제약 및 주의사항:</strong> {w.operatingSpecs.fieldConstraints}
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
                                  <span className="cm-lbl">🛠️ 권장 환경 극복 패키지:</span>
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
                          <strong style={{ color: 'var(--radar-cyan)' }}>📍 {l.name}</strong>
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

      {/* Terrain Photo Enlarged Inspection Modal */}
      {isPhotoZoomed && c?.terrainInfo?.terrainPhoto && (
        <div className="modal-overlay" onClick={() => setIsPhotoZoomed(false)}>
          <div className="modal-card terrain-zoom-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="report-badge">
                  <Compass size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  FIELD RECONNAISSANCE INTELLIGENCE
                </div>
                <h3 className="modal-title">{c.terrainInfo.country} - 작전 지형 정찰 사진</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsPhotoZoomed(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '1rem' }}>
              <div className="zoom-photo-frame">
                <img
                  src={c.terrainInfo.terrainPhoto.url}
                  alt={c.terrainInfo.terrainPhoto.caption}
                  className="zoom-img"
                  referrerPolicy="no-referrer"
                />
                <div className="zoom-hud-reticle"></div>
              </div>
              <div className="zoom-meta-box">
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.35rem', fontSize: '1rem' }}>
                  {c.terrainInfo.terrainPhoto.caption}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                  {c.terrainInfo.terrainDescription}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span className="score-badge badge-high" style={{ fontSize: '0.75rem' }}>
                    지형 유형: {c.terrainInfo.terrainType}
                  </span>
                  <span className="score-badge badge-med" style={{ fontSize: '0.75rem' }}>
                    기온 폭: {c.terrainInfo.tempRange?.min}°C ~ {c.terrainInfo.tempRange?.max}°C
                  </span>
                  <span className="score-badge badge-low" style={{ fontSize: '0.75rem' }}>
                    상대 습도: 평균 {c.terrainInfo.humidity?.avg}% (최대 {c.terrainInfo.humidity?.max}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
