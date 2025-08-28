# 🔧 Technical Deep Dive - MC Taxi Calculator

## 🏗️ Architecture Patterns

### **Clean Architecture Implementation**

```
┌─────────────────────────────────────────┐
│              Presentation Layer          │
│  ┌─────────────┐    ┌─────────────────┐ │
│  │   Next.js   │    │   React Hooks   │ │
│  │  Frontend   │    │   State Mgmt    │ │
│  └─────────────┘    └─────────────────┘ │
└─────────────────────────────────────────┘
                     │
┌─────────────────────────────────────────┐
│              API Gateway Layer           │
│  ┌─────────────┐    ┌─────────────────┐ │
│  │  Express.js │    │   Middleware    │ │
│  │   Router    │    │  Rate Limiting  │ │
│  └─────────────┘    └─────────────────┘ │
└─────────────────────────────────────────┘
                     │
┌─────────────────────────────────────────┐
│             Business Logic Layer         │
│  ┌─────────────┐    ┌─────────────────┐ │
│  │    Fare     │    │   Validation    │ │
│  │ Calculator  │    │    Service      │ │
│  └─────────────┘    └─────────────────┘ │
└─────────────────────────────────────────┘
                     │
┌─────────────────────────────────────────┐
│              Data Access Layer           │
│  ┌─────────────┐    ┌─────────────────┐ │
│  │  MongoDB    │    │    Mongoose     │ │
│  │   Atlas     │    │      ODM        │ │
│  └─────────────┘    └─────────────────┘ │
└─────────────────────────────────────────┘
```

### **Design Patterns Used**

1. **MVC Pattern**: Model-View-Controller separation
2. **Repository Pattern**: Data access abstraction
3. **Factory Pattern**: Component creation (React components)
4. **Observer Pattern**: State management with hooks
5. **Middleware Pattern**: Express.js request processing
6. **Singleton Pattern**: Database connection management

## 🎨 Frontend Architecture

### **Component Hierarchy**

```typescript
// Component structure
app/
├── page.tsx                 // Main application page
├── layout.tsx              // Root layout with fonts
├── globals.css             // Global styles and design tokens
├── components/
│   ├── ui/                 // Reusable UI components
│   │   ├── Modal.tsx       // Modal wrapper
│   │   ├── MonitoringModal.tsx // Admin panel
│   │   └── Button.tsx      // Button component
│   ├── Header.tsx          // Application header
│   ├── VehicleSelector.tsx // Vehicle selection logic
│   ├── DistanceInput.tsx   // Distance input with validation
│   ├── CalculateButton.tsx // Calculation trigger
│   ├── FareResult.tsx      // Results display
│   ├── ErrorMessage.tsx    // Error handling
│   ├── ResetButton.tsx     // Reset functionality
│   └── Footer.tsx          // Application footer
├── hooks/
│   └── useFareCalculator.ts // Main business logic hook
└── lib/
    └── utils.ts            // Utility functions
```

### **State Management Strategy**

```typescript
// Custom hook pattern for state management
export function useFareCalculator() {
  // Local state management
  const [distance, setDistance] = useState('');
  const [vehicleType, setVehicleType] = useState('motorcycle');
  const [fare, setFare] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Business logic encapsulation
  const validateDistance = (distanceValue: number): string | null => {
    // Validation logic
  };

  const calculateFare = async () => {
    // API interaction logic
  };

  // Return interface
  return {
    // State
    distance, vehicleType, fare, error, loading,
    // Actions
    setDistance, setVehicleType, calculateFare, reset,
    // Computed
    canCalculate, showReset
  };
}
```

### **TypeScript Integration**

```typescript
// Type definitions
interface FareCalculationResult {
  success: boolean;
  data?: {
    totalFare: number;
    breakdown: string;
  };
  message?: string;
}

interface VehicleOption {
  id: string;
  name: string;
  emoji: string;
  icon: LucideIcon;
  description: string;
}

// Props with strict typing
interface VehicleSelectorProps {
  selectedVehicle: string;
  onVehicleChange: (vehicle: string) => void;
}
```

## 🚀 Backend Architecture

### **Express.js Server Structure**

```javascript
// Server initialization with middleware stack
const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request processing
app.use(express.json());
app.use(morgan('combined'));

// Custom middleware
app.use(metrics.httpRequestsMiddleware);
app.use('/api', validateFareRequest);

// Route handling
app.use('/api', fareRoutes);
app.use('/api', healthRoutes);
app.use('/metrics', metricsRoutes);
```

### **Database Schema Design**

```javascript
// Fare Calculation Model
const fareCalculationSchema = new mongoose.Schema({
  distance: {
    type: Number,
    required: true,
    min: 1,
    max: 1000
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['motorcycle', 'car']
  },
  totalFare: {
    type: Number,
    required: true
  },
  breakdown: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String
});

// Indexes for performance
fareCalculationSchema.index({ timestamp: -1 });
fareCalculationSchema.index({ vehicleType: 1, timestamp: -1 });
```

### **Error Handling Strategy**

```javascript
// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
```

## 📊 Monitoring Implementation

### **Prometheus Metrics Collection**

```javascript
// Custom metrics definitions
const promClient = require('prom-client');

// HTTP request metrics
const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Business metrics
const fareCalculationsTotal = new promClient.Counter({
  name: 'fare_calculations_total',
  help: 'Total number of fare calculations performed',
  labelNames: ['vehicle_type', 'status']
});

const fareCalculationDuration = new promClient.Histogram({
  name: 'fare_calculation_duration_seconds',
  help: 'Duration of fare calculations',
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Middleware implementation
const httpRequestsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    
    httpRequestsTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });
  
  next();
};
```

