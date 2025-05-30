
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, Calendar, User, Star, Briefcase, Clock, Car, Settings, Edit } from "lucide-react";
import { TransportDriver } from '../types';
import EditDriverForm from './EditDriverForm';
import { useToast } from "@/hooks/use-toast";

interface DriverDetailsProps {
  driver: TransportDriver;
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ driver }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [driverData, setDriverData] = useState<TransportDriver>(driver);
  const { toast } = useToast();
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'long' });
  };
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };
  
  const formatVehicleType = (type: string) => {
    const typeMap: Record<string, string> = {
      'sedan': 'Berline',
      'van': 'Fourgon',
      'suv': 'SUV',
      'luxury': 'Premium',
      'bus': 'Bus',
      'electric': 'Électrique'
    };
    
    return typeMap[type] || type;
  };
  
  const getLicenseExpiryBadge = () => {
    const expiryDate = new Date(driverData.licenseExpiry);
    const today = new Date();
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return <Badge className="bg-red-500">Expiré</Badge>;
    } else if (diffDays <= 30) {
      return <Badge className="bg-yellow-500">Expire bientôt</Badge>;
    } else {
      return <Badge className="bg-green-500">Valide</Badge>;
    }
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleSave = (updatedDriver: TransportDriver) => {
    setDriverData(updatedDriver);
    setIsEditing(false);
    toast({
      title: "Modifications enregistrées",
      description: `Les informations de ${updatedDriver.firstName} ${updatedDriver.lastName} ont été mises à jour.`,
    });
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Modification du chauffeur</h3>
        </div>
        <EditDriverForm 
          driver={driverData} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={driverData.photo} alt={`${driverData.firstName} ${driverData.lastName}`} />
            <AvatarFallback className="text-xl">{getInitials(driverData.firstName, driverData.lastName)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{driverData.firstName} {driverData.lastName}</h3>
            <div className="flex items-center mt-1">
              <Badge className={`${driverData.available ? 'bg-green-500' : 'bg-red-500'} mr-2`}>
                {driverData.available ? 'Disponible' : 'Indisponible'}
              </Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{driverData.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-1" />
                <span>{driverData.experience} ans d'expérience</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleEditClick}
        >
          <Edit size={16} />
          <span>Modifier</span>
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <User size={16} />
              <span>Informations de contact</span>
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{driverData.phone}</span>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{driverData.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar size={16} />
              <span>Informations de permis</span>
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Numéro de permis:</span>
                <span className="font-medium">{driverData.licenseNumber}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date d'expiration:</span>
                <div className="flex items-center gap-2">
                  <span>{formatDate(driverData.licenseExpiry)}</span>
                  {getLicenseExpiryBadge()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Settings size={16} />
            <span>Préférences et compétences</span>
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Types de véhicules préférés</h5>
              <div className="flex flex-wrap gap-1">
                {driverData.preferredVehicleType && driverData.preferredVehicleType.map((type, idx) => (
                  <Badge key={idx} variant="outline" className="bg-gray-100">
                    {formatVehicleType(type)}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h5 className="text-sm font-medium">Compétences</h5>
              <div className="flex flex-wrap gap-2">
                {driverData.skills ? (
                  driverData.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">Aucune compétence spécifiée</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDetails;
