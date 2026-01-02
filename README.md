# 🌊 Flood Logistics Optimization System

Real-time logistics route optimization during flood conditions in Jakarta, Indonesia.

(<img width="741" height="516" alt="image" src="https://github.com/user-attachments/assets/edd7f84e-e4cd-4e6b-8884-834aa9d6a66c" />)

## 😮‍💨 Problem

Jakarta experiences severe flooding during monsoon season, creating significant challenges for logistics operations. Traditional routing systems optimize for distance and traffic but **fail to account for rapidly changing flood conditions**.

**Current Limitations:**
- Route planning doesn't integrate real-time flood data
- Dispatchers make manual adjustments during flood events
- Drivers lack current flood information
- Routes become impassable without warning

**The Technical Gap:**
While real-time flood data is available from satellite and ground sensors, this data isn't integrated into logistics route optimization systems.

**The Opportunity:**
This project demonstrates how integrating real-time river discharge data with intelligent pathfinding algorithms can enable flood-aware route planning.


## 🪄 Approach (Features)

- **Real-Time Flood Data**: Integrates with Open-Meteo Flood API
- **Route Optimization**: Dijkstra algorithm with flood-level penalties
- **Interactive Visualization**: SVG-based map with step-by-step playback
- **Cost Analysis**: Detailed breakdown of route segments
- **Multiple Vehicles**: Truck and motorcycle options with different flood tolerances

## 🛠️ Tech Stack

- **Frontend**: React 18, JavaScript, TypeScript
- **Styling**: Tailwind CSS
- **API**: Open-Meteo Flood API
- **Algorithm**: Modified Dijkstra with branch & bound
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📊 How It Works

1. **Data Acquisition**: Fetches river discharge data from satellite/ground sensors
2. **Conversion**: Transforms discharge (m³/s) to flood risk levels (0-4)
3. **Optimization**: Calculates optimal route avoiding high-risk areas
4. **Visualization**: Displays route with real-time algorithm execution

## 🎯 Algorithm
```javascript
Cost = Distance × (1 + (FloodLevel × 0.5))

If FloodLevel > VehicleMaxLevel:
  Cost = Infinity (blocked)
```

## 📦 Installation

\`\`\`bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/flood-logistics-app.git
cd flood-logistics-app

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

## 🌐 Live Demo

[View Live Demo](https://your-deployed-url.vercel.app)

## 📸 Screenshots

### Main Dashboard
<img width="1451" height="995" alt="image" src="https://github.com/user-attachments/assets/1f9a29c0-7c4a-498a-86e3-a2aff2b40199" />

### Real-Time Data
<img width="874" height="906" alt="image" src="https://github.com/user-attachments/assets/18f67a69-b225-4b63-83f4-874423cfb8b9" />

### Algorithm Playback
<img width="1483" height="955" alt="image" src="https://github.com/user-attachments/assets/fdc043b8-a23b-4348-b2d4-143c6e43c63a" />

## 🔧 Configuration

Create `.env` file (optional):
\`\`\`
VITE_API_URL=https://flood-api.open-meteo.com
\`\`\`

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 👨‍💻 Author
**Your Name**
- GitHub: [@yourusername](https://github.com/nayyaraazra)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com) for free flood data API
- Jakarta geography data
- Inspired by real-world logistics challenges
  
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
