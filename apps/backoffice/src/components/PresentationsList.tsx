'use client';

import { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Copy, ExternalLink, Calendar, User } from 'lucide-react';
import { apiClient, Presentation } from '@/lib/api';

interface PresentationsListProps {
  onCreateNew: () => void;
  onEdit: (presentation: Presentation) => void;
}

export default function PresentationsList({ onCreateNew, onEdit }: PresentationsListProps) {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPresentations = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getPresentations();
      setPresentations(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar presentaciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPresentations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta presentación?')) {
      return;
    }

    try {
      await apiClient.deletePresentation(id);
      await loadPresentations();
    } catch (err: any) {
      alert(`Error al eliminar: ${err.message}`);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await apiClient.duplicatePresentation(id);
      await loadPresentations();
    } catch (err: any) {
      alert(`Error al duplicar: ${err.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Publicada';
      case 'DRAFT':
        return 'Borrador';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-neutral-600">Cargando presentaciones...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadPresentations}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Presentaciones</h2>
          <p className="text-neutral-600">
            {presentations.length} presentación{presentations.length !== 1 ? 'es' : ''} encontrada{presentations.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Presentación</span>
        </button>
      </div>

      {/* Presentations Grid */}
      {presentations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No hay presentaciones</h3>
          <p className="text-neutral-600 mb-4">Crea tu primera presentación para comenzar.</p>
          <button
            onClick={onCreateNew}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Presentación</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((presentation) => (
            <div
              key={presentation.id}
              className="bg-white rounded-lg border border-neutral-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2">
                    {presentation.title}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(presentation.status)}`}
                  >
                    {getStatusText(presentation.status)}
                  </span>
                </div>

                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                  {presentation.description}
                </p>

                <div className="flex items-center text-xs text-neutral-500 mb-4 space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(presentation.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{presentation.content?.slides?.length || 0} slides</span>
                  </div>
                </div>

                {presentation.status === 'PUBLISHED' && presentation.accessToken && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-600">Token público:</span>
                      <button
                        onClick={() => window.open(`http://localhost:3001/presentation/${presentation.accessToken}`, '_blank')}
                        className="text-green-600 hover:text-green-800"
                        title="Abrir presentación en nueva pestaña"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <code className="text-xs text-green-700 font-mono">
                      {presentation.accessToken}
                    </code>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(presentation)}
                      className="p-2 text-neutral-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(presentation.id)}
                      className="p-2 text-neutral-600 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      title="Duplicar"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(presentation.id)}
                      className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {presentation.status === 'PUBLISHED' && (
                    <button
                      onClick={() => window.open(`http://localhost:3001/presentation/${presentation.accessToken}`, '_blank')}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Ver</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
