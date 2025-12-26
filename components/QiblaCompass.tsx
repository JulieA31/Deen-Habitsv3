
import React, { useState, useEffect } from 'react';
import { Compass, MapPin, AlertCircle, RotateCw } from 'lucide-react';

interface QiblaCompassProps {
  userLocation: { lat: number; lon: number } | null;
}

const QiblaCompass: React.FC<QiblaCompassProps> = ({ userLocation }) => {
  const [heading, setHeading] = useState<number>(0);
  const [qiblaAngle, setQiblaAngle] = useState<number>(0);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);

  // Kaaba coordinates
  const KAABA_LAT = 21.4225;
  const KAABA_LON = 39.8262;

  const calculateQibla = (lat: number, lon: number) => {
    const toRad = (deg: number) => deg * (Math.PI / 180);
    const toDeg = (rad: number) => rad * (180 / Math.PI);

    const φ1 = toRad(lat);
    const λ1 = toRad(lon);
    const φ2 = toRad(KAABA_LAT);
    const λ2 = toRad(KAABA_LON);

    const y = Math.sin(λ2 - λ1);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(λ2 - λ1);
    const angle = (toDeg(Math.atan2(y, x)) + 360) % 360;
    setQiblaAngle(angle);
  };

  useEffect(() => {
    if (userLocation) {
      calculateQibla(userLocation.lat, userLocation.lon);
    }
  }, [userLocation]);

  const requestPermission = async () => {
    // Handling iOS 13+ permission
    // @ts-ignore
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        // @ts-ignore
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setIsPermissionGranted(true);
          startCompass();
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Non-iOS or older iOS
      setIsPermissionGranted(true);
      startCompass();
    }
  };

  const startCompass = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let compassHeading = 0;
      // @ts-ignore
      if (event.webkitCompassHeading) {
        // iOS
        // @ts-ignore
        compassHeading = event.webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Android / others (alpha might not be absolute heading without specific events)
        compassHeading = 360 - event.alpha;
      }
      setHeading(compassHeading);
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    // Use absolute orientation if available for better accuracy on some Androids
    window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true);
    };
  };

  useEffect(() => {
    // Start listening if permission is already assumed (like on most Androids)
    // @ts-ignore
    if (typeof DeviceOrientationEvent === 'undefined') {
      setIsSupported(false);
    }
  }, []);

  const totalRotation = qiblaAngle - heading;

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Compass className="w-6 h-6 text-emerald-600" /> Direction de la Qibla
        </h2>
        <p className="text-sm text-slate-500 mt-1">Tournez votre appareil pour trouver la Kaaba</p>
      </div>

      {!isPermissionGranted ? (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center max-w-sm space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <RotateCw className="w-8 h-8" />
          </div>
          <p className="text-slate-600 font-medium">L'application a besoin d'accéder aux capteurs de mouvement pour afficher la boussole.</p>
          <button 
            onClick={requestPermission}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors"
          >
            Activer les capteurs
          </button>
        </div>
      ) : (
        <div className="relative w-72 h-72">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-8 border-slate-100 shadow-inner"></div>
          
          {/* Compass Face */}
          <div 
            className="absolute inset-4 rounded-full bg-white shadow-xl flex items-center justify-center transition-transform duration-100"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            {/* Cardinal points */}
            <span className="absolute top-2 font-bold text-slate-300">N</span>
            <span className="absolute right-2 font-bold text-slate-300">E</span>
            <span className="absolute bottom-2 font-bold text-slate-300">S</span>
            <span className="absolute left-2 font-bold text-slate-300">W</span>
            
            {/* Qibla Needle Container (rotates within the compass) */}
            <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: `rotate(${qiblaAngle}deg)` }}
            >
                <div className="relative flex flex-col items-center">
                    {/* The Mecca Icon/Indicator */}
                    <div className="absolute -top-12 flex flex-col items-center">
                        <img src="/logo.png" className="w-10 h-10 shadow-lg rounded-lg border-2 border-emerald-500 bg-white" alt="Kaaba" />
                        <div className="w-1 h-8 bg-emerald-500 mt-1 rounded-full"></div>
                    </div>
                </div>
            </div>
            
            {/* Central Dot */}
            <div className="w-4 h-4 bg-slate-800 rounded-full z-10 border-4 border-white"></div>
          </div>
          
          {/* Angle Display Overlay */}
          <div className="absolute -bottom-12 left-0 right-0 text-center">
            <div className="inline-block bg-slate-800 text-white px-4 py-1.5 rounded-full text-sm font-mono shadow-md">
              Azimut: {Math.round(qiblaAngle)}° | Cap: {Math.round(heading)}°
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3 max-w-sm">
        <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-800 leading-relaxed">
          {userLocation ? (
            <p>Calculé pour votre position actuelle : <b>{userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}</b>. Tenez votre téléphone à plat (horizontalement).</p>
          ) : (
            <p className="text-amber-700 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Géolocalisation nécessaire pour une précision optimale.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QiblaCompass;
