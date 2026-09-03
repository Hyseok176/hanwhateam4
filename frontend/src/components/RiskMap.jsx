import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Lightbulb, Crosshair, MapPin, Newspaper, Map as MapIcon } from 'lucide-react';

export default function RiskMap({ conflicts, selectedConflict, onSelectConflict }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const subLocationsLayerRef = useRef(null);
  const [filterIntensity, setFilterIntensity] = useState('ALL');

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [25.0, 35.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    subLocationsLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

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
      const colorHex = isHigh ? '#FF3B30' : isMed ? '#FF9500' : '#00F0FF';
      const size = isHigh ? 28 : isMed ? 22 : 18;

      const customIcon = L.divIcon({
        className: 'tactical-marker-wrap',
        html: `
          <div style="position: relative; width: ${size}px; height: ${size}px; cursor: pointer;">
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${colorHex}; opacity: 0.9; box-shadow: 0 0 12px ${colorHex}; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 10px; font-weight: 800;">
              ${conflict.griScore || ''}
            </div>
            <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; border: 2px solid ${colorHex}; animation: map-pulse-${isHigh ? 'high' : 'med'} 2s infinite ease-out;"></div>
          </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker([lat, lon], { icon: customIcon });

      marker.bindTooltip(`
        <div style="font-family: sans-serif; font-size: 11px; padding: 2px 4px; background: #0E1626; color: #fff; border: 1px solid ${colorHex}; border-radius: 4px;">
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
        html: `<div style="width: 10px; height: 10px; border-radius: 50%; background: #00F0FF; border: 2px solid #0E1626; box-shadow: 0 0 8px #00F0FF;"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      });

      const subMarker = L.marker([loc.lat, loc.lon], { icon: subIcon });
      subMarker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 12px; color: #0E1626; max-width: 200px;">
          <strong>📍 ${loc.name}</strong>
          <p style="margin: 4px 0 0; font-size: 11px; color: #4B5563;">${loc.description || '주요 거점'}</p>
          ${loc.control ? `<p style="margin: 4px 0 0; font-size: 10px; color: #D97706;"><strong>통제:</strong> ${loc.control}</p>` : ''}
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

                {/* Strategic Summary */}
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

                {/* Matched Hanwha Weapons */}
                <div>
                  <div className="dossier-section-title">
                    <Crosshair size={14} className="text-orange" /> 한화 방산 소요 무기 매칭 ({c.matchedWeapons?.length || 0}종)
                  </div>
                  {c.matchedWeapons && c.matchedWeapons.length > 0 ? (
                    c.matchedWeapons.map(w => (
                      <div className="weapon-match-card" key={w.weaponId}>
                        <div className="wm-header">
                          <div>
                            <div className="wm-name">{w.nameKo}</div>
                            <div className="wm-company">{w.company} • {w.category}</div>
                          </div>
                          <div className="wm-score">매칭 적합도 {w.matchScore}%</div>
                        </div>
                        <p className="wm-desc">{w.description}</p>
                        <ul className="wm-reasons">
                          {w.reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>매칭된 전용 소요 무기 데이터가 없습니다.</p>
                  )}
                </div>

                {/* Frontline Locations */}
                <div>
                  <div className="dossier-section-title">
                    <MapPin size={14} className="text-cyan" /> 핵심 전선 및 감시 거점
                  </div>
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    {c.locations && c.locations.length > 0 ? (
                      c.locations.map((l, i) => (
                        <div key={i} style={{ fontSize: '0.78rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <strong style={{ color: 'var(--radar-cyan)' }}>📍 {l.name}</strong>
                          <span style={{ color: 'var(--text-secondary)' }}> - {l.description || '주요 거점'}</span>
                          {l.control && <div style={{ color: 'var(--alert-amber)', fontSize: '0.72rem', marginTop: '2px' }}>통제: {l.control}</div>}
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
