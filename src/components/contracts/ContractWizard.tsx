import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  CheckCircle2, 
  Search, 
  Trash2, 
  Package,
  Calendar,
  User,
  Info,
  DollarSign,
  Plus,
  Box,
  Truck,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity,
  AlertCircle,
  Filter,
  ArrowUpRight,
  Maximize2,
  Copy,
  Clock,
  MapPin,
  Weight
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const steps = [
  { id: 1, name: 'Contract Details' },
  { id: 2, name: 'Product Selection' },
  { id: 3, name: 'Storage Charges' },
  { id: 4, name: 'Additional Charges' },
  { id: 5, name: 'Review & Submit' },
];

const MOCK_CUSTOMERS = [
  { id: 'C001', name: 'Samsung Electronics', industry: 'Electronics', activeContracts: 3, creditStatus: 'Good' },
  { id: 'C002', name: 'Unilever Indonesia', industry: 'FMCG', activeContracts: 12, creditStatus: 'Good' },
  { id: 'C003', name: 'Indofood CBP', industry: 'FMCG', activeContracts: 5, creditStatus: 'Warning' },
  { id: 'C004', name: 'Toyota Astra Motor', industry: 'Automotive', activeContracts: 1, creditStatus: 'Good' },
];

const MOCK_SALES_MANAGERS = [
  { id: 'USR-101', name: 'Andi Pratama', role: 'Senior Sales', region: 'Jakarta', activeContracts: 42 },
  { id: 'USR-102', name: 'Budi Santoso', role: 'Sales Manager', region: 'Surabaya', activeContracts: 28 },
  { id: 'USR-103', name: 'Citra Dewi', role: 'Account Executive', region: 'Bandung', activeContracts: 15 },
];

const MOCK_PRODUCTS = [
  { sku: 'SKU-ELEC-001', name: 'LED Smart TV 55"', category: 'Electronics', unit: 'Pack', warehouse: 'Jakarta DC', inventory: 1250, lastPrice: 45000, status: 'In Stock' },
  { sku: 'SKU-ELEC-002', name: 'Refrigerator Side-by-Side', category: 'Electronics', unit: 'Volume', warehouse: 'Surabaya Hub', inventory: 450, lastPrice: 120000, status: 'In Stock' },
  { sku: 'SKU-FMCG-001', name: 'Cooking Oil 2L (Box)', category: 'FMCG', unit: 'Pallet', warehouse: 'Jakarta DC', inventory: 2800, lastPrice: 2500, status: 'In Stock' },
  { sku: 'SKU-FMCG-002', name: 'Wheat Flour 25Kg', category: 'FMCG', unit: 'Weight', warehouse: 'Semarang WH', inventory: 15, lastPrice: 1200, status: 'Low Stock' },
  { sku: 'SKU-PHAR-001', name: 'Medical Masks (Box 50)', category: 'Pharmaceutical', unit: 'Pack', warehouse: 'Jakarta DC', inventory: 5000, lastPrice: 15000, status: 'In Stock' },
  { sku: 'SKU-RETA-001', name: 'Denim Jacket XL', category: 'Retail', warehouse: 'Bandung WH', inventory: 0, lastPrice: 85000, status: 'Out of Stock', unit: 'Pack' },
];

const PRICING_UNITS = [
  { id: 'Pack', name: 'Pack / Karton', description: 'Pricing per individual packaging' },
  { id: 'Weight', name: 'Weight (Kg / Ton)', description: 'Pricing based on mass' },
  { id: 'Storage', name: 'Storage Level', description: 'Pricing by warehouse position' },
  { id: 'Fleet', name: 'Fleet', description: 'Pricing per transport vehicle' },
  { id: 'Volume', name: 'Volume (CBM)', description: 'Pricing based on space occupied' },
  { id: 'Space', name: 'Booking Space', description: 'Fixed area or slot booking' },
];

// Mock data fetcher
const getContractById = (id: string) => ({
  id,
  name: 'Q2 Supply Chain Agreement',
  customer: MOCK_CUSTOMERS[0],
  status: 'Active',
  start: '2024-01-15',
  end: '2025-01-14',
  accountManager: 'Budi Santoso (Sales)',
  notes: 'Priority handling for electronics with temperature control requirements.',
  selectedProducts: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]],
  storageCharges: [
    { 
      sku: 'SKU-ELEC-001', 
      rules: [{
        id: 'r1',
        type: 'Pack',
        rate: 5000,
        timeUnit: 'Day',
        minThreshold: 100,
        maxThreshold: 1000,
        penaltyFee: 50000,
        gracePeriod: 2,
        notes: 'Fragile handling',
        active: true
      }]
    },
    { 
      sku: 'SKU-ELEC-002', 
      rules: [{
        id: 'r2',
        type: 'Volume',
        rate: 150000,
        timeUnit: 'Month',
        minThreshold: 10,
        maxThreshold: 100,
        penaltyFee: 100000,
        gracePeriod: 0,
        notes: 'Bulky item storage',
        active: true
      }]
    },
  ],
  additionalCharges: [
    { id: 'ac1', name: 'Outbound Handling', category: 'Handling', rate: 2500, unit: 'Per Shipment', taxable: true, notes: 'Standard processing' },
    { id: 'ac2', name: 'Labeling Service', category: 'Documentation', rate: 500, unit: 'Fixed', taxable: false, notes: 'Barcode application' },
  ]
});

