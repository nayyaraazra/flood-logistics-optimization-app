# 🌊 Flood Logistics Optimization System

Real-time logistics route optimization during flood conditions in Jakarta, Indonesia.

![Project Banner](screenshot.png)

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

- **Frontend**: React 18, TypeScript
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
```typescript
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
![Dashboard](screenshots/dashboard.png)

### Real-Time Data
![Real-Time](screenshots/realtime.png)

### Algorithm Playback
![Playback](screenshots/playback.png)

## 🔧 Configuration

Create `.env` file (optional):
\`\`\`
VITE_API_URL=https://flood-api.open-meteo.com
\`\`\`

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
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
