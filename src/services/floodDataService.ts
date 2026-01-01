// src/services/floodDataService.ts
import { fetchWeatherApi } from 'openmeteo';

// Jakarta coordinates for each location: latitude n longitude
const ZONE_COORDINATES = {
  'TG_PRIOK': { lat: -6.1064, lon: 106.8831, name: 'Pelabuhan Tg. Priok' },
  'PLUIT': { lat: -6.1338, lon: 106.7904, name: 'Pluit/Muara Karang' },
  'CLINCING': { lat: -6.1186, lon: 106.9506, name: 'Cilincing' },
  'CENGKARENG': { lat: -6.1376, lon: 106.7364, name: 'Cengkareng' },
  'GROGOL': { lat: -6.1614, lon: 106.7889, name: 'Grogol/Trisakti' },
  'MONAS': { lat: -6.1754, lon: 106.8272, name: 'Monas/Gambir' },
  'TN_ABANG': { lat: -6.1862, lon: 106.8138, name: 'Tanah Abang' },
  'MANGGARAI': { lat: -6.2067, lon: 106.8503, name: 'Pintu Air Manggarai' },
  'KELAPA_GD': { lat: -6.1571, lon: 106.9006, name: 'Kelapa Gading' },
  'CAKUNG': { lat: -6.1724, lon: 106.9443, name: 'Cakung/Pulo Gadung' },
  'JATINEGARA': { lat: -6.2150, lon: 106.8705, name: 'Jatinegara/Kp. Melayu' },
  'BLOK_M': { lat: -6.2443, lon: 106.7996, name: 'Blok M' },
  'CILANDAK': { lat: -6.2914, lon: 106.8044, name: 'Cilandak/Kemang' },
  'PS_MINGGU': { lat: -6.2856, lon: 106.8428, name: 'Pasar Minggu' }
};

// blueprint for a single flood report
interface FloodData {
  locationId: string;
  locationName: string;
  floodLevel: number; // alert level in: 0-4
  riverDischarge: number;
  confidence: number;
  timestamp: Date;
}

class FloodDataService {
  private floodApiUrl = "https://flood-api.open-meteo.com/v1/flood";

  /**
   * Fetch flood data for a specific location
   */
  // send a request
  async fetchLocationFloodData(lat: number, lon: number): Promise<number> {
    try {
      const params = {
        latitude: lat,
        longitude: lon,
        daily: "river_discharge",
        models: ["forecast_v4"], // Use one model for speed
        timezone: "Asia/Jakarta",
        forecast_days: 1 // Only for today
      };

      const responses = await fetchWeatherApi(this.floodApiUrl, params);
      
      // Safety check: Did the API return nothing?
      if (!responses || responses.length === 0) {
        console.warn('No flood data received');
        return 0;
      }

      const response = responses[0];
      const daily = response.daily();
      
      if (!daily) {
        return 0;
      }

      //Extract the specific variable we asked for (river_discharge is index 0)
      const riverDischargeArray = daily.variables(0)?.valuesArray();
      
      if (!riverDischargeArray || riverDischargeArray.length === 0) {
        return 0;
      }

      // Get today's discharge (first value)
      const todayDischarge = riverDischargeArray[0];
      
      // Convert discharge to flood level (0-4)
      return this.dischargeToFloodLevel(todayDischarge);

    } catch (error) {
      console.error('Error fetching flood data:', error);
      return 0;
    }
  }

  /**
   * Convert river discharge (m³/s) to flood level (0-4)
   * Based on typical Jakarta river discharge thresholds
   */
  private dischargeToFloodLevel(discharge: number): number {
    if (isNaN(discharge) || discharge === null) return 0;
    
    // Jakarta river discharge thresholds (approximate)
    // Normal: 0-100 m³/s
    // Alert: 100-200 m³/s
    // Warning: 200-300 m³/s
    // Danger: 300-400 m³/s
    // Extreme: >400 m³/s
    
    if (discharge < 100) return 0;
    if (discharge < 200) return 1;
    if (discharge < 300) return 2;
    if (discharge < 400) return 3;
    return 4;
  }

  /**
   * Fetch flood data for all Jakarta locations
   * This is the main function you'll call from your app
   */
  async getAllFloodLevels(): Promise<Record<string, number>> {
    const floodLevels: Record<string, number> = {};
    
    console.log('🌊 Fetching real flood data from Open-Meteo...');

    // Fetch data for all locations in parallel
    // 1. Create a list of "Tasks" (Promises)
    const promises = Object.entries(ZONE_COORDINATES).map(
      async ([locationId, coords]) => {
        try {
          // Trigger the fetch for this specific location
          const level = await this.fetchLocationFloodData(coords.lat, coords.lon);
          return { locationId, level };
        } catch (error) {
          console.error(`Error for ${locationId}:`, error);
          return { locationId, level: 0 }; // Return safe default on error
        }
      }
    );

    // 2. Wait for every singlr request has come back
    const results = await Promise.all(promises);
    
    // 3. Organize the results into a single object
    results.forEach(({ locationId, level }) => {
      floodLevels[locationId] = level;
      console.log(`  ${locationId}: Level ${level}`);
    });

    console.log('✅ Flood data fetched successfully!');
    return floodLevels;
  }

  /**
   * Get detailed flood data with metadata (optional, for advanced use)
   */
  async getDetailedFloodData(): Promise<FloodData[]> {
    const detailedData: FloodData[] = [];

    for (const [locationId, coords] of Object.entries(ZONE_COORDINATES)) {
      try {
        const params = {
          latitude: coords.lat,
          longitude: coords.lon,
          daily: "river_discharge",
          models: ["forecast_v4"],
          timezone: "Asia/Jakarta",
          forecast_days: 1
        };

        const responses = await fetchWeatherApi(this.floodApiUrl, params);
        const response = responses[0];
        const daily = response.daily();
        
        if (!daily) continue;

        const riverDischargeArray = daily.variables(0)?.valuesArray();
        const todayDischarge = riverDischargeArray?.[0] || 0;
        const floodLevel = this.dischargeToFloodLevel(todayDischarge);

        // Calculate confidence based on model
        const confidence = response.model() === 0 ? 0.9 : 0.8;

        detailedData.push({
          locationId,
          locationName: coords.name,
          floodLevel,
          riverDischarge: todayDischarge,
          confidence,
          timestamp: new Date()
        });

      } catch (error) {
        console.error(`Error for ${locationId}:`, error);
      }
    }

    return detailedData;
  }
}

// Export singleton instance
export const floodDataService = new FloodDataService();