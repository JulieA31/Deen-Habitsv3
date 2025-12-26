
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
      setIsPermissionGranted(true);
      startCompass();
    }
  };

  const startCompass = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let compassHeading = 0;
      // @ts-ignore
      if (event.webkitCompassHeading !== undefined) {
        // iOS
        // @ts-ignore
        compassHeading = event.webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Android / others
        compassHeading = 360 - event.alpha;
      }
      setHeading(compassHeading);
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true);
    };
  };

  useEffect(() => {
    // Check support
    // @ts-ignore
    if (typeof DeviceOrientationEvent === 'undefined') {
      setIsSupported(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Compass className="w-6 h-6 text-emerald-600" /> Direction de la Qibla
        </h2>
        <p className="text-sm text-slate-500 mt-1">Tenez votre appareil à plat et tournez-le</p>
      </div>

      {!isPermissionGranted ? (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center max-w-sm space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <RotateCw className="w-8 h-8" />
          </div>
          <p className="text-slate-600 font-medium">L'accès aux capteurs de mouvement est requis pour faire fonctionner la boussole.</p>
          <button 
            onClick={requestPermission}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors"
          >
            Activer la boussole
          </button>
        </div>
      ) : (
        <div className="relative w-80 h-80 flex items-center justify-center">
          {/* Outer static Ring */}
          <div className="absolute inset-0 rounded-full border-[10px] border-slate-100 shadow-inner"></div>
          <div className="absolute inset-[15px] rounded-full border border-slate-200 opacity-30"></div>
          
          {/* Compass Face (Rotates with phone heading) */}
          <div 
            className="absolute inset-4 rounded-full flex items-center justify-center transition-transform duration-100"
            style={{ transform: `rotate(${-heading}deg)` }}
          >
            {/* Cardinal points */}
            <span className="absolute top-2 font-black text-slate-400">N</span>
            <span className="absolute right-2 font-black text-slate-400">E</span>
            <span className="absolute bottom-2 font-black text-slate-400">S</span>
            <span className="absolute left-2 font-black text-slate-400">W</span>
            
            {/* Qibla Arrow Container */}
            <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ transform: `rotate(${qiblaAngle}deg)` }}
            >
                <div className="relative h-full w-full flex flex-col items-center justify-start py-8">
                    {/* Simple Emerald Arrow */}
                    <div className="flex flex-col items-center">
                        <div 
                            className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[30px] border-b-emerald-600 drop-shadow-xl z-20"
                        ></div>
                        <div className="w-1.5 h-20 bg-gradient-to-b from-emerald-600 to-transparent -mt-1 rounded-full opacity-50"></div>
                    </div>
                </div>
            </div>
          </div>
          
          {/* Static Center Dot */}
          <div className="w-6 h-6 bg-slate-800 rounded-full z-10 border-4 border-white shadow-md"></div>
          
          {/* Angle Display Overlay */}
          <div className="absolute -bottom-14 left-0 right-0 text-center">
            <div className="inline-flex flex-col bg-white border border-slate-100 px-4 py-2 rounded-2xl shadow-lg">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Angle Qibla</span>
              <span className="text-xl font-black text-emerald-600">{Math.round(qiblaAngle)}°</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 max-w-sm mt-8">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <MapPin className="w-5 h-5" />
        </div>
        <div className="text-sm text-slate-600 leading-relaxed">
          {userLocation ? (
            <p>Direction calculée pour : <br/><span className="font-bold text-slate-800">{userLocation.lat.toFixed(3)}, {userLocation.lon.toFixed(3)}</span></p>
          ) : (
            <p className="text-amber-600 font-medium">Localisation requise pour la précision.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QiblaCompass;
