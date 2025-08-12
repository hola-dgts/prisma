'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Import Material Icons - Two Tone (para iconos grandes)
import {
  BusinessTwoTone,
  TrendingUpTwoTone,
  GroupTwoTone,
  BarChartTwoTone,
  LightbulbTwoTone,
  RocketLaunchTwoTone,
  SecurityTwoTone,
  SpeedTwoTone,
  IntegrationInstructionsTwoTone,
  CloudTwoTone,
  DataUsageTwoTone,
  AutoGraphTwoTone,
  InsightsTwoTone,
  PsychologyTwoTone,
  EngineeringTwoTone,
  InventoryTwoTone,
  AccountBalanceTwoTone,
  CampaignTwoTone,
  HandshakeTwoTone,
  StarTwoTone,
  CheckCircleTwoTone,
  ErrorTwoTone,
  InfoTwoTone,
  WarningTwoTone
} from '@mui/icons-material';

// Import Material Icons - Outlined (para iconos en listas)
import {
  BusinessOutlined,
  TrendingUpOutlined,
  GroupOutlined,
  BarChartOutlined,
  LightbulbOutlined,
  RocketLaunchOutlined,
  SecurityOutlined,
  SpeedOutlined,
  IntegrationInstructionsOutlined,
  CloudOutlined,
  DataUsageOutlined,
  AutoGraphOutlined,
  InsightsOutlined,
  PsychologyOutlined,
  EngineeringOutlined,
  InventoryOutlined,
  AccountBalanceOutlined,
  CampaignOutlined,
  HandshakeOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  InfoOutlined,
  WarningOutlined,
  EmailOutlined,
  PhoneOutlined,
  LocationOnOutlined,
  LanguageOutlined
} from '@mui/icons-material';

// Mapeo de iconos Two Tone (para elementos grandes como highlights, keypoints, metrics)
const twoToneIcons = {
  // Iconos existentes
  business: BusinessTwoTone,
  trending: TrendingUpTwoTone,
  group: GroupTwoTone,
  chart: BarChartTwoTone,
  lightbulb: LightbulbTwoTone,
  rocket: RocketLaunchTwoTone,
  security: SecurityTwoTone,
  speed: SpeedTwoTone,
  integration: IntegrationInstructionsTwoTone,
  cloud: CloudTwoTone,
  data: DataUsageTwoTone,
  graph: AutoGraphTwoTone,
  insights: InsightsTwoTone,
  psychology: PsychologyTwoTone,
  engineering: EngineeringTwoTone,
  inventory: InventoryTwoTone,
  balance: AccountBalanceTwoTone,
  campaign: CampaignTwoTone,
  handshake: HandshakeTwoTone,
  star: StarTwoTone,
  check: CheckCircleTwoTone,
  error: ErrorTwoTone,
  info: InfoTwoTone,
  warning: WarningTwoTone,
  // Mapeos específicos para Liquid Glass presentation
  sparkles: StarTwoTone,
  layers: InventoryTwoTone,
  motion: SpeedTwoTone,
  target: CampaignTwoTone,
  event: BusinessTwoTone
};

// Mapeo de iconos Outlined (para listas y elementos pequeños)
const outlinedIcons = {
  // Iconos existentes
  business: BusinessOutlined,
  trending: TrendingUpOutlined,
  group: GroupOutlined,
  chart: BarChartOutlined,
  lightbulb: LightbulbOutlined,
  rocket: RocketLaunchOutlined,
  security: SecurityOutlined,
  speed: SpeedOutlined,
  integration: IntegrationInstructionsOutlined,
  cloud: CloudOutlined,
  data: DataUsageOutlined,
  graph: AutoGraphOutlined,
  insights: InsightsOutlined,
  psychology: PsychologyOutlined,
  engineering: EngineeringOutlined,
  inventory: InventoryOutlined,
  balance: AccountBalanceOutlined,
  campaign: CampaignOutlined,
  handshake: HandshakeOutlined,
  star: StarOutlined,
  check: CheckCircleOutlined,
  error: ErrorOutlined,
  info: InfoOutlined,
  warning: WarningOutlined,
  email: EmailOutlined,
  phone: PhoneOutlined,
  location: LocationOnOutlined,
  web: LanguageOutlined,
  // Mapeos específicos para Liquid Glass presentation
  sparkles: StarOutlined,
  layers: InventoryOutlined,
  motion: SpeedOutlined,
  target: CampaignOutlined,
  event: BusinessOutlined
};

export interface MaterialIconProps {
  name: string;
  variant?: 'twotone' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  variant = 'twotone',
  size = 'medium',
  className,
  color = 'primary'
}) => {
  // Seleccionar el conjunto de iconos según la variante
  const iconSet = variant === 'outlined' ? outlinedIcons : twoToneIcons;
  
  // Obtener el componente de icono
  const IconComponent = iconSet[name as keyof typeof iconSet];
  
  // Si no existe el icono, no renderizar nada
  if (!IconComponent) {
    console.warn(`Material icon "${name}" not found in variant "${variant}"`);
    return null;
  }
  
  // Clases CSS
  const iconClasses = cn(
    'prisma-icon',
    `prisma-icon--${size}`,
    `prisma-icon--${color}`,
    className
  );
  
  return (
    <IconComponent 
      className={iconClasses}
      fontSize="inherit"
    />
  );
};

// Componente específico para iconos grandes (Two Tone)
export const MaterialIconLarge: React.FC<Omit<MaterialIconProps, 'variant' | 'size'>> = (props) => (
  <MaterialIcon {...props} variant="twotone" size="large" />
);

// Componente específico para iconos en listas (Outlined)
export const MaterialIconList: React.FC<Omit<MaterialIconProps, 'variant' | 'size'>> = (props) => (
  <MaterialIcon {...props} variant="outlined" size="small" />
);

// Exportar los mapeos para uso directo si es necesario
export { twoToneIcons, outlinedIcons };
