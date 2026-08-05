import fs from 'fs';

const filePath = 'c:\\Users\\SatouVu\\Desktop\\Startups_Blogs\\frontend\\src\\pages\\BusinessDetail.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const correctTop = `import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Globe, 
  MapPin, 
  Calendar, 
  Users, 
  Bookmark, 
  Heart, 
  Mail, 
  ArrowLeft, 
  Building2,
  ShieldAlert
} from 'lucide-react';
import BusinessCard from '../components/business/BusinessCard';
import styles from './BusinessDetail.module.css';
import { 
  getBusinessBySlug, 
  getPublishedFundingOpportunitiesByBusinessId, 
  getRelatedBusinesses 
} from '../utils/filterHelpers';
import { MOCK_ARTICLES } from '../utils/mockData';

const formatCurrency = (min: number, max: number, currency: string) => {
  if (currency === 'USD') {
    return \`$\${(min / 1000).toLocaleString('en-US')}k – $\${(max / 1000).toLocaleString('en-US')}k USD\`;
  }
  const minBillion = min / 1000000000;
  const maxBillion = max / 1000000000;
  if (minBillion >= 1) return \`\${minBillion} – \${maxBillion} tỷ VNĐ\`;
  return \`\${min / 1000000} – \${max / 1000000} triệu VNĐ\`;
};

const BusinessDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isSaved, setIsSaved] = useState(false);
`;

fs.writeFileSync(filePath, correctTop + content, 'utf8');
console.log('BusinessDetail fixed successfully');