### **Health Check Implementation**

```javascript
// Comprehensive health check
app.get('/api/health', async (req, res) => {
  try {
    // Database connectivity check
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Memory usage check
    const memUsage = process.memoryUsage();
    
    // Uptime calculation
    const uptime = process.uptime();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      database: dbStatus,
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024),
        total: Math.round(memUsage.heapTotal / 1024 / 1024)
      },
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

## 🎨 UI/UX Implementation

### **Design System Architecture**

```css
/* Design tokens in globals.css */
:root {
  /* Color system with HSL values for better manipulation */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  --muted: 210 40% 96%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.75rem;
}

/* Dark mode overrides */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... other dark mode values */
}
```

### **Animation System**

```typescript
// Framer Motion animation patterns
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Custom animation hooks
export const useStaggerAnimation = () => {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }
  };
};
```

### **Responsive Design Strategy**

```typescript
// Tailwind configuration for responsive design
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    }
  }
};

// Responsive component patterns
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
```

## 🔒 Security Implementation

### **Input Validation**

```javascript
// Joi validation schemas
const fareRequestSchema = Joi.object({
  distance: Joi.number()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'number.min': 'Distance must be at least 1km',
      'number.max': 'Distance cannot exceed 1000km'
    }),
  vehicleType: Joi.string()
    .valid('motorcycle', 'car')
    .required(),
  clientId: Joi.string()
    .min(1)
    .max(100)
    .required()
});

// Validation middleware
const validateFareRequest = (req, res, next) => {
  const { error } = fareRequestSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: error.details[0].message
    });
  }
  next();
};
```

### **Rate Limiting Strategy**

```javascript
// Advanced rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.',
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// Different limits for different endpoints
app.use('/api/calculate-fare', createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  50, // 50 requests per window
  'Too many fare calculations'
));
```

## 🚀 Performance Optimizations

### **Frontend Optimizations**

```typescript
// Code splitting with dynamic imports
const MonitoringModal = dynamic(
  () => import('./components/ui/MonitoringModal'),
  { ssr: false }
);

// Image optimization
import Image from 'next/image';

// Memoization patterns
const MemoizedVehicleSelector = React.memo(VehicleSelector);

// Custom hooks for performance
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

### **Backend Optimizations**

```javascript
// Database connection optimization
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  bufferMaxEntries: 0
});

// Response compression
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024
}));

// Caching strategy
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      res.sendResponse(body);
    };
    
    next();
  };
};
```

## 🧪 Testing Strategy

### **Frontend Testing**

```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { VehicleSelector } from '../components/VehicleSelector';

describe('VehicleSelector', () => {
  it('should select vehicle on click', () => {
    const mockOnChange = jest.fn();
    render(
      <VehicleSelector 
        selectedVehicle="motorcycle" 
        onVehicleChange={mockOnChange} 
      />
    );
    
    fireEvent.click(screen.getByText('Car'));
    expect(mockOnChange).toHaveBeenCalledWith('car');
  });
});

// Hook testing
import { renderHook, act } from '@testing-library/react';
import { useFareCalculator } from '../hooks/useFareCalculator';

describe('useFareCalculator', () => {
  it('should calculate fare correctly', async () => {
    const { result } = renderHook(() => useFareCalculator());
    
    act(() => {
      result.current.setDistance('10');
      result.current.setVehicleType('motorcycle');
    });
    
    await act(async () => {
      await result.current.calculateFare();
    });
    
    expect(result.current.fare).toBeGreaterThan(0);
  });
});
```

### **Backend Testing**

```javascript
// API testing with Supertest
const request = require('supertest');
const app = require('../server');

describe('POST /api/calculate-fare', () => {
  it('should calculate fare for valid input', async () => {
    const response = await request(app)
      .post('/api/calculate-fare')
      .send({
        distance: 10,
        vehicleType: 'motorcycle',
        clientId: 'test-client'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.totalFare).toBeGreaterThan(0);
  });
  
  it('should reject invalid distance', async () => {
    const response = await request(app)
      .post('/api/calculate-fare')
      .send({
        distance: -1,
        vehicleType: 'motorcycle',
        clientId: 'test-client'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
```

## 📈 Scalability Patterns

### **Horizontal Scaling Preparation**

```javascript
// Stateless application design
// No server-side sessions, all state in database or client

// Database connection with replica sets
const mongoOptions = {
  replicaSet: 'rs0',
  readPreference: 'secondaryPreferred',
  maxPoolSize: 20,
  minPoolSize: 5
};

// Load balancer configuration (nginx.conf)
upstream app_servers {
    server app1:3001;
    server app2:3001;
    server app3:3001;
}

server {
    listen 80;
    location / {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **Microservices Architecture Preparation**

```javascript
// Service boundaries identified
// 1. Fare Calculation Service
// 2. User Management Service  
// 3. Notification Service
// 4. Analytics Service

// API Gateway pattern
const routes = {
  '/api/fare': 'fare-service:3001',
  '/api/users': 'user-service:3002',
  '/api/notifications': 'notification-service:3003',
  '/api/analytics': 'analytics-service:3004'
};
```

This technical overview demonstrates advanced software engineering concepts, architectural thinking, and production-ready implementation patterns that showcase professional-level development skills.