export function ContractWizard() {
  const { id } = useParams();
  const isEdit = !!id;
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    contractName: '',
    customerId: '',
    startDate: '',
    endDate: '',
    contractType: 'Standard',
    accountManagerId: 'USR-101',
    currency: 'IDR',
    notes: '',
    tags: [] as string[],
    selectedProducts: [] as any[],
    storageCharges: [] as { sku: string; rules: any[] }[],
    additionalCharges: [
      { id: 'ac1', name: 'Outbound Handling', category: 'Handling', rate: 2500, unit: 'Per Shipment', taxable: true, notes: 'Standard processing' },
      { id: 'ac2', name: 'Labeling Service', category: 'Documentation', rate: 500, unit: 'Fixed', taxable: false, notes: 'Barcode application' },
    ]
  });

  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productFilters, setProductFilters] = useState({
    category: 'All',
    warehouse: 'All',
    unit: 'All',
    status: 'All'
  });
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);

  const toggleProductAccordion = (sku: string) => {
    setExpandedProducts(prev => 
      prev.includes(sku) ? prev.filter(s => s !== sku) : [...prev, sku]
    );
  };

  const filteredCustomers = MOCK_CUSTOMERS.filter(cust => 
    cust.name.toLowerCase().includes(customerSearch.toLowerCase()) || 
    cust.id.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredProducts = MOCK_PRODUCTS.filter(prod => {
    const matchesSearch = prod.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        prod.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productFilters.category === 'All' || prod.category === productFilters.category;
    const matchesWarehouse = productFilters.warehouse === 'All' || prod.warehouse === productFilters.warehouse;
    const matchesUnit = productFilters.unit === 'All' || prod.unit === productFilters.unit;
    const matchesStatus = productFilters.status === 'All' || prod.status === productFilters.status;
    
    return matchesSearch && matchesCategory && matchesWarehouse && matchesUnit && matchesStatus;
  });

  useEffect(() => {
    if (isEdit && id) {
      const data = getContractById(id);
      setFormData({
        contractName: data.name,
        customerId: data.customer.id,
        startDate: data.start,
        endDate: data.end,
        accountManagerId: 'USR-101',
        contractType: 'Standard',
        currency: 'IDR',
        notes: data.notes,
        tags: ['Priority', 'Electronics'],
        selectedProducts: data.selectedProducts,
        storageCharges: data.storageCharges,
        additionalCharges: data.additionalCharges
      });
    }
  }, [id, isEdit]);

  useEffect(() => {
    // End Date Auto-suggest (+1 year)
    if (formData.startDate && !formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(start.setFullYear(start.getFullYear() + 1));
      handleInputChange('endDate', end.toISOString().split('T')[0]);
    }
  }, [formData.startDate]);

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    return months > 0 ? `${months} Months` : `${diffDays} Days`;
  };

  const selectCustomer = (cust: any) => {
    handleInputChange('customerId', cust.id);
    if (!formData.contractName) {
      const year = new Date().getFullYear();
      handleInputChange('contractName', `${cust.name} Contract ${year}`);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleProduct = (product: any) => {
    const isSelected = formData.selectedProducts.find(p => p.sku === product.sku);
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        selectedProducts: prev.selectedProducts.filter(p => p.sku !== product.sku),
        storageCharges: prev.storageCharges.filter(s => s.sku !== product.sku)
      }));
    } else {
      if (formData.selectedProducts.length >= 50) {
        alert('Maximum limit of 50 products reached per contract.');
        return;
      }
      setFormData(prev => ({
        ...prev,
        selectedProducts: [...prev.selectedProducts, product],
        storageCharges: [...prev.storageCharges, { 
          sku: product.sku, 
          rules: [{
            id: Math.random().toString(36).substring(7),
            type: product.unit || 'Pack',
            rate: 0,
            timeUnit: 'Month',
            minThreshold: 0,
            maxThreshold: 0,
            penaltyFee: 0,
            gracePeriod: 0,
            notes: '',
            active: true
          }]
        }]
      }));
    }
  };

  const addPricingRule = (sku: string, type: string = 'Pack') => {
    setFormData(prev => ({
      ...prev,
      storageCharges: prev.storageCharges.map(s => s.sku === sku ? {
        ...s,
        rules: [...s.rules, {
          id: Math.random().toString(36).substring(7),
          type,
          rate: 0,
          timeUnit: 'Month',
          minThreshold: 0,
          maxThreshold: 0,
          penaltyFee: 0,
          gracePeriod: 0,
          notes: '',
          active: true
        }]
      } : s)
    }));
  };

  const removePricingRule = (sku: string, ruleId: string) => {
    setFormData(prev => ({
      ...prev,
      storageCharges: prev.storageCharges.map(s => s.sku === sku ? {
        ...s,
        rules: s.rules.filter(r => r.id !== ruleId)
      } : s)
    }));
  };

  const duplicatePricingRule = (sku: string, rule: any) => {
    setFormData(prev => ({
      ...prev,
      storageCharges: prev.storageCharges.map(s => s.sku === sku ? {
        ...s,
        rules: [...s.rules, { ...rule, id: Math.random().toString(36).substring(7) }]
      } : s)
    }));
  };

  const updatePricingRule = (sku: string, ruleId: string, updates: any) => {
    setFormData(prev => ({
      ...prev,
      storageCharges: prev.storageCharges.map(s => s.sku === sku ? {
        ...s,
        rules: s.rules.map(r => r.id === ruleId ? { ...r, ...updates } : r)
      } : s)
    }));
  };

  const addAdditionalCharge = () => {
    setFormData(prev => ({
      ...prev,
      additionalCharges: [...prev.additionalCharges, { 
        id: Math.random().toString(36).substring(7),
        name: '', 
        category: 'Handling', 
        rate: 0, 
        unit: 'Fixed', 
        taxable: true, 
        notes: '' 
      }]
    }));
  };

  const removeAdditionalCharge = (id: string) => {
    setFormData(prev => ({
      ...prev,
      additionalCharges: prev.additionalCharges.filter((c) => c.id !== id)
    }));
  };

  const updateAdditionalCharge = (id: string, updates: any) => {
    setFormData(prev => ({
      ...prev,
      additionalCharges: prev.additionalCharges.map((c) => c.id === id ? { ...c, ...updates } : c)
    }));
  };

  const duplicateAdditionalCharge = (charge: any) => {
    setFormData(prev => ({
      ...prev,
      additionalCharges: [...prev.additionalCharges, { ...charge, id: Math.random().toString(36).substring(7) }]
    }));
  };
  
  const [tagInput, setTagInput] = useState('');
  const [expandedRules, setExpandedRules] = useState<string[]>([]);

  const toggleRuleAccordion = (ruleId: string) => {
    setExpandedRules(prev => 
      prev.includes(ruleId) ? prev.filter(id => id !== ruleId) : [...prev, ruleId]
    );
  };
  
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Mock auto-save
    const interval = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 2000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const validateStep1 = () => {
    const required = ['contractName', 'customerId', 'startDate', 'endDate', 'accountManagerId'];
    for (const field of required) {
      if (!(formData as any)[field]) {
        alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        return false;
      }
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('End date must be after start date.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && formData.selectedProducts.length === 0) {
      alert('Please select at least one product.');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const saveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Draft saved successfully!');
    }, 1000);
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSubmitModal(false);
      alert(`Contract ${isEdit ? 'Updated' : 'Created'} Successfully!`);
      navigate('/contracts');
    }, 1500);
  };

  const selectedCustomer = MOCK_CUSTOMERS.find(c => c.id === formData.customerId);
  const selectedManager = MOCK_SALES_MANAGERS.find(m => m.id === formData.accountManagerId);

  const estimatedStorageValue = formData.storageCharges.reduce((acc, curr) => 
    acc + (curr.rules?.reduce((rAcc, rCurr) => rAcc + rCurr.rate, 0) || 0)
  , 0);
  
  const estimatedAdditionalValue = formData.additionalCharges.reduce((acc, c) => acc + c.rate, 0);
  const estimatedTaxValue = formData.additionalCharges.filter(c => c.taxable).reduce((acc, c) => acc + (c.rate * 0.11), 0); 
  const totalEstimatedValue = estimatedStorageValue + estimatedAdditionalValue + estimatedTaxValue;

  const validationChecklist = {
    details: !!(formData.contractName && formData.customerId && formData.startDate && formData.endDate),
    products: formData.selectedProducts.length > 0,
    pricing: formData.storageCharges.length > 0 && formData.storageCharges.every(s => s.rules.length > 0),
    additional: formData.additionalCharges.length > 0,
    dates: formData.startDate && formData.endDate && new Date(formData.startDate) < new Date(formData.endDate)
  };

  const isStep5Valid = Object.values(validationChecklist).every(v => v);

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const SummarySection = ({ 
    title, 
    step, 
    children, 
    isExpanded = true,
    onToggle,
    isValid = true
  }: { 
    title: string; 
    step: number; 
    children: React.ReactNode; 
    isExpanded?: boolean;
    onToggle?: () => void;
    isValid?: boolean;
  }) => (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div 
        onClick={onToggle}
        className="px-8 py-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black",
            isValid ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {isValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          </div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h4>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setCurrentStep(step);
            }}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
          >
            Edit Section
          </button>
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
            isExpanded ? "bg-blue-50 text-blue-600 rotate-180" : "bg-slate-50 text-slate-400"
          )}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100"
          >
            <div className="p-8">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const [expandedSections, setExpandedSections] = useState<number[]>([1, 2, 3, 4, 5]);

  const toggleSection = (step: number) => {
    setExpandedSections(prev => 
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  return (
    <div className="max-w-[1440px] w-full mx-auto py-8 px-4 md:px-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Contract Builder v2</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">
            {isEdit ? 'Refine' : 'Architect'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Agreement</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Step {currentStep} of {steps.length}: {steps[currentStep-1].name}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/contracts')}
            className="px-6 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-slate-400 transition-all shadow-sm"
          >
            Cancel Session
          </button>
          <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all">
            <Save className="w-4 h-4" />
            Commit Draft
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-12 relative px-10">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
        <div className="relative z-10 flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center border-4 transition-all duration-500",
                currentStep === step.id 
                  ? "bg-blue-600 border-blue-50 text-white shadow-xl shadow-blue-500/20 scale-110" 
                  : currentStep > step.id 
                    ? "bg-emerald-500 border-emerald-50 text-white" 
                    : "bg-white border-slate-200 text-slate-400"
              )}>
                {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{step.id}</span>}
              </div>
              <span className={cn(
                "mt-3 text-[10px] font-extrabold uppercase tracking-[0.1em]",
                currentStep === step.id ? "text-blue-600" : "text-slate-400"
              )}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-hidden h-[calc(100vh-18rem)] min-h-[800px] flex flex-col">
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-10 h-full overflow-y-auto custom-scrollbar flex flex-col"
              >
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Contract Details</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.05em] mt-1">Set up base information and legal validity period</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        isSaving ? "bg-blue-500 animate-spin" : "bg-emerald-500"
                      )}></div>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                        {isSaving ? 'Directing Sync...' : 'Draft Secured'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  {/* Left Column - Core Data */}
                  <div className="lg:col-span-7 space-y-10">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contract Identification</label>
                      <input 
                        type="text" 
                        value={formData.contractName}
                        onChange={(e) => handleInputChange('contractName', e.target.value)}
                        placeholder="e.g. PT Indo Logistics Contract 2026"
                        className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-500/10 outline-none transition-all font-black text-slate-900 placeholder:text-slate-200" 
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Customer Entity</label>
                      <div className="relative mb-6 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                          type="text"
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          placeholder="Search registered customers..."
                          className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-3xl focus:border-blue-500 shadow-sm outline-none transition-all font-bold text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-3 max-h-[360px] overflow-y-auto pr-4 custom-scrollbar">
                        {filteredCustomers.map(cust => (
                          <div 
                            key={cust.id}
                            onClick={() => selectCustomer(cust)}
                            className={cn(
                              "p-5 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-6 group relative overflow-hidden",
                              formData.customerId === cust.id 
                                ? "bg-blue-50 border-blue-600 shadow-lg shadow-blue-500/10" 
                                : "bg-white border-slate-100/50 hover:border-slate-200"
                            )}
                          >
                            {formData.customerId === cust.id && (
                              <div className="absolute top-0 right-0 p-4">
                                <CheckCircle2 className="w-6 h-6 text-blue-600" />
                              </div>
                            )}
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-black text-lg">
                              {cust.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="font-black text-slate-900">{cust.name}</p>
                              <div className="flex gap-4 mt-1">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{cust.id}</span>
                                <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest bg-blue-100/50 px-2 rounded-md">{cust.industry}</span>
                              </div>
                            </div>
                            <div className="text-right pr-10">
                              <p className="text-xs font-black text-slate-900">{cust.activeContracts}</p>
                              <p className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">Active Contracts</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Governance & Financial */}
                  <div className="lg:col-span-5 space-y-12 bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100">
                    <div className="space-y-6">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Validity Framework</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="text-[9px] font-black text-slate-400 absolute left-6 top-3 uppercase">Start Date</label>
                          <input 
                            type="date" 
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            className="w-full pl-6 pr-4 pt-8 pb-4 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-black text-sm text-slate-900" 
                          />
                        </div>
                        <div className="relative">
                          <label className="text-[9px] font-black text-slate-400 absolute left-6 top-3 uppercase">End Date</label>
                          <input 
                            type="date" 
                            value={formData.endDate}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                            className="w-full pl-6 pr-4 pt-8 pb-4 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-black text-sm text-slate-900" 
                          />
                        </div>
                      </div>
                      {calculateDuration() && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl w-fit">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Duration: {calculateDuration()}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</label>
                      <div className="flex flex-col gap-3">
                        {['Standard', 'Custom', 'Framework'].map(type => (
                          <div 
                            key={type}
                            onClick={() => handleInputChange('contractType', type)}
                            className={cn(
                              "p-4 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all",
                              formData.contractType === type 
                                ? "bg-white border-blue-600 shadow-md transform -translate-x-1" 
                                : "bg-white border-slate-100 opacity-60 hover:opacity-100"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center",
                              formData.contractType === type ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                            )}>
                              {type === 'Standard' ? <FileText className="w-5 h-5" /> : type === 'Custom' ? <Activity className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                            </div>
                            <span className="font-black text-sm text-slate-900 uppercase tracking-widest">{type} Agreement</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Currency</label>
                        <select 
                          value={formData.currency}
                          onChange={(e) => handleInputChange('currency', e.target.value)}
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-black text-sm appearance-none"
                        >
                          <option value="IDR">IDR (Rp)</option>
                          <option value="USD">USD ($)</option>
                          <option value="SGD">SGD (S$)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Account Governance</label>
                        <select 
                          value={formData.accountManagerId}
                          onChange={(e) => handleInputChange('accountManagerId', e.target.value)}
                          className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-black text-sm appearance-none"
                        >
                          {MOCK_SALES_MANAGERS.map(m => (
                            <option key={m.id} value={m.id}>{m.name} ({m.region})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Operational Provisions (Notes)</label>
                      <textarea 
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Define special storage requirements, service level priorities, or regional exclusions..."
                        className="w-full px-6 py-5 bg-white border border-slate-200 rounded-[2rem] focus:border-blue-500 outline-none font-medium text-sm text-slate-600 leading-relaxed resize-none transition-all placeholder:text-slate-200"
                      />
                      <p className="text-right text-[10px] text-slate-300 font-bold mt-2 uppercase tracking-widest">{formData.notes.length} / 500 characters</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col lg:flex-row h-full overflow-hidden"
              >
                {/* Catalog Browser (70%) */}
                <div className="flex-1 flex flex-col p-8 border-r border-slate-100 overflow-hidden bg-slate-50/20">
                  <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Product Selection</h3>
                        <p className="text-sm text-slate-500 font-bold uppercase tracking-tight mt-1">Select one or more products to configure storage pricing</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "px-4 py-2 rounded-xl border flex items-center gap-2 transition-all",
                          formData.selectedProducts.length >= 40 ? "bg-amber-50 border-amber-200 text-amber-700 animate-pulse" : "bg-white border-slate-200 text-slate-600"
                        )}>
                          <Package className="w-4 h-4" />
                          <span className="text-xs font-black uppercase tracking-widest">{formData.selectedProducts.length} / 50 Products</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
                      <div className="md:col-span-2 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                          type="text" 
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search products, SKU, or category..." 
                          className="w-full pl-11 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-blue-500 transition-all outline-none font-bold" 
                        />
                      </div>
                      <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <select 
                          value={productFilters.category}
                          onChange={(e) => setProductFilters(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none hover:bg-slate-100 appearance-none"
                        >
                          <option value="All">All Categories</option>
                          {['Electronics', 'FMCG', 'Pharmaceutical', 'Retail'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <select 
                          value={productFilters.warehouse}
                          onChange={(e) => setProductFilters(prev => ({ ...prev, warehouse: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none hover:bg-slate-100 appearance-none"
                        >
                          <option value="All">All Warehouses</option>
                          {['Jakarta DC', 'Surabaya Hub', 'Semarang WH', 'Bandung WH'].map(wh => <option key={wh} value={wh}>{wh}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm flex-1 flex flex-col">
                    <div className="overflow-auto custom-scrollbar flex-1">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <th className="px-6 py-5 w-12">
                              <div className="w-5 h-5 rounded bg-slate-200 border border-slate-300"></div>
                            </th>
                            <th className="px-6 py-5">Product Information</th>
                            <th className="px-6 py-5">SKU / ID</th>
                            <th className="px-6 py-5">Warehouse</th>
                            <th className="px-6 py-5">Inventory</th>
                            <th className="px-6 py-5">Last Base Price</th>
                            <th className="px-6 py-5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredProducts.map(product => {
                            const isSelected = formData.selectedProducts.find(p => p.sku === product.sku);
                            return (
                              <tr 
                                key={product.sku}
                                onClick={() => toggleProduct(product)}
                                className={cn(
                                  "group cursor-pointer transition-all",
                                  isSelected ? "bg-blue-50/40" : "hover:bg-slate-50"
                                )}
                              >
                                <td className="px-6 py-5">
                                  <div className={cn(
                                    "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                                    isSelected ? "bg-blue-600 border-blue-600" : "bg-white border-slate-300 group-hover:border-blue-400"
                                  )}>
                                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                                      <Box className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{product.name}</p>
                                      <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-black uppercase text-slate-400 rounded-md tracking-widest">{product.category}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">{product.sku}</span>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-slate-300" />
                                    <span className="text-xs font-bold text-slate-600">{product.warehouse}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-black text-slate-900">{product.inventory.toLocaleString()}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.unit}s</span>
                                  </div>
                                </td>
                                <td className="px-6 py-5 font-mono text-[11px]">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-slate-400">Rp</span>
                                    <span className="font-black text-slate-900">{product.lastPrice.toLocaleString()}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-5">
                                  <span className={cn(
                                    "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    product.status === 'In Stock' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                    product.status === 'Low Stock' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                    "bg-rose-50 text-rose-600 border border-rose-100"
                                  )}>
                                    {product.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredProducts.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-24 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 border border-slate-100 shadow-inner">
                                  <Search className="w-8 h-8" />
                                </div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No matching products found</p>
                                <button 
                                  onClick={() => {
                                    setProductSearch('');
                                    setProductFilters({ category: 'All', warehouse: 'All', unit: 'All', status: 'All' });
                                  }}
                                  className="mt-4 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline"
                                >
                                  Reset All Filters
                                </button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Sticky Selected Panel (30%) */}
                <div className="w-full lg:w-96 bg-white flex flex-col shadow-2xl relative z-10">
                  <div className="p-8 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">Basket</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formData.selectedProducts.length} Items Queued</p>
                      </div>
                      <button 
                        onClick={() => setFormData(prev => ({ ...prev, selectedProducts: [], storageCharges: [] }))}
                        className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Info className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-[10px] font-bold text-blue-800 leading-relaxed uppercase tracking-tight">
                        Selected products will appear in Step 3 for granular storage pricing configuration.
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar bg-slate-50/30">
                    {formData.selectedProducts.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale py-20 px-8">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50">
                          <Package className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 leading-relaxed">No products selected from catalog</p>
                        <p className="text-[9px] font-bold text-slate-400 leading-relaxed">Click checkboxes to add items to contract basket</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.selectedProducts.map(product => (
                          <div key={product.sku} className="p-4 bg-white border border-slate-100 rounded-[1.5rem] flex items-center gap-3 shadow-sm hover:shadow-md transition-all group animate-in fade-in slide-in-from-right-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                              <Box className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">{product.name}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono font-bold text-slate-400">{product.sku}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{product.unit}</span>
                              </div>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleProduct(product); }}
                              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-8 border-t border-slate-100 bg-white">
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total SKUs</span>
                        <span className="text-sm font-black text-slate-900">{formData.selectedProducts.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Matrix</span>
                        <span className="text-sm font-black text-slate-900">{formData.selectedProducts.length} Groups</span>
                      </div>
                    </div>
                    
                    <button 
                      disabled={formData.selectedProducts.length === 0}
                      onClick={nextStep}
                      className={cn(
                        "w-full py-5 rounded-3xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]",
                        formData.selectedProducts.length > 0 
                          ? "bg-blue-600 text-white shadow-blue-500/25 hover:bg-blue-700" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      Configure Pricing
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-10 h-full flex flex-col"
              >
                <div className="h-full overflow-y-auto pr-4 custom-scrollbar pb-20 flex-1">
                  <div className="flex items-center justify-between mb-12">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100/50 mb-4">
                          <Activity className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Pricing Configuration</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Storage Charges</h3>
                        <p className="max-w-xl text-slate-500 font-bold text-sm uppercase tracking-tight mt-2">Configure granular pricing logic per SKU. Support for volume-based tiers and cross-hub space booking.</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-right">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Auto-saved</span>
                          </div>
                          <div className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                            Draft
                          </div>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                    
                    {/* Horizontal Real-time Summary */}
                    <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-colors">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Products</p>
                          <p className="text-2xl font-black text-slate-900">{formData.selectedProducts.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Package className="w-6 h-6 text-blue-500" />
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between group hover:border-purple-300 transition-colors">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pricing Rules</p>
                          <p className="text-2xl font-black text-slate-900">
                            {formData.storageCharges.reduce((acc, curr) => acc + (curr.rules?.length || 0), 0)}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Activity className="w-6 h-6 text-purple-500" />
                        </div>
                      </div>

                      <div className="bg-slate-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Contract Base</p>
                        <div className="flex items-baseline gap-1.5 mt-2">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Rp</span>
                          <span className="text-2xl font-black text-white tracking-tighter">
                            {formData.storageCharges.reduce((acc, curr) => 
                              acc + (curr.rules?.reduce((rAcc, rCurr) => rAcc + rCurr.rate, 0) || 0)
                            , 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden flex flex-col justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Integrity Check</p>
                        <div className="flex -space-x-1 overflow-hidden">
                          {formData.selectedProducts.slice(0, 5).map(p => {
                            const hasRules = formData.storageCharges.find(s => s.sku === p.sku)?.rules?.length > 0;
                            return (
                              <div key={p.sku} className={cn(
                                "w-6 h-6 rounded-lg border-2 border-white flex items-center justify-center transition-all hover:scale-125 z-10",
                                hasRules ? "bg-emerald-500" : "bg-rose-400"
                              )}>
                                {hasRules ? <CheckCircle2 className="w-3 h-3 text-white" /> : <AlertCircle className="w-3 h-3 text-white" />}
                              </div>
                            );
                          })}
                          {formData.selectedProducts.length > 5 && (
                            <div className="w-6 h-6 rounded-lg bg-slate-100 border-2 border-white flex items-center justify-center z-0">
                              <span className="text-[8px] font-black text-slate-400">+{formData.selectedProducts.length - 5}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">
                          {formData.storageCharges.filter(s => s.rules?.length > 0).length} of {formData.selectedProducts.length} Ready
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {formData.selectedProducts.map(product => {
                    const charge = formData.storageCharges.find(s => s.sku === product.sku);
                    const isExpanded = expandedProducts.includes(product.sku);
                    
                    return (
                      <div key={product.sku} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                        {/* Product Header */}
                        <div 
                          onClick={() => toggleProductAccordion(product.sku)}
                          className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 select-none hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                              <Box className="w-7 h-7 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-lg leading-tight">{product.name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-tighter">{product.sku}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.category}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Base Unit: {product.unit}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-8">
                            <div className="text-right hidden lg:block">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pricing Bench</p>
                              <div className="flex items-center gap-1.5 justify-end">
                                <span className="text-xs font-black text-slate-700">Rp 120,000</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Last Contract</span>
                              </div>
                            </div>
                            <div className="text-right hidden md:block">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Rules</p>
                              <div className="flex items-center gap-1.5 justify-end">
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                  {charge?.rules?.length || 0} Pricing Rules
                                </span>
                              </div>
                            </div>
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                              isExpanded ? "bg-blue-50 text-blue-600 rotate-180" : "bg-slate-50 text-slate-400"
                            )}>
                              <ChevronDown className="w-5 h-5" />
                            </div>
                          </div>
                        </div>

                        {/* Collapsible Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-slate-50/30 border-t border-slate-100"
                            >
                              <div className="p-8 space-y-8">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Configuration Matrix</h4>
                                  <div className="flex gap-2">
                                    <div className="relative group">
                                      <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                                        <Plus className="w-4 h-4" />
                                        Add Pricing Rule
                                      </button>
                                      {/* Rule Selector Dropdown (Simplified for UI flow) */}
                                      <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 hidden group-hover:block z-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Select Pricing Model</p>
                                        <div className="grid grid-cols-1 gap-1">
                                          {PRICING_UNITS.map(unit => (
                                            <button 
                                              key={unit.id}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                addPricingRule(product.sku, unit.id);
                                              }}
                                              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-blue-50 transition-all text-left"
                                            >
                                              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                                {unit.id === 'Pack' && <Package className="w-5 h-5 text-blue-500" />}
                                                {unit.id === 'Weight' && <Weight className="w-5 h-5 text-emerald-500" />}
                                                {unit.id === 'Storage' && <Layers className="w-5 h-5 text-amber-500" />}
                                                {unit.id === 'Fleet' && <Truck className="w-5 h-5 text-rose-500" />}
                                                {unit.id === 'Volume' && <Box className="w-5 h-5 text-indigo-500" />}
                                                {unit.id === 'Space' && <MapPin className="w-5 h-5 text-purple-500" />}
                                              </div>
                                              <div>
                                                <p className="text-xs font-black text-slate-900">{unit.name}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{unit.description}</p>
                                              </div>
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {(!charge?.rules || charge.rules.length === 0) ? (
                                  <div className="py-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                                    <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                      <Activity className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <p className="text-slate-400 font-extrabold uppercase tracking-widest text-sm">No rules configured for this SKU</p>
                                    <button onClick={() => addPricingRule(product.sku)} className="mt-4 text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Create First Rule</button>
                                  </div>
                                ) : (
                                  <div className="space-y-6">
                                    {charge?.rules?.map((rule: any, idx: number) => (
                                      <div key={rule.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                        {/* Rule Header */}
                                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
                                          <div className="flex items-center gap-4">
                                            <div className="w-2 h-10 bg-blue-500 rounded-full scale-y-75"></div>
                                            <div>
                                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Rule #{idx + 1}</span>
                                              <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">{rule.type}</span>
                                                <span className="text-sm font-black text-slate-900">Pricing Configuration</span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <button 
                                              onClick={() => duplicatePricingRule(product.sku, rule)}
                                              className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                              title="Duplicate Rule"
                                            >
                                              <Copy className="w-4.5 h-4.5" />
                                            </button>
                                            <button 
                                              onClick={() => removePricingRule(product.sku, rule.id)}
                                              className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                              title="Delete Rule"
                                            >
                                              <Trash2 className="w-4.5 h-4.5" />
                                            </button>
                                          </div>
                                        </div>

                                        {/* Rule Configuration Content */}
                                        <div className="p-8 space-y-12">
                                          
                                          {/* Section B — Pricing Configuration */}
                                          <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                              <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Section B — Pricing Configuration</h5>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                              {/* Rate Price */}
                                              <div className="space-y-3">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rate Price (IDR)</label>
                                                <div className="relative group">
                                                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                                  <input 
                                                    type="number" 
                                                    value={rule.rate}
                                                    onChange={(e) => updatePricingRule(product.sku, rule.id, { rate: Number(e.target.value) })}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-black text-sm text-slate-900 transition-all"
                                                    placeholder="0.00"
                                                  />
                                                </div>
                                              </div>

                                              {/* Unit Specific Detail */}
                                              <div className="space-y-3">
                                                {rule.type === 'Pack' && (
                                                  <>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quantity per Unit</label>
                                                    <input 
                                                      type="number" 
                                                      value={rule.packQty || 1}
                                                      onChange={(e) => updatePricingRule(product.sku, rule.id, { packQty: Number(e.target.value) })}
                                                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-black text-sm transition-all"
                                                      placeholder="e.g. 24"
                                                    />
                                                  </>
                                                )}

                                                {rule.type === 'Weight' && (
                                                  <>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Weight Unit</label>
                                                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                                                      {['Kg', 'Ton'].map(w => (
                                                        <button 
                                                          key={w}
                                                          onClick={() => updatePricingRule(product.sku, rule.id, { weightUnit: w })}
                                                          className={cn(
                                                            "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                                            rule.weightUnit === w ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400"
                                                          )}
                                                        >
                                                          {w}
                                                        </button>
                                                      ))}
                                                    </div>
                                                  </>
                                                )}

                                                {rule.type === 'Storage' && (
                                                  <>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Storage Type</label>
                                                    <select 
                                                      value={rule.storageType || 'Pallet'}
                                                      onChange={(e) => updatePricingRule(product.sku, rule.id, { storageType: e.target.value })}
                                                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-black text-sm transition-all"
                                                    >
                                                      <option value="Pallet">Pallet</option>
                                                      <option value="Rack">Rack</option>
                                                      <option value="Bin">Bin</option>
                                                    </select>
                                                  </>
                                                )}

                                                {rule.type === 'Fleet' && (
                                                  <>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fleet Type</label>
                                                    <select 
                                                      value={rule.fleetType || 'Truck CDDL'}
                                                      onChange={(e) => updatePricingRule(product.sku, rule.id, { fleetType: e.target.value })}
                                                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-black text-sm transition-all"
                                                    >
                                                      <option value="Truck CDDL">Truck CDDL</option>
                                                      <option value="Container 20FT">Container 20FT</option>
                                                      <option value="Wingbox">Wingbox</option>
                                                    </select>
                                                  </>
                                                )}

                                                {rule.type === 'Volume' && (
                                                  <>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Volume Unit</label>
                                                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                                                      {['CBM', 'm³', 'ft³'].map(v => (
                                                        <button 
                                                          key={v}
                                                          onClick={() => updatePricingRule(product.sku, rule.id, { volumeUnit: v })}
                                                          className={cn(
                                                            "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                                            rule.volumeUnit === v ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"
                                                          )}
                                                        >
                                                          {v}
                                                        </button>
                                                      ))}
                                                    </div>
                                                  </>
                                                )}

                                                {rule.type === 'Space' && (
                                                  <>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pricing Type</label>
                                                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                                                      {['Fixed', 'Variable'].map(pt => (
                                                        <button 
                                                          key={pt}
                                                          onClick={() => updatePricingRule(product.sku, rule.id, { pricingType: pt })}
                                                          className={cn(
                                                            "flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                                            (rule.pricingType || 'Fixed') === pt ? "bg-white text-purple-600 shadow-sm" : "text-slate-400"
                                                          )}
                                                        >
                                                          {pt}
                                                        </button>
                                                      ))}
                                                    </div>
                                                  </>
                                                )}
                                              </div>

                                              {/* Time Unit */}
                                              {!(rule.type === 'Space' && (rule.pricingType || 'Fixed') === 'Fixed') && (
                                                <div className="space-y-3">
                                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Time Unit</label>
                                                  <select 
                                                    value={rule.timeUnit}
                                                    onChange={(e) => updatePricingRule(product.sku, rule.id, { timeUnit: e.target.value })}
                                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-black text-sm transition-all"
                                                  >
                                                    <option value="Day">Per Day</option>
                                                    <option value="Month">Per Month</option>
                                                  </select>
                                                </div>
                                              )}
                                              
                                              {/* Location selector for Space Booking */}
                                              {rule.type === 'Space' && (
                                                <div className="col-span-full space-y-3">
                                                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Location Selector</label>
                                                  <div className="flex flex-wrap gap-2">
                                                    {['JKT-01', 'SUB-02', 'BDG-01', 'MDN-01', 'SEM-02'].map(loc => {
                                                      const current = rule.locationIds || [];
                                                      const isSelected = current.includes(loc);
                                                      return (
                                                        <button 
                                                          key={loc}
                                                          onClick={() => {
                                                            const next = isSelected ? current.filter((l: string) => l !== loc) : [...current, loc];
                                                            updatePricingRule(product.sku, rule.id, { locationIds: next });
                                                          }}
                                                          className={cn(
                                                            "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                                            isSelected ? "bg-purple-600 text-white border-purple-600 shadow-md" : "bg-white text-slate-400 border-slate-200"
                                                          )}
                                                        >
                                                          {loc}
                                                        </button>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                            
                                            {/* Preview Text */}
                                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50 flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Effective Pricing Preview</span>
                                              </div>
                                              <p className="font-mono text-xs font-black text-emerald-600">
                                                Rp {rule.rate.toLocaleString()} / {rule.type} / {rule.timeUnit}
                                              </p>
                                            </div>
                                          </div>

                                          {/* Section C — Penalty Configuration */}
                                          <div className="space-y-6">
                                            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                                              <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Section C — Penalty Configuration</h5>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                              <div className="space-y-3">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                  {rule.type === 'Pack' && 'Minimum Quantity'}
                                                  {rule.type === 'Weight' && 'Minimum Weight'}
                                                  {rule.type === 'Storage' && 'Minimum Quantity'}
                                                  {rule.type === 'Fleet' && 'Minimum Fleet Count'}
                                                  {rule.type === 'Volume' && 'Minimum Volume'}
                                                  {rule.type === 'Space' && 'Minimum Usage'}
                                                </label>
                                                <input 
                                                  type="number" 
                                                  value={rule.minThreshold}
                                                  onChange={(e) => updatePricingRule(product.sku, rule.id, { minThreshold: Number(e.target.value) })}
                                                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-rose-500 outline-none font-black text-sm transition-all"
                                                />
                                              </div>

                                              <div className="space-y-3">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                  {rule.type === 'Pack' && 'Maximum Quantity'}
                                                  {rule.type === 'Weight' && 'Maximum Weight'}
                                                  {rule.type === 'Storage' && 'Maximum Quantity'}
                                                  {rule.type === 'Fleet' && 'Maximum Fleet Count'}
                                                  {rule.type === 'Volume' && 'Maximum Volume'}
                                                  {rule.type === 'Space' && 'Maximum Usage'}
                                                </label>
                                                <input 
                                                  type="number" 
                                                  value={rule.maxThreshold}
                                                  onChange={(e) => updatePricingRule(product.sku, rule.id, { maxThreshold: Number(e.target.value) })}
                                                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-slate-500 outline-none font-black text-sm transition-all"
                                                />
                                              </div>

                                              <div className="space-y-3">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                  {rule.type === 'Pack' && 'Min Quantity Penalty'}
                                                  {rule.type === 'Weight' && 'Min Weight Penalty'}
                                                  {rule.type === 'Storage' && 'Penalty'}
                                                  {rule.type === 'Fleet' && 'Penalty'}
                                                  {rule.type === 'Volume' && 'Penalty'}
                                                  {rule.type === 'Space' && 'Penalty Fee'}
                                                </label>
                                                <div className="relative group">
                                                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                                                  <input 
                                                    type="number" 
                                                    value={rule.penaltyFee}
                                                    onChange={(e) => updatePricingRule(product.sku, rule.id, { penaltyFee: Number(e.target.value) })}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-rose-500 outline-none font-black text-sm transition-all"
                                                  />
                                                </div>
                                              </div>

                                              <div className="space-y-3">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Grace Period (Days)</label>
                                                <div className="relative">
                                                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                  <input 
                                                    type="number" 
                                                    value={rule.gracePeriod}
                                                    onChange={(e) => updatePricingRule(product.sku, rule.id, { gracePeriod: Number(e.target.value) })}
                                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-rose-500 outline-none font-black text-sm transition-all"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          {/* Section D — Advanced Settings Collapsible */}
                                          <div className="pt-8 border-t border-slate-100">
                                            <button 
                                              onClick={() => toggleRuleAccordion(rule.id)}
                                              className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                                            >
                                              <div className={cn(
                                                "w-5 h-5 rounded-md flex items-center justify-center transition-all",
                                                expandedRules.includes(rule.id) ? "bg-blue-50 text-blue-600" : "bg-slate-50"
                                              )}>
                                                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expandedRules.includes(rule.id) && "rotate-180")} />
                                              </div>
                                              Advanced Settings
                                            </button>

                                            <AnimatePresence>
                                              {expandedRules.includes(rule.id) && (
                                                <motion.div
                                                  initial={{ height: 0, opacity: 0 }}
                                                  animate={{ height: 'auto', opacity: 1 }}
                                                  exit={{ height: 0, opacity: 0 }}
                                                  className="overflow-hidden"
                                                >
                                                  <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operation Caveats / Notes</label>
                                                      <textarea 
                                                        rows={2}
                                                        value={rule.notes}
                                                        onChange={(e) => updatePricingRule(product.sku, rule.id, { notes: e.target.value })}
                                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none font-medium text-sm shadow-inner"
                                                        placeholder="e.g. Temperature range 2-8C required..."
                                                      />
                                                    </div>
                                                    <div className="space-y-3">
                                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rule Status</label>
                                                      <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white transition-all">
                                                        <div className="flex-1">
                                                          <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Active State</p>
                                                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Enable or disable this pricing rule</p>
                                                        </div>
                                                        <button 
                                                          onClick={() => updatePricingRule(product.sku, rule.id, { active: !rule.active })}
                                                          className={cn(
                                                            "w-12 h-6 rounded-full relative transition-all duration-500 shadow-inner",
                                                            rule.active ? "bg-emerald-500" : "bg-slate-200"
                                                          )}
                                                        >
                                                          <div className={cn(
                                                            "absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-500",
                                                            rule.active ? "left-7" : "left-1"
                                                          )} />
                                                        </button>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      </div>
                    );
                    })}
                  </div>
                  
                  {formData.selectedProducts.length === 0 && (
                    <div className="py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                        <Package className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-extrabold uppercase tracking-widest text-sm">Initial selection required</p>
                      <p className="text-xs text-slate-400 mt-2">Go back to Step 2 to select contract items.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-10 h-full overflow-y-auto custom-scrollbar flex flex-col"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Additional Charges</h3>
                    <p className="text-sm text-slate-500 font-bold uppercase tracking-tight mt-1">Configure non-storage service fees, labor, and custom surcharges</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-4 px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Est. Surcharges</p>
                        <p className="text-sm font-black text-emerald-700">Rp {formData.additionalCharges.reduce((acc, c) => acc + c.rate, 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={addAdditionalCharge}
                      className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 group"
                    >
                      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                      Add Charge Item
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm flex-1 flex flex-col">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <th className="px-8 py-6">Charge Information</th>
                          <th className="px-8 py-6">Category</th>
                          <th className="px-8 py-6">Billing Rate</th>
                          <th className="px-8 py-6">Taxability</th>
                          <th className="px-8 py-6">Internal Notes</th>
                          <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {formData.additionalCharges.map((charge) => (
                          <tr key={charge.id} className="group hover:bg-blue-50/20 transition-all">
                            <td className="px-8 py-5">
                              <input 
                                type="text" 
                                value={charge.name}
                                onChange={(e) => updateAdditionalCharge(charge.id, { name: e.target.value })}
                                placeholder="e.g. Inbound Handling"
                                className="w-full bg-transparent border-none focus:ring-0 font-black text-slate-900 placeholder:text-slate-200 outline-none p-0 text-sm"
                              />
                            </td>
                            <td className="px-8 py-5">
                              <select 
                                value={charge.category}
                                onChange={(e) => updateAdditionalCharge(charge.id, { category: e.target.value })}
                                className="bg-slate-100/50 border-none rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer hover:bg-slate-200 transition-colors"
                              >
                                {['Handling', 'Documentation', 'Insurance', 'Administration', 'Labor', 'Transportation', 'Warehouse', 'Packaging', 'Custom'].map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl group-focus-within:bg-white group-focus-within:border-blue-200 transition-all">
                                  <span className="text-[10px] font-black text-slate-400">Rp</span>
                                  <input 
                                    type="number" 
                                    value={charge.rate}
                                    onChange={(e) => updateAdditionalCharge(charge.id, { rate: Number(e.target.value) })}
                                    className="w-24 bg-transparent border-none focus:ring-0 font-black text-slate-900 outline-none p-0 text-sm"
                                  />
                                </div>
                                <select 
                                  value={charge.unit}
                                  onChange={(e) => updateAdditionalCharge(charge.id, { unit: e.target.value })}
                                  className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-transparent border-none p-0 outline-none cursor-pointer"
                                >
                                  {['Per Shipment', 'Per KG', 'Per Pallet', 'Per Day', 'Fixed', 'Per Container', 'Per Truck', 'Per Document', 'Per Hour', 'Per CBM'].map(u => (
                                    <option key={u} value={u}>{u}</option>
                                  ))}
                                </select>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => updateAdditionalCharge(charge.id, { taxable: !charge.taxable })}
                                  className={cn(
                                    "w-10 h-5 rounded-full relative transition-all",
                                    charge.taxable ? "bg-blue-600 shadow-sm shadow-blue-500/30" : "bg-slate-200"
                                  )}
                                >
                                  <div className={cn(
                                    "absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm",
                                    charge.taxable ? "left-6" : "left-1"
                                  )}></div>
                                </button>
                                <span className={cn(
                                  "text-[10px] font-black uppercase tracking-widest",
                                  charge.taxable ? "text-blue-600" : "text-slate-400"
                                )}>
                                  {charge.taxable ? 'Taxable' : 'Exempt'}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <input 
                                type="text" 
                                value={charge.notes}
                                onChange={(e) => updateAdditionalCharge(charge.id, { notes: e.target.value })}
                                placeholder="Internal note..."
                                className="w-full bg-transparent border-none focus:ring-0 font-bold text-slate-400 placeholder:text-slate-200 outline-none p-0 text-xs italic"
                              />
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button 
                                  onClick={() => duplicateAdditionalCharge(charge)}
                                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                  title="Duplicate Item"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => removeAdditionalCharge(charge.id)}
                                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                  title="Remove Item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {formData.additionalCharges.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center py-32 bg-slate-50/50">
                      <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-slate-200/50 border border-slate-100 animate-bounce">
                        <FileText className="w-10 h-10 text-slate-200" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2">No additional charges defined</h4>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">Add line items for handling, documentation, or other surcharges</p>
                      <button 
                        onClick={addAdditionalCharge}
                        className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:bg-slate-50 hover:border-blue-200 transition-all active:scale-95"
                      >
                        <Plus className="w-4 h-4 text-blue-500" />
                        Create First Charge
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex gap-4">
                   <div className="flex-1 p-6 bg-blue-50/30 rounded-3xl border border-blue-100/50 flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                       <Info className="w-6 h-6 text-blue-500" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Billing Policy Info</p>
                       <p className="text-xs font-bold text-blue-800/60 leading-relaxed">Additional charges will be evaluated during the monthly billing cycle based on operational activity logs. Ensure charge names match GL accounts for finance reconciliation.</p>
                     </div>
                   </div>
                </div>
              </motion.div>
            )}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 h-full overflow-hidden flex flex-col gap-8 bg-slate-50/30"
              >
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
                  {/* Summary Hero Card */}
                  <div className="bg-[#0a0c10] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute -right-32 -top-32 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px]"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center p-4 shadow-xl">
                          <span className="text-slate-900 font-black text-2xl uppercase">{selectedCustomer?.name.substring(0, 2)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">{formData.contractType} Agreement</span>
                             <span className="text-slate-500 font-mono text-sm tracking-widest font-bold">DRAFT-2026</span>
                          </div>
                          <h3 className="text-3xl font-black tracking-tight">{formData.contractName || 'Untitled Contract'}</h3>
                          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 text-xs">{selectedCustomer?.name} • PIC: {selectedManager?.name}</p>
                        </div>
                      </div>
                      <div className="lg:text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Estimated Value</p>
                        <div className="flex items-baseline lg:justify-end gap-2">
                          <span className="text-xl font-black text-blue-400">{formData.currency}</span>
                          <span className="text-4xl font-black tracking-tighter">{totalEstimatedValue.toLocaleString()}</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Projected Annual Revenue</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Side - Review Sections */}
                    <div className="lg:col-span-8 space-y-6">
                      <SummarySection 
                        title="1. Contract Details" 
                        step={1} 
                        isValid={validationChecklist.details && validationChecklist.dates}
                        isExpanded={expandedSections.includes(1)}
                        onToggle={() => toggleSection(1)}
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                            <p className="text-sm font-black text-slate-900">{selectedCustomer?.name}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</p>
                            <p className="text-sm font-black text-slate-900">{formData.startDate} → {formData.endDate}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manager</p>
                            <p className="text-sm font-black text-slate-900">{selectedManager?.name}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Currency</p>
                            <p className="text-sm font-black text-slate-900">{formData.currency}</p>
                          </div>
                          <div className="col-span-full space-y-1 pt-4 border-t border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provision Notes</p>
                            <p className="text-xs font-bold text-slate-500 italic leading-relaxed">
                              {formData.notes || 'No special terms recorded.'}
                            </p>
                          </div>
                        </div>
                      </SummarySection>

                      <SummarySection 
                        title="2. Selected Products" 
                        step={2} 
                        isValid={validationChecklist.products}
                        isExpanded={expandedSections.includes(2)}
                        onToggle={() => toggleSection(2)}
                      >
                        <div className="flex flex-wrap gap-2">
                          {formData.selectedProducts.map(p => (
                            <div key={p.sku} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                              <Box className="w-3.5 h-3.5 text-blue-500" />
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-900 leading-none">{p.name}</span>
                                <span className="text-[8px] font-bold text-slate-400 uppercase">{p.sku}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </SummarySection>

                      <SummarySection 
                        title="3. Storage Charges" 
                        step={3} 
                        isValid={validationChecklist.pricing}
                        isExpanded={expandedSections.includes(3)}
                        onToggle={() => toggleSection(3)}
                      >
                        <div className="space-y-6">
                          {formData.storageCharges.map(charge => {
                            const product = formData.selectedProducts.find(p => p.sku === charge.sku);
                            return (
                              <div key={charge.sku} className="p-5 border border-slate-100 rounded-3xl bg-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                                    <Package className="w-5 h-5 text-blue-500" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-black text-slate-900">{product?.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">{charge.rules.length} Active Rules</p>
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  {charge.rules.map((rule: any) => (
                                    <div key={rule.id} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl flex items-baseline gap-1">
                                      <span className="text-[10px] font-black text-slate-900">{rule.rate.toLocaleString()}</span>
                                      <span className="text-[8px] font-black text-slate-400 uppercase">{formData.currency} / {rule.type}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </SummarySection>

                      <SummarySection 
                        title="4. Additional Charges" 
                        step={4} 
                        isValid={validationChecklist.additional}
                        isExpanded={expandedSections.includes(4)}
                        onToggle={() => toggleSection(4)}
                      >
                        <div className="overflow-hidden border border-slate-100 rounded-3xl">
                          <table className="w-full text-left">
                            <thead className="bg-slate-50">
                              <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-4">Surcharge Service</th>
                                <th className="px-6 py-4">Rate Configuration</th>
                                <th className="px-6 py-4 text-right">Ext. Tax</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {formData.additionalCharges.map(charge => (
                                <tr key={charge.id} className="text-xs font-bold text-slate-700">
                                  <td className="px-6 py-4">{charge.name}</td>
                                  <td className="px-6 py-4">{formData.currency} {charge.rate.toLocaleString()} / {charge.unit}</td>
                                  <td className="px-6 py-4 text-right uppercase text-[10px]">{charge.taxable ? '11% PPN' : 'Exempt'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </SummarySection>
                    </div>

                    {/* Right Side - Sticky Validation & Value */}
                    <div className="lg:col-span-4 space-y-8">
                       {/* Value Summary Card */}
                       <div className="bg-white border-2 border-slate-900 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-900 opacity-[0.02] -mr-8 -mt-8 rounded-full"></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Value Summary</h4>
                        <div className="space-y-5">
                          <div className="flex justify-between items-center text-xs font-black text-slate-600 uppercase tracking-widest">
                            <span>Storage Revenue</span>
                            <span>{formData.currency} {estimatedStorageValue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-black text-slate-600 uppercase tracking-widest">
                            <span>Ancillary Charges</span>
                            <span>{formData.currency} {estimatedAdditionalValue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-black text-slate-600 uppercase tracking-widest">
                            <span>Projected Tax</span>
                            <span>{formData.currency} {estimatedTaxValue.toLocaleString()}</span>
                          </div>
                          <div className="h-px bg-slate-100 my-4"></div>
                          <div className="flex justify-between items-end">
                            <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none mb-1">Total Estimation</span>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter leading-none mb-1">{formData.currency}</p>
                               <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{totalEstimatedValue.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Validation Checklist */}
                      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Compliance Check</h4>
                          {isStep5Valid ? (
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-lg border border-emerald-100">Ready</span>
                          ) : (
                            <span className="px-2 py-1 bg-rose-50 text-rose-600 text-[8px] font-black uppercase rounded-lg border border-rose-100">Pending</span>
                          )}
                        </div>
                        <div className="space-y-4">
                          {[
                            { label: 'Contract Details Complete', valid: validationChecklist.details },
                            { label: 'Chronological Integrity', valid: validationChecklist.dates },
                            { label: 'Catalog Items Selected', valid: validationChecklist.products },
                            { label: 'Pricing Logic Validated', valid: validationChecklist.pricing },
                            { label: 'Service Fees Configured', valid: validationChecklist.additional },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className={cn(
                                "w-5 h-5 rounded-lg flex items-center justify-center transition-all",
                                item.valid ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-300"
                              )}>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </div>
                              <span className={cn(
                                "text-[11px] font-bold uppercase tracking-tight",
                                item.valid ? "text-slate-700" : "text-slate-400"
                              )}>{item.label}</span>
                            </div>
                          ))}
                        </div>
                        
                        {!isStep5Valid && (
                           <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
                            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-black text-rose-700 uppercase leading-relaxed tracking-tight">
                              Some mandatory steps are incomplete. Review sections with warning icons before final submission.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-10 bg-slate-50/30 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:bg-slate-100 transition-all disabled:opacity-20 disabled:scale-95 shadow-sm active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous Step
            </button>
            <button 
              onClick={saveDraft}
              className="hidden md:flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-[1.25rem] text-[10px] font-black text-slate-700 hover:bg-slate-50 transition-all uppercase tracking-widest shadow-sm"
            >
              <Save className="w-4 h-4 text-blue-500" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
          
          <button 
            onClick={currentStep === steps.length ? handleSubmit : nextStep}
            className={cn(
              "w-full md:w-auto flex items-center justify-center gap-3 px-14 py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.25em] transition-all shadow-2xl active:scale-95 group",
              currentStep === steps.length 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/30" 
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30"
            )}
          >
            {currentStep === steps.length ? (isEdit ? 'Authorize Updates' : 'Finalize Agreement') : 'Next Step'}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSubmitModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="p-10">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Confirm Submission</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Final Authorization Check</p>
                  </div>
                </div>

                <div className="space-y-6 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-10">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-400">Customer</span>
                    <span className="text-slate-900">{selectedCustomer?.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-400">Validity Period</span>
                    <span className="text-slate-900">{formData.startDate} → {formData.endDate}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-400">Contract Value</span>
                    <span className="text-blue-600">{formData.currency} {totalEstimatedValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-10 flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-black text-amber-700 uppercase leading-relaxed tracking-tight">
                    After submission, this contract will be locked for review. You will not be able to modify pricing rules until it is approved or rejected by the regional director.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                  >
                    Return to Review
                  </button>
                  <button 
                    onClick={confirmSubmit}
                    disabled={isSaving}
                    className="flex-1 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSaving ? 'Processing...' : 'Confirm & Submit'}
                    {!isSaving && <ArrowUpRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visual Indicator of Progress */}
      <div className="mt-8 flex justify-center gap-2">
        {steps.map(s => (
          <div key={s.id} className={cn(
            "h-1.5 rounded-full transition-all duration-500",
            currentStep === s.id ? "w-12 bg-blue-600 shadow-lg shadow-blue-500/20" : "w-3 bg-slate-200"
          )}></div>
        ))}
      </div>
    </div>
  );
}
