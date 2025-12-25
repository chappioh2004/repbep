// Mock data for Repbep platform

export const mockUser = {
  id: '1',
  email: 'demo@repbep.com',
  displayName: 'Alex Johnson',
  bio: 'Full-stack developer passionate about AI and automation',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  theme: 'dark',
  colorScheme: 'emerald',
  socialLinks: {
    github: 'https://github.com/alexjohnson',
    twitter: 'https://twitter.com/alexjohnson',
    linkedin: 'https://linkedin.com/in/alexjohnson'
  },
  workspaceSettings: {
    autoSave: true,
    codeCompletion: true,
    notifications: true
  },
  createdAt: '2024-01-15'
};

export const mockProjects = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration',
    status: 'active',
    lastModified: '2024-07-20T10:30:00Z',
    createdAt: '2024-07-15T08:00:00Z',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    color: 'emerald'
  },
  {
    id: '2',
    name: 'AI Content Generator',
    description: 'Generate blog posts and social media content using AI',
    status: 'active',
    lastModified: '2024-07-19T15:20:00Z',
    createdAt: '2024-07-10T12:00:00Z',
    tech: ['React', 'FastAPI', 'OpenAI'],
    color: 'blue'
  },
  {
    id: '3',
    name: 'Task Management App',
    description: 'Collaborative task management with real-time updates',
    status: 'completed',
    lastModified: '2024-07-18T09:45:00Z',
    createdAt: '2024-06-20T10:00:00Z',
    tech: ['React', 'Firebase', 'Tailwind'],
    color: 'purple'
  }
];

export const mockConversations = [
  {
    id: '1',
    projectId: '1',
    title: 'Build payment integration',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'Add Stripe payment integration to the checkout page',
        timestamp: '2024-07-20T10:30:00Z'
      },
      {
        id: 'm2',
        role: 'assistant',
        content: 'I\'ll help you integrate Stripe into your checkout page. Let me create the payment flow with the following components:\n\n1. Stripe checkout form component\n2. Payment processing API endpoint\n3. Success/failure handling\n\nShould I proceed with the implementation?',
        timestamp: '2024-07-20T10:30:15Z'
      },
      {
        id: 'm3',
        role: 'user',
        content: 'Yes, please proceed',
        timestamp: '2024-07-20T10:31:00Z'
      }
    ],
    createdAt: '2024-07-20T10:30:00Z'
  }
];

export const mockFeatures = [
  {
    icon: 'Zap',
    title: 'AI-Powered Development',
    description: 'Build full-stack applications using natural language. Our AI agents understand your requirements and generate production-ready code.'
  },
  {
    icon: 'Code',
    title: 'Real Code, No Lock-in',
    description: 'Export your entire codebase anytime. Built with React, FastAPI, and MongoDB - standard technologies you already know.'
  },
  {
    icon: 'Layers',
    title: 'Multi-Agent System',
    description: 'Specialized agents for frontend, backend, testing, and deployment work together to build your application.'
  },
  {
    icon: 'Rocket',
    title: 'Deploy Instantly',
    description: 'Push to production with a single click. Automatic scaling, monitoring, and continuous deployment included.'
  },
  {
    icon: 'Users',
    title: 'Collaborative Workspace',
    description: 'Invite team members, share projects, and build together in real-time with built-in version control.'
  },
  {
    icon: 'Shield',
    title: 'Enterprise Security',
    description: 'SOC 2 compliant infrastructure with end-to-end encryption, regular audits, and compliance certifications.'
  }
];

export const mockPricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out Repbep',
    features: [
      '2 projects',
      'Basic AI assistance',
      'Community support',
      '500 AI generations/month',
      'Standard deployment'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For professional developers',
    features: [
      'Unlimited projects',
      'Advanced AI models',
      'Priority support',
      'Unlimited AI generations',
      'Custom domains',
      'Team collaboration (5 members)',
      'GitHub integration'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantees',
      'On-premise deployment',
      'Advanced security'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export const mockTestimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder, TechStart',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content: 'Repbep helped us launch our MVP in just 2 weeks. The AI agents understood exactly what we needed and delivered production-ready code.'
  },
  {
    name: 'Michael Rodriguez',
    role: 'CTO, GrowthLabs',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    content: 'Game changer for our development workflow. We\'ve reduced development time by 60% while maintaining high code quality.'
  },
  {
    name: 'Emily Watson',
    role: 'Lead Developer, CloudSync',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    content: 'The multi-agent system is incredibly powerful. It feels like having a whole development team at your fingertips.'
  }
];
